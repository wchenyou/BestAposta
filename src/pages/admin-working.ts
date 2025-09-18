export function renderWorkingAdminPage(): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Your Best Casino</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div id="app" class="min-h-screen"></div>
    
    <script type="module">
        import { h, render } from 'https://unpkg.com/preact@10.22.0/dist/preact.module.js';
        import { useState, useEffect } from 'https://unpkg.com/preact@10.22.0/hooks/dist/hooks.module.js';
        import htm from 'https://unpkg.com/htm@3.1.1/dist/htm.module.js';
        
        const html = htm.bind(h);
        
        function App() {
            const [isLoggedIn, setIsLoggedIn] = useState(false);
            const [loading, setLoading] = useState(true);
            
            useEffect(() => {
                // Check if user is already logged in
                checkAuth();
            }, []);
            
            async function checkAuth() {
                try {
                    const response = await fetch('/api/admin/auth');
                    if (response.ok) {
                        setIsLoggedIn(true);
                    }
                } catch (err) {
                    console.error('Auth check failed:', err);
                } finally {
                    setLoading(false);
                }
            }
            
            function LoginForm() {
                const [credentials, setCredentials] = useState({ email: 'wchenyou@gmail.com', password: '' });
                const [error, setError] = useState('');
                
                const handleLogin = async (e) => {
                    e.preventDefault();
                    try {
                        const res = await fetch('/api/admin/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(credentials)
                        });
                        
                        if (res.ok) {
                            setIsLoggedIn(true);
                            setError('');
                        } else {
                            setError('Invalid credentials');
                        }
                    } catch (err) {
                        setError('Login failed');
                    }
                };
                
                return html\`
                    <div class="flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-xl shadow-lg w-96">
                            <h2 class="text-2xl font-bold mb-6 text-center">Admin Login</h2>
                            \${error && html\`<div class="bg-red-100 text-red-600 p-2 rounded mb-4">\${error}</div>\`}
                            <form onSubmit=\${handleLogin}>
                                <div class="mb-4">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                    <input type="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        value=\${credentials.email}
                                        onChange=\${e => setCredentials({...credentials, email: e.target.value})} />
                                </div>
                                <div class="mb-6">
                                    <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                    <input type="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                        placeholder="Enter password"
                                        value=\${credentials.password}
                                        onChange=\${e => setCredentials({...credentials, password: e.target.value})} />
                                </div>
                                <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                                    Login
                                </button>
                                <div class="mt-4 text-sm text-gray-600 text-center">
                                    Use: wchenyou@gmail.com / Aaron12345678
                                </div>
                            </form>
                        </div>
                    </div>
                \`;
            }
            
            function CasinoManager() {
                const [casinos, setCasinos] = useState([]);
                const [loading, setLoading] = useState(true);
                const [showForm, setShowForm] = useState(false);
                const [editingCasino, setEditingCasino] = useState(null);
                
                useEffect(() => {
                    loadCasinos();
                }, []);
                
                async function loadCasinos() {
                    try {
                        const res = await fetch('/api/admin/casinos');
                        if (res.ok) {
                            const data = await res.json();
                            setCasinos(data);
                        }
                        setLoading(false);
                    } catch (err) {
                        console.error('Failed to load casinos:', err);
                        setLoading(false);
                    }
                }
                
                async function saveCasino(casino) {
                    const isNew = !casino.id;
                    const url = isNew ? '/api/admin/casinos' : \`/api/admin/casinos/\${casino.id}\`;
                    const method = isNew ? 'POST' : 'PUT';
                    
                    try {
                        const res = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(casino)
                        });
                        
                        if (res.ok) {
                            await loadCasinos();
                            setShowForm(false);
                            setEditingCasino(null);
                        }
                    } catch (err) {
                        console.error('Failed to save casino:', err);
                    }
                }
                
                async function deleteCasino(id) {
                    if (confirm('Are you sure you want to delete this casino?')) {
                        try {
                            const res = await fetch('/api/admin/casinos/' + id, { method: 'DELETE' });
                            if (res.ok) {
                                await loadCasinos();
                            }
                        } catch (err) {
                            console.error('Failed to delete casino:', err);
                        }
                    }
                }
                
                async function handleLogout() {
                    await fetch('/api/admin/logout', { method: 'POST' });
                    setIsLoggedIn(false);
                }
                
                if (loading) {
                    return html\`<div class="text-center py-8">Loading...</div>\`;
                }
                
                return html\`
                    <div class="min-h-screen bg-gray-100">
                        <!-- Header -->
                        <div class="bg-white shadow">
                            <div class="px-4 sm:px-6 lg:px-8">
                                <div class="flex justify-between h-16">
                                    <div class="flex items-center">
                                        <h1 class="text-xl font-semibold">Admin Panel - Your Best Casino</h1>
                                    </div>
                                    <div class="flex items-center space-x-4">
                                        <nav class="flex space-x-4">
                                            <button class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                                                <i class="fas fa-dice mr-2"></i>Casinos
                                            </button>
                                            <button class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                                <i class="fas fa-users mr-2"></i>Player Types
                                            </button>
                                            <button class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                                <i class="fas fa-newspaper mr-2"></i>Blog
                                            </button>
                                            <button class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                                <i class="fas fa-envelope mr-2"></i>Contact
                                            </button>
                                        </nav>
                                        <button onClick=\${handleLogout}
                                            class="text-gray-500 hover:text-gray-700">
                                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-8">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold">Casino Management</h2>
                                <button onClick=\${() => { setEditingCasino(null); setShowForm(true); }}
                                    class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                                    <i class="fas fa-plus mr-2"></i>Add Casino
                                </button>
                            </div>
                            
                            \${showForm ? html\`
                                <\${CasinoForm} 
                                    casino=\${editingCasino}
                                    onSave=\${saveCasino}
                                    onCancel=\${() => { setShowForm(false); setEditingCasino(null); }}
                                />
                            \` : html\`
                                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            \${casinos.map(casino => html\`
                                                <tr key=\${casino.id}>
                                                    <td class="px-6 py-4 whitespace-nowrap">\${casino.name}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <a href=\${casino.website_url} target="_blank" class="text-blue-600 hover:underline">
                                                            \${casino.website_url}
                                                        </a>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">\${casino.rating || 0}/5</td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class=\${casino.is_active 
                                                            ? "px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                                                            : "px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
                                                        }>
                                                            \${casino.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <button onClick=\${() => { setEditingCasino(casino); setShowForm(true); }}
                                                            class="text-blue-600 hover:text-blue-800 mr-3">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                        <button onClick=\${() => deleteCasino(casino.id)}
                                                            class="text-red-600 hover:text-red-800">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            \`)}
                                        </tbody>
                                    </table>
                                </div>
                            \`}
                        </div>
                    </div>
                \`;
            }
            
            function CasinoForm({ casino, onSave, onCancel }) {
                const [formData, setFormData] = useState(casino || {
                    name: '',
                    slug: '',
                    logo_url: '',
                    website_url: '',
                    affiliate_link: '',
                    sort_order: 0,
                    is_active: true,
                    rating: 4.5,
                    welcome_bonus_en: '',
                    welcome_bonus_pt: '',
                    welcome_bonus_zh: '',
                    min_deposit_en: '',
                    min_deposit_pt: '',
                    min_deposit_zh: '',
                });
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                return html\`
                    <div class="bg-white p-6 rounded-lg shadow">
                        <h2 class="text-2xl font-bold mb-4">\${casino?.id ? 'Edit Casino' : 'Add New Casino'}</h2>
                        <form onSubmit=\${handleSubmit}>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Name</label>
                                    <input type="text" required class="w-full px-3 py-2 border rounded"
                                        value=\${formData.name}
                                        onChange=\${e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Slug</label>
                                    <input type="text" required class="w-full px-3 py-2 border rounded"
                                        value=\${formData.slug}
                                        onChange=\${e => setFormData({...formData, slug: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Logo URL</label>
                                    <input type="url" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.logo_url}
                                        onChange=\${e => setFormData({...formData, logo_url: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Website URL</label>
                                    <input type="url" required class="w-full px-3 py-2 border rounded"
                                        value=\${formData.website_url}
                                        onChange=\${e => setFormData({...formData, website_url: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Affiliate Link</label>
                                    <input type="url" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.affiliate_link}
                                        onChange=\${e => setFormData({...formData, affiliate_link: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Rating (0-5)</label>
                                    <input type="number" min="0" max="5" step="0.1" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.rating}
                                        onChange=\${e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                                </div>
                                <div class="col-span-2">
                                    <h3 class="font-semibold mb-2">Welcome Bonus</h3>
                                    <div class="grid grid-cols-3 gap-2">
                                        <input type="text" placeholder="English" class="px-3 py-2 border rounded"
                                            value=\${formData.welcome_bonus_en}
                                            onChange=\${e => setFormData({...formData, welcome_bonus_en: e.target.value})} />
                                        <input type="text" placeholder="Portuguese" class="px-3 py-2 border rounded"
                                            value=\${formData.welcome_bonus_pt}
                                            onChange=\${e => setFormData({...formData, welcome_bonus_pt: e.target.value})} />
                                        <input type="text" placeholder="Chinese" class="px-3 py-2 border rounded"
                                            value=\${formData.welcome_bonus_zh}
                                            onChange=\${e => setFormData({...formData, welcome_bonus_zh: e.target.value})} />
                                    </div>
                                </div>
                                <div class="col-span-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" class="mr-2"
                                            checked=\${formData.is_active}
                                            onChange=\${e => setFormData({...formData, is_active: e.target.checked})} />
                                        <span class="text-sm font-medium">Active</span>
                                    </label>
                                </div>
                            </div>
                            <div class="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick=\${onCancel}
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                    Cancel
                                </button>
                                <button type="submit"
                                    class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                \`;
            }
            
            if (loading) {
                return html\`<div class="flex items-center justify-center min-h-screen">Loading...</div>\`;
            }
            
            return html\`
                <div>
                    \${isLoggedIn ? html\`<\${CasinoManager} />\` : html\`<\${LoginForm} />\`}
                </div>
            \`;
        }
        
        // Mount the app
        const container = document.getElementById('app');
        if (container) {
            render(html\`<\${App} />\`, container);
        }
    </script>
</body>
</html>
  `;
}