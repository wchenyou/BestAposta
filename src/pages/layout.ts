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
                    <a href="/" class="text-2xl font-bold text-purple-600">
                        <i class="fas fa-dice mr-2"></i>${t(lang, 'siteName')}
                    </a>
                    
                    <div class="hidden md:flex space-x-6">
                        <a href="/" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-home mr-1"></i> ${t(lang, 'nav.home')}
                        </a>
                        <a href="/blog" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-blog mr-1"></i> ${t(lang, 'nav.blog')}
                        </a>
                        <a href="/contact" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-envelope mr-1"></i> ${t(lang, 'nav.contact')}
                        </a>
                        <a href="/admin" class="text-gray-600 hover:text-purple-600 transition">
                            <i class="fas fa-lock mr-1"></i> ${t(lang, 'nav.admin')}
                        </a>
                    </div>
                    
                    <!-- Language Switcher -->
                    <div class="flex items-center space-x-2">
                        <a href="/set-language/en" class="px-2 py-1 rounded ${lang === 'en' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">EN</a>
                        <a href="/set-language/pt" class="px-2 py-1 rounded ${lang === 'pt' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">PT</a>
                        <a href="/set-language/zh" class="px-2 py-1 rounded ${lang === 'zh' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">中文</a>
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
                    <a href="/blog" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-blog mr-2"></i> ${t(lang, 'nav.blog')}
                    </a>
                    <a href="/contact" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-envelope mr-2"></i> ${t(lang, 'nav.contact')}
                    </a>
                    <a href="/admin" class="block py-2 text-gray-600 hover:text-purple-600">
                        <i class="fas fa-lock mr-2"></i> ${t(lang, 'nav.admin')}
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
                <div class="text-center">
                    <p class="mb-2">${t(lang, 'footer.copyright')}</p>
                    <p class="text-sm text-gray-400">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        ${t(lang, 'footer.disclaimer')}
                    </p>
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