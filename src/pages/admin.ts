// Admin panel with integrated casino form

export function renderAdminPage(): string {
  return `
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
                const [editingCasino, setEditingCasino] = useState(null);
                const [showForm, setShowForm] = useState(false);
                const [loading, setLoading] = useState(true);
                
                useEffect(() => {
                    checkAuth();
                }, []);
                
                useEffect(() => {
                    if (isLoggedIn && activeSection === 'casinos') {
                        loadCasinos();
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
                
                async function loadCasinos() {
                    try {
                        const response = await fetch('/api/admin/casinos');
                        if (response.ok) {
                            const data = await response.json();
                            setCasinos(data);
                        }
                    } catch (error) {
                        console.error('Error loading casinos:', error);
                    }
                }
                
                async function deleteCasino(id) {
                    if (confirm('確定要刪除這個娛樂城嗎？')) {
                        const response = await fetch(\`/api/admin/casino/\${id}\`, { 
                            method: 'DELETE' 
                        });
                        if (response.ok) {
                            loadCasinos();
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
                                        <button onClick=\${() => setIsLoggedIn(false)}
                                            class="text-gray-500 hover:text-gray-700">
                                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-8">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold">娛樂城管理</h2>
                                <button onClick=\${() => { setEditingCasino(null); setShowForm(true); }}
                                    class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                                    <i class="fas fa-plus mr-2"></i>新增娛樂城
                                </button>
                            </div>
                            
                            \${showForm ? html\`
                                <\${CasinoForm} 
                                    casino=\${editingCasino}
                                    onSave=\${() => { 
                                        setShowForm(false); 
                                        setEditingCasino(null);
                                        loadCasinos(); 
                                    }}
                                    onCancel=\${() => { 
                                        setShowForm(false); 
                                        setEditingCasino(null); 
                                    }}
                                />
                            \` : html\`
                                <div class="bg-white shadow rounded-lg overflow-hidden">
                                    <table class="min-w-full">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名稱</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            \${casinos.map(casino => html\`
                                                <tr>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        \${casino.logo_url ? html\`
                                                            <img src=\${casino.logo_url} alt=\${casino.name} 
                                                                class="h-10 w-16 object-contain" />
                                                        \` : html\`<span class="text-gray-400">無圖片</span>\`}
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <div class="text-sm font-medium text-gray-900">\${casino.name}</div>
                                                        <div class="text-sm text-gray-500">/casino/\${casino.slug}</div>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap">
                                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            \${casino.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                            \${casino.is_active ? '啟用' : '停用'}
                                                        </span>
                                                    </td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                        <button onClick=\${() => { setEditingCasino(casino); setShowForm(true); }}
                                                            class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                            <i class="fas fa-edit"></i> 編輯
                                                        </button>
                                                        <button onClick=\${() => deleteCasino(casino.id)}
                                                            class="text-red-600 hover:text-red-900">
                                                            <i class="fas fa-trash"></i> 刪除
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
            
            // Integrated Casino Form with proper database mapping
            function CasinoForm({ casino, onSave, onCancel }) {
                const [activeTab, setActiveTab] = useState('basic');
                const [activeLang, setActiveLang] = useState('en');
                const [loading, setLoading] = useState(false);
                const [formData, setFormData] = useState({
                    // Basic info
                    name: '',
                    slug: '',
                    logo_url: '',
                    website_url: '',
                    affiliate_link: '',
                    rating: 4.5,
                    bonus_percentage: 100,
                    is_active: true,
                    sort_order: 0,
                    
                    // Casino info for each language
                    info: {
                        en: {
                            company_info: '',
                            established_year: '',
                            licenses_safety: '',
                            operating_countries: '',
                            supported_currencies: '',
                            supported_languages: '',
                            game_types: '',
                            payment_methods: '',
                            mobile_apps: '',
                            customer_support: '',
                            why_choose: '',
                            casino_features: '',
                            licenses_safety_detail: '',
                            operating_countries_detail: '',
                            game_variety_detail: '',
                            sports_betting_features: '',
                            special_promotions: '',
                            suitable_players: ''
                        },
                        pt: {
                            company_info: '',
                            established_year: '',
                            licenses_safety: '',
                            operating_countries: '',
                            supported_currencies: '',
                            supported_languages: '',
                            game_types: '',
                            payment_methods: '',
                            mobile_apps: '',
                            customer_support: '',
                            why_choose: '',
                            casino_features: '',
                            licenses_safety_detail: '',
                            operating_countries_detail: '',
                            game_variety_detail: '',
                            sports_betting_features: '',
                            special_promotions: '',
                            suitable_players: ''
                        },
                        zh: {
                            company_info: '',
                            established_year: '',
                            licenses_safety: '',
                            operating_countries: '',
                            supported_currencies: '',
                            supported_languages: '',
                            game_types: '',
                            payment_methods: '',
                            mobile_apps: '',
                            customer_support: '',
                            why_choose: '',
                            casino_features: '',
                            licenses_safety_detail: '',
                            operating_countries_detail: '',
                            game_variety_detail: '',
                            sports_betting_features: '',
                            special_promotions: '',
                            suitable_players: ''
                        }
                    }
                });

                useEffect(() => {
                    if (casino && casino.id) {
                        loadCasinoData(casino.id);
                    }
                }, [casino]);

                async function loadCasinoData(casinoId) {
                    setLoading(true);
                    try {
                        const response = await fetch(\`/api/admin/casino/\${casinoId}/full\`);
                        if (response.ok) {
                            const data = await response.json();
                            setFormData({
                                name: data.name || '',
                                slug: data.slug || '',
                                logo_url: data.logo_url || '',
                                website_url: data.website_url || '',
                                affiliate_link: data.affiliate_link || '',
                                rating: data.rating || 4.5,
                                bonus_percentage: data.bonus_percentage || 100,
                                is_active: data.is_active !== false,
                                sort_order: data.sort_order || 0,
                                info: {
                                    en: data.info_en || formData.info.en,
                                    pt: data.info_pt || formData.info.pt,
                                    zh: data.info_zh || formData.info.zh
                                }
                            });
                        }
                    } catch (error) {
                        console.error('Error loading casino:', error);
                    } finally {
                        setLoading(false);
                    }
                }

                const updateLangField = (lang, field, value) => {
                    setFormData(prev => ({
                        ...prev,
                        info: {
                            ...prev.info,
                            [lang]: {
                                ...prev.info[lang],
                                [field]: value
                            }
                        }
                    }));
                };

                async function handleSubmit(e) {
                    e.preventDefault();
                    setLoading(true);
                    
                    try {
                        const method = casino?.id ? 'PUT' : 'POST';
                        const url = casino?.id ? \`/api/admin/casino/\${casino.id}\` : '/api/admin/casino';
                        
                        const response = await fetch(url, {
                            method,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                        
                        if (response.ok) {
                            alert(casino ? '娛樂城更新成功！' : '娛樂城創建成功！');
                            onSave();
                        } else {
                            const error = await response.text();
                            console.error('Save error:', error);
                            alert('保存失敗，請重試。');
                        }
                    } catch (error) {
                        console.error('Save error:', error);
                        alert('保存失敗，請重試。');
                    } finally {
                        setLoading(false);
                    }
                }

                const langLabels = {
                    en: { flag: '🇬🇧', name: 'English' },
                    pt: { flag: '🇧🇷', name: 'Português' },
                    zh: { flag: '🇨🇳', name: '中文' }
                };

                const tableFields = [
                    { key: 'company_info', label: { zh: '營運公司', en: 'Operating Company', pt: 'Empresa' } },
                    { key: 'established_year', label: { zh: '成立時間', en: 'Established', pt: 'Fundação' } },
                    { key: 'licenses_safety', label: { zh: '國際牌照與網站安全', en: 'Licenses & Safety', pt: 'Licenças' } },
                    { key: 'operating_countries', label: { zh: '經營國家', en: 'Countries', pt: 'Países' } },
                    { key: 'supported_currencies', label: { zh: '支援幣別', en: 'Currencies', pt: 'Moedas' } },
                    { key: 'supported_languages', label: { zh: '支援語系', en: 'Languages', pt: 'Idiomas' } },
                    { key: 'game_types', label: { zh: '遊戲類型', en: 'Games', pt: 'Jogos' } },
                    { key: 'payment_methods', label: { zh: '支付方式', en: 'Payments', pt: 'Pagamentos' } },
                    { key: 'mobile_apps', label: { zh: '是否有APP', en: 'Mobile Apps', pt: 'Apps' } },
                    { key: 'customer_support', label: { zh: '客服支援', en: 'Support', pt: 'Suporte' } }
                ];

                const detailFields = [
                    { key: 'why_choose', label: { zh: '為何選擇', en: 'Why Choose', pt: 'Por Que Escolher' } },
                    { key: 'casino_features', label: { zh: '娛樂城特色', en: 'Features', pt: 'Características' } },
                    { key: 'licenses_safety_detail', label: { zh: '牌照詳細', en: 'License Details', pt: 'Detalhes' } },
                    { key: 'operating_countries_detail', label: { zh: '國家詳細', en: 'Countries Detail', pt: 'Países' } },
                    { key: 'game_variety_detail', label: { zh: '遊戲種類', en: 'Game Variety', pt: 'Variedade' } },
                    { key: 'sports_betting_features', label: { zh: '體育投注', en: 'Sports Betting', pt: 'Apostas' } },
                    { key: 'special_promotions', label: { zh: '特別優惠', en: 'Promotions', pt: 'Promoções' } },
                    { key: 'suitable_players', label: { zh: '適合玩家', en: 'Suitable For', pt: 'Adequado Para' } }
                ];

                return html\`
                    <div class="bg-white rounded-lg shadow-xl p-6">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">\${casino?.id ? '編輯娛樂城' : '新增娛樂城'}</h2>
                            <button onClick=\${onCancel} class="text-gray-500 hover:text-gray-700">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit=\${handleSubmit}>
                            <!-- Tabs -->
                            <div class="border-b mb-6">
                                <nav class="flex space-x-6">
                                    <button type="button"
                                        onClick=\${() => setActiveTab('basic')}
                                        class="py-3 px-1 border-b-2 font-medium \${
                                            activeTab === 'basic' 
                                            ? 'border-purple-500 text-purple-600' 
                                            : 'border-transparent text-gray-500'
                                        }">
                                        基本資訊
                                    </button>
                                    <button type="button"
                                        onClick=\${() => setActiveTab('table')}
                                        class="py-3 px-1 border-b-2 font-medium \${
                                            activeTab === 'table' 
                                            ? 'border-purple-500 text-purple-600' 
                                            : 'border-transparent text-gray-500'
                                        }">
                                        資訊表格
                                    </button>
                                    <button type="button"
                                        onClick=\${() => setActiveTab('detail')}
                                        class="py-3 px-1 border-b-2 font-medium \${
                                            activeTab === 'detail' 
                                            ? 'border-purple-500 text-purple-600' 
                                            : 'border-transparent text-gray-500'
                                        }">
                                        詳細說明
                                    </button>
                                </nav>
                            </div>

                            <!-- Basic Info Tab -->
                            \${activeTab === 'basic' ? html\`
                                <div class="space-y-4">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">名稱 *</label>
                                            <input type="text" required
                                                class="w-full px-3 py-2 border rounded-lg"
                                                value=\${formData.name}
                                                onChange=\${e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                                            <input type="text" required
                                                class="w-full px-3 py-2 border rounded-lg"
                                                value=\${formData.slug}
                                                onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                        <input type="url"
                                            class="w-full px-3 py-2 border rounded-lg"
                                            value=\${formData.logo_url}
                                            onChange=\${e => setFormData({...formData, logo_url: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">推廣連結 *</label>
                                        <input type="url" required
                                            class="w-full px-3 py-2 border rounded-lg"
                                            value=\${formData.affiliate_link}
                                            onChange=\${e => setFormData({...formData, affiliate_link: e.target.value})} />
                                    </div>
                                </div>
                            \` : ''}

                            <!-- Table Data Tab -->
                            \${activeTab === 'table' ? html\`
                                <div>
                                    <!-- Language Tabs -->
                                    <div class="bg-gray-100 p-1 rounded-lg mb-4">
                                        <div class="flex">
                                            \${Object.entries(langLabels).map(([lang, label]) => html\`
                                                <button type="button"
                                                    onClick=\${() => setActiveLang(lang)}
                                                    class="flex-1 py-2 px-4 rounded-lg \${
                                                        activeLang === lang
                                                        ? 'bg-white text-purple-600 shadow'
                                                        : 'text-gray-600'
                                                    }">
                                                    <span class="text-lg mr-2">\${label.flag}</span>
                                                    \${label.name}
                                                </button>
                                            \`)}
                                        </div>
                                    </div>

                                    <!-- Table Fields -->
                                    <div class="space-y-3">
                                        \${tableFields.map(field => html\`
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${field.label[activeLang]}
                                                </label>
                                                <input type="text"
                                                    class="w-full px-3 py-2 border rounded-lg"
                                                    value=\${formData.info[activeLang][field.key] || ''}
                                                    onChange=\${e => updateLangField(activeLang, field.key, e.target.value)} />
                                            </div>
                                        \`)}
                                    </div>
                                </div>
                            \` : ''}

                            <!-- Detail Content Tab -->
                            \${activeTab === 'detail' ? html\`
                                <div>
                                    <!-- Language Tabs -->
                                    <div class="bg-gray-100 p-1 rounded-lg mb-4">
                                        <div class="flex">
                                            \${Object.entries(langLabels).map(([lang, label]) => html\`
                                                <button type="button"
                                                    onClick=\${() => setActiveLang(lang)}
                                                    class="flex-1 py-2 px-4 rounded-lg \${
                                                        activeLang === lang
                                                        ? 'bg-white text-purple-600 shadow'
                                                        : 'text-gray-600'
                                                    }">
                                                    <span class="text-lg mr-2">\${label.flag}</span>
                                                    \${label.name}
                                                </button>
                                            \`)}
                                        </div>
                                    </div>

                                    <!-- Detail Fields -->
                                    <div class="space-y-4">
                                        \${detailFields.map(field => html\`
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${field.label[activeLang]}
                                                </label>
                                                <textarea rows="4"
                                                    class="w-full px-3 py-2 border rounded-lg"
                                                    value=\${formData.info[activeLang][field.key] || ''}
                                                    onChange=\${e => updateLangField(activeLang, field.key, e.target.value)}></textarea>
                                            </div>
                                        \`)}
                                    </div>
                                </div>
                            \` : ''}

                            <!-- Submit Buttons -->
                            <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
                                <button type="button"
                                    onClick=\${onCancel}
                                    class="px-6 py-2 border rounded-lg hover:bg-gray-50">
                                    取消
                                </button>
                                <button type="submit" disabled=\${loading}
                                    class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                                    \${loading ? '保存中...' : '保存'}
                                </button>
                            </div>
                        </form>
                    </div>
                \`;
            }
            
            render(html\`<\${AdminApp} />\`, document.body);
        </script>
    </head>
    <body>
        <!-- App will be rendered here -->
    </body>
    </html>
  `;
}