import { Hono } from 'hono';
import { Bindings } from '../types';
import { hashPassword, verifyPassword, generateToken, isAuthenticated } from '../utils/auth';

const api = new Hono<{ Bindings: Bindings }>();

// Auth endpoints
api.post('/auth/login', async (c) => {
  const { env } = c;
  const { username, password } = await c.req.json();
  
  try {
    const user = await env.DB.prepare(
      'SELECT * FROM admin_users WHERE username = ?'
    ).bind(username).first();
    
    if (user && await verifyPassword(password, user.password_hash as string)) {
      const token = generateToken(user.id as number, user.username as string);
      return c.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    }
    
    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

api.post('/auth/register', async (c) => {
  const { env } = c;
  const { username, password, email } = await c.req.json();
  
  try {
    const hashedPassword = await hashPassword(password);
    
    const result = await env.DB.prepare(
      'INSERT INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)'
    ).bind(username, hashedPassword, email).run();
    
    if (result.success) {
      return c.json({ message: 'User created successfully' });
    }
    
    return c.json({ error: 'Failed to create user' }, 400);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Admin endpoints (protected)
api.use('/admin/*', async (c, next) => {
  const auth = isAuthenticated(c.req.header('Authorization'));
  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  c.set('user', auth);
  await next();
});

// Casinos CRUD
api.get('/admin/casinos', async (c) => {
  const { env } = c;
  
  try {
    // Get all casinos with their details
    const casinos = await env.DB.prepare(
      'SELECT * FROM casinos ORDER BY sort_order, name'
    ).all();
    
    // For each casino, get its details in all languages
    for (const casino of casinos.results) {
      const details = await env.DB.prepare(
        'SELECT * FROM casino_info WHERE casino_id = ?'
      ).bind(casino.id).all();
      
      // Merge details into the casino object
      for (const detail of details.results) {
        const lang = detail.language;
        casino[`welcome_bonus_${lang}`] = detail.welcome_bonus;
        casino[`min_deposit_${lang}`] = detail.min_deposit;
        casino[`payment_methods_${lang}`] = detail.payment_methods;
        casino[`license_${lang}`] = detail.license;
        casino[`founded_year_${lang}`] = detail.founded_year;
        casino[`bonus_description_${lang}`] = detail.bonus_description;
        casino[`games_description_${lang}`] = detail.games_description;
        casino[`payment_description_${lang}`] = detail.payment_description;
        casino[`support_description_${lang}`] = detail.support_description;
        casino[`mobile_description_${lang}`] = detail.mobile_description;
        casino[`security_description_${lang}`] = detail.security_description;
        casino[`responsible_gaming_${lang}`] = detail.responsible_gaming_description;
        casino[`pros_${lang}`] = detail.pros;
      }
    }
    
    return c.json(casinos.results);
  } catch (error) {
    console.error('Failed to fetch casinos:', error);
    return c.json({ error: 'Failed to fetch casinos' }, 500);
  }
});

api.post('/admin/casinos', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  try {
    // Insert main casino record
    const result = await env.DB.prepare(
      'INSERT INTO casinos (slug, name, logo_url, website_url, affiliate_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(data.slug, data.name, data.logo_url, data.website_url, data.affiliate_link, data.sort_order || 0, data.is_active ? 1 : 0).run();
    
    const casinoId = result.meta.last_row_id;
    
    // Insert details for each language
    const languages = ['en', 'pt', 'zh'];
    for (const lang of languages) {
      await env.DB.prepare(`
        INSERT INTO casino_info 
        (casino_id, language, welcome_bonus, min_deposit, payment_methods, license, founded_year,
         bonus_description, games_description, payment_description, support_description, 
         mobile_description, security_description, responsible_gaming_description, pros)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        casinoId, lang,
        data[`welcome_bonus_${lang}`] || '',
        data[`min_deposit_${lang}`] || '',
        data[`payment_methods_${lang}`] || '',
        data[`license_${lang}`] || '',
        data[`founded_year_${lang}`] || '',
        data[`bonus_description_${lang}`] || '',
        data[`games_description_${lang}`] || '',
        data[`payment_description_${lang}`] || '',
        data[`support_description_${lang}`] || '',
        data[`mobile_description_${lang}`] || '',
        data[`security_description_${lang}`] || '',
        data[`responsible_gaming_${lang}`] || '',
        data[`pros_${lang}`] || ''
      ).run();
    }
    
    return c.json({ id: casinoId, ...data });
  } catch (error) {
    console.error('Failed to create casino:', error);
    return c.json({ error: 'Failed to create casino' }, 500);
  }
});

api.put('/admin/casinos/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  const data = await c.req.json();
  
  try {
    // Update main casino record
    await env.DB.prepare(
      'UPDATE casinos SET name = ?, slug = ?, logo_url = ?, website_url = ?, affiliate_link = ?, sort_order = ?, is_active = ? WHERE id = ?'
    ).bind(data.name, data.slug, data.logo_url, data.website_url, data.affiliate_link, data.sort_order, data.is_active ? 1 : 0, id).run();
    
    // Update or insert details for each language
    const languages = ['en', 'pt', 'zh'];
    for (const lang of languages) {
      // Check if details exist for this language
      const existing = await env.DB.prepare(
        'SELECT id FROM casino_info WHERE casino_id = ? AND language = ?'
      ).bind(id, lang).first();
      
      if (existing) {
        // Update existing details
        await env.DB.prepare(`
          UPDATE casino_info SET
            welcome_bonus = ?, min_deposit = ?, payment_methods = ?, license = ?, founded_year = ?,
            bonus_description = ?, games_description = ?, payment_description = ?, support_description = ?,
            mobile_description = ?, security_description = ?, responsible_gaming_description = ?, pros = ?
          WHERE casino_id = ? AND language = ?
        `).bind(
          data[`welcome_bonus_${lang}`] || '',
          data[`min_deposit_${lang}`] || '',
          data[`payment_methods_${lang}`] || '',
          data[`license_${lang}`] || '',
          data[`founded_year_${lang}`] || '',
          data[`bonus_description_${lang}`] || '',
          data[`games_description_${lang}`] || '',
          data[`payment_description_${lang}`] || '',
          data[`support_description_${lang}`] || '',
          data[`mobile_description_${lang}`] || '',
          data[`security_description_${lang}`] || '',
          data[`responsible_gaming_${lang}`] || '',
          data[`pros_${lang}`] || '',
          id, lang
        ).run();
      } else {
        // Insert new details
        await env.DB.prepare(`
          INSERT INTO casino_info 
          (casino_id, language, welcome_bonus, min_deposit, payment_methods, license, founded_year,
           bonus_description, games_description, payment_description, support_description, 
           mobile_description, security_description, responsible_gaming_description, pros)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id, lang,
          data[`welcome_bonus_${lang}`] || '',
          data[`min_deposit_${lang}`] || '',
          data[`payment_methods_${lang}`] || '',
          data[`license_${lang}`] || '',
          data[`founded_year_${lang}`] || '',
          data[`bonus_description_${lang}`] || '',
          data[`games_description_${lang}`] || '',
          data[`payment_description_${lang}`] || '',
          data[`support_description_${lang}`] || '',
          data[`mobile_description_${lang}`] || '',
          data[`security_description_${lang}`] || '',
          data[`responsible_gaming_${lang}`] || '',
          data[`pros_${lang}`] || ''
        ).run();
      }
    }
    
    return c.json({ id, ...data });
  } catch (error) {
    console.error('Failed to update casino:', error);
    return c.json({ error: 'Failed to update casino' }, 500);
  }
});

api.delete('/admin/casinos/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  
  try {
    // Delete casino details first (foreign key constraint)
    await env.DB.prepare('DELETE FROM casino_info WHERE casino_id = ?').bind(id).run();
    
    // Delete player type associations
    await env.DB.prepare('DELETE FROM player_type_casinos WHERE casino_id = ?').bind(id).run();
    
    // Delete main casino record
    await env.DB.prepare('DELETE FROM casinos WHERE id = ?').bind(id).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Failed to delete casino:', error);
    return c.json({ error: 'Failed to delete casino' }, 500);
  }
});

// Casino details
api.get('/admin/casinos/:id/details', async (c) => {
  const { env } = c;
  const casinoId = c.req.param('id');
  
  try {
    const details = await env.DB.prepare(
      'SELECT * FROM casino_info WHERE casino_id = ?'
    ).bind(casinoId).all();
    
    return c.json(details.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch casino details' }, 500);
  }
});

api.post('/admin/casinos/:id/details', async (c) => {
  const { env } = c;
  const casinoId = c.req.param('id');
  const data = await c.req.json();
  
  try {
    // Convert arrays to JSON strings
    const pros = data.pros ? JSON.stringify(data.pros) : null;
    const cons = data.cons ? JSON.stringify(data.cons) : null;
    
    const result = await env.DB.prepare(`
      INSERT OR REPLACE INTO casino_info 
      (casino_id, language, welcome_bonus, min_deposit, payment_methods, license, founded_year,
       bonus_description, games_description, payment_description, support_description, 
       mobile_description, security_description, responsible_gaming_description, pros, cons,
       rating_overall, rating_bonus, rating_games, rating_payment, rating_support, rating_mobile)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      casinoId, data.language, data.welcome_bonus, data.min_deposit, data.payment_methods,
      data.license, data.founded_year, data.bonus_description, data.games_description,
      data.payment_description, data.support_description, data.mobile_description,
      data.security_description, data.responsible_gaming_description, pros, cons,
      data.rating_overall || 0, data.rating_bonus || 0, data.rating_games || 0,
      data.rating_payment || 0, data.rating_support || 0, data.rating_mobile || 0
    ).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error saving casino details:', error);
    return c.json({ error: 'Failed to save casino details' }, 500);
  }
});

// Player types
api.get('/admin/player-types', async (c) => {
  const { env } = c;
  
  try {
    const types = await env.DB.prepare(
      'SELECT * FROM player_types ORDER BY sort_order'
    ).all();
    
    return c.json(types.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch player types' }, 500);
  }
});

api.post('/admin/player-types', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  try {
    const result = await env.DB.prepare(`
      INSERT INTO player_types 
      (name_en, name_pt, name_zh, description_en, description_pt, description_zh, icon, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name_en, data.name_pt, data.name_zh, 
      data.description_en, data.description_pt, data.description_zh,
      data.icon, data.sort_order || 0
    ).run();
    
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to create player type' }, 500);
  }
});

// Contact form submission (public)
api.post('/contact', async (c) => {
  const { env } = c;
  const { email, message } = await c.req.json();
  
  try {
    // Get IP address and user agent for tracking
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const userAgent = c.req.header('User-Agent') || 'unknown';
    
    // Save to database
    await env.DB.prepare(
      'INSERT INTO contact_submissions (email, message, ip_address, user_agent) VALUES (?, ?, ?, ?)'
    ).bind(email, message, ip, userAgent).run();
    
    return c.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: 'Failed to submit message' }, 500);
  }
});

// Get contact submissions (admin only)
api.get('/admin/contact-submissions', async (c) => {
  const { env } = c;
  
  try {
    const submissions = await env.DB.prepare(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100'
    ).all();
    
    return c.json(submissions.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch contact submissions' }, 500);
  }
});

// Blog Categories CRUD
api.get('/admin/blog/categories', async (c) => {
  const { env } = c;
  
  try {
    const categories = await env.DB.prepare(
      'SELECT * FROM blog_categories ORDER BY sort_order, name_en'
    ).all();
    
    return c.json(categories.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

api.post('/admin/blog/categories', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  try {
    const result = await env.DB.prepare(`
      INSERT INTO blog_categories (slug, name_en, name_pt, name_zh, description_en, description_pt, description_zh, is_visible, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.slug, data.name_en, data.name_pt, data.name_zh || '',
      data.description_en || '', data.description_pt || '', data.description_zh || '',
      data.is_visible ? 1 : 0, data.sort_order || 0
    ).run();
    
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

api.put('/admin/blog/categories/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  const data = await c.req.json();
  
  try {
    await env.DB.prepare(`
      UPDATE blog_categories 
      SET slug = ?, name_en = ?, name_pt = ?, name_zh = ?, 
          description_en = ?, description_pt = ?, description_zh = ?,
          is_visible = ?, sort_order = ?
      WHERE id = ?
    `).bind(
      data.slug, data.name_en, data.name_pt, data.name_zh || '',
      data.description_en || '', data.description_pt || '', data.description_zh || '',
      data.is_visible ? 1 : 0, data.sort_order || 0, id
    ).run();
    
    return c.json({ id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

api.delete('/admin/blog/categories/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  
  try {
    await env.DB.prepare('DELETE FROM blog_categories WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

// Blog Posts CRUD with publish date sorting
api.get('/admin/blog/posts', async (c) => {
  const { env } = c;
  
  try {
    const posts = await env.DB.prepare(`
      SELECT * FROM blog_posts 
      ORDER BY published_at DESC, created_at DESC
    `).all();
    
    return c.json(posts.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

api.post('/admin/blog/posts', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  try {
    const result = await env.DB.prepare(`
      INSERT INTO blog_posts (
        category_id, slug, title_en, title_pt, title_zh,
        excerpt_en, excerpt_pt, excerpt_zh,
        content_en, content_pt, content_zh,
        featured_image, author, is_published, published_at, view_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.category_id, data.slug,
      data.title_en, data.title_pt, data.title_zh || '',
      data.excerpt_en || '', data.excerpt_pt || '', data.excerpt_zh || '',
      data.content_en || '', data.content_pt || '', data.content_zh || '',
      data.featured_image || '', data.author || '',
      data.is_published ? 1 : 0,
      data.published_at || new Date().toISOString(),
      0
    ).run();
    
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

api.put('/admin/blog/posts/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  const data = await c.req.json();
  
  try {
    await env.DB.prepare(`
      UPDATE blog_posts SET
        category_id = ?, slug = ?, title_en = ?, title_pt = ?, title_zh = ?,
        excerpt_en = ?, excerpt_pt = ?, excerpt_zh = ?,
        content_en = ?, content_pt = ?, content_zh = ?,
        featured_image = ?, author = ?, is_published = ?, published_at = ?
      WHERE id = ?
    `).bind(
      data.category_id, data.slug,
      data.title_en, data.title_pt, data.title_zh || '',
      data.excerpt_en || '', data.excerpt_pt || '', data.excerpt_zh || '',
      data.content_en || '', data.content_pt || '', data.content_zh || '',
      data.featured_image || '', data.author || '',
      data.is_published ? 1 : 0,
      data.published_at || new Date().toISOString(),
      id
    ).run();
    
    return c.json({ id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to update post' }, 500);
  }
});

api.delete('/admin/blog/posts/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  
  try {
    await env.DB.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to delete post' }, 500);
  }
});

// Player Type Casinos Management
api.get('/admin/player-types/:id/casinos', async (c) => {
  const { env } = c;
  const typeId = c.req.param('id');
  
  try {
    const casinos = await env.DB.prepare(`
      SELECT c.* FROM casinos c
      JOIN player_type_casinos ptc ON c.id = ptc.casino_id
      WHERE ptc.player_type_id = ?
      ORDER BY ptc.sort_order, c.name
    `).bind(typeId).all();
    
    return c.json(casinos.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch player type casinos' }, 500);
  }
});

api.post('/admin/player-types/:id/casinos', async (c) => {
  const { env } = c;
  const typeId = c.req.param('id');
  const { casinoIds } = await c.req.json();
  
  try {
    // Delete existing associations
    await env.DB.prepare('DELETE FROM player_type_casinos WHERE player_type_id = ?').bind(typeId).run();
    
    // Insert new associations
    for (let i = 0; i < casinoIds.length; i++) {
      await env.DB.prepare(
        'INSERT INTO player_type_casinos (player_type_id, casino_id, sort_order) VALUES (?, ?, ?)'
      ).bind(typeId, casinoIds[i], i).run();
    }
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update player type casinos' }, 500);
  }
});

export default api;