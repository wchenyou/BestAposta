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
        <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
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
            
            // Casino Manager Component
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
                
                async function deleteCasino(id) {
                    if (confirm('Are you sure you want to delete this casino?')) {
                        try {
                            const res = await apiCall('/admin/casinos/' + id, { method: 'DELETE' });
                            if (res.ok) {
                                await loadCasinos();
                            }
                        } catch (err) {
                            console.error('Failed to delete casino:', err);
                        }
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
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                                                    Visit <i class="fas fa-external-link-alt text-xs"></i>
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
                                                <button onClick=\${() => deleteCasino(casino.id)}
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
                    // English content
                    welcome_bonus_en: '',
                    min_deposit_en: '',
                    payment_methods_en: '',
                    license_en: '',
                    founded_year_en: '',
                    bonus_description_en: '',
                    games_description_en: '',
                    payment_description_en: '',
                    support_description_en: '',
                    mobile_description_en: '',
                    security_description_en: '',
                    responsible_gaming_en: '',
                    pros_en: '',
                    // Portuguese content
                    welcome_bonus_pt: '',
                    min_deposit_pt: '',
                    payment_methods_pt: '',
                    license_pt: '',
                    founded_year_pt: '',
                    bonus_description_pt: '',
                    games_description_pt: '',
                    payment_description_pt: '',
                    support_description_pt: '',
                    mobile_description_pt: '',
                    security_description_pt: '',
                    responsible_gaming_pt: '',
                    pros_pt: '',
                    // Chinese content
                    welcome_bonus_zh: '',
                    min_deposit_zh: '',
                    payment_methods_zh: '',
                    license_zh: '',
                    founded_year_zh: '',
                    bonus_description_zh: '',
                    games_description_zh: '',
                    payment_description_zh: '',
                    support_description_zh: '',
                    mobile_description_zh: '',
                    security_description_zh: '',
                    responsible_gaming_zh: '',
                    pros_zh: ''
                });
                
                const [activeTab, setActiveTab] = useState('basic');
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-bold mb-4">\${casino ? 'Edit Casino' : 'Add New Casino'}</h3>
                        
                        <!-- Tab Navigation -->
                        <div class="border-b mb-6">
                            <nav class="-mb-px flex space-x-8">
                                <button type="button"
                                    class="py-2 px-1 border-b-2 font-medium text-sm \${activeTab === 'basic' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                                    onClick=\${() => setActiveTab('basic')}>
                                    Basic Info
                                </button>
                                <button type="button"
                                    class="py-2 px-1 border-b-2 font-medium text-sm \${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                                    onClick=\${() => setActiveTab('overview')}>
                                    Overview Content
                                </button>
                                <button type="button"
                                    class="py-2 px-1 border-b-2 font-medium text-sm \${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                                    onClick=\${() => setActiveTab('details')}>
                                    Detailed Content
                                </button>
                            </nav>
                        </div>
                        
                        <form onSubmit=\${handleSubmit}>
                            <!-- Basic Info Tab -->
                            \${activeTab === 'basic' ? html\`
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Casino Name *</label>
                                            <input type="text" class="w-full px-3 py-2 border rounded" required
                                                value=\${formData.name}
                                                onChange=\${e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                                            <input type="text" class="w-full px-3 py-2 border rounded" required
                                                value=\${formData.slug}
                                                onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                            <p class="text-xs text-gray-500 mt-1">URL: /casino/\${formData.slug || 'casino-name'}</p>
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                            <input type="url" class="w-full px-3 py-2 border rounded"
                                                placeholder="https://example.com/logo.png"
                                                value=\${formData.logo_url}
                                                onChange=\${e => setFormData({...formData, logo_url: e.target.value})} />
                                            \${formData.logo_url ? html\`
                                                <img src="\${formData.logo_url}" class="mt-2 h-12 object-contain" alt="Logo preview" />
                                            \` : ''}
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                            <input type="url" class="w-full px-3 py-2 border rounded"
                                                placeholder="https://casino.com"
                                                value=\${formData.website_url}
                                                onChange=\${e => setFormData({...formData, website_url: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Affiliate Link *</label>
                                            <input type="url" class="w-full px-3 py-2 border rounded" required
                                                placeholder="https://affiliate.com/link"
                                                value=\${formData.affiliate_link}
                                                onChange=\${e => setFormData({...formData, affiliate_link: e.target.value})} />
                                            <p class="text-xs text-gray-500 mt-1">Used for "Visit Casino" button</p>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                            <input type="number" class="w-full px-3 py-2 border rounded"
                                                value=\${formData.sort_order}
                                                onChange=\${e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
                                            <p class="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                                        </div>
                                    </div>
                                    
                                    <div class="border rounded p-4 bg-gray-50">
                                        <label class="flex items-center cursor-pointer">
                                            <input type="checkbox" class="mr-3 h-5 w-5 text-indigo-600"
                                                checked=\${formData.is_active}
                                                onChange=\${e => setFormData({...formData, is_active: e.target.checked})} />
                                            <div>
                                                <span class="text-sm font-medium text-gray-900">Active Status</span>
                                                <p class="text-xs text-gray-500">Inactive casinos won't be shown on the website</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            \` : ''}
                            
                            <!-- Overview Content Tab -->
                            \${activeTab === 'overview' ? html\`
                                <div class="space-y-6">
                                    <div class="bg-blue-50 p-3 rounded">
                                        <p class="text-sm text-blue-800">Fill in the overview information in each language. This appears on the casino detail page.</p>
                                    </div>
                                    
                                    <!-- English Overview -->
                                    <div class="border rounded-lg p-4">
                                        <h4 class="font-medium mb-3">🇬🇧 English Content</h4>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Welcome Bonus</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="100% up to $500"
                                                    value=\${formData.welcome_bonus_en}
                                                    onChange=\${e => setFormData({...formData, welcome_bonus_en: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Min. Deposit</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="$10"
                                                    value=\${formData.min_deposit_en}
                                                    onChange=\${e => setFormData({...formData, min_deposit_en: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Payment Methods</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="Visa, Mastercard, Bitcoin"
                                                    value=\${formData.payment_methods_en}
                                                    onChange=\${e => setFormData({...formData, payment_methods_en: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">License</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="Malta Gaming Authority"
                                                    value=\${formData.license_en}
                                                    onChange=\${e => setFormData({...formData, license_en: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Founded Year</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="2020"
                                                    value=\${formData.founded_year_en}
                                                    onChange=\${e => setFormData({...formData, founded_year_en: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Pros (comma separated)</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="Fast payouts, Great support"
                                                    value=\${formData.pros_en}
                                                    onChange=\${e => setFormData({...formData, pros_en: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Portuguese Overview -->
                                    <div class="border rounded-lg p-4">
                                        <h4 class="font-medium mb-3">🇧🇷 Portuguese Content</h4>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Bônus de Boas-vindas</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="100% até R$ 2.500"
                                                    value=\${formData.welcome_bonus_pt}
                                                    onChange=\${e => setFormData({...formData, welcome_bonus_pt: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Depósito Mínimo</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="R$ 50"
                                                    value=\${formData.min_deposit_pt}
                                                    onChange=\${e => setFormData({...formData, min_deposit_pt: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Métodos de Pagamento</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    placeholder="Pix, Boleto, Cartão"
                                                    value=\${formData.payment_methods_pt}
                                                    onChange=\${e => setFormData({...formData, payment_methods_pt: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Licença</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.license_pt}
                                                    onChange=\${e => setFormData({...formData, license_pt: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Ano de Fundação</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.founded_year_pt}
                                                    onChange=\${e => setFormData({...formData, founded_year_pt: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Prós (separados por vírgula)</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.pros_pt}
                                                    onChange=\${e => setFormData({...formData, pros_pt: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Chinese Overview -->
                                    <div class="border rounded-lg p-4">
                                        <h4 class="font-medium mb-3">🇨🇳 Chinese Content</h4>
                                        <div class="grid grid-cols-2 gap-3">
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">欢迎奖金</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.welcome_bonus_zh}
                                                    onChange=\${e => setFormData({...formData, welcome_bonus_zh: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">最低存款</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.min_deposit_zh}
                                                    onChange=\${e => setFormData({...formData, min_deposit_zh: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">支付方式</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.payment_methods_zh}
                                                    onChange=\${e => setFormData({...formData, payment_methods_zh: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">许可证</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.license_zh}
                                                    onChange=\${e => setFormData({...formData, license_zh: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">成立年份</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.founded_year_zh}
                                                    onChange=\${e => setFormData({...formData, founded_year_zh: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">优点（逗号分隔）</label>
                                                <input type="text" class="w-full px-2 py-1 text-sm border rounded"
                                                    value=\${formData.pros_zh}
                                                    onChange=\${e => setFormData({...formData, pros_zh: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            \` : ''}
                            
                            <!-- Detailed Content Tab -->
                            \${activeTab === 'details' ? html\`
                                <div class="space-y-6">
                                    <div class="bg-yellow-50 p-3 rounded">
                                        <p class="text-sm text-yellow-800">These detailed descriptions appear in expandable sections on the casino page.</p>
                                    </div>
                                    
                                    <!-- English Details -->
                                    <div class="border rounded-lg p-4">
                                        <h4 class="font-medium mb-3">🇬🇧 English Detailed Content</h4>
                                        <div class="space-y-3">
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Bonus Details</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.bonus_description_en}
                                                    onChange=\${e => setFormData({...formData, bonus_description_en: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Games & Software</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.games_description_en}
                                                    onChange=\${e => setFormData({...formData, games_description_en: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Payment Options</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.payment_description_en}
                                                    onChange=\${e => setFormData({...formData, payment_description_en: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Customer Support</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.support_description_en}
                                                    onChange=\${e => setFormData({...formData, support_description_en: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Mobile Experience</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.mobile_description_en}
                                                    onChange=\${e => setFormData({...formData, mobile_description_en: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Security & Fairness</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.security_description_en}
                                                    onChange=\${e => setFormData({...formData, security_description_en: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Responsible Gaming</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.responsible_gaming_en}
                                                    onChange=\${e => setFormData({...formData, responsible_gaming_en: e.target.value})}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Portuguese Details -->
                                    <div class="border rounded-lg p-4">
                                        <h4 class="font-medium mb-3">🇧🇷 Portuguese Detailed Content</h4>
                                        <div class="space-y-3">
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Detalhes do Bônus</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.bonus_description_pt}
                                                    onChange=\${e => setFormData({...formData, bonus_description_pt: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Jogos e Software</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.games_description_pt}
                                                    onChange=\${e => setFormData({...formData, games_description_pt: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Opções de Pagamento</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.payment_description_pt}
                                                    onChange=\${e => setFormData({...formData, payment_description_pt: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Suporte ao Cliente</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.support_description_pt}
                                                    onChange=\${e => setFormData({...formData, support_description_pt: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Experiência Móvel</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.mobile_description_pt}
                                                    onChange=\${e => setFormData({...formData, mobile_description_pt: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Segurança e Justiça</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.security_description_pt}
                                                    onChange=\${e => setFormData({...formData, security_description_pt: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">Jogo Responsável</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.responsible_gaming_pt}
                                                    onChange=\${e => setFormData({...formData, responsible_gaming_pt: e.target.value})}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Chinese Details -->
                                    <div class="border rounded-lg p-4">
                                        <h4 class="font-medium mb-3">🇨🇳 Chinese Detailed Content</h4>
                                        <div class="space-y-3">
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">奖金详情</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.bonus_description_zh}
                                                    onChange=\${e => setFormData({...formData, bonus_description_zh: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">游戏与软件</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.games_description_zh}
                                                    onChange=\${e => setFormData({...formData, games_description_zh: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">支付选项</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.payment_description_zh}
                                                    onChange=\${e => setFormData({...formData, payment_description_zh: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">客户支持</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.support_description_zh}
                                                    onChange=\${e => setFormData({...formData, support_description_zh: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">移动体验</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.mobile_description_zh}
                                                    onChange=\${e => setFormData({...formData, mobile_description_zh: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">安全与公平</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.security_description_zh}
                                                    onChange=\${e => setFormData({...formData, security_description_zh: e.target.value})}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-xs font-medium text-gray-700 mb-1">负责任博彩</label>
                                                <textarea class="w-full px-2 py-1 text-sm border rounded" rows="2"
                                                    value=\${formData.responsible_gaming_zh}
                                                    onChange=\${e => setFormData({...formData, responsible_gaming_zh: e.target.value})}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            \` : ''}
                            
                            <!-- Form Actions -->
                            <div class="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button type="button" onClick=\${onCancel}
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                    Cancel
                                </button>
                                <button type="submit"
                                    class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                    <i class="fas fa-save mr-2"></i>
                                    \${casino ? 'Update Casino' : 'Create Casino'}
                                </button>
                            </div>
                        </form>
                    </div>
                \`;
            }
            
            // Player Types Manager Component
            function PlayerTypesManager() {
                const [playerTypes, setPlayerTypes] = useState([]);
                const [loading, setLoading] = useState(true);
                const [editingType, setEditingType] = useState(null);
                const [showForm, setShowForm] = useState(false);
                
                useEffect(() => {
                    loadPlayerTypes();
                }, []);
                
                async function loadPlayerTypes() {
                    setLoading(true);
                    try {
                        const res = await apiCall('/admin/player-types');
                        if (res.ok) {
                            const data = await res.json();
                            setPlayerTypes(data);
                        }
                    } catch (err) {
                        console.error('Failed to load player types:', err);
                    }
                    setLoading(false);
                }
                
                async function savePlayerType(type) {
                    try {
                        const url = type.id ? '/admin/player-types/' + type.id : '/admin/player-types';
                        const method = type.id ? 'PUT' : 'POST';
                        
                        const res = await apiCall(url, {
                            method,
                            body: JSON.stringify(type)
                        });
                        
                        if (res.ok) {
                            await loadPlayerTypes();
                            setShowForm(false);
                            setEditingType(null);
                        }
                    } catch (err) {
                        console.error('Failed to save player type:', err);
                    }
                }
                
                async function deletePlayerType(id) {
                    if (confirm('Are you sure you want to delete this player type?')) {
                        try {
                            const res = await apiCall('/admin/player-types/' + id, { method: 'DELETE' });
                            if (res.ok) {
                                await loadPlayerTypes();
                            }
                        } catch (err) {
                            console.error('Failed to delete player type:', err);
                        }
                    }
                }
                
                if (loading) {
                    return html\`<div class="text-center py-8">Loading...</div>\`;
                }
                
                if (showForm) {
                    return html\`
                        <div>
                            <button onClick=\${() => { setShowForm(false); setEditingType(null); }}
                                class="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                <i class="fas fa-arrow-left mr-2"></i> Back
                            </button>
                            <\${PlayerTypeForm} 
                                playerType=\${editingType}
                                onSave=\${savePlayerType}
                                onCancel=\${() => { setShowForm(false); setEditingType(null); }}
                            />
                        </div>
                    \`;
                }
                
                return html\`
                    <div>
                        <button onClick=\${() => setShowForm(true)}
                            class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            <i class="fas fa-plus mr-2"></i> Add Player Type
                        </button>
                        
                        <div class="bg-white rounded-lg shadow overflow-hidden">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name (EN/PT/ZH)</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sort</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    \${playerTypes.map(type => html\`
                                        <tr>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <i class="fas \${type.icon || 'fa-user'} text-purple-600 text-xl"></i>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="text-sm">
                                                    <div class="font-medium text-gray-900">\${type.name_en}</div>
                                                    <div class="text-gray-500">\${type.name_pt}</div>
                                                    <div class="text-gray-400">\${type.name_zh || '-'}</div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${type.sort_order}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    \${type.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                    \${type.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick=\${() => { setEditingType(type); setShowForm(true); }}
                                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button onClick=\${() => deletePlayerType(type.id)}
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
                \`;
            }
            
            function PlayerTypeForm({ playerType, onSave, onCancel }) {
                const [formData, setFormData] = useState(playerType || {
                    name_en: '',
                    name_pt: '',
                    name_zh: '',
                    description_en: '',
                    description_pt: '',
                    description_zh: '',
                    icon: 'fa-user',
                    sort_order: 0,
                    is_active: true
                });
                
                const iconOptions = [
                    'fa-user', 'fa-user-plus', 'fa-dice', 'fa-fire', 'fa-calculator', 'fa-crown',
                    'fa-star', 'fa-trophy', 'fa-gem', 'fa-coins', 'fa-wallet', 'fa-chart-line'
                ];
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-bold mb-4">\${playerType ? 'Edit Player Type' : 'Add New Player Type'}</h3>
                        <form onSubmit=\${handleSubmit}>
                            <div class="space-y-4">
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
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                        <select class="w-full px-3 py-2 border rounded"
                                            value=\${formData.icon}
                                            onChange=\${e => setFormData({...formData, icon: e.target.value})}>
                                            \${iconOptions.map(icon => html\`
                                                <option value=\${icon}>\${icon}</option>
                                            \`)}
                                        </select>
                                        <div class="mt-2">
                                            <i class="fas \${formData.icon} text-purple-600 text-2xl"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                        <input type="number" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.sort_order}
                                            onChange=\${e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div class="mt-2">
                                            <input type="checkbox" id="player_active" class="mr-2"
                                                checked=\${formData.is_active}
                                                onChange=\${e => setFormData({...formData, is_active: e.target.checked})} />
                                            <label for="player_active">Active</label>
                                        </div>
                                    </div>
                                </div>
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
            
            // Blog Manager Component
            function BlogManager() {
                const [posts, setPosts] = useState([]);
                const [categories, setCategories] = useState([]);
                const [loading, setLoading] = useState(true);
                const [editingPost, setEditingPost] = useState(null);
                const [showForm, setShowForm] = useState(false);
                const [activeTab, setActiveTab] = useState('posts'); // posts or categories
                
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
                            setPosts(await postsRes.json());
                        }
                        if (categoriesRes.ok) {
                            setCategories(await categoriesRes.json());
                        }
                    } catch (err) {
                        console.error('Failed to load blog data:', err);
                    }
                    setLoading(false);
                }
                
                async function savePost(post) {
                    try {
                        const url = post.id ? '/admin/blog/posts/' + post.id : '/admin/blog/posts';
                        const method = post.id ? 'PUT' : 'POST';
                        
                        const res = await apiCall(url, {
                            method,
                            body: JSON.stringify(post)
                        });
                        
                        if (res.ok) {
                            await loadData();
                            setShowForm(false);
                            setEditingPost(null);
                        }
                    } catch (err) {
                        console.error('Failed to save post:', err);
                    }
                }
                
                async function deletePost(id) {
                    if (confirm('Are you sure you want to delete this post?')) {
                        try {
                            const res = await apiCall('/admin/blog/posts/' + id, { method: 'DELETE' });
                            if (res.ok) {
                                await loadData();
                            }
                        } catch (err) {
                            console.error('Failed to delete post:', err);
                        }
                    }
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
                            <\${BlogCategoriesManager} categories=\${categories} onUpdate=\${loadData} />
                        \`}
                    </div>
                \`;
            }
            
            function BlogPostForm({ post, categories, onSave, onCancel }) {
                const [formData, setFormData] = useState(post || {
                    category_id: categories[0]?.id || 1,
                    slug: '',
                    title_en: '',
                    title_pt: '',
                    title_zh: '',
                    excerpt_en: '',
                    excerpt_pt: '',
                    excerpt_zh: '',
                    content_en: '',
                    content_pt: '',
                    content_zh: '',
                    featured_image: '',
                    author: '',
                    is_published: false,
                    published_at: new Date().toISOString().split('T')[0]
                });
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-bold mb-4">\${post ? 'Edit Post' : 'Add New Post'}</h3>
                        <form onSubmit=\${handleSubmit}>
                            <div class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                        <select class="w-full px-3 py-2 border rounded" required
                                            value=\${formData.category_id}
                                            onChange=\${e => setFormData({...formData, category_id: parseInt(e.target.value)})}>
                                            \${categories.map(cat => html\`
                                                <option value=\${cat.id}>\${cat.name_en}</option>
                                            \`)}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded" required
                                            value=\${formData.slug}
                                            onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded" required
                                            value=\${formData.title_en}
                                            onChange=\${e => setFormData({...formData, title_en: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Title (Portuguese) *</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded" required
                                            value=\${formData.title_pt}
                                            onChange=\${e => setFormData({...formData, title_pt: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Title (Chinese)</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.title_zh}
                                            onChange=\${e => setFormData({...formData, title_zh: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt (English)</label>
                                        <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                            value=\${formData.excerpt_en}
                                            onChange=\${e => setFormData({...formData, excerpt_en: e.target.value})}></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt (Portuguese)</label>
                                        <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                            value=\${formData.excerpt_pt}
                                            onChange=\${e => setFormData({...formData, excerpt_pt: e.target.value})}></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt (Chinese)</label>
                                        <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                            value=\${formData.excerpt_zh}
                                            onChange=\${e => setFormData({...formData, excerpt_zh: e.target.value})}></textarea>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                                        <textarea class="w-full px-3 py-2 border rounded" rows="6"
                                            value=\${formData.content_en}
                                            onChange=\${e => setFormData({...formData, content_en: e.target.value})}></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Content (Portuguese)</label>
                                        <textarea class="w-full px-3 py-2 border rounded" rows="6"
                                            value=\${formData.content_pt}
                                            onChange=\${e => setFormData({...formData, content_pt: e.target.value})}></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Content (Chinese)</label>
                                        <textarea class="w-full px-3 py-2 border rounded" rows="6"
                                            value=\${formData.content_zh}
                                            onChange=\${e => setFormData({...formData, content_zh: e.target.value})}></textarea>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.featured_image}
                                            onChange=\${e => setFormData({...formData, featured_image: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.author}
                                            onChange=\${e => setFormData({...formData, author: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                        <input type="date" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.published_at?.split('T')[0]}
                                            onChange=\${e => setFormData({...formData, published_at: e.target.value})} />
                                    </div>
                                </div>
                                
                                <div class="flex items-center">
                                    <input type="checkbox" id="is_published" class="mr-2"
                                        checked=\${formData.is_published}
                                        onChange=\${e => setFormData({...formData, is_published: e.target.checked})} />
                                    <label for="is_published" class="text-sm font-medium text-gray-700">Publish this post</label>
                                </div>
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
            
            function BlogCategoriesManager({ categories, onUpdate }) {
                return html\`
                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sort</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                \${categories.map(cat => html\`
                                    <tr>
                                        <td class="px-6 py-4">
                                            <div class="text-sm">
                                                <div class="font-medium text-gray-900">\${cat.name_en}</div>
                                                <div class="text-gray-500">\${cat.name_pt}</div>
                                                <div class="text-gray-400">\${cat.name_zh || '-'}</div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${cat.slug}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${cat.sort_order}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                \${cat.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                \${cat.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                \`)}
                            </tbody>
                        </table>
                    </div>
                \`;
            }
            
            // Contact Settings Manager Component
            function ContactManager() {
                const [settings, setSettings] = useState(null);
                const [loading, setLoading] = useState(true);
                const [editing, setEditing] = useState(false);
                
                useEffect(() => {
                    loadSettings();
                }, []);
                
                async function loadSettings() {
                    setLoading(true);
                    try {
                        const res = await apiCall('/admin/contact');
                        if (res.ok) {
                            const data = await res.json();
                            setSettings(data || {
                                email: '',
                                content_en: '',
                                content_pt: '',
                                content_zh: ''
                            });
                        }
                    } catch (err) {
                        console.error('Failed to load contact settings:', err);
                    }
                    setLoading(false);
                }
                
                async function saveSettings(data) {
                    try {
                        const res = await apiCall('/admin/contact', {
                            method: 'POST',
                            body: JSON.stringify(data)
                        });
                        
                        if (res.ok) {
                            await loadSettings();
                            setEditing(false);
                        }
                    } catch (err) {
                        console.error('Failed to save contact settings:', err);
                    }
                }
                
                if (loading) {
                    return html\`<div class="text-center py-8">Loading...</div>\`;
                }
                
                if (editing) {
                    return html\`
                        <\${ContactForm} 
                            settings=\${settings}
                            onSave=\${saveSettings}
                            onCancel=\${() => setEditing(false)}
                        />
                    \`;
                }
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-bold">Contact Settings</h3>
                            <button onClick=\${() => setEditing(true)}
                                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                <i class="fas fa-edit mr-2"></i> Edit
                            </button>
                        </div>
                        
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                <p class="text-gray-900">\${settings?.email || 'Not set'}</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                                <div class="bg-gray-50 p-3 rounded">
                                    <p class="text-gray-900 whitespace-pre-wrap">\${settings?.content_en || 'Not set'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Content (Portuguese)</label>
                                <div class="bg-gray-50 p-3 rounded">
                                    <p class="text-gray-900 whitespace-pre-wrap">\${settings?.content_pt || 'Not set'}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Content (Chinese)</label>
                                <div class="bg-gray-50 p-3 rounded">
                                    <p class="text-gray-900 whitespace-pre-wrap">\${settings?.content_zh || 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            function ContactForm({ settings, onSave, onCancel }) {
                const [formData, setFormData] = useState(settings || {
                    email: '',
                    content_en: '',
                    content_pt: '',
                    content_zh: ''
                });
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-bold mb-4">Edit Contact Settings</h3>
                        <form onSubmit=\${handleSubmit}>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                                    <input type="email" class="w-full px-3 py-2 border rounded" required
                                        value=\${formData.email}
                                        onChange=\${e => setFormData({...formData, email: e.target.value})} />
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                                    <textarea class="w-full px-3 py-2 border rounded" rows="4"
                                        value=\${formData.content_en}
                                        onChange=\${e => setFormData({...formData, content_en: e.target.value})}></textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Content (Portuguese)</label>
                                    <textarea class="w-full px-3 py-2 border rounded" rows="4"
                                        value=\${formData.content_pt}
                                        onChange=\${e => setFormData({...formData, content_pt: e.target.value})}></textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Content (Chinese)</label>
                                    <textarea class="w-full px-3 py-2 border rounded" rows="4"
                                        value=\${formData.content_zh}
                                        onChange=\${e => setFormData({...formData, content_zh: e.target.value})}></textarea>
                                </div>
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
            
            // Main Admin Panel Component
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
                                \${activeTab === 'players' && html\`<\${PlayerTypesManager} />\`}
                                \${activeTab === 'blog' && html\`<\${BlogManager} />\`}
                                \${activeTab === 'contact' && html\`<\${ContactManager} />\`}
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