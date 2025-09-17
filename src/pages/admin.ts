export function renderAdminPage(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel - Best Apostas</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div id="app" class="min-h-screen"></div>
        
        <script type="module">
            import { html, render, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js';
            
            const API_BASE = '/api';
            let authToken = localStorage.getItem('adminToken');
            
            // API helper
            async function apiCall(url, options = {}) {
                const res = await fetch(API_BASE + url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authToken ? 'Bearer ' + authToken : '',
                        ...options.headers
                    }
                });
                if (!res.ok && res.status === 401) {
                    localStorage.removeItem('adminToken');
                    window.location.reload();
                }
                return res;
            }
            
            function LoginForm() {
                const [credentials, setCredentials] = useState({ username: '', password: '' });
                const [error, setError] = useState('');
                
                const handleLogin = async (e) => {
                    e.preventDefault();
                    try {
                        const res = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(credentials)
                        });
                        
                        if (res.ok) {
                            const data = await res.json();
                            localStorage.setItem('adminToken', data.token);
                            authToken = data.token;
                            window.location.reload();
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
                                <input type="text" placeholder="Username" class="w-full mb-4 px-4 py-2 border rounded"
                                    value=\${credentials.username}
                                    onChange=\${e => setCredentials({...credentials, username: e.target.value})} />
                                <input type="password" placeholder="Password" class="w-full mb-6 px-4 py-2 border rounded"
                                    value=\${credentials.password}
                                    onChange=\${e => setCredentials({...credentials, password: e.target.value})} />
                                <button type="submit" class="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                \`;
            }
            
            function CasinoManager() {
                const [casinos, setCasinos] = useState([]);
                const [loading, setLoading] = useState(true);
                const [editingCasino, setEditingCasino] = useState(null);
                const [showForm, setShowForm] = useState(false);
                
                useEffect(() => {
                    loadCasinos();
                }, []);
                
                async function loadCasinos() {
                    setLoading(true);
                    try {
                        const res = await apiCall('/admin/casinos');
                        if (res.ok) {
                            const data = await res.json();
                            setCasinos(data);
                        }
                    } catch (err) {
                        console.error('Failed to load casinos:', err);
                    }
                    setLoading(false);
                }
                
                async function saveCasino(casino) {
                    try {
                        const url = casino.id ? '/admin/casinos/' + casino.id : '/admin/casinos';
                        const method = casino.id ? 'PUT' : 'POST';
                        
                        const res = await apiCall(url, {
                            method,
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
                
                if (loading) {
                    return html\`<div class="text-center py-8">Loading...</div>\`;
                }
                
                if (showForm) {
                    return html\`
                        <div>
                            <button onClick=\${() => { setShowForm(false); setEditingCasino(null); }}
                                class="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                <i class="fas fa-arrow-left mr-2"></i> Back
                            </button>
                            <\${CasinoForm} 
                                casino=\${editingCasino}
                                onSave=\${saveCasino}
                                onCancel=\${() => { setShowForm(false); setEditingCasino(null); }}
                            />
                        </div>
                    \`;
                }
                
                return html\`
                    <div>
                        <button onClick=\${() => setShowForm(true)}
                            class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            <i class="fas fa-plus mr-2"></i> Add Casino
                        </button>
                        
                        <div class="bg-white rounded-lg shadow overflow-hidden">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    \${casinos.map(casino => html\`
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="flex items-center">
                                                    \${casino.logo_url ? html\`
                                                        <img src="\${casino.logo_url}" class="h-8 w-12 mr-3 object-contain" />
                                                    \` : ''}
                                                    <span class="font-medium">\${casino.name}</span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${casino.slug}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <a href="\${casino.website_url}" target="_blank" class="text-blue-600 hover:underline">
                                                    Visit <i class="fas fa-external-link-alt ml-1"></i>
                                                </a>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    \${casino.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                    \${casino.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick=\${() => { setEditingCasino(casino); setShowForm(true); }}
                                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onClick=\${() => handleToggleStatus(casino)}
                                                    class="text-yellow-600 hover:text-yellow-900">
                                                    <i class="fas fa-toggle-\${casino.is_active ? 'on' : 'off'}"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    \`)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                \`;
                
                async function handleToggleStatus(casino) {
                    await saveCasino({ ...casino, is_active: !casino.is_active });
                }
            }
            
            function CasinoForm({ casino, onSave, onCancel }) {
                const [formData, setFormData] = useState(casino || {
                    name: '',
                    slug: '',
                    logo_url: '',
                    website_url: '',
                    affiliate_link: '',
                    sort_order: 0,
                    is_active: true
                });
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-bold mb-4">\${casino ? 'Edit Casino' : 'Add New Casino'}</h3>
                        <form onSubmit=\${handleSubmit}>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" class="w-full px-3 py-2 border rounded" required
                                        value=\${formData.name}
                                        onChange=\${e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                    <input type="text" class="w-full px-3 py-2 border rounded" required
                                        value=\${formData.slug}
                                        onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                    <input type="text" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.logo_url}
                                        onChange=\${e => setFormData({...formData, logo_url: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                    <input type="text" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.website_url}
                                        onChange=\${e => setFormData({...formData, website_url: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Affiliate Link</label>
                                    <input type="text" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.affiliate_link}
                                        onChange=\${e => setFormData({...formData, affiliate_link: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                    <input type="number" class="w-full px-3 py-2 border rounded"
                                        value=\${formData.sort_order}
                                        onChange=\${e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                                </div>
                            </div>
                            
                            <div class="mt-4 flex items-center">
                                <input type="checkbox" id="is_active" class="mr-2"
                                    checked=\${formData.is_active}
                                    onChange=\${e => setFormData({...formData, is_active: e.target.checked})} />
                                <label for="is_active" class="text-sm font-medium text-gray-700">Active</label>
                            </div>
                            
                            <div class="mt-6 flex space-x-2">
                                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                    Save
                                </button>
                                <button type="button" onClick=\${onCancel}
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                \`;
            }
            
            function AdminPanel() {
                const [activeTab, setActiveTab] = useState('casinos');
                
                const handleLogout = () => {
                    localStorage.removeItem('adminToken');
                    window.location.reload();
                };
                
                return html\`
                    <div class="flex h-screen">
                        <!-- Sidebar -->
                        <div class="w-64 bg-gray-800 text-white">
                            <div class="p-4">
                                <h1 class="text-2xl font-bold">Admin Panel</h1>
                                <p class="text-sm text-gray-400 mt-1">Best Apostas</p>
                            </div>
                            <nav class="mt-8">
                                <a href="#" onClick=\${() => setActiveTab('casinos')}
                                   class="block px-4 py-2 hover:bg-gray-700 \${activeTab === 'casinos' ? 'bg-gray-700' : ''}">
                                    <i class="fas fa-dice mr-2"></i> Casinos
                                </a>
                                <a href="#" onClick=\${() => setActiveTab('players')}
                                   class="block px-4 py-2 hover:bg-gray-700 \${activeTab === 'players' ? 'bg-gray-700' : ''}">
                                    <i class="fas fa-users mr-2"></i> Player Types
                                </a>
                                <a href="#" onClick=\${() => setActiveTab('blog')}
                                   class="block px-4 py-2 hover:bg-gray-700 \${activeTab === 'blog' ? 'bg-gray-700' : ''}">
                                    <i class="fas fa-blog mr-2"></i> Blog
                                </a>
                                <a href="#" onClick=\${() => setActiveTab('contact')}
                                   class="block px-4 py-2 hover:bg-gray-700 \${activeTab === 'contact' ? 'bg-gray-700' : ''}">
                                    <i class="fas fa-envelope mr-2"></i> Contact
                                </a>
                                <a href="#" onClick=\${handleLogout}
                                   class="block px-4 py-2 hover:bg-gray-700 mt-8">
                                    <i class="fas fa-sign-out-alt mr-2"></i> Logout
                                </a>
                            </nav>
                        </div>
                        
                        <!-- Main Content -->
                        <div class="flex-1 overflow-y-auto bg-gray-100">
                            <div class="p-8">
                                <h2 class="text-3xl font-bold mb-6">
                                    \${activeTab === 'casinos' ? 'Manage Casinos' : ''}
                                    \${activeTab === 'players' ? 'Manage Player Types' : ''}
                                    \${activeTab === 'blog' ? 'Manage Blog' : ''}
                                    \${activeTab === 'contact' ? 'Contact Settings' : ''}
                                </h2>
                                
                                \${activeTab === 'casinos' && html\`<\${CasinoManager} />\`}
                                
                                \${activeTab !== 'casinos' && html\`
                                    <div class="bg-white rounded-lg shadow p-6">
                                        <p class="text-gray-600">
                                            This section is under development. Casino management is currently available.
                                        </p>
                                    </div>
                                \`}
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            function App() {
                if (!authToken) {
                    return html\`<\${LoginForm} />\`;
                }
                return html\`<\${AdminPanel} />\`;
            }
            
            render(html\`<\${App} />\`, document.getElementById('app'));
        </script>
    </body>
    </html>
  `;
}