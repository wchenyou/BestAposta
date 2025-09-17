import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderBlogPage(lang: Language, categories: any[], posts: any[], singlePost?: any, currentCategory?: string): string {
  if (singlePost) {
    return renderSinglePost(lang, singlePost);
  }
  
  const content = `
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">${t(lang, 'nav.blog')}</h1>
        
        <!-- Mobile Categories (Top) -->
        <div class="lg:hidden mb-6">
            <div class="bg-white rounded-xl shadow-lg p-4">
                <h3 class="text-lg font-bold mb-3">
                    <i class="fas fa-folder mr-2 text-purple-600"></i>${t(lang, 'blog.categories')}
                </h3>
                <div class="flex flex-wrap gap-2">
                    <a href="/blog" class="px-3 py-1 ${!currentCategory ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-full text-sm hover:bg-purple-700 hover:text-white transition">
                        ${lang === 'pt' ? 'Todos' : lang === 'zh' ? '全部' : 'All'}
                    </a>
                    ${categories.filter(cat => cat.is_visible !== false).map(cat => {
                      const name = cat[`name_${lang}`] || cat.name_en;
                      const isActive = currentCategory === cat.slug;
                      return `
                        <a href="/blog?category=${cat.slug}" class="px-3 py-1 ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'} rounded-full text-sm hover:bg-purple-700 hover:text-white transition">
                            ${name}
                        </a>
                      `;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <div class="grid lg:grid-cols-4 gap-8">
            <!-- Desktop Categories Sidebar (Left) -->
            <aside class="hidden lg:block">
                <div class="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                    <h3 class="text-xl font-bold mb-4">
                        <i class="fas fa-folder mr-2 text-purple-600"></i>${t(lang, 'blog.categories')}
                    </h3>
                    <ul class="space-y-2">
                        <li>
                            <a href="/blog" class="flex justify-between items-center p-2 ${!currentCategory ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50'} rounded transition">
                                <span>${lang === 'pt' ? 'Todos os Artigos' : lang === 'zh' ? '全部文章' : 'All Articles'}</span>
                                <i class="fas fa-chevron-right text-gray-400"></i>
                            </a>
                        </li>
                        ${categories.filter(cat => cat.is_visible !== false).map(cat => {
                          const name = cat[`name_${lang}`] || cat.name_en;
                          const isActive = currentCategory === cat.slug;
                          return `
                            <li>
                                <a href="/blog?category=${cat.slug}" class="flex justify-between items-center p-2 ${isActive ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50'} rounded transition">
                                    <span>${name}</span>
                                    <i class="fas fa-chevron-right text-gray-400"></i>
                                </a>
                            </li>
                          `;
                        }).join('')}
                    </ul>
                </div>
            </aside>
            
            <!-- Posts List -->
            <div class="lg:col-span-3">
                <div class="space-y-6">
                    ${posts.length > 0 ? posts.map(post => {
                      const title = post[`title_${lang}`] || post.title_en;
                      const excerpt = post[`excerpt_${lang}`] || post.excerpt_en || '';
                      
                      return `
                        <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                            ${post.featured_image ? `
                            <img src="${post.featured_image}" alt="${title}" class="w-full h-48 object-cover">
                            ` : ''}
                            <div class="p-6">
                                <div class="flex items-center text-sm text-gray-600 mb-2">
                                    <span class="bg-purple-100 text-purple-600 px-2 py-1 rounded mr-2">
                                        ${post.category_name}
                                    </span>
                                    <span><i class="far fa-calendar mr-1"></i>${new Date(post.published_at).toLocaleDateString(lang)}</span>
                                    <span class="ml-4"><i class="far fa-eye mr-1"></i>${post.views} ${t(lang, 'blog.views')}</span>
                                </div>
                                <h2 class="text-xl font-bold mb-2">
                                    <a href="/blog/${post.slug}" class="hover:text-purple-600 transition">
                                        ${title}
                                    </a>
                                </h2>
                                <p class="text-gray-600 mb-4">${excerpt}</p>
                                <a href="/blog/${post.slug}" class="text-purple-600 font-semibold hover:text-purple-700 transition">
                                    ${t(lang, 'blog.readMore')} <i class="fas fa-arrow-right ml-1"></i>
                                </a>
                            </div>
                        </article>
                      `;
                    }).join('') : `
                        <div class="bg-white rounded-xl shadow-lg p-8 text-center">
                            <i class="fas fa-newspaper text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">No posts available yet.</p>
                        </div>
                    `}
                </div>
            </div>
        </div>
    </div>
  `;
  
  return renderLayout(lang, t(lang, 'nav.blog'), content);
}

function renderSinglePost(lang: Language, post: any): string {
  const title = post[`title_${lang}`] || post.title_en;
  const content_field = post[`content_${lang}`] || post.content_en || '';
  
  const content = `
    <article class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                ${post.featured_image ? `
                <img src="${post.featured_image}" alt="${title}" class="w-full h-64 object-cover">
                ` : ''}
                
                <div class="p-8">
                    <div class="flex items-center text-sm text-gray-600 mb-4">
                        <span class="bg-purple-100 text-purple-600 px-2 py-1 rounded mr-2">
                            ${post.category_name}
                        </span>
                        <span><i class="far fa-calendar mr-1"></i>${new Date(post.published_at).toLocaleDateString(lang)}</span>
                        ${post.author ? `<span class="ml-4"><i class="far fa-user mr-1"></i>${post.author}</span>` : ''}
                        <span class="ml-4"><i class="far fa-eye mr-1"></i>${post.views} ${t(lang, 'blog.views')}</span>
                    </div>
                    
                    <h1 class="text-3xl font-bold mb-6">${title}</h1>
                    
                    <div class="prose max-w-none">
                        ${content_field}
                    </div>
                </div>
            </div>
            
            <div class="mt-8 text-center">
                <a href="/blog" class="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                    <i class="fas fa-arrow-left mr-2"></i> Back to Blog
                </a>
            </div>
        </div>
    </article>
  `;
  
  return renderLayout(lang, `${title} - ${t(lang, 'siteName')}`, content);
}