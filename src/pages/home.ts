import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderHomePage(lang: Language, playerTypes: any[]): string {
  const content = `
    <!-- Hero Section -->
    <section class="gradient-bg text-white py-20">
        <div class="container mx-auto px-4">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    ${t(lang, 'tagline')}
                </h1>
                <p class="text-lg mb-8 max-w-3xl mx-auto">${t(lang, 'subtitle')}</p>
                <div class="flex justify-center space-x-4">
                    <a href="#player-types" class="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg">
                        <i class="fas fa-search mr-2"></i> ${lang === 'pt' ? 'Encontre Seu Cassino Ideal' : lang === 'zh' ? '找到您的理想賭場' : 'Find Your Ideal Casino'}
                    </a>
                    <a href="/blog" class="bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                        <i class="fas fa-book-open mr-2"></i> ${t(lang, 'nav.blog')}
                    </a>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Player Types Section -->
    <section id="player-types" class="py-16">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold mb-4">${t(lang, 'playerTypes.title')}</h2>
                <p class="text-gray-600">${t(lang, 'playerTypes.subtitle')}</p>
            </div>
            
            <div class="space-y-8">
                ${playerTypes.map(playerType => {
                  const name = playerType[`name_${lang}`] || playerType.name_en;
                  const description = playerType[`description_${lang}`] || playerType.description_en;
                  const casinos = playerType.casinos_json ? JSON.parse(`[${playerType.casinos_json}]`) : [];
                  
                  return `
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                <i class="fas ${playerType.icon || 'fa-user'} text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">${name}</h3>
                                ${description ? `<p class="text-gray-600">${description}</p>` : ''}
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            ${casinos.map(casino => `
                                <a href="/casino/${casino.slug}" class="casino-card bg-white border-2 border-gray-200 rounded-lg overflow-hidden text-center hover:border-purple-500 hover:shadow-lg transition">
                                    <div class="h-16 flex items-center justify-center bg-gray-50">
                                        ${casino.logo_url ? 
                                          `<img src="${casino.logo_url}" alt="${casino.name}" class="w-full h-full object-contain">` :
                                          `<span class="text-lg font-bold text-purple-600">${casino.name}</span>`
                                        }
                                    </div>
                                    <p class="text-sm font-semibold text-gray-700 p-2">${casino.name}</p>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                  `;
                }).join('')}
            </div>
        </div>
    </section>
    
    <!-- Features Section -->
    <section class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-shield-alt text-purple-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${lang === 'pt' ? 'Seguro e Confiável' : lang === 'zh' ? '安全可靠' : 'Safe & Reliable'}</h3>
                    <p class="text-gray-600">${lang === 'pt' ? 'Apenas cassinos licenciados e confiáveis' : lang === 'zh' ? '仅推荐持牌可靠的娱乐城' : 'Only licensed and trusted casinos'}</p>
                </div>
                
                <div class="text-center">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-chart-bar text-purple-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${lang === 'pt' ? 'Análises Detalhadas' : lang === 'zh' ? '详细分析' : 'Detailed Analysis'}</h3>
                    <p class="text-gray-600">${lang === 'pt' ? 'Comparações completas e imparciais' : lang === 'zh' ? '完整公正的对比分析' : 'Complete and unbiased comparisons'}</p>
                </div>
                
                <div class="text-center">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-info-circle text-purple-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold mb-2">${lang === 'pt' ? 'Informações Atualizadas' : lang === 'zh' ? '最新资讯' : 'Updated Information'}</h3>
                    <p class="text-gray-600">${lang === 'pt' ? 'Conteúdo sempre atualizado e relevante' : lang === 'zh' ? '持续更新的相关内容' : 'Always updated and relevant content'}</p>
                </div>
            </div>
        </div>
    </section>
  `;
  
  return renderLayout(lang, t(lang, 'siteName'), content);
}