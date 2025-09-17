import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderCasinosPage(lang: Language, casinos: any[]): string {
  const content = `
    <div class="container mx-auto px-4 py-8">
        <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4">${t(lang, 'nav.casinos')}</h1>
            <p class="text-lg text-gray-600">
                ${lang === 'pt' ? 
                  'Explore nossa lista completa de cassinos online confiáveis para jogadores brasileiros' : 
                  lang === 'zh' ? 
                  '探索我们为巴西玩家精选的可靠在线娱乐城完整列表' : 
                  'Explore our complete list of trusted online casinos for Brazilian players'}
            </p>
        </div>
        
        <!-- Casino Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${casinos.map(casino => {
              const detail = casino.details ? casino.details[0] : null;
              return `
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition casino-card">
                    <div class="h-32 bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                        ${casino.logo_url ? 
                          `<img src="${casino.logo_url}" alt="${casino.name}" class="w-full h-full object-contain">` :
                          `<span class="text-purple-600 text-2xl font-bold">${casino.name}</span>`
                        }
                    </div>
                    
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">${casino.name}</h3>
                        
                        ${detail ? `
                        <div class="space-y-2 mb-4">
                            ${detail.supported_languages ? `
                            <div class="flex items-center text-sm">
                                <i class="fas fa-language text-blue-500 w-5"></i>
                                <span class="ml-2 text-gray-700">${detail.supported_languages}</span>
                            </div>` : ''}
                            
                            ${detail.supported_currencies ? `
                            <div class="flex items-center text-sm">
                                <i class="fas fa-money-bill-wave text-green-500 w-5"></i>
                                <span class="ml-2 text-gray-700">${detail.supported_currencies}</span>
                            </div>` : ''}
                            
                            ${detail.payment_methods ? `
                            <div class="flex items-center text-sm">
                                <i class="fas fa-credit-card text-purple-500 w-5"></i>
                                <span class="ml-2 text-gray-700 truncate">${detail.payment_methods}</span>
                            </div>` : ''}

                        </div>
                        ` : `
                        <p class="text-gray-600 text-sm mb-4">
                            ${lang === 'pt' ? 
                              'Clique para ver mais detalhes' : 
                              lang === 'zh' ? 
                              '点击查看更多详情' : 
                              'Click to see more details'}
                        </p>
                        `}
                        
                        <div class="flex space-x-2">
                            <a href="/casino/${casino.slug}" 
                               class="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:bg-purple-700 transition">
                                ${lang === 'pt' ? 'Ver Detalhes' : lang === 'zh' ? '查看详情' : 'View Details'}
                            </a>
                            <a href="${casino.affiliate_link || casino.website_url}" 
                               target="_blank" rel="noopener noreferrer"
                               class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:bg-green-700 transition">
                                ${t(lang, 'casino.visitSite')}
                            </a>
                        </div>
                    </div>
                </div>
              `;
            }).join('')}
        </div>
        
        <!-- Info Section -->
        <div class="mt-12 bg-blue-50 rounded-xl p-8">
            <h2 class="text-2xl font-bold mb-4">
                <i class="fas fa-info-circle mr-2 text-blue-600"></i>
                ${lang === 'pt' ? 
                  'Sobre Nossa Seleção de Cassinos' : 
                  lang === 'zh' ? 
                  '关于我们的娱乐城选择' : 
                  'About Our Casino Selection'}
            </h2>
            <p class="text-gray-700 mb-4">
                ${lang === 'pt' ? 
                  'Todos os cassinos listados foram cuidadosamente avaliados considerando segurança, variedade de jogos, métodos de pagamento para brasileiros, qualidade do suporte em português e confiabilidade geral.' : 
                  lang === 'zh' ? 
                  '所有列出的娱乐城都经过仔细评估，考虑了安全性、游戏种类、巴西支付方式、葡萄牙语支持质量和整体可靠性。' : 
                  'All listed casinos have been carefully evaluated considering safety, game variety, payment methods for Brazilians, Portuguese support quality, and overall reliability.'}
            </p>
            <div class="grid md:grid-cols-3 gap-4 mt-6">
                <div class="flex items-center">
                    <i class="fas fa-shield-alt text-blue-600 text-2xl mr-3"></i>
                    <div>
                        <p class="font-semibold">${lang === 'pt' ? 'Segurança' : lang === 'zh' ? '安全性' : 'Security'}</p>
                        <p class="text-sm text-gray-600">${lang === 'pt' ? 'Licenciados e regulamentados' : lang === 'zh' ? '持牌和受监管' : 'Licensed and regulated'}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-language text-blue-600 text-2xl mr-3"></i>
                    <div>
                        <p class="font-semibold">${lang === 'pt' ? 'Suporte' : lang === 'zh' ? '支持' : 'Support'}</p>
                        <p class="text-sm text-gray-600">${lang === 'pt' ? 'Atendimento em português' : lang === 'zh' ? '葡萄牙语客服' : 'Portuguese customer service'}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <i class="fas fa-brazilian-real-sign text-blue-600 text-2xl mr-3"></i>
                    <div>
                        <p class="font-semibold">${lang === 'pt' ? 'Pagamentos' : lang === 'zh' ? '支付' : 'Payments'}</p>
                        <p class="text-sm text-gray-600">${lang === 'pt' ? 'PIX e métodos locais' : lang === 'zh' ? 'PIX和本地支付' : 'PIX and local methods'}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `;
  
  return renderLayout(lang, t(lang, 'nav.casinos'), content);
}