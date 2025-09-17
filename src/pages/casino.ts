import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderCasinoPage(lang: Language, casino: any): string {
  const pros = casino.pros ? JSON.parse(casino.pros) : [];
  const cons = casino.cons ? JSON.parse(casino.cons) : [];
  
  const content = `
    <div class="container mx-auto px-4 py-8">
        <!-- Casino Header -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div class="flex flex-col md:flex-row items-center justify-between mb-6">
                <div class="flex items-center mb-4 md:mb-0">
                    ${casino.logo_url ? 
                      `<img src="${casino.logo_url}" alt="${casino.name}" class="h-16 mr-4 object-contain">` :
                      `<div class="h-16 w-32 bg-purple-100 rounded flex items-center justify-center mr-4">
                        <span class="text-xl font-bold text-purple-600">${casino.name}</span>
                      </div>`
                    }
                    <div>
                        <h1 class="text-3xl font-bold">${casino.name}</h1>
                        ${casino.founded_year ? `<p class="text-gray-600">${t(lang, 'casino.founded')}: ${casino.founded_year}</p>` : ''}
                    </div>
                </div>
                
                <a href="${casino.affiliate_link || casino.website_url}" target="_blank" rel="noopener noreferrer" 
                   class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                    <i class="fas fa-external-link-alt mr-2"></i> ${t(lang, 'casino.visitSite')}
                </a>
            </div>
            
            <!-- Overview Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <tbody>
                        ${casino.welcome_bonus ? `
                        <tr class="border-b">
                            <td class="py-3 pr-4 font-semibold text-gray-600 w-1/3">
                                <i class="fas fa-gift mr-2"></i>${t(lang, 'casino.bonus')}
                            </td>
                            <td class="py-3 text-gray-800">${casino.welcome_bonus}</td>
                        </tr>` : ''}
                        
                        ${casino.min_deposit ? `
                        <tr class="border-b">
                            <td class="py-3 pr-4 font-semibold text-gray-600">
                                <i class="fas fa-coins mr-2"></i>${t(lang, 'casino.minDeposit')}
                            </td>
                            <td class="py-3 text-gray-800">${casino.min_deposit}</td>
                        </tr>` : ''}
                        
                        ${casino.payment_methods ? `
                        <tr class="border-b">
                            <td class="py-3 pr-4 font-semibold text-gray-600">
                                <i class="fas fa-credit-card mr-2"></i>${t(lang, 'casino.paymentMethods')}
                            </td>
                            <td class="py-3 text-gray-800">${casino.payment_methods}</td>
                        </tr>` : ''}
                        
                        ${casino.license ? `
                        <tr class="border-b">
                            <td class="py-3 pr-4 font-semibold text-gray-600">
                                <i class="fas fa-certificate mr-2"></i>${t(lang, 'casino.license')}
                            </td>
                            <td class="py-3 text-gray-800">${casino.license}</td>
                        </tr>` : ''}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Ratings -->
        ${(casino.rating_overall > 0) ? `
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-2xl font-bold mb-4">${t(lang, 'ratings.overall')}</h2>
            <div class="space-y-3">
                ${renderRatingBar(t(lang, 'ratings.overall'), casino.rating_overall)}
                ${renderRatingBar(t(lang, 'ratings.bonus'), casino.rating_bonus)}
                ${renderRatingBar(t(lang, 'ratings.games'), casino.rating_games)}
                ${renderRatingBar(t(lang, 'ratings.payment'), casino.rating_payment)}
                ${renderRatingBar(t(lang, 'ratings.support'), casino.rating_support)}
                ${renderRatingBar(t(lang, 'ratings.mobile'), casino.rating_mobile)}
            </div>
        </div>` : ''}
        
        <!-- Pros and Cons -->
        ${(pros.length > 0 || cons.length > 0) ? `
        <div class="grid md:grid-cols-2 gap-6 mb-8">
            ${pros.length > 0 ? `
            <div class="bg-green-50 rounded-xl p-6">
                <h3 class="text-xl font-bold text-green-800 mb-4">
                    <i class="fas fa-check-circle mr-2"></i>${t(lang, 'casino.pros')}
                </h3>
                <ul class="space-y-2">
                    ${pros.map(pro => `
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-600 mt-1 mr-2"></i>
                            <span>${pro}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>` : ''}
            
            ${cons.length > 0 ? `
            <div class="bg-red-50 rounded-xl p-6">
                <h3 class="text-xl font-bold text-red-800 mb-4">
                    <i class="fas fa-times-circle mr-2"></i>${t(lang, 'casino.cons')}
                </h3>
                <ul class="space-y-2">
                    ${cons.map(con => `
                        <li class="flex items-start">
                            <i class="fas fa-times text-red-600 mt-1 mr-2"></i>
                            <span>${con}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>` : ''}
        </div>` : ''}
        
        <!-- Detailed Sections -->
        <div class="space-y-6">
            ${renderSection(t(lang, 'casino.games'), casino.games_description, 'fa-gamepad')}
            ${renderSection(t(lang, 'casino.payments'), casino.payment_description, 'fa-credit-card')}
            ${renderSection(t(lang, 'casino.support'), casino.support_description, 'fa-headset')}
            ${renderSection(t(lang, 'casino.mobile'), casino.mobile_description, 'fa-mobile-alt')}
            ${renderSection(t(lang, 'casino.security'), casino.security_description, 'fa-shield-alt')}
            ${renderSection(t(lang, 'casino.responsibleGaming'), casino.responsible_gaming_description, 'fa-user-shield')}
        </div>
        
        <!-- CTA Button -->
        <div class="text-center mt-12">
            <a href="${casino.affiliate_link || casino.website_url}" target="_blank" rel="noopener noreferrer" 
               class="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition">
                <i class="fas fa-play-circle mr-2"></i> ${t(lang, 'casino.visitSite')}
            </a>
        </div>
    </div>
  `;
  
  return renderLayout(lang, `${casino.name} - ${t(lang, 'siteName')}`, content);
}

function renderRatingBar(label: string, rating: number): string {
  return `
    <div class="flex items-center justify-between">
        <span class="font-semibold text-gray-700 w-32">${label}</span>
        <div class="flex-1 mx-4">
            <div class="h-6 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full rating-bar rounded-full" style="--rating: ${rating}%"></div>
            </div>
        </div>
        <span class="font-bold text-gray-800 w-12 text-right">${rating}%</span>
    </div>
  `;
}

function renderSection(title: string, content: string | null, icon: string): string {
  if (!content) return '';
  
  return `
    <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-bold mb-4">
            <i class="fas ${icon} mr-2 text-purple-600"></i>${title}
        </h2>
        <div class="prose max-w-none text-gray-700">
            ${content}
        </div>
    </div>
  `;
}