// Additional API endpoints needed for complete functionality

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

// Blog Posts CRUD
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
api.get('/api/player-types/:id/casinos', async (c) => {
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

// Contact Submissions Management
api.get('/admin/contact-submissions', async (c) => {
  const { env } = c;
  
  try {
    const submissions = await env.DB.prepare(`
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC
    `).all();
    
    return c.json(submissions.results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch contact submissions' }, 500);
  }
});

api.put('/admin/contact-submissions/:id', async (c) => {
  const { env } = c;
  const id = c.req.param('id');
  const { submission_status, notes } = await c.req.json();
  
  try {
    await env.DB.prepare(`
      UPDATE contact_submissions 
      SET submission_status = ?, notes = ?, replied_at = ?
      WHERE id = ?
    `).bind(
      submission_status,
      notes || '',
      submission_status === 'replied' ? new Date().toISOString() : null,
      id
    ).run();
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to update submission' }, 500);
  }
});