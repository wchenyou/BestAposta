import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import { Bindings } from './types';
import { detectLanguage, t } from './utils/language';
import { renderHomePage } from './pages/home';
import { renderCasinoPage } from './pages/casino';
import { renderCasinosPage } from './pages/casinos';
import { renderBlogPage } from './pages/blog';
import { renderContactPage } from './pages/contact';
import { renderAdminPage } from './pages/admin';
import apiRoutes from './routes/api';

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }));

// API routes
app.route('/api', apiRoutes);

// Home page
app.get('/', async (c) => {
  const lang = detectLanguage(c);
  const { env } = c;
  
  try {
    // Get player types with casinos from casino_info table
    const playerTypes = await env.DB.prepare(`
      SELECT 
        pt.*,
        GROUP_CONCAT(
          DISTINCT json_object(
            'id', ci.casino_id,
            'slug', ci.slug,
            'name', ci.casino_name,
            'logo_url', ci.logo_url,
            'affiliate_link', ci.affiliate_link
          )
        ) as casinos_json
      FROM player_types pt
      LEFT JOIN player_type_casinos ptc ON pt.id = ptc.player_type_id
      LEFT JOIN (
        SELECT DISTINCT casino_id, slug, casino_name, logo_url, affiliate_link, is_active
        FROM casino_info 
        WHERE language = 'en' AND is_active = 1
      ) ci ON ptc.casino_id = ci.casino_id
      WHERE pt.is_active = 1
      GROUP BY pt.id
      ORDER BY pt.sort_order
    `).all();
    
    return c.html(renderHomePage(lang, playerTypes.results || []));
  } catch (error) {
    console.error('Error loading home page:', error);
    return c.html(renderHomePage(lang, []));
  }
});

// Casinos list page
app.get('/casinos', async (c) => {
  const lang = detectLanguage(c);
  const { env } = c;
  
  try {
    // Get all active casinos with their details
    const casinos = await env.DB.prepare(`
      SELECT 
        c.*,
        json_object(
          'welcome_bonus', ci.welcome_bonus,
          'min_deposit', ci.min_deposit,
          'payment_methods', ci.payment_methods,
          'rating_overall', ci.rating_overall
        ) as details
      FROM casinos c
      LEFT JOIN casino_info ci ON c.id = ci.casino_id AND ci.language = ?
      WHERE c.is_active = 1
      ORDER BY c.sort_order, c.name
    `).bind(lang).all();
    
    // Parse the JSON details
    const casinosWithDetails = casinos.results?.map(casino => ({
      ...casino,
      details: casino.details ? [JSON.parse(casino.details as string)] : []
    })) || [];
    
    return c.html(renderCasinosPage(lang, casinosWithDetails));
  } catch (error) {
    console.error('Error loading casinos page:', error);
    return c.html(renderCasinosPage(lang, []));
  }
});

// Casino detail page
app.get('/casino/:slug', async (c) => {
  const lang = detectLanguage(c);
  const slug = c.req.param('slug');
  
  try {
    return await renderCasinoPage(c, slug, lang);
  } catch (error) {
    console.error('Error loading casino page:', error);
    return c.html('<h1>Error loading casino</h1>', 500);
  }
});

// Blog page
app.get('/blog', async (c) => {
  const lang = detectLanguage(c);
  const { env } = c;
  const categorySlug = c.req.query('category');
  
  try {
    const categories = await env.DB.prepare(`
      SELECT * FROM blog_categories WHERE is_active = 1 ORDER BY sort_order
    `).all();
    
    let postsQuery = `
      SELECT p.*, c.slug as category_slug, c.name_en, c.name_pt, c.name_zh
      FROM blog_posts p
      JOIN blog_categories c ON p.category_id = c.id
      WHERE p.is_published = 1
    `;
    
    if (categorySlug) {
      postsQuery += ` AND c.slug = '${categorySlug}'`;
    }
    
    postsQuery += ` ORDER BY p.published_at DESC LIMIT 20`;
    
    const posts = await env.DB.prepare(postsQuery).all();
    
    // Add category name for current language
    const postsWithCategoryName = posts.results?.map(post => ({
      ...post,
      category_name: post[`name_${lang}`] || post.name_en
    })) || [];
    
    return c.html(renderBlogPage(lang, categories.results || [], postsWithCategoryName, undefined, categorySlug));
  } catch (error) {
    console.error('Error loading blog page:', error);
    return c.html(renderBlogPage(lang, [], []));
  }
});

// Blog post page
app.get('/blog/:slug', async (c) => {
  const lang = detectLanguage(c);
  const { env } = c;
  const slug = c.req.param('slug');
  
  try {
    const post = await env.DB.prepare(`
      SELECT p.*, c.slug as category_slug, c.name_${lang} as category_name
      FROM blog_posts p
      JOIN blog_categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.is_published = 1
    `).bind(slug).first();
    
    if (!post) {
      return c.html('<h1>Post not found</h1>', 404);
    }
    
    // Update view count
    await env.DB.prepare(`
      UPDATE blog_posts SET views = views + 1 WHERE id = ?
    `).bind(post.id).run();
    
    return c.html(renderBlogPage(lang, [], [], post));
  } catch (error) {
    console.error('Error loading blog post:', error);
    return c.html('<h1>Error loading post</h1>', 500);
  }
});

// Contact page
app.get('/contact', async (c) => {
  const lang = detectLanguage(c);
  const { env } = c;
  
  try {
    const settings = await env.DB.prepare(`
      SELECT * FROM contact_settings LIMIT 1
    `).first();
    
    return c.html(renderContactPage(lang, settings));
  } catch (error) {
    console.error('Error loading contact page:', error);
    return c.html(renderContactPage(lang, null));
  }
});

// Admin panel
app.get('/admin', async (c) => {
  return c.html(renderAdminPage());
});

// Language switcher
app.get('/set-language/:lang', (c) => {
  const lang = c.req.param('lang');
  const referer = c.req.header('Referer') || '/';
  
  if (['en', 'pt', 'zh'].includes(lang)) {
    // Set cookie header manually for Cloudflare Workers
    c.header('Set-Cookie', `lang=${lang}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax`);
  }
  
  return c.redirect(referer);
});

export default app;