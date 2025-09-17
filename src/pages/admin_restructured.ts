// Admin Panel with Restructured Casino Form
import { html } from 'htm/preact';
import { useState, useEffect } from 'preact/hooks';

export function renderAdminPage() {
  return html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Panel - Your Best Casino</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script type="module">
            import { h, render } from 'https://unpkg.com/preact@10.22.0/dist/preact.module.js';
            import { useState, useEffect } from 'https://unpkg.com/preact@10.22.0/hooks/dist/hooks.module.js';
            import htm from 'https://unpkg.com/htm@3.1.1/dist/htm.module.js';
            
            const html = htm.bind(h);
            
            function AdminApp() {
                const [isLoggedIn, setIsLoggedIn] = useState(false);
                const [activeSection, setActiveSection] = useState('casinos');
                const [casinos, setCasinos] = useState([]);
                const [playerTypes, setPlayerTypes] = useState([]);
                const [blogPosts, setBlogPosts] = useState([]);
                const [blogCategories, setBlogCategories] = useState([]);
                const [editingCasino, setEditingCasino] = useState(null);
                const [editingPlayerType, setEditingPlayerType] = useState(null);
                const [editingPost, setEditingPost] = useState(null);
                const [showForm, setShowForm] = useState(false);
                const [loading, setLoading] = useState(true);
                const [stats, setStats] = useState({});
                const [contacts, setContacts] = useState([]);
                
                useEffect(() => {
                    checkAuth();
                }, []);
                
                useEffect(() => {
                    if (isLoggedIn) {
                        loadData();
                    }
                }, [isLoggedIn, activeSection]);
                
                async function checkAuth() {
                    const response = await fetch('/api/admin/auth');
                    setIsLoggedIn(response.ok);
                    setLoading(false);
                }
                
                async function handleLogin(e) {
                    e.preventDefault();
                    const email = e.target.email.value;
                    const password = e.target.password.value;
                    
                    const response = await fetch('/api/admin/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    
                    if (response.ok) {
                        setIsLoggedIn(true);
                    } else {
                        alert('Invalid credentials');
                    }
                }
                
                async function handleLogout() {
                    await fetch('/api/admin/logout', { method: 'POST' });
                    setIsLoggedIn(false);
                }
                
                async function loadData() {
                    setLoading(true);
                    try {
                        if (activeSection === 'dashboard') {
                            const response = await fetch('/api/admin/stats');
                            if (response.ok) {
                                setStats(await response.json());
                            }
                        } else if (activeSection === 'casinos') {
                            const response = await fetch('/api/admin/casinos');
                            if (response.ok) {
                                setCasinos(await response.json());
                            }
                        } else if (activeSection === 'player_types') {
                            const response = await fetch('/api/admin/player-types');
                            if (response.ok) {
                                setPlayerTypes(await response.json());
                            }
                        } else if (activeSection === 'blog') {
                            const [postsRes, catsRes] = await Promise.all([
                                fetch('/api/admin/blog-posts'),
                                fetch('/api/admin/blog-categories')
                            ]);
                            if (postsRes.ok) setBlogPosts(await postsRes.json());
                            if (catsRes.ok) setBlogCategories(await catsRes.json());
                        } else if (activeSection === 'contacts') {
                            const response = await fetch('/api/admin/contacts');
                            if (response.ok) {
                                setContacts(await response.json());
                            }
                        }
                    } finally {
                        setLoading(false);
                    }
                }
                
                async function deleteCasino(id) {
                    if (confirm('Are you sure you want to delete this casino?')) {
                        const response = await fetch(\`/api/casinos/\${id}\`, { method: 'DELETE' });
                        if (response.ok) {
                            loadData();
                        }
                    }
                }
                
                if (loading) {
                    return html\`
                        <div class="min-h-screen flex items-center justify-center">
                            <div class="text-lg">Loading...</div>
                        </div>
                    \`;
                }
                
                if (!isLoggedIn) {
                    return html\`
                        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
                            <div class="bg-white p-8 rounded-lg shadow-md w-96">
                                <h2 class="text-2xl font-bold mb-6">Admin Login</h2>
                                <form onSubmit=\${handleLogin}>
                                    <div class="mb-4">
                                        <label class="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                        <input type="email" name="email" required
                                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />
                                    </div>
                                    <div class="mb-6">
                                        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                        <input type="password" name="password" required
                                            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />
                                    </div>
                                    <button type="submit"
                                        class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    \`;
                }
                
                return html\`
                    <div class="min-h-screen bg-gray-100">
                        <!-- Header -->
                        <div class="bg-white shadow">
                            <div class="px-4 sm:px-6 lg:px-8">
                                <div class="flex justify-between h-16">
                                    <div class="flex items-center">
                                        <h1 class="text-xl font-semibold">Admin Panel</h1>
                                    </div>
                                    <div class="flex items-center">
                                        <button onClick=\${handleLogout}
                                            class="text-gray-500 hover:text-gray-700">
                                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex h-screen bg-gray-100">
                            <!-- Sidebar -->
                            <div class="w-64 bg-gray-800">
                                <nav class="mt-5 px-2">
                                    <a onClick=\${() => setActiveSection('dashboard')}
                                       class="cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md \${activeSection === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">
                                        <i class="fas fa-dashboard mr-3"></i> Dashboard
                                    </a>
                                    <a onClick=\${() => setActiveSection('casinos')}
                                       class="cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md \${activeSection === 'casinos' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">
                                        <i class="fas fa-dice mr-3"></i> Casinos
                                    </a>
                                    <a onClick=\${() => setActiveSection('player_types')}
                                       class="cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md \${activeSection === 'player_types' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">
                                        <i class="fas fa-users mr-3"></i> Player Types
                                    </a>
                                    <a onClick=\${() => setActiveSection('blog')}
                                       class="cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md \${activeSection === 'blog' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">
                                        <i class="fas fa-blog mr-3"></i> Blog
                                    </a>
                                    <a onClick=\${() => setActiveSection('contacts')}
                                       class="cursor-pointer group flex items-center px-2 py-2 text-sm font-medium rounded-md \${activeSection === 'contacts' ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}">
                                        <i class="fas fa-envelope mr-3"></i> Contacts
                                    </a>
                                </nav>
                            </div>
                            
                            <!-- Main Content -->
                            <div class="flex-1 overflow-auto">
                                <div class="p-8">
                                    \${activeSection === 'dashboard' ? html\`
                                        <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
                                        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div class="bg-white p-6 rounded-lg shadow">
                                                <div class="text-2xl font-bold">\${stats.totalCasinos || 0}</div>
                                                <div class="text-gray-600">Total Casinos</div>
                                            </div>
                                            <div class="bg-white p-6 rounded-lg shadow">
                                                <div class="text-2xl font-bold">\${stats.totalPosts || 0}</div>
                                                <div class="text-gray-600">Blog Posts</div>
                                            </div>
                                            <div class="bg-white p-6 rounded-lg shadow">
                                                <div class="text-2xl font-bold">\${stats.totalViews || 0}</div>
                                                <div class="text-gray-600">Total Views</div>
                                            </div>
                                            <div class="bg-white p-6 rounded-lg shadow">
                                                <div class="text-2xl font-bold">\${stats.totalContacts || 0}</div>
                                                <div class="text-gray-600">Contact Forms</div>
                                            </div>
                                        </div>
                                    \` : ''}
                                    
                                    \${activeSection === 'casinos' ? html\`
                                        <div class="flex justify-between items-center mb-6">
                                            <h2 class="text-2xl font-bold">Casinos</h2>
                                            <button onClick=\${() => { setEditingCasino(null); setShowForm(true); }}
                                                class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                                                <i class="fas fa-plus mr-2"></i>Add Casino
                                            </button>
                                        </div>
                                        
                                        \${showForm ? html\`
                                            <\${CasinoForm} 
                                                casino=\${editingCasino}
                                                onSave=\${() => { setShowForm(false); loadData(); }}
                                                onCancel=\${() => { setShowForm(false); setEditingCasino(null); }}
                                            />
                                        \` : html\`
                                            <div class="bg-white shadow rounded-lg">
                                                <table class="min-w-full">
                                                    <thead class="bg-gray-50">
                                                        <tr>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="bg-white divide-y divide-gray-200">
                                                        \${casinos.map(casino => html\`
                                                            <tr>
                                                                <td class="px-6 py-4 whitespace-nowrap">
                                                                    \${casino.logo_url ? html\`
                                                                        <img src=\${casino.logo_url} alt=\${casino.name} 
                                                                            class="h-8 w-12 object-contain" />
                                                                    \` : html\`<span class="text-gray-400">No logo</span>\`}
                                                                </td>
                                                                <td class="px-6 py-4 whitespace-nowrap">
                                                                    <div class="text-sm font-medium text-gray-900">\${casino.name}</div>
                                                                    <div class="text-sm text-gray-500">/casino/\${casino.slug}</div>
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
                                        \`}
                                    \` : ''}
                                    
                                    \${activeSection === 'player_types' ? html\`
                                        <\${PlayerTypesSection}
                                            playerTypes=\${playerTypes}
                                            onRefresh=\${loadData}
                                        />
                                    \` : ''}
                                    
                                    \${activeSection === 'blog' ? html\`
                                        <\${BlogSection}
                                            posts=\${blogPosts}
                                            categories=\${blogCategories}
                                            onRefresh=\${loadData}
                                        />
                                    \` : ''}
                                    
                                    \${activeSection === 'contacts' ? html\`
                                        <\${ContactsSection}
                                            contacts=\${contacts}
                                            onRefresh=\${loadData}
                                        />
                                    \` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                \`;
            }
            
            // Restructured Casino Form Component
            function CasinoForm({ casino, onSave, onCancel }) {
                const [activeTab, setActiveTab] = useState('table');
                const [loading, setLoading] = useState(false);
                const [formData, setFormData] = useState({
                    // Basic info (casinos table)
                    name: '',
                    slug: '',
                    logo_url: '',
                    website_url: '',
                    affiliate_link: '',
                    rating: 4.5,
                    bonus_percentage: 100,
                    is_active: true,
                    sort_order: 0,
                    
                    // Table section fields (casino_info table) - for all languages
                    company_info_en: '',
                    company_info_pt: '',
                    company_info_zh: '',
                    
                    established_year_en: '',
                    established_year_pt: '',
                    established_year_zh: '',
                    
                    licenses_safety_en: '',
                    licenses_safety_pt: '',
                    licenses_safety_zh: '',
                    
                    operating_countries_en: '',
                    operating_countries_pt: '',
                    operating_countries_zh: '',
                    
                    supported_currencies_en: '',
                    supported_currencies_pt: '',
                    supported_currencies_zh: '',
                    
                    supported_languages_en: '',
                    supported_languages_pt: '',
                    supported_languages_zh: '',
                    
                    game_types_en: '',
                    game_types_pt: '',
                    game_types_zh: '',
                    
                    payment_methods_en: '',
                    payment_methods_pt: '',
                    payment_methods_zh: '',
                    
                    mobile_apps_en: '',
                    mobile_apps_pt: '',
                    mobile_apps_zh: '',
                    
                    customer_support_en: '',
                    customer_support_pt: '',
                    customer_support_zh: '',
                    
                    // Detail section fields
                    why_choose_en: '',
                    why_choose_pt: '',
                    why_choose_zh: '',
                    
                    casino_features_en: '',
                    casino_features_pt: '',
                    casino_features_zh: '',
                    
                    licenses_safety_detail_en: '',
                    licenses_safety_detail_pt: '',
                    licenses_safety_detail_zh: '',
                    
                    operating_countries_detail_en: '',
                    operating_countries_detail_pt: '',
                    operating_countries_detail_zh: '',
                    
                    game_variety_detail_en: '',
                    game_variety_detail_pt: '',
                    game_variety_detail_zh: '',
                    
                    sports_betting_features_en: '',
                    sports_betting_features_pt: '',
                    sports_betting_features_zh: '',
                    
                    special_promotions_en: '',
                    special_promotions_pt: '',
                    special_promotions_zh: '',
                    
                    suitable_players_en: '',
                    suitable_players_pt: '',
                    suitable_players_zh: ''
                });

                useEffect(() => {
                    if (casino) {
                        // Load existing casino data
                        loadCasinoData(casino.id);
                    }
                }, [casino]);

                async function loadCasinoData(casinoId) {
                    setLoading(true);
                    try {
                        const response = await fetch(\`/api/admin/casino/\${casinoId}/full\`);
                        if (response.ok) {
                            const data = await response.json();
                            
                            // Map the data to form fields
                            setFormData({
                                ...data,
                                // Map casino_info fields from different languages
                                company_info_en: data.info_en?.company_info || '',
                                company_info_pt: data.info_pt?.company_info || '',
                                company_info_zh: data.info_zh?.company_info || '',
                                
                                established_year_en: data.info_en?.established_year || '',
                                established_year_pt: data.info_pt?.established_year || '',
                                established_year_zh: data.info_zh?.established_year || '',
                                
                                licenses_safety_en: data.info_en?.licenses_safety || '',
                                licenses_safety_pt: data.info_pt?.licenses_safety || '',
                                licenses_safety_zh: data.info_zh?.licenses_safety || '',
                                
                                operating_countries_en: data.info_en?.operating_countries || '',
                                operating_countries_pt: data.info_pt?.operating_countries || '',
                                operating_countries_zh: data.info_zh?.operating_countries || '',
                                
                                supported_currencies_en: data.info_en?.supported_currencies || '',
                                supported_currencies_pt: data.info_pt?.supported_currencies || '',
                                supported_currencies_zh: data.info_zh?.supported_currencies || '',
                                
                                supported_languages_en: data.info_en?.supported_languages || '',
                                supported_languages_pt: data.info_pt?.supported_languages || '',
                                supported_languages_zh: data.info_zh?.supported_languages || '',
                                
                                game_types_en: data.info_en?.game_types || '',
                                game_types_pt: data.info_pt?.game_types || '',
                                game_types_zh: data.info_zh?.game_types || '',
                                
                                payment_methods_en: data.info_en?.payment_methods || '',
                                payment_methods_pt: data.info_pt?.payment_methods || '',
                                payment_methods_zh: data.info_zh?.payment_methods || '',
                                
                                mobile_apps_en: data.info_en?.mobile_apps || '',
                                mobile_apps_pt: data.info_pt?.mobile_apps || '',
                                mobile_apps_zh: data.info_zh?.mobile_apps || '',
                                
                                customer_support_en: data.info_en?.customer_support || '',
                                customer_support_pt: data.info_pt?.customer_support || '',
                                customer_support_zh: data.info_zh?.customer_support || '',
                                
                                // Detail fields
                                why_choose_en: data.info_en?.why_choose || '',
                                why_choose_pt: data.info_pt?.why_choose || '',
                                why_choose_zh: data.info_zh?.why_choose || '',
                                
                                casino_features_en: data.info_en?.casino_features || '',
                                casino_features_pt: data.info_pt?.casino_features || '',
                                casino_features_zh: data.info_zh?.casino_features || '',
                                
                                licenses_safety_detail_en: data.info_en?.licenses_safety_detail || '',
                                licenses_safety_detail_pt: data.info_pt?.licenses_safety_detail || '',
                                licenses_safety_detail_zh: data.info_zh?.licenses_safety_detail || '',
                                
                                operating_countries_detail_en: data.info_en?.operating_countries_detail || '',
                                operating_countries_detail_pt: data.info_pt?.operating_countries_detail || '',
                                operating_countries_detail_zh: data.info_zh?.operating_countries_detail || '',
                                
                                game_variety_detail_en: data.info_en?.game_variety_detail || '',
                                game_variety_detail_pt: data.info_pt?.game_variety_detail || '',
                                game_variety_detail_zh: data.info_zh?.game_variety_detail || '',
                                
                                sports_betting_features_en: data.info_en?.sports_betting_features || '',
                                sports_betting_features_pt: data.info_pt?.sports_betting_features || '',
                                sports_betting_features_zh: data.info_zh?.sports_betting_features || '',
                                
                                special_promotions_en: data.info_en?.special_promotions || '',
                                special_promotions_pt: data.info_pt?.special_promotions || '',
                                special_promotions_zh: data.info_zh?.special_promotions || '',
                                
                                suitable_players_en: data.info_en?.suitable_players || '',
                                suitable_players_pt: data.info_pt?.suitable_players || '',
                                suitable_players_zh: data.info_zh?.suitable_players || ''
                            });
                        }
                    } finally {
                        setLoading(false);
                    }
                }

                async function handleSubmit(e) {
                    e.preventDefault();
                    setLoading(true);
                    
                    try {
                        const method = casino ? 'PUT' : 'POST';
                        const url = casino ? \`/api/casinos/\${casino.id}\` : '/api/casinos';
                        
                        // Prepare casino info for each language
                        const casinoInfo = {
                            en: {
                                company_info: formData.company_info_en,
                                established_year: formData.established_year_en,
                                licenses_safety: formData.licenses_safety_en,
                                operating_countries: formData.operating_countries_en,
                                supported_currencies: formData.supported_currencies_en,
                                supported_languages: formData.supported_languages_en,
                                game_types: formData.game_types_en,
                                payment_methods: formData.payment_methods_en,
                                mobile_apps: formData.mobile_apps_en,
                                customer_support: formData.customer_support_en,
                                why_choose: formData.why_choose_en,
                                casino_features: formData.casino_features_en,
                                licenses_safety_detail: formData.licenses_safety_detail_en,
                                operating_countries_detail: formData.operating_countries_detail_en,
                                game_variety_detail: formData.game_variety_detail_en,
                                sports_betting_features: formData.sports_betting_features_en,
                                special_promotions: formData.special_promotions_en,
                                suitable_players: formData.suitable_players_en
                            },
                            pt: {
                                company_info: formData.company_info_pt,
                                established_year: formData.established_year_pt,
                                licenses_safety: formData.licenses_safety_pt,
                                operating_countries: formData.operating_countries_pt,
                                supported_currencies: formData.supported_currencies_pt,
                                supported_languages: formData.supported_languages_pt,
                                game_types: formData.game_types_pt,
                                payment_methods: formData.payment_methods_pt,
                                mobile_apps: formData.mobile_apps_pt,
                                customer_support: formData.customer_support_pt,
                                why_choose: formData.why_choose_pt,
                                casino_features: formData.casino_features_pt,
                                licenses_safety_detail: formData.licenses_safety_detail_pt,
                                operating_countries_detail: formData.operating_countries_detail_pt,
                                game_variety_detail: formData.game_variety_detail_pt,
                                sports_betting_features: formData.sports_betting_features_pt,
                                special_promotions: formData.special_promotions_pt,
                                suitable_players: formData.suitable_players_pt
                            },
                            zh: {
                                company_info: formData.company_info_zh,
                                established_year: formData.established_year_zh,
                                licenses_safety: formData.licenses_safety_zh,
                                operating_countries: formData.operating_countries_zh,
                                supported_currencies: formData.supported_currencies_zh,
                                supported_languages: formData.supported_languages_zh,
                                game_types: formData.game_types_zh,
                                payment_methods: formData.payment_methods_zh,
                                mobile_apps: formData.mobile_apps_zh,
                                customer_support: formData.customer_support_zh,
                                why_choose: formData.why_choose_zh,
                                casino_features: formData.casino_features_zh,
                                licenses_safety_detail: formData.licenses_safety_detail_zh,
                                operating_countries_detail: formData.operating_countries_detail_zh,
                                game_variety_detail: formData.game_variety_detail_zh,
                                sports_betting_features: formData.sports_betting_features_zh,
                                special_promotions: formData.special_promotions_zh,
                                suitable_players: formData.suitable_players_zh
                            }
                        };
                        
                        const response = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: formData.name,
                                slug: formData.slug,
                                logo_url: formData.logo_url,
                                website_url: formData.website_url,
                                affiliate_link: formData.affiliate_link,
                                rating: formData.rating,
                                bonus_percentage: formData.bonus_percentage,
                                is_active: formData.is_active,
                                sort_order: formData.sort_order,
                                casino_info: casinoInfo
                            })
                        });
                        
                        if (response.ok) {
                            alert(casino ? 'Casino updated successfully!' : 'Casino created successfully!');
                            onSave();
                        } else {
                            alert('Error saving casino. Please try again.');
                        }
                    } finally {
                        setLoading(false);
                    }
                }

                if (loading) {
                    return html\`<div class="text-center py-4">Loading...</div>\`;
                }

                return html\`
                    <div class="bg-white rounded-lg p-6 border-2 border-gray-200">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold">\${casino ? '編輯娛樂城 / Edit Casino' : '新增娛樂城 / Add New Casino'}</h3>
                            <button onClick=\${onCancel}
                                class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <!-- Tabs -->
                        <div class="border-b mb-4">
                            <nav class="flex space-x-4">
                                <button type="button"
                                    class="py-2 px-1 border-b-2 font-medium text-sm \${activeTab === 'table' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                                    onClick=\${() => setActiveTab('table')}>
                                    表格資料 / Table Data
                                </button>
                                <button type="button"
                                    class="py-2 px-1 border-b-2 font-medium text-sm \${activeTab === 'detail' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                                    onClick=\${() => setActiveTab('detail')}>
                                    詳細內容 / Detail Content
                                </button>
                            </nav>
                        </div>
                        
                        <form onSubmit=\${handleSubmit}>
                            <!-- Table Data Tab -->
                            \${activeTab === 'table' ? html\`
                                <div class="space-y-6">
                                    <!-- Basic Casino Info -->
                                    <div class="bg-gray-50 p-4 rounded-lg">
                                        <h3 class="font-medium text-gray-900 mb-3">基本資訊 / Basic Info</h3>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">娛樂城名稱 / Casino Name *</label>
                                                <input type="text" required
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData.name}
                                                    onChange=\${e => setFormData({...formData, name: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">營運公司 / Operating Company</label>
                                                <div class="space-y-2">
                                                    <input type="text" placeholder="English"
                                                        class="w-full px-3 py-2 border rounded"
                                                        value=\${formData.company_info_en}
                                                        onChange=\${e => setFormData({...formData, company_info_en: e.target.value})} />
                                                    <input type="text" placeholder="Português"
                                                        class="w-full px-3 py-2 border rounded"
                                                        value=\${formData.company_info_pt}
                                                        onChange=\${e => setFormData({...formData, company_info_pt: e.target.value})} />
                                                    <input type="text" placeholder="中文"
                                                        class="w-full px-3 py-2 border rounded"
                                                        value=\${formData.company_info_zh}
                                                        onChange=\${e => setFormData({...formData, company_info_zh: e.target.value})} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Table Fields -->
                                    <div class="bg-gray-50 p-4 rounded-lg">
                                        <h3 class="font-medium text-gray-900 mb-3">表格顯示資料 / Table Display Data</h3>
                                        
                                        <!-- Established Year -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">成立時間 / Established Year</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., 2020)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.established_year_en}
                                                    onChange=\${e => setFormData({...formData, established_year_en: e.target.value})} />
                                                <input type="text" placeholder="Português (e.g., 2020)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.established_year_pt}
                                                    onChange=\${e => setFormData({...formData, established_year_pt: e.target.value})} />
                                                <input type="text" placeholder="中文 (e.g., 2020年)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.established_year_zh}
                                                    onChange=\${e => setFormData({...formData, established_year_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Licenses & Safety -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">國際牌照與網站安全 / Licenses & Safety</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.licenses_safety_en}
                                                    onChange=\${e => setFormData({...formData, licenses_safety_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.licenses_safety_pt}
                                                    onChange=\${e => setFormData({...formData, licenses_safety_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.licenses_safety_zh}
                                                    onChange=\${e => setFormData({...formData, licenses_safety_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Operating Countries -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">經營國家 / Operating Countries</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., Brazil, Portugal)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.operating_countries_en}
                                                    onChange=\${e => setFormData({...formData, operating_countries_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.operating_countries_pt}
                                                    onChange=\${e => setFormData({...formData, operating_countries_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.operating_countries_zh}
                                                    onChange=\${e => setFormData({...formData, operating_countries_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Supported Currencies -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">支援幣別 / Supported Currencies</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., BRL, USD, EUR)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.supported_currencies_en}
                                                    onChange=\${e => setFormData({...formData, supported_currencies_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.supported_currencies_pt}
                                                    onChange=\${e => setFormData({...formData, supported_currencies_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.supported_currencies_zh}
                                                    onChange=\${e => setFormData({...formData, supported_currencies_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Supported Languages -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">支援語系 / Supported Languages</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., Portuguese, English)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.supported_languages_en}
                                                    onChange=\${e => setFormData({...formData, supported_languages_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.supported_languages_pt}
                                                    onChange=\${e => setFormData({...formData, supported_languages_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.supported_languages_zh}
                                                    onChange=\${e => setFormData({...formData, supported_languages_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Game Types -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">遊戲類型 / Game Types</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.game_types_en}
                                                    onChange=\${e => setFormData({...formData, game_types_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.game_types_pt}
                                                    onChange=\${e => setFormData({...formData, game_types_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.game_types_zh}
                                                    onChange=\${e => setFormData({...formData, game_types_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Payment Methods (Brazil) -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">巴西支付方式 / Payment Methods (Brazil)</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., PIX, Boleto)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.payment_methods_en}
                                                    onChange=\${e => setFormData({...formData, payment_methods_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.payment_methods_pt}
                                                    onChange=\${e => setFormData({...formData, payment_methods_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.payment_methods_zh}
                                                    onChange=\${e => setFormData({...formData, payment_methods_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Mobile Apps -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">是否有APP / Mobile Apps</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., iOS, Android)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.mobile_apps_en}
                                                    onChange=\${e => setFormData({...formData, mobile_apps_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.mobile_apps_pt}
                                                    onChange=\${e => setFormData({...formData, mobile_apps_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.mobile_apps_zh}
                                                    onChange=\${e => setFormData({...formData, mobile_apps_zh: e.target.value})} />
                                            </div>
                                        </div>

                                        <!-- Customer Support -->
                                        <div class="mb-4">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">客服支援 / Customer Support</label>
                                            <div class="grid grid-cols-3 gap-2">
                                                <input type="text" placeholder="English (e.g., 24/7 Live Chat)"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.customer_support_en}
                                                    onChange=\${e => setFormData({...formData, customer_support_en: e.target.value})} />
                                                <input type="text" placeholder="Português"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.customer_support_pt}
                                                    onChange=\${e => setFormData({...formData, customer_support_pt: e.target.value})} />
                                                <input type="text" placeholder="中文"
                                                    class="px-3 py-2 border rounded"
                                                    value=\${formData.customer_support_zh}
                                                    onChange=\${e => setFormData({...formData, customer_support_zh: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>

                                    <!-- URLs and Settings -->
                                    <div class="bg-gray-50 p-4 rounded-lg">
                                        <h3 class="font-medium text-gray-900 mb-3">連結與設定 / Links & Settings</h3>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
                                                <input type="text" required
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData.slug}
                                                    onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                                <input type="url"
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData.logo_url}
                                                    onChange=\${e => setFormData({...formData, logo_url: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                                <input type="url"
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData.website_url}
                                                    onChange=\${e => setFormData({...formData, website_url: e.target.value})} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">Affiliate Link *</label>
                                                <input type="url" required
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData.affiliate_link}
                                                    onChange=\${e => setFormData({...formData, affiliate_link: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            \` : ''}
                            
                            <!-- Detail Content Tab -->
                            \${activeTab === 'detail' ? html\`
                                <div class="space-y-6">
                                    <div class="bg-yellow-50 p-3 rounded">
                                        <p class="text-sm text-yellow-800">這些詳細內容將顯示在娛樂城詳情頁面的可展開區塊中。</p>
                                    </div>
                                    
                                    <!-- Detail Fields -->
                                    \${[
                                        { field: 'why_choose', label: '為何選擇這間娛樂城 / Why Choose This Casino' },
                                        { field: 'casino_features', label: '娛樂城特色 / Casino Features' },
                                        { field: 'licenses_safety_detail', label: '國際牌照與網站安全(詳細) / Licenses & Safety (Detail)' },
                                        { field: 'operating_countries_detail', label: '經營國家(詳細) / Operating Countries (Detail)' },
                                        { field: 'game_variety_detail', label: '遊戲種類(詳細) / Game Variety (Detail)' },
                                        { field: 'sports_betting_features', label: '體育投注功能 / Sports Betting Features' },
                                        { field: 'special_promotions', label: '特別優惠活動 / Special Promotions' },
                                        { field: 'suitable_players', label: '適合玩家 / Suitable for Players' }
                                    ].map(({ field, label }) => html\`
                                        <div class="bg-gray-50 p-4 rounded-lg">
                                            <label class="block text-sm font-medium text-gray-700 mb-2">\${label}</label>
                                            <div class="space-y-2">
                                                <textarea placeholder="English" rows="3"
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData[field + '_en']}
                                                    onChange=\${e => setFormData({...formData, [field + '_en']: e.target.value})}></textarea>
                                                <textarea placeholder="Português" rows="3"
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData[field + '_pt']}
                                                    onChange=\${e => setFormData({...formData, [field + '_pt']: e.target.value})}></textarea>
                                                <textarea placeholder="中文" rows="3"
                                                    class="w-full px-3 py-2 border rounded"
                                                    value=\${formData[field + '_zh']}
                                                    onChange=\${e => setFormData({...formData, [field + '_zh']: e.target.value})}></textarea>
                                            </div>
                                        </div>
                                    \`)}
                                </div>
                            \` : ''}
                            
                            <!-- Submit Buttons -->
                            <div class="flex justify-end space-x-2 mt-6">
                                <button type="button"
                                    onClick=\${onCancel}
                                    class="px-4 py-2 border rounded hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled=\${loading}
                                    class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50">
                                    \${loading ? 'Saving...' : casino ? 'Update Casino' : 'Create Casino'}
                                </button>
                            </div>
                        </form>
                    </div>
                \`;
            }
            
            // Other components would continue here...
            function PlayerTypesSection({ playerTypes, onRefresh }) {
                return html\`<div>Player Types Section</div>\`;
            }
            
            function BlogSection({ posts, categories, onRefresh }) {
                return html\`<div>Blog Section</div>\`;
            }
            
            function ContactsSection({ contacts, onRefresh }) {
                return html\`<div>Contacts Section</div>\`;
            }
            
            render(html\`<\${AdminApp} />\`, document.body);
        </script>
    </head>
    <body>
        <!-- App will be rendered here by Preact -->
    </body>
    </html>
  `;
}