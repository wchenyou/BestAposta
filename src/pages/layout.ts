import { Language, t } from '../utils/language';

export function renderLayout(lang: Language, title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - ${t(lang, 'siteName')}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .casino-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .casino-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          .rating-bar {
            background: linear-gradient(90deg, #10b981 0%, #10b981 var(--rating), #e5e7eb var(--rating));
          }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800">
        <!-- Navigation -->
        <nav class="bg-white shadow-md sticky top-0 z-50">
            <div class="container mx-auto px-4">
                <div class="flex justify-between items-center py-4">
                    <a href="/" class="text-lg md:text-2xl font-bold text-purple-600">
                        <i class="fas fa-dice mr-1 md:mr-2"></i>
                        <!-- Show abbreviated name on mobile -->
                        <span class="md:hidden">YBC</span>
                        <!-- Show full name on desktop -->
                        <span class="hidden md:inline">${t(lang, 'siteName')}</span>
                    </a>
                    
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-home mr-1"></i> ${t(lang, 'nav.home')}
                        </a>
                        <a href="/casinos" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-dice mr-1"></i> ${t(lang, 'nav.casinos')}
                        </a>
                        <a href="/blog" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-blog mr-1"></i> ${t(lang, 'nav.blog')}
                        </a>
                        <a href="/contact" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-envelope mr-1"></i> ${t(lang, 'nav.contact')}
                        </a>
                    </div>
                    
                    <!-- Language Switcher Dropdown -->
                    <div class="relative">
                        <!-- Desktop: Show flag + text -->
                        <select onchange="window.location.href='/set-language/' + this.value; return false;" 
                                class="hidden md:block bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none">
                            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                            <option value="pt" ${lang === 'pt' ? 'selected' : ''}>🇧🇷 Português</option>
                            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇨🇳 简体中文</option>
                        </select>
                        
                        <!-- Mobile: Show only flags -->
                        <select onchange="window.location.href='/set-language/' + this.value; return false;" 
                                class="md:hidden bg-white border border-gray-300 rounded-lg px-2 py-2 pr-6 text-gray-700 hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer appearance-none text-lg">
                            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇬🇧</option>
                            <option value="pt" ${lang === 'pt' ? 'selected' : ''}>🇧🇷</option>
                            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇨🇳</option>
                        </select>
                        
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 md:px-2 text-gray-700">
                            <i class="fas fa-chevron-down text-xs md:text-sm"></i>
                        </div>
                    </div>
                    
                    <!-- Mobile menu button -->
                    <button class="md:hidden text-gray-600" onclick="toggleMobileMenu()">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
                
                <!-- Mobile menu -->
                <div id="mobile-menu" class="hidden md:hidden pb-4">
                    <a href="/" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-home mr-2"></i> ${t(lang, 'nav.home')}
                    </a>
                    <a href="/casinos" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-dice mr-2"></i> ${t(lang, 'nav.casinos')}
                    </a>
                    <a href="/blog" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-blog mr-2"></i> ${t(lang, 'nav.blog')}
                    </a>
                    <a href="/contact" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-envelope mr-2"></i> ${t(lang, 'nav.contact')}
                    </a>
                </div>
            </div>
        </nav>
        
        <!-- Main Content -->
        <main class="min-h-screen">
            ${content}
        </main>
        
        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8 mt-12">
            <div class="container mx-auto px-4">
                <!-- Responsible Gaming Warning -->
                <div class="bg-yellow-900 bg-opacity-50 border-2 border-yellow-600 rounded-lg p-6 mb-6">
                    <div class="flex items-start">
                        <div class="text-yellow-400 mr-3 text-2xl">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-yellow-400 font-bold text-lg mb-2">
                                ${lang === 'zh' ? '重要提醒' : lang === 'pt' ? 'Aviso Importante' : 'Important Notice'}
                            </h3>
                            <p class="text-sm text-gray-200 leading-relaxed">
                                ${lang === 'zh' ? 
                                  '請理性娛樂，適度參與，未滿18歲請勿賭博。本網站僅提供資訊比較服務，不涉及任何實際博彩活動。請確保您了解當地法律法規，並只在合法的司法管轄區內參與相關活動。博彩可能會上癮，請根據自身經濟能力謹慎參與，如需協助，請聯繫相關專業機構。' :
                                  lang === 'pt' ?
                                  'Jogue com responsabilidade e moderação. Menores de 18 anos não devem apostar. Este site oferece apenas serviços de comparação de informações e não está envolvido em nenhuma atividade real de jogos de azar. Certifique-se de compreender as leis e regulamentos locais e participe apenas em jurisdições legais. O jogo pode ser viciante, participe com cautela de acordo com sua capacidade financeira. Se precisar de ajuda, entre em contato com instituições profissionais relevantes.' :
                                  'Please gamble responsibly and in moderation. Minors under 18 should not gamble. This website only provides information comparison services and is not involved in any actual gambling activities. Please ensure you understand local laws and regulations and only participate in legal jurisdictions. Gambling can be addictive, please participate cautiously according to your financial capacity. If you need help, please contact relevant professional institutions.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Copyright and Basic Info -->
                <div class="text-center">
                    <p class="mb-2">© 2025 ${t(lang, 'siteName')}. ${lang === 'zh' ? '版權所有' : lang === 'pt' ? 'Todos os direitos reservados' : 'All rights reserved'}.</p>
                </div>
            </div>
        </footer>
        
        <script>
            function toggleMobileMenu() {
                const menu = document.getElementById('mobile-menu');
                menu.classList.toggle('hidden');
            }
        </script>
    </body>
    </html>
  `;
}