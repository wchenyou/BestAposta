export function renderFullAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Your Best Casino</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-900">
    <div id="root">
        <div class="min-h-screen flex items-center justify-center">
            <div class="text-white text-xl">Loading admin panel...</div>
        </div>
    </div>
    
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        function AdminApp() {
            const [isLoggedIn, setIsLoggedIn] = useState(false);
            const [loading, setLoading] = useState(true);
            const [activeSection, setActiveSection] = useState('casinos');
            const [casinos, setCasinos] = useState([]);
            const [playerTypes, setPlayerTypes] = useState([]);
            const [blogCategories, setBlogCategories] = useState([]);
            const [blogPosts, setBlogPosts] = useState([]);
            const [contactSubmissions, setContactSubmissions] = useState([]);
            const [showForm, setShowForm] = useState(false);
            const [editingItem, setEditingItem] = useState(null);
            
            useEffect(() => {
                checkAuth();
            }, []);
            
            useEffect(() => {
                if (isLoggedIn) {
                    loadDataForSection();
                }
            }, [isLoggedIn, activeSection]);
            
            async function checkAuth() {
                try {
                    const response = await fetch('/api/admin/auth');
                    setIsLoggedIn(response.ok);
                } catch (err) {
                    console.error('Auth check failed:', err);
                    setIsLoggedIn(false);
                } finally {
                    setLoading(false);
                }
            }
            
            async function handleLogin(e) {
                e.preventDefault();
                const formData = new FormData(e.target);
                
                try {
                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: formData.get('email'),
                            password: formData.get('password')
                        })
                    });
                    
                    if (response.ok) {
                        setIsLoggedIn(true);
                        loadDataForSection();
                    } else {
                        alert('Invalid credentials');
                    }
                } catch (err) {
                    alert('Login failed: ' + err.message);
                }
            }
            
            async function handleLogout() {
                await fetch('/api/admin/logout', { method: 'POST' });
                setIsLoggedIn(false);
                setCasinos([]);
                setPlayerTypes([]);
                setBlogCategories([]);
                setBlogPosts([]);
                setContactSubmissions([]);
            }
            
            async function loadDataForSection() {
                switch(activeSection) {
                    case 'casinos':
                        loadCasinos();
                        break;
                    case 'player-types':
                        loadPlayerTypes();
                        break;
                    case 'blog-categories':
                        loadBlogCategories();
                        break;
                    case 'blog-posts':
                        loadBlogPosts();
                        break;
                    case 'contact':
                        loadContactSubmissions();
                        break;
                }
            }
            
            async function loadCasinos() {
                try {
                    const response = await fetch('/api/admin/casinos');
                    if (response.ok) {
                        const data = await response.json();
                        setCasinos(data || []);
                    }
                } catch (err) {
                    console.error('Failed to load casinos:', err);
                }
            }
            
            async function loadPlayerTypes() {
                try {
                    const response = await fetch('/api/admin/player-types');
                    if (response.ok) {
                        const data = await response.json();
                        setPlayerTypes(data || []);
                    }
                } catch (err) {
                    console.error('Failed to load player types:', err);
                }
            }
            
            async function loadBlogCategories() {
                try {
                    const response = await fetch('/api/admin/blog/categories');
                    if (response.ok) {
                        const data = await response.json();
                        setBlogCategories(data || []);
                    }
                } catch (err) {
                    console.error('Failed to load blog categories:', err);
                }
            }
            
            async function loadBlogPosts() {
                try {
                    const response = await fetch('/api/admin/blog/posts');
                    if (response.ok) {
                        const data = await response.json();
                        setBlogPosts(data || []);
                    }
                } catch (err) {
                    console.error('Failed to load blog posts:', err);
                }
            }
            
            async function loadContactSubmissions() {
                try {
                    const response = await fetch('/api/admin/contact-submissions');
                    if (response.ok) {
                        const data = await response.json();
                        setContactSubmissions(data || []);
                    }
                } catch (err) {
                    console.error('Failed to load contact submissions:', err);
                }
            }
            
            async function handleDeleteCasino(id) {
                if (!confirm('Are you sure you want to delete this casino?')) return;
                
                try {
                    const response = await fetch(\`/api/admin/casino/\${id}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadCasinos();
                    } else {
                        alert('Failed to delete casino');
                    }
                } catch (err) {
                    alert('Error deleting casino');
                }
            }
            
            async function handleDeletePlayerType(id) {
                if (!confirm('Are you sure you want to delete this player type?')) return;
                
                try {
                    const response = await fetch(\`/api/admin/player-types/\${id}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadPlayerTypes();
                    } else {
                        alert('Failed to delete player type');
                    }
                } catch (err) {
                    alert('Error deleting player type');
                }
            }
            
            async function handleDeleteBlogCategory(id) {
                if (!confirm('Are you sure you want to delete this category?')) return;
                
                try {
                    const response = await fetch(\`/api/admin/blog/categories/\${id}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadBlogCategories();
                    } else {
                        alert('Failed to delete category');
                    }
                } catch (err) {
                    alert('Error deleting category');
                }
            }
            
            async function handleDeleteBlogPost(id) {
                if (!confirm('Are you sure you want to delete this post?')) return;
                
                try {
                    const response = await fetch(\`/api/admin/blog/posts/\${id}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        loadBlogPosts();
                    } else {
                        alert('Failed to delete post');
                    }
                } catch (err) {
                    alert('Error deleting post');
                }
            }
            
            if (loading) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-900">
                        <div className="text-white text-xl">Loading...</div>
                    </div>
                );
            }
            
            if (!isLoggedIn) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-900">
                        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Email</label>
                                    <input type="email" name="email" required
                                        defaultValue="wchenyou@gmail.com"
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Password</label>
                                    <input type="password" name="password" required
                                        className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        placeholder="Enter your password" />
                                </div>
                                <button type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                );
            }
            
            return (
                <div className="min-h-screen bg-gray-900">
                    <nav className="bg-gray-800 shadow-lg">
                        <div className="container mx-auto px-4">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center space-x-4">
                                    <h1 className="text-xl font-bold text-white">
                                        <i className="fas fa-crown mr-2"></i>Admin Panel
                                    </h1>
                                    <div className="hidden md:flex space-x-2">
                                        <button 
                                            onClick={() => setActiveSection('casinos')}
                                            className={\`px-3 py-2 rounded transition-colors \${
                                                activeSection === 'casinos' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }\`}>
                                            <i className="fas fa-dice mr-2"></i>Casinos
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('player-types')}
                                            className={\`px-3 py-2 rounded transition-colors \${
                                                activeSection === 'player-types' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }\`}>
                                            <i className="fas fa-users mr-2"></i>Player Types
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('blog-categories')}
                                            className={\`px-3 py-2 rounded transition-colors \${
                                                activeSection === 'blog-categories' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }\`}>
                                            <i className="fas fa-folder mr-2"></i>Blog Categories
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('blog-posts')}
                                            className={\`px-3 py-2 rounded transition-colors \${
                                                activeSection === 'blog-posts' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }\`}>
                                            <i className="fas fa-newspaper mr-2"></i>Blog Posts
                                        </button>
                                        <button 
                                            onClick={() => setActiveSection('contact')}
                                            className={\`px-3 py-2 rounded transition-colors \${
                                                activeSection === 'contact' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                            }\`}>
                                            <i className="fas fa-envelope mr-2"></i>Contact
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Mobile menu button */}
                                <div className="md:hidden">
                                    <select 
                                        value={activeSection}
                                        onChange={(e) => setActiveSection(e.target.value)}
                                        className="bg-gray-700 text-white px-3 py-1 rounded mr-4">
                                        <option value="casinos">Casinos</option>
                                        <option value="player-types">Player Types</option>
                                        <option value="blog-categories">Blog Categories</option>
                                        <option value="blog-posts">Blog Posts</option>
                                        <option value="contact">Contact</option>
                                    </select>
                                </div>
                                
                                <button onClick={handleLogout}
                                    className="text-gray-300 hover:text-white px-4 py-2">
                                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                    
                    <div className="container mx-auto px-4 py-8">
                        {/* Casinos Section */}
                        {activeSection === 'casinos' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        <i className="fas fa-dice mr-2"></i>Manage Casinos
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setEditingItem(null);
                                            setShowForm(true);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                        <i className="fas fa-plus mr-2"></i>Add Casino
                                    </button>
                                </div>
                                
                                {showForm ? (
                                    <CasinoForm 
                                        casino={editingItem}
                                        onSave={() => {
                                            setShowForm(false);
                                            loadCasinos();
                                        }}
                                        onCancel={() => setShowForm(false)}
                                    />
                                ) : (
                                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                                        {casinos.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400">
                                                <i className="fas fa-inbox fa-4x mb-4"></i>
                                                <p className="text-lg">No casinos found</p>
                                            </div>
                                        ) : (
                                            <table className="w-full">
                                                <thead className="bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Rating</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700">
                                                    {casinos.map(casino => (
                                                        <tr key={casino.id}>
                                                            <td className="px-6 py-4 text-sm text-white">{casino.name}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-300">{casino.rating}/5</td>
                                                            <td className="px-6 py-4">
                                                                <span className={\`px-2 py-1 text-xs rounded-full \${
                                                                    casino.is_active 
                                                                        ? 'bg-green-900 text-green-400' 
                                                                        : 'bg-red-900 text-red-400'
                                                                }\`}>
                                                                    {casino.is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <button 
                                                                    onClick={() => {
                                                                        fetch(\`/api/admin/casino/\${casino.id}/full\`)
                                                                            .then(res => res.json())
                                                                            .then(data => {
                                                                                setEditingItem(data);
                                                                                setShowForm(true);
                                                                            });
                                                                    }}
                                                                    className="text-blue-400 hover:text-blue-300 mr-3">
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteCasino(casino.id)}
                                                                    className="text-red-400 hover:text-red-300">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Player Types Section */}
                        {activeSection === 'player-types' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        <i className="fas fa-users mr-2"></i>Manage Player Types
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setEditingItem(null);
                                            setShowForm(true);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                        <i className="fas fa-plus mr-2"></i>Add Player Type
                                    </button>
                                </div>
                                
                                {showForm ? (
                                    <PlayerTypeForm 
                                        playerType={editingItem}
                                        onSave={() => {
                                            setShowForm(false);
                                            loadPlayerTypes();
                                        }}
                                        onCancel={() => setShowForm(false)}
                                    />
                                ) : (
                                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                                        {playerTypes.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400">
                                                <i className="fas fa-inbox fa-4x mb-4"></i>
                                                <p className="text-lg">No player types found</p>
                                            </div>
                                        ) : (
                                            <table className="w-full">
                                                <thead className="bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Icon</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name (EN)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name (PT)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700">
                                                    {playerTypes.map(type => (
                                                        <tr key={type.id}>
                                                            <td className="px-6 py-4 text-2xl">
                                                                <i className={\`fas fa-\${type.icon}\`}></i>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-white">{type.name_en}</td>
                                                            <td className="px-6 py-4 text-sm text-white">{type.name_pt}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-300">{type.sort_order}</td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingItem(type);
                                                                        setShowForm(true);
                                                                    }}
                                                                    className="text-blue-400 hover:text-blue-300 mr-3">
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeletePlayerType(type.id)}
                                                                    className="text-red-400 hover:text-red-300">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Blog Categories Section */}
                        {activeSection === 'blog-categories' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        <i className="fas fa-folder mr-2"></i>Manage Blog Categories
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setEditingItem(null);
                                            setShowForm(true);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                        <i className="fas fa-plus mr-2"></i>Add Category
                                    </button>
                                </div>
                                
                                {showForm ? (
                                    <BlogCategoryForm 
                                        category={editingItem}
                                        onSave={() => {
                                            setShowForm(false);
                                            loadBlogCategories();
                                        }}
                                        onCancel={() => setShowForm(false)}
                                    />
                                ) : (
                                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                                        {blogCategories.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400">
                                                <i className="fas fa-inbox fa-4x mb-4"></i>
                                                <p className="text-lg">No categories found</p>
                                            </div>
                                        ) : (
                                            <table className="w-full">
                                                <thead className="bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name (EN)</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Slug</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Visible</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700">
                                                    {blogCategories.map(category => (
                                                        <tr key={category.id}>
                                                            <td className="px-6 py-4 text-sm text-white">{category.name_en}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-300">{category.slug}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={\`px-2 py-1 text-xs rounded-full \${
                                                                    category.is_visible 
                                                                        ? 'bg-green-900 text-green-400' 
                                                                        : 'bg-red-900 text-red-400'
                                                                }\`}>
                                                                    {category.is_visible ? 'Yes' : 'No'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingItem(category);
                                                                        setShowForm(true);
                                                                    }}
                                                                    className="text-blue-400 hover:text-blue-300 mr-3">
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteBlogCategory(category.id)}
                                                                    className="text-red-400 hover:text-red-300">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Blog Posts Section */}
                        {activeSection === 'blog-posts' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        <i className="fas fa-newspaper mr-2"></i>Manage Blog Posts
                                    </h2>
                                    <button 
                                        onClick={() => {
                                            setEditingItem(null);
                                            setShowForm(true);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                        <i className="fas fa-plus mr-2"></i>Add Post
                                    </button>
                                </div>
                                
                                {showForm ? (
                                    <BlogPostForm 
                                        post={editingItem}
                                        categories={blogCategories}
                                        onSave={() => {
                                            setShowForm(false);
                                            loadBlogPosts();
                                        }}
                                        onCancel={() => setShowForm(false)}
                                    />
                                ) : (
                                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                                        {blogPosts.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400">
                                                <i className="fas fa-inbox fa-4x mb-4"></i>
                                                <p className="text-lg">No posts found</p>
                                            </div>
                                        ) : (
                                            <table className="w-full">
                                                <thead className="bg-gray-700">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Title</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Author</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Published</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Views</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-700">
                                                    {blogPosts.map(post => (
                                                        <tr key={post.id}>
                                                            <td className="px-6 py-4 text-sm text-white">{post.title_en || post.title_pt}</td>
                                                            <td className="px-6 py-4 text-sm text-gray-300">{post.author || 'Admin'}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={\`px-2 py-1 text-xs rounded-full \${
                                                                    post.is_published 
                                                                        ? 'bg-green-900 text-green-400' 
                                                                        : 'bg-yellow-900 text-yellow-400'
                                                                }\`}>
                                                                    {post.is_published ? 'Published' : 'Draft'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-300">{post.view_count || 0}</td>
                                                            <td className="px-6 py-4 text-sm">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingItem(post);
                                                                        setShowForm(true);
                                                                    }}
                                                                    className="text-blue-400 hover:text-blue-300 mr-3">
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteBlogPost(post.id)}
                                                                    className="text-red-400 hover:text-red-300">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Contact Submissions Section */}
                        {activeSection === 'contact' && (
                            <div>
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        <i className="fas fa-envelope mr-2"></i>Contact Submissions
                                    </h2>
                                </div>
                                
                                <div className="bg-gray-800 rounded-lg overflow-hidden">
                                    {contactSubmissions.length === 0 ? (
                                        <div className="p-8 text-center text-gray-400">
                                            <i className="fas fa-inbox fa-4x mb-4"></i>
                                            <p className="text-lg">No contact submissions yet</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-700">
                                            {contactSubmissions.map(submission => (
                                                <div key={submission.id} className="p-6 hover:bg-gray-750">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="text-white font-semibold">{submission.email}</p>
                                                            <p className="text-sm text-gray-400">
                                                                {new Date(submission.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <span className={\`px-2 py-1 text-xs rounded-full \${
                                                            submission.is_read 
                                                                ? 'bg-gray-700 text-gray-400' 
                                                                : 'bg-blue-900 text-blue-400'
                                                        }\`}>
                                                            {submission.is_read ? 'Read' : 'New'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 mt-2">{submission.message}</p>
                                                    <div className="mt-3 text-xs text-gray-500">
                                                        IP: {submission.ip_address} | Browser: {submission.user_agent?.slice(0, 50)}...
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        
        // Casino Form Component (simplified version - you already have this)
        function CasinoForm({ casino, onSave, onCancel }) {
            const [formData, setFormData] = useState(casino || {
                name: '',
                logo_url: '',
                website_url: '',
                rating: 4.5,
                is_active: true
            });
            
            async function handleSubmit(e) {
                e.preventDefault();
                const url = casino ? \`/api/admin/casino/\${casino.id}\` : '/api/admin/casino';
                const method = casino ? 'PUT' : 'POST';
                
                try {
                    const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        onSave();
                    } else {
                        alert('Failed to save casino');
                    }
                } catch (err) {
                    alert('Error saving casino');
                }
            }
            
            return (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {casino ? 'Edit Casino' : 'Add New Casino'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Name</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Website URL</label>
                                <input 
                                    type="url" 
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={onCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
        
        // Player Type Form Component
        function PlayerTypeForm({ playerType, onSave, onCancel }) {
            const [formData, setFormData] = useState(playerType || {
                name_en: '',
                name_pt: '',
                name_zh: '',
                description_en: '',
                description_pt: '',
                description_zh: '',
                icon: 'user',
                sort_order: 0
            });
            
            async function handleSubmit(e) {
                e.preventDefault();
                const url = playerType ? \`/api/admin/player-types/\${playerType.id}\` : '/api/admin/player-types';
                const method = playerType ? 'PUT' : 'POST';
                
                try {
                    const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        onSave();
                    } else {
                        alert('Failed to save player type');
                    }
                } catch (err) {
                    alert('Error saving player type');
                }
            }
            
            return (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {playerType ? 'Edit Player Type' : 'Add New Player Type'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Name (English)</label>
                                <input 
                                    type="text" 
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Name (Portuguese)</label>
                                <input 
                                    type="text" 
                                    value={formData.name_pt}
                                    onChange={(e) => setFormData({...formData, name_pt: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Name (Chinese)</label>
                                <input 
                                    type="text" 
                                    value={formData.name_zh}
                                    onChange={(e) => setFormData({...formData, name_zh: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Icon (FontAwesome name)</label>
                                <input 
                                    type="text" 
                                    value={formData.icon}
                                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                    placeholder="e.g., user, dice, star"
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Sort Order</label>
                                <input 
                                    type="number" 
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={onCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
        
        // Blog Category Form Component
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
            
            async function handleSubmit(e) {
                e.preventDefault();
                const url = category ? \`/api/admin/blog/categories/\${category.id}\` : '/api/admin/blog/categories';
                const method = category ? 'PUT' : 'POST';
                
                try {
                    const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        onSave();
                    } else {
                        alert('Failed to save category');
                    }
                } catch (err) {
                    alert('Error saving category');
                }
            }
            
            return (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {category ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Slug</label>
                                <input 
                                    type="text" 
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Name (English)</label>
                                <input 
                                    type="text" 
                                    value={formData.name_en}
                                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={onCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
        
        // Blog Post Form Component
        function BlogPostForm({ post, categories, onSave, onCancel }) {
            const [formData, setFormData] = useState(post || {
                category_id: categories[0]?.id || '',
                slug: '',
                title_en: '',
                title_pt: '',
                title_zh: '',
                content_en: '',
                content_pt: '',
                content_zh: '',
                author: 'Admin',
                is_published: false
            });
            
            async function handleSubmit(e) {
                e.preventDefault();
                const url = post ? \`/api/admin/blog/posts/\${post.id}\` : '/api/admin/blog/posts';
                const method = post ? 'PUT' : 'POST';
                
                try {
                    const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        onSave();
                    } else {
                        alert('Failed to save post');
                    }
                } catch (err) {
                    alert('Error saving post');
                }
            }
            
            return (
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {post ? 'Edit Post' : 'Add New Post'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Category</label>
                                <select 
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md">
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Slug</label>
                                <input 
                                    type="text" 
                                    value={formData.slug}
                                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Title (English)</label>
                            <input 
                                type="text" 
                                value={formData.title_en}
                                onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                                required
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-bold mb-2">Content (English)</label>
                            <textarea 
                                value={formData.content_en}
                                onChange={(e) => setFormData({...formData, content_en: e.target.value})}
                                rows="6"
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center text-gray-300">
                                <input 
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
                                    className="mr-2" />
                                Publish immediately
                            </label>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" onClick={onCancel}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Cancel
                            </button>
                            <button type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            );
        }
        
        // Mount the app
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<AdminApp />);
    </script>
</body>
</html>`;
}