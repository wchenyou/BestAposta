import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderContactPage(lang: Language, settings: any): string {
  const contentField = settings ? settings[`content_${lang}`] || settings.content_en || '' : '';
  
  const content = `
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-center">${t(lang, 'contact.title')}</h1>
            
            <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                ${contentField ? `
                <div class="prose max-w-none mb-8">
                    ${contentField}
                </div>
                ` : ''}
                
                ${settings?.email ? `
                <div class="bg-purple-50 rounded-lg p-6 mb-8">
                    <div class="flex items-center">
                        <i class="fas fa-envelope text-purple-600 text-2xl mr-4"></i>
                        <div>
                            <p class="font-semibold text-gray-700">${t(lang, 'contact.email')}</p>
                            <a href="mailto:${settings.email}" class="text-purple-600 text-lg hover:underline">
                                ${settings.email}
                            </a>
                        </div>
                    </div>
                </div>
                ` : ''}
                
                <form id="contact-form" class="space-y-6">
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            ${t(lang, 'contact.email')}
                        </label>
                        <input type="email" name="email" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 font-semibold mb-2">
                            ${t(lang, 'contact.message')}
                        </label>
                        <textarea name="message" rows="6" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                    </div>
                    
                    <button type="submit" class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                        <i class="fas fa-paper-plane mr-2"></i>${t(lang, 'contact.send')}
                    </button>
                </form>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formData.get('email'),
                        message: formData.get('message')
                    })
                });
                
                if (response.ok) {
                    alert('Message sent successfully!');
                    e.target.reset();
                } else {
                    alert('Error sending message. Please try again.');
                }
            } catch (error) {
                alert('Error sending message. Please try again.');
            }
        });
    </script>
  `;
  
  return renderLayout(lang, t(lang, 'contact.title'), content);
}