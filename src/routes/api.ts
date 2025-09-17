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
    const casinos = await env.DB.prepare(
      'SELECT * FROM casinos ORDER BY sort_order, name'
    ).all();
    
    return c.json(casinos.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch casinos' }, 500);
  }
});

api.post('/admin/casinos', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  try {
    const result = await env.DB.prepare(
      'INSERT INTO casinos (slug, name, logo_url, website_url, affiliate_link, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(data.slug, data.name, data.logo_url, data.website_url, data.affiliate_link, data.sort_order || 0).run();
    
    return c.json({ id: result.meta.last_row_id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to create casino' }, 500);
  }
});

api.put('/admin/casinos/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  const data = await c.req.json();
  
  try {
    await env.DB.prepare(
      'UPDATE casinos SET name = ?, logo_url = ?, website_url = ?, affiliate_link = ?, sort_order = ?, is_active = ? WHERE id = ?'
    ).bind(data.name, data.logo_url, data.website_url, data.affiliate_link, data.sort_order, data.is_active, id).run();
    
    return c.json({ id, ...data });
  } catch (error) {
    return c.json({ error: 'Failed to update casino' }, 500);
  }
});

// Casino details
api.get('/admin/casinos/:id/details', async (c) => {
  const { env } = c;
  const casinoId = c.req.param('id');
  
  try {
    const details = await env.DB.prepare(
      'SELECT * FROM casino_details WHERE casino_id = ?'
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
      INSERT OR REPLACE INTO casino_details 
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
  
  // In a real application, you would send an email or save to database
  // For now, we'll just log it
  console.log('Contact form submission:', { email, message });
  
  return c.json({ success: true, message: 'Message sent successfully' });
});

export default api;