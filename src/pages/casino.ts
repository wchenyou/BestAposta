import { Context } from 'hono';
import { Bindings } from '../types';
import { translations as t } from '../utils/language';

export async function renderCasinoPage(c: Context<{ Bindings: Bindings }>, slug: string, lang: 'en' | 'pt' | 'zh') {
  const { env } = c;
  
  try {
    // Get casino basic info
    const casino = await env.DB.prepare(
      'SELECT * FROM casinos WHERE slug = ? AND is_active = 1'
    ).bind(slug).first();
    
    if (!casino) {
      return c.html(`
        <html>
        <head>
          <title>Casino Not Found - Best Apostas</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100">
          <div class="max-w-4xl mx-auto p-8">
            <h1 class="text-2xl font-bold mb-4">Casino não encontrado / Casino not found / 赌场未找到</h1>
            <a href="/" class="text-purple-600 hover:underline">← ${t[lang].nav.home}</a>
          </div>
        </body>
        </html>
      `);
    }
    
    // Get casino detailed info in the requested language
    const casinoInfo = await env.DB.prepare(
      'SELECT * FROM casino_info WHERE casino_id = ? AND language = ?'
    ).bind(casino.id, lang).first();
    
    // If no info in requested language, try to get English version as fallback
    const info = casinoInfo || await env.DB.prepare(
      'SELECT * FROM casino_info WHERE casino_id = ? AND language = "en"'
    ).bind(casino.id).first();
    
    return c.html(`
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${casino.name} - ${t[lang].siteName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <a href="/" class="flex items-center">
                  <span class="text-2xl font-bold text-purple-600">${t[lang].siteName}</span>
                </a>
                <div class="hidden md:flex ml-10 space-x-8">
                  <a href="/" class="text-gray-700 hover:text-purple-600">${t[lang].nav.home}</a>
                  <a href="/casinos" class="text-gray-700 hover:text-purple-600">${t[lang].nav.casinos}</a>
                  <a href="/blog" class="text-gray-700 hover:text-purple-600">${t[lang].nav.blog}</a>
                  <a href="/contact" class="text-gray-700 hover:text-purple-600">${t[lang].nav.contact}</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <div class="max-w-7xl mx-auto px-4 py-8">
          <!-- Casino Header -->
          <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="flex items-center mb-4 md:mb-0">
                ${casino.logo_url ? `
                  <div class="h-20 w-32 mr-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white rounded-lg">
                    <img src="${casino.logo_url}" alt="${casino.name}" class="w-full h-full object-contain">
                  </div>
                ` : ''}
                <div>
                  <h1 class="text-3xl font-bold text-gray-900">${casino.name}</h1>
                  ${info ? `
                    <p class="text-gray-600 mt-2">${info.company_info || ''}</p>
                  ` : ''}
                </div>
              </div>
              <a href="${casino.affiliate_link}" target="_blank" rel="noopener" 
                class="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition">
                <i class="fas fa-play-circle mr-2"></i>
                ${t[lang].casino.visitSite}
              </a>
            </div>
          </div>
          
          ${info ? `
            <!-- Basic Information Table -->
            <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 class="text-2xl font-bold mb-6 text-gray-900">
                ${lang === 'zh' ? '基本資訊' : lang === 'pt' ? 'Informações Básicas' : 'Basic Information'}
              </h2>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <tbody class="divide-y divide-gray-200">
                    ${info.company_info ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50 w-1/3">
                          ${lang === 'zh' ? '營運公司' : lang === 'pt' ? 'Empresa Operadora' : 'Operating Company'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.company_info}</td>
                      </tr>
                    ` : ''}
                    ${info.established_year ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '成立時間' : lang === 'pt' ? 'Ano de Fundação' : 'Established'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.established_year}</td>
                      </tr>
                    ` : ''}
                    ${info.licenses_safety ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '國際牌照與網站安全' : lang === 'pt' ? 'Licenças e Segurança' : 'Licenses & Safety'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.licenses_safety}</td>
                      </tr>
                    ` : ''}
                    ${info.operating_countries ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '經營國家' : lang === 'pt' ? 'Países de Operação' : 'Operating Countries'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.operating_countries}</td>
                      </tr>
                    ` : ''}
                    ${info.supported_currencies ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '支援幣別' : lang === 'pt' ? 'Moedas Suportadas' : 'Supported Currencies'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.supported_currencies}</td>
                      </tr>
                    ` : ''}
                    ${info.supported_languages ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '支援語系' : lang === 'pt' ? 'Idiomas Suportados' : 'Supported Languages'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.supported_languages}</td>
                      </tr>
                    ` : ''}
                    ${info.game_types ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '遊戲類型' : lang === 'pt' ? 'Tipos de Jogos' : 'Game Types'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.game_types}</td>
                      </tr>
                    ` : ''}
                    ${info.payment_methods ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '支付方式' : lang === 'pt' ? 'Métodos de Pagamento' : 'Payment Methods'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.payment_methods}</td>
                      </tr>
                    ` : ''}
                    ${info.mobile_apps ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '是否有APP' : lang === 'pt' ? 'Aplicativos Móveis' : 'Mobile Apps'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.mobile_apps}</td>
                      </tr>
                    ` : ''}
                    ${info.customer_support ? `
                      <tr>
                        <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-50">
                          ${lang === 'zh' ? '客服支援' : lang === 'pt' ? 'Suporte ao Cliente' : 'Customer Support'}
                        </td>
                        <td class="py-3 px-4 text-gray-900">${info.customer_support}</td>
                      </tr>
                    ` : ''}
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- Detailed Information -->
            <div class="bg-white rounded-lg shadow-lg p-6 space-y-8">
              ${info.why_choose ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-question-circle text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '為何選擇這間娛樂城？' : lang === 'pt' ? 'Por que escolher este cassino?' : 'Why choose this casino?'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.why_choose}</div>
                </div>
              ` : ''}
              
              ${info.casino_features ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-star text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '娛樂城特色' : lang === 'pt' ? 'Características do Cassino' : 'Casino Features'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.casino_features}</div>
                </div>
              ` : ''}
              
              ${info.licenses_safety_detail ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-shield-alt text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '國際牌照與網站安全' : lang === 'pt' ? 'Licenças e Segurança do Site' : 'Licenses & Website Security'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.licenses_safety_detail}</div>
                </div>
              ` : ''}
              
              ${info.operating_countries_detail ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-globe text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '經營國家' : lang === 'pt' ? 'Países de Operação' : 'Operating Countries'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.operating_countries_detail}</div>
                </div>
              ` : ''}
              
              ${info.game_variety_detail ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-gamepad text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '遊戲種類' : lang === 'pt' ? 'Variedade de Jogos' : 'Game Variety'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.game_variety_detail}</div>
                </div>
              ` : ''}
              
              ${info.sports_betting_features ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-futbol text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '體育投注功能' : lang === 'pt' ? 'Recursos de Apostas Esportivas' : 'Sports Betting Features'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.sports_betting_features}</div>
                </div>
              ` : ''}
              
              ${info.special_promotions ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-gift text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '特別優惠活動' : lang === 'pt' ? 'Promoções Especiais' : 'Special Promotions'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.special_promotions}</div>
                </div>
              ` : ''}
              
              ${info.suitable_players ? `
                <div>
                  <h3 class="text-xl font-bold mb-4 text-gray-900">
                    <i class="fas fa-users text-purple-600 mr-2"></i>
                    ${lang === 'zh' ? '適合玩家' : lang === 'pt' ? 'Jogadores Adequados' : 'Suitable Players'}
                  </h3>
                  <div class="text-gray-700 whitespace-pre-line">${info.suitable_players}</div>
                </div>
              ` : ''}
            </div>
          ` : `
            <!-- No detailed information available message -->
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <i class="fas fa-exclamation-triangle text-yellow-400"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">
                    ${lang === 'zh' ? '詳細資訊即將推出' : lang === 'pt' ? 'Informações detalhadas em breve' : 'Detailed information coming soon'}
                  </p>
                </div>
              </div>
            </div>
          `}
          
          <!-- Bottom CTA Button -->
          <div class="mt-12 text-center">
            <a href="${casino.affiliate_link || casino.website_url}" 
               target="_blank" 
               rel="noopener noreferrer"
               class="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition">
              <i class="fas fa-play-circle mr-2"></i>
              ${lang === 'zh' ? '立即遊戲' : lang === 'pt' ? 'Jogar Agora' : 'Play Now'}
            </a>
          </div>
        </div>
        
        <!-- Language Selector Script -->
        <script>
          function changeLanguage(lang) {
            document.cookie = 'lang=' + lang + '; Max-Age=' + (60 * 60 * 24 * 365) + '; Path=/; SameSite=Lax';
            window.location.reload();
          }
        </script>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Error loading casino:', error);
    return c.html(`
      <html>
      <head>
        <title>Error - Best Apostas</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-100">
        <div class="max-w-4xl mx-auto p-8">
          <h1 class="text-2xl font-bold mb-4 text-red-600">Error loading casino</h1>
          <p>We apologize for the inconvenience. Please try again later.</p>
          <a href="/" class="text-purple-600 hover:underline">← ${t[lang].nav.home}</a>
        </div>
      </body>
      </html>
    `);
  }
}