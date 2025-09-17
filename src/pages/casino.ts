import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderCasinoPage(lang: Language, casino: any): string {
  const pros = casino.pros ? JSON.parse(casino.pros) : [];
  const cons = casino.cons ? JSON.parse(casino.cons) : [];
  
  const content = `
    <div class="container mx-auto px-4 py-8">
        <!-- Casino Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="flex items-center mb-4 md:mb-0">
                    ${casino.logo_url ? 
                      `<div class="bg-white p-3 rounded-lg mr-4">
                        <img src="${casino.logo_url}" alt="${casino.name}" class="h-16 object-contain">
                      </div>` :
                      `<div class="h-20 w-32 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                        <span class="text-2xl font-bold">${casino.name}</span>
                      </div>`
                    }
                    <div>
                        <h1 class="text-4xl font-bold mb-2">${casino.name}</h1>
                        ${casino.founded_year ? `<p class="text-purple-100">${t(lang, 'casino.founded')}: ${casino.founded_year}</p>` : ''}
                    </div>
                </div>
                
                <a href="${casino.affiliate_link || casino.website_url}" target="_blank" rel="noopener noreferrer" 
                   class="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition shadow-lg">
                    <i class="fas fa-play-circle mr-2"></i> ${t(lang, 'casino.visitSite')}
                </a>
            </div>
        </div>
        
        <!-- Quick Overview Table (Top Section as per Notion template) -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-gray-50 px-6 py-4 border-b">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-info-circle mr-2 text-purple-600"></i>${t(lang, 'casino.overview')}
                </h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <tbody class="divide-y divide-gray-200">
                        ${casino.welcome_bonus ? `
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 w-1/3 flex items-center">
                                <i class="fas fa-gift mr-3 text-purple-500"></i>${t(lang, 'casino.bonus')}
                            </td>
                            <td class="py-4 px-6 text-gray-800 font-medium">${casino.welcome_bonus}</td>
                        </tr>` : ''}
                        
                        ${casino.min_deposit ? `
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-coins mr-3 text-green-500"></i>${t(lang, 'casino.minDeposit')}
                            </td>
                            <td class="py-4 px-6 text-gray-800 font-medium">${casino.min_deposit}</td>
                        </tr>` : ''}
                        
                        ${casino.payment_methods ? `
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-credit-card mr-3 text-blue-500"></i>${t(lang, 'casino.paymentMethods')}
                            </td>
                            <td class="py-4 px-6 text-gray-800">
                                <div class="flex flex-wrap gap-2">
                                    ${casino.payment_methods.split(',').map(method => 
                                      `<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">${method.trim()}</span>`
                                    ).join('')}
                                </div>
                            </td>
                        </tr>` : ''}
                        
                        ${casino.license ? `
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-certificate mr-3 text-yellow-500"></i>${t(lang, 'casino.license')}
                            </td>
                            <td class="py-4 px-6 text-gray-800 font-medium">${casino.license}</td>
                        </tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Ratings Section -->
        ${(casino.rating_overall > 0) ? `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-gray-50 px-6 py-4 border-b">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-star mr-2 text-yellow-500"></i>${t(lang, 'ratings.overall')}
                </h2>
            </div>
            <div class="p-6">
                <div class="mb-6">
                    <div class="text-center">
                        <div class="text-5xl font-bold text-purple-600 mb-2">${casino.rating_overall}%</div>
                        <div class="text-gray-600">${t(lang, 'ratings.overall')}</div>
                    </div>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                    ${renderRatingBar(t(lang, 'ratings.bonus'), casino.rating_bonus, 'text-green-600')}
                    ${renderRatingBar(t(lang, 'ratings.games'), casino.rating_games, 'text-blue-600')}
                    ${renderRatingBar(t(lang, 'ratings.payment'), casino.rating_payment, 'text-purple-600')}
                    ${renderRatingBar(t(lang, 'ratings.support'), casino.rating_support, 'text-orange-600')}
                    ${renderRatingBar(t(lang, 'ratings.mobile'), casino.rating_mobile, 'text-pink-600')}
                </div>
            </div>
        </div>` : ''}
        
        <!-- Pros and Cons Section -->
        ${(pros.length > 0 || cons.length > 0) ? `
        <div class="grid md:grid-cols-2 gap-6 mb-8">
            ${pros.length > 0 ? `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-green-500 px-6 py-4">
                    <h3 class="text-xl font-bold text-white">
                        <i class="fas fa-check-circle mr-2"></i>${t(lang, 'casino.pros')}
                    </h3>
                </div>
                <div class="p-6">
                    <ul class="space-y-3">
                        ${pros.map(pro => `
                            <li class="flex items-start">
                                <div class="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <i class="fas fa-check text-green-600 text-xs"></i>
                                </div>
                                <span class="ml-3 text-gray-700">${pro}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>` : ''}
            
            ${cons.length > 0 ? `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-red-500 px-6 py-4">
                    <h3 class="text-xl font-bold text-white">
                        <i class="fas fa-times-circle mr-2"></i>${t(lang, 'casino.cons')}
                    </h3>
                </div>
                <div class="p-6">
                    <ul class="space-y-3">
                        ${cons.map(con => `
                            <li class="flex items-start">
                                <div class="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                                    <i class="fas fa-times text-red-600 text-xs"></i>
                                </div>
                                <span class="ml-3 text-gray-700">${con}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>` : ''}
        </div>` : ''}
        
        <!-- Detailed Sections (Bottom Section as per Notion template) -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold mb-6 text-center">${t(lang, 'casino.details')}</h2>
            <div class="space-y-6">
                ${renderSection(t(lang, 'casino.bonus'), casino.bonus_description, 'fa-gift', 'purple')}
                ${renderSection(t(lang, 'casino.games'), casino.games_description, 'fa-gamepad', 'blue')}
                ${renderSection(t(lang, 'casino.payments'), casino.payment_description, 'fa-credit-card', 'green')}
                ${renderSection(t(lang, 'casino.support'), casino.support_description, 'fa-headset', 'orange')}
                ${renderSection(t(lang, 'casino.mobile'), casino.mobile_description, 'fa-mobile-alt', 'pink')}
                ${renderSection(t(lang, 'casino.security'), casino.security_description, 'fa-shield-alt', 'red')}
                ${renderSection(t(lang, 'casino.responsibleGaming'), casino.responsible_gaming_description, 'fa-user-shield', 'indigo')}
            </div>
        </div>
        
        <!-- Final CTA Section (Bottom as per Notion template) -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-center">
            <h3 class="text-2xl font-bold text-white mb-4">
                ${lang === 'pt' ? 
                  `Pronto para jogar no ${casino.name}?` : 
                  lang === 'zh' ? 
                  `准备好在${casino.name}游戏了吗？` : 
                  `Ready to play at ${casino.name}?`}
            </h3>
            <p class="text-purple-100 mb-6">
                ${lang === 'pt' ? 
                  'Cadastre-se agora e aproveite o bônus de boas-vindas!' : 
                  lang === 'zh' ? 
                  '立即注册并享受欢迎奖金！' : 
                  'Register now and enjoy the welcome bonus!'}
            </p>
            <a href="${casino.affiliate_link || casino.website_url}" target="_blank" rel="noopener noreferrer" 
               class="inline-block bg-green-500 text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-green-600 transition shadow-lg transform hover:scale-105">
                <i class="fas fa-rocket mr-2"></i> 
                ${t(lang, 'casino.visitSite')}
            </a>
        </div>
    </div>
  `;
  
  return renderLayout(lang, `${casino.name} - ${t(lang, 'siteName')}`, content);
}

function renderRatingBar(label: string, rating: number, colorClass: string = 'text-purple-600'): string {
  return `
    <div>
        <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-700">${label}</span>
            <span class="text-sm font-bold ${colorClass}">${rating}%</span>
        </div>
        <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500" 
                 style="width: ${rating}%"></div>
        </div>
    </div>
  `;
}

function renderSection(title: string, content: string | null, icon: string, color: string = 'purple'): string {
  if (!content) return '';
  
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600'
  };
  
  const bgColor = colorClasses[color] || colorClasses.purple;
  
  return `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="${bgColor.split(' ')[0]} px-6 py-4 border-b-2 ${bgColor.split(' ')[1]}">
            <h3 class="text-xl font-bold flex items-center">
                <i class="fas ${icon} mr-3 ${bgColor.split(' ')[2]}"></i>
                <span class="text-gray-800">${title}</span>
            </h3>
        </div>
        <div class="p-6">
            <div class="prose max-w-none text-gray-700">
                ${content}
            </div>
        </div>
    </div>
  `;
}