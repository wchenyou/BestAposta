// Key changes for admin panel:
// 1. Blog list shows publish date and sorts by newest
// 2. Player Types can select associated casinos
// 3. Blog category management with add/delete

// Updated BlogManager component
const BlogManagerUpdated = `
    function BlogManager() {
        const [posts, setPosts] = useState([]);
        const [categories, setCategories] = useState([]);
        const [loading, setLoading] = useState(true);
        const [editingPost, setEditingPost] = useState(null);
        const [editingCategory, setEditingCategory] = useState(null);
        const [showForm, setShowForm] = useState(false);
        const [showCategoryForm, setShowCategoryForm] = useState(false);
        const [activeTab, setActiveTab] = useState('posts');
        
        useEffect(() => {
            loadData();
        }, []);
        
        async function loadData() {
            setLoading(true);
            try {
                const [postsRes, categoriesRes] = await Promise.all([
                    apiCall('/admin/blog/posts'),
                    apiCall('/admin/blog/categories')
                ]);
                
                if (postsRes.ok) {
                    const postsData = await postsRes.json();
                    // Sort posts by published_at date, newest first
                    postsData.sort((a, b) => {
                        const dateA = new Date(a.published_at || a.created_at);
                        const dateB = new Date(b.published_at || b.created_at);
                        return dateB - dateA;
                    });
                    setPosts(postsData);
                }
                if (categoriesRes.ok) {
                    setCategories(await categoriesRes.json());
                }
            } catch (err) {
                console.error('Failed to load blog data:', err);
            }
            setLoading(false);
        }
        
        async function saveCategory(category) {
            try {
                const url = category.id ? '/admin/blog/categories/' + category.id : '/admin/blog/categories';
                const method = category.id ? 'PUT' : 'POST';
                
                const res = await apiCall(url, {
                    method,
                    body: JSON.stringify(category)
                });
                
                if (res.ok) {
                    await loadData();
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                }
            } catch (err) {
                console.error('Failed to save category:', err);
            }
        }
        
        async function deleteCategory(id) {
            if (confirm('Are you sure? This will delete the category but keep the posts.')) {
                try {
                    const res = await apiCall('/admin/blog/categories/' + id, { method: 'DELETE' });
                    if (res.ok) {
                        await loadData();
                    }
                } catch (err) {
                    console.error('Failed to delete category:', err);
                }
            }
        }
        
        function formatDate(dateString) {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        
        if (loading) {
            return html\`<div class="text-center py-8">Loading...</div>\`;
        }
        
        if (showForm) {
            return html\`
                <div>
                    <button onClick=\${() => { setShowForm(false); setEditingPost(null); }}
                        class="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        <i class="fas fa-arrow-left mr-2"></i> Back
                    </button>
                    <\${BlogPostForm} 
                        post=\${editingPost}
                        categories=\${categories}
                        onSave=\${savePost}
                        onCancel=\${() => { setShowForm(false); setEditingPost(null); }}
                    />
                </div>
            \`;
        }
        
        if (showCategoryForm) {
            return html\`
                <div>
                    <button onClick=\${() => { setShowCategoryForm(false); setEditingCategory(null); }}
                        class="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        <i class="fas fa-arrow-left mr-2"></i> Back
                    </button>
                    <\${BlogCategoryForm} 
                        category=\${editingCategory}
                        onSave=\${saveCategory}
                        onCancel=\${() => { setShowCategoryForm(false); setEditingCategory(null); }}
                    />
                </div>
            \`;
        }
        
        return html\`
            <div>
                <div class="mb-4 flex space-x-4">
                    <button onClick=\${() => setActiveTab('posts')}
                        class="px-4 py-2 rounded \${activeTab === 'posts' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}">
                        <i class="fas fa-newspaper mr-2"></i> Posts
                    </button>
                    <button onClick=\${() => setActiveTab('categories')}
                        class="px-4 py-2 rounded \${activeTab === 'categories' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}">
                        <i class="fas fa-folder mr-2"></i> Categories
                    </button>
                </div>
                
                \${activeTab === 'posts' ? html\`
                    <div>
                        <button onClick=\${() => setShowForm(true)}
                            class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            <i class="fas fa-plus mr-2"></i> Add Post
                        </button>
                        
                        <div class="bg-white rounded-lg shadow overflow-hidden">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publish Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    \${posts.map(post => html\`
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                \${formatDate(post.published_at)}
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="text-sm">
                                                    <div class="font-medium text-gray-900">\${post.title_en}</div>
                                                    <div class="text-gray-500">\${post.slug}</div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                \${categories.find(c => c.id === post.category_id)?.name_en || '-'}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${post.author || '-'}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    \${post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                                                    \${post.is_published ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick=\${() => { setEditingPost(post); setShowForm(true); }}
                                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onClick=\${() => deletePost(post.id)}
                                                    class="text-red-600 hover:text-red-900">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    \`)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                \` : html\`
                    <div>
                        <button onClick=\${() => setShowCategoryForm(true)}
                            class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            <i class="fas fa-plus mr-2"></i> Add Category
                        </button>
                        
                        <div class="bg-white rounded-lg shadow overflow-hidden">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visibility</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posts Count</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    \${categories.map(category => html\`
                                        <tr>
                                            <td class="px-6 py-4">
                                                <div class="text-sm">
                                                    <div class="font-medium text-gray-900">\${category.name_en}</div>
                                                    <div class="text-gray-500">\${category.name_pt}</div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${category.slug}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    \${category.is_visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                                    \${category.is_visible ? 'Visible' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                \${posts.filter(p => p.category_id === category.id).length} posts
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick=\${() => { setEditingCategory(category); setShowCategoryForm(true); }}
                                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onClick=\${() => deleteCategory(category.id)}
                                                    class="text-red-600 hover:text-red-900">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    \`)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                \`}
            </div>
        \`;
    }
`;

// Blog Category Form
const BlogCategoryForm = `
    function BlogCategoryForm({ category, onSave, onCancel }) {
        const [formData, setFormData] = useState(category || {
            slug: '',
            name_en: '',
            name_pt: '',
            name_zh: '',
            description_en: '',
            description_pt: '',
            description_zh: '',
            is_visible: true,
            sort_order: 0
        });
        
        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(formData);
        };
        
        return html\`
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-bold mb-4">\${category ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit=\${handleSubmit}>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                <input type="text" class="w-full px-3 py-2 border rounded" required
                                    placeholder="sports-betting"
                                    value=\${formData.slug}
                                    onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                <input type="number" class="w-full px-3 py-2 border rounded"
                                    value=\${formData.sort_order}
                                    onChange=\${e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                                <input type="text" class="w-full px-3 py-2 border rounded" required
                                    value=\${formData.name_en}
                                    onChange=\${e => setFormData({...formData, name_en: e.target.value})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Name (Portuguese) *</label>
                                <input type="text" class="w-full px-3 py-2 border rounded" required
                                    value=\${formData.name_pt}
                                    onChange=\${e => setFormData({...formData, name_pt: e.target.value})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Name (Chinese)</label>
                                <input type="text" class="w-full px-3 py-2 border rounded"
                                    value=\${formData.name_zh}
                                    onChange=\${e => setFormData({...formData, name_zh: e.target.value})} />
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                                <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                    value=\${formData.description_en}
                                    onChange=\${e => setFormData({...formData, description_en: e.target.value})}></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Portuguese)</label>
                                <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                    value=\${formData.description_pt}
                                    onChange=\${e => setFormData({...formData, description_pt: e.target.value})}></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Chinese)</label>
                                <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                    value=\${formData.description_zh}
                                    onChange=\${e => setFormData({...formData, description_zh: e.target.value})}></textarea>
                            </div>
                        </div>
                        
                        <div class="flex items-center">
                            <input type="checkbox" id="category_visible" class="mr-2"
                                checked=\${formData.is_visible}
                                onChange=\${e => setFormData({...formData, is_visible: e.target.checked})} />
                            <label for="category_visible" class="text-sm font-medium text-gray-700">
                                Visible on frontend
                            </label>
                        </div>
                        
                        <div class="flex justify-end gap-3 mt-6">
                            <button type="button" onClick=\${onCancel}
                                class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                            <button type="submit"
                                class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                <i class="fas fa-save mr-2"></i>
                                \${category ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        \`;
    }
`;