import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderBlogPage(lang: Language, categories: any[], posts: any[], singlePost?: any, currentCategory?: string): string {
  if (singlePost) {
    return renderSinglePost(lang, singlePost);
  }
  
  const content = `
    <!-- Mobile Sticky Categories Header -->
    <div class="lg:hidden sticky top-[64px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div class="container mx-auto px-4 py-3">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-sm font-bold text-gray-700">
                    <i class="fas fa-folder mr-1 text-purple-600"></i>${t(lang, 'blog.categories')}
                </h3>
                <div class="text-xs text-gray-500">
                    <i class="fas fa-chevron-left mr-1"></i>
                    ${lang === 'pt' ? 'Deslize' : lang === 'zh' ? '滑動' : 'Swipe'}
                    <i class="fas fa-chevron-right ml-1"></i>
                </div>
            </div>
            <div class="flex overflow-x-auto gap-2 pb-1 scrollbar-hide" style="-webkit-overflow-scrolling: touch;">
                <a href="/blog" class="flex-shrink-0 px-3 py-1.5 ${!currentCategory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 border border-gray-300'} rounded-full text-sm font-medium transition-colors duration-200">
                    ${lang === 'pt' ? 'Todos' : lang === 'zh' ? '全部' : 'All'}
                </a>
                ${categories.filter(cat => cat.is_visible !== false).map(cat => {
                  const name = cat[`name_${lang}`] || cat.name_en;
                  const isActive = currentCategory === cat.slug;
                  return `
                    <a href="/blog?category=${cat.slug}" class="flex-shrink-0 px-3 py-1.5 ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 border border-gray-300'} rounded-full text-sm font-medium transition-colors duration-200">
                        ${name}
                    </a>
                  `;
                }).join('')}
            </div>
        </div>
    </div>
    
    <div class="container mx-auto px-4 py-8">
        <!-- Add padding-top on mobile to account for sticky category bar -->
        <h1 class="text-3xl font-bold mb-8 lg:mt-0">${t(lang, 'nav.blog')}</h1>
        
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
                        <article class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition flex flex-col md:flex-row">
                            ${post.featured_image ? `
                            <div class="md:w-1/3">
                                <div class="relative pb-[75%] md:pb-0 md:h-full">
                                    <img src="${post.featured_image}" 
                                         alt="${title}" 
                                         class="absolute inset-0 w-full h-full object-cover md:relative"
                                         onerror="this.style.display='none'; this.parentElement.style.display='none';">
                                </div>
                            </div>
                            ` : ''}
                            <div class="p-6 ${post.featured_image ? 'md:w-2/3' : 'w-full'}">
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
            <!-- Back button at top left -->
            <div class="mb-4">
                <a href="/blog" class="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
                    <i class="fas fa-arrow-left mr-2"></i> ${lang === 'zh' ? '返回文章列表' : lang === 'pt' ? 'Voltar aos Artigos' : 'Back to Articles'}
                </a>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                ${post.featured_image ? `
                <!-- Featured image with better aspect ratio -->
                <div class="relative w-full bg-gray-100">
                    <!-- 16:9 aspect ratio on mobile, 2:1 on desktop for better viewing -->
                    <div class="relative pb-[56.25%] md:pb-[50%] lg:pb-[45%]">
                        <img src="${post.featured_image}" 
                             alt="${title}" 
                             class="absolute inset-0 w-full h-full object-cover"
                             loading="lazy"
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'absolute inset-0 flex items-center justify-center bg-gray-200\\'><i class=\\'fas fa-image-slash text-gray-400 text-4xl\\'></i></div>';">
                        <!-- Gradient overlay for better text readability if needed -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                </div>
                ` : ''}
                
                <div class="p-8">
                    <div class="flex items-center text-sm text-gray-600 mb-4">
                        <span class="bg-purple-100 text-purple-600 px-2 py-1 rounded mr-2">
                            ${post.category_name}
                        </span>
                        <span><i class="far fa-calendar mr-1"></i>${new Date(post.published_at).toLocaleDateString(lang)}</span>
                    </div>
                    
                    <h1 class="text-3xl font-bold mb-6">${title}</h1>
                    
                    <div class="prose max-w-none">
                        ${content_field}
                    </div>
                </div>
            </div>
        </div>
    </article>
  `;
  
  return renderLayout(lang, `${title} - ${t(lang, 'siteName')}`, content);
}