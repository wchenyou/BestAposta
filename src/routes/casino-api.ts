import { Hono } from 'hono';
import { Bindings } from '../types';

const casinoApi = new Hono<{ Bindings: Bindings }>();

// Get full casino data with all language info
casinoApi.get('/admin/casino/:id/full', async (c) => {
  const { env } = c;
  const casinoId = c.req.param('id');
  
  try {
    // Get basic casino info
    const casino = await env.DB.prepare(
      'SELECT * FROM casinos WHERE id = ?'
    ).bind(casinoId).first();
    
    if (!casino) {
      return c.json({ error: 'Casino not found' }, 404);
    }
    
    // Get all language info
    const infos = await env.DB.prepare(
      'SELECT * FROM casino_info WHERE casino_id = ?'
    ).bind(casinoId).all();
    
    // Organize info by language
    const result = {
      ...casino,
      info_en: infos.results?.find(i => i.language === 'en') || null,
      info_pt: infos.results?.find(i => i.language === 'pt') || null,
      info_zh: infos.results?.find(i => i.language === 'zh') || null
    };
    
    return c.json(result);
  } catch (error) {
    console.error('Error fetching casino:', error);
    return c.json({ error: 'Failed to fetch casino' }, 500);
  }
});

// Create new casino
casinoApi.post('/admin/casino', async (c) => {
  const { env } = c;
  const data = await c.req.json();
  
  try {
    // Insert main casino record
    const result = await env.DB.prepare(`
      INSERT INTO casinos (name, slug, logo_url, website_url, affiliate_link, rating, bonus_percentage, is_active, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.name,
      data.slug,
      data.logo_url || '',
      data.website_url || '',
      data.affiliate_link || '',
      data.rating || 4.5,
      data.bonus_percentage || 100,
      data.is_active ? 1 : 0,
      data.sort_order || 0
    ).run();
    
    const casinoId = result.meta.last_row_id;
    
    // Insert casino info for each language
    if (data.info) {
      for (const [lang, info] of Object.entries(data.info)) {
        await env.DB.prepare(`
          INSERT INTO casino_info (
            casino_id, language,
            company_info, established_year, licenses_safety, operating_countries,
            supported_currencies, supported_languages, game_types, payment_methods,
            mobile_apps, customer_support,
            why_choose, casino_features, licenses_safety_detail, operating_countries_detail,
            game_variety_detail, sports_betting_features, special_promotions, suitable_players
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          casinoId, lang,
          info.company_info || '',
          info.established_year || '',
          info.licenses_safety || '',
          info.operating_countries || '',
          info.supported_currencies || '',
          info.supported_languages || '',
          info.game_types || '',
          info.payment_methods || '',
          info.mobile_apps || '',
          info.customer_support || '',
          info.why_choose || '',
          info.casino_features || '',
          info.licenses_safety_detail || '',
          info.operating_countries_detail || '',
          info.game_variety_detail || '',
          info.sports_betting_features || '',
          info.special_promotions || '',
          info.suitable_players || ''
        ).run();
      }
    }
    
    return c.json({ id: casinoId, success: true });
  } catch (error) {
    console.error('Error creating casino:', error);
    return c.json({ error: 'Failed to create casino' }, 500);
  }
});

// Update existing casino
casinoApi.put('/admin/casino/:id', async (c) => {
  const { env } = c;
  const casinoId = c.req.param('id');
  const data = await c.req.json();
  
  try {
    // Update main casino record
    await env.DB.prepare(`
      UPDATE casinos SET
        name = ?, slug = ?, logo_url = ?, website_url = ?, affiliate_link = ?,
        rating = ?, bonus_percentage = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.name,
      data.slug,
      data.logo_url || '',
      data.website_url || '',
      data.affiliate_link || '',
      data.rating || 4.5,
      data.bonus_percentage || 100,
      data.is_active ? 1 : 0,
      data.sort_order || 0,
      casinoId
    ).run();
    
    // Update or insert casino info for each language
    if (data.info) {
      for (const [lang, info] of Object.entries(data.info)) {
        // Check if info exists for this language
        const existing = await env.DB.prepare(
          'SELECT id FROM casino_info WHERE casino_id = ? AND language = ?'
        ).bind(casinoId, lang).first();
        
        if (existing) {
          // Update existing
          await env.DB.prepare(`
            UPDATE casino_info SET
              company_info = ?, established_year = ?, licenses_safety = ?, operating_countries = ?,
              supported_currencies = ?, supported_languages = ?, game_types = ?, payment_methods = ?,
              mobile_apps = ?, customer_support = ?,
              why_choose = ?, casino_features = ?, licenses_safety_detail = ?, operating_countries_detail = ?,
              game_variety_detail = ?, sports_betting_features = ?, special_promotions = ?, suitable_players = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE casino_id = ? AND language = ?
          `).bind(
            info.company_info || '',
            info.established_year || '',
            info.licenses_safety || '',
            info.operating_countries || '',
            info.supported_currencies || '',
            info.supported_languages || '',
            info.game_types || '',
            info.payment_methods || '',
            info.mobile_apps || '',
            info.customer_support || '',
            info.why_choose || '',
            info.casino_features || '',
            info.licenses_safety_detail || '',
            info.operating_countries_detail || '',
            info.game_variety_detail || '',
            info.sports_betting_features || '',
            info.special_promotions || '',
            info.suitable_players || '',
            casinoId, lang
          ).run();
        } else {
          // Insert new
          await env.DB.prepare(`
            INSERT INTO casino_info (
              casino_id, language,
              company_info, established_year, licenses_safety, operating_countries,
              supported_currencies, supported_languages, game_types, payment_methods,
              mobile_apps, customer_support,
              why_choose, casino_features, licenses_safety_detail, operating_countries_detail,
              game_variety_detail, sports_betting_features, special_promotions, suitable_players
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            casinoId, lang,
            info.company_info || '',
            info.established_year || '',
            info.licenses_safety || '',
            info.operating_countries || '',
            info.supported_currencies || '',
            info.supported_languages || '',
            info.game_types || '',
            info.payment_methods || '',
            info.mobile_apps || '',
            info.customer_support || '',
            info.why_choose || '',
            info.casino_features || '',
            info.licenses_safety_detail || '',
            info.operating_countries_detail || '',
            info.game_variety_detail || '',
            info.sports_betting_features || '',
            info.special_promotions || '',
            info.suitable_players || ''
          ).run();
        }
      }
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating casino:', error);
    return c.json({ error: 'Failed to update casino' }, 500);
  }
});

// Delete casino
casinoApi.delete('/admin/casino/:id', async (c) => {
  const { env } = c;
  const casinoId = c.req.param('id');
  
  try {
    // Delete casino info first (foreign key constraint)
    await env.DB.prepare('DELETE FROM casino_info WHERE casino_id = ?').bind(casinoId).run();
    
    // Delete player type associations
    await env.DB.prepare('DELETE FROM player_type_casinos WHERE casino_id = ?').bind(casinoId).run();
    
    // Delete main casino record
    await env.DB.prepare('DELETE FROM casinos WHERE id = ?').bind(casinoId).run();
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting casino:', error);
    return c.json({ error: 'Failed to delete casino' }, 500);
  }
});

export default casinoApi;