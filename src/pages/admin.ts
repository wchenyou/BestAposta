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
                // Don't set Content-Type for FormData - browser will set it with boundary
                const isFormData = options.body instanceof FormData;
                
                const headers = {
                    'Authorization': authToken ? 'Bearer ' + authToken : '',
                    ...options.headers
                };
                
                // Only add Content-Type if not FormData and not already set
                if (!isFormData && !options.headers?.['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
                
                const res = await fetch(API_BASE + url, {
                    ...options,
                    headers
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
                
                async function saveCasino(formData) {
                    // The CasinoForm now handles saving internally
                    await loadCasinos();
                    setShowForm(false);
                    setEditingCasino(null);
                }
                
                async function deleteCasino(id) {
                    if (confirm('Are you sure you want to delete this casino?')) {
                        try {
                            const res = await apiCall('/admin/casino/' + id, { method: 'DELETE' });
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
                                                        <img src="\${casino.logo_url}" alt="\${casino.name}" class="h-10 w-16 mr-3 object-contain border rounded" 
                                                             onerror="this.style.display='none'" />
                                                    \` : html\`
                                                        <div class="h-10 w-16 mr-3 bg-gray-200 rounded flex items-center justify-center">
                                                            <i class="fas fa-image text-gray-400"></i>
                                                        </div>
                                                    \`}
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
                // Initialize form with proper structure
                const initFormData = () => {
                    if (casino && casino.id) {
                        return {
                            id: casino.id,
                            name: casino.name || '',
                            slug: casino.slug || '',
                            logo_url: casino.logo_url || '',
                            website_url: casino.website_url || '',
                            affiliate_link: casino.affiliate_link || '',
                            rating: casino.rating || 4.5,
                            bonus_percentage: casino.bonus_percentage || 100,
                            sort_order: casino.sort_order || 0,
                            is_active: casino.is_active !== false,
                            // Casino info for each language
                            info: {
                                en: casino.info_en || {},
                                pt: casino.info_pt || {},
                                zh: casino.info_zh || {}
                            }
                        };
                    }
                    return {
                        name: '',
                        slug: '',
                        logo_url: '',
                        website_url: '',
                        affiliate_link: '',
                        rating: 4.5,
                        bonus_percentage: 100,
                        sort_order: 0,
                        is_active: true,
                        info: {
                            en: {},
                            pt: {},
                            zh: {}
                        }
                    };
                };
                
                const [formData, setFormData] = useState(initFormData());
                const [loading, setLoading] = useState(false);
                
                // Load full casino data if editing
                useEffect(() => {
                    if (casino && casino.id && !casino.info_en) {
                        loadFullCasinoData();
                    }
                }, [casino]);
                
                async function loadFullCasinoData() {
                    setLoading(true);
                    try {
                        const res = await apiCall('/admin/casino/' + casino.id + '/full');
                        if (res.ok) {
                            const data = await res.json();
                            setFormData({
                                id: data.id,
                                name: data.name || '',
                                slug: data.slug || '',
                                logo_url: data.logo_url || '',
                                website_url: data.website_url || '',
                                affiliate_link: data.affiliate_link || '',
                                rating: data.rating || 4.5,
                                bonus_percentage: data.bonus_percentage || 100,
                                sort_order: data.sort_order || 0,
                                is_active: data.is_active !== false,
                                info: {
                                    en: data.info_en || {},
                                    pt: data.info_pt || {},
                                    zh: data.info_zh || {}
                                }
                            });
                        }
                    } catch (err) {
                        console.error('Failed to load casino data:', err);
                    }
                    setLoading(false);
                }
                
                // Helper to update nested info fields
                const updateInfoField = (lang, field, value) => {
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
                
                const [activeTab, setActiveTab] = useState('basic');
                const [activeDetailTab, setActiveDetailTab] = useState('en');
                
                const handleSubmit = async (e) => {
                    e.preventDefault();
                    const url = formData.id ? '/admin/casino/' + formData.id : '/admin/casino';
                    const method = formData.id ? 'PUT' : 'POST';
                    
                    try {
                        const res = await apiCall(url, {
                            method,
                            body: JSON.stringify(formData)
                        });
                        
                        if (res.ok) {
                            onSave(formData);
                        } else {
                            alert('Failed to save casino');
                        }
                    } catch (err) {
                        console.error('Failed to save casino:', err);
                        alert('Error saving casino');
                    }
                };
                
                if (loading) {
                    return html\`<div class="text-center py-8">Loading casino data...</div>\`;
                }
                
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
                                    class="py-2 px-1 border-b-2 font-medium text-sm \${activeTab === 'table-info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                                    onClick=\${() => setActiveTab('table-info')}>
                                    Table Info
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
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Casino Logo</label>
                                            <div class="space-y-2">
                                                <div class="flex items-center space-x-2">
                                                    <input type="url" class="flex-1 px-3 py-2 border rounded"
                                                        placeholder="https://example.com/logo.png"
                                                        value=\${formData.logo_url}
                                                        onChange=\${e => setFormData({...formData, logo_url: e.target.value})} />
                                                    <label class="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
                                                        <i class="fas fa-upload mr-1"></i> Upload
                                                        <input type="file" 
                                                            accept="image/*"
                                                            class="hidden"
                                                            onChange=\${async (e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    // Check file size
                                                                    if (file.size > 10 * 1024 * 1024) {
                                                                        alert('File size too large. Maximum 10MB allowed.');
                                                                        return;
                                                                    }
                                                                    
                                                                    // Show loading state
                                                                    const originalUrl = formData.logo_url;
                                                                    setFormData({...formData, logo_url: 'uploading...'});
                                                                    
                                                                    try {
                                                                        // Create FormData for upload
                                                                        const uploadData = new FormData();
                                                                        uploadData.append('image', file);
                                                                        
                                                                        // Try local upload first (stores in your own database)
                                                                        let res = await apiCall('/admin/upload-local', {
                                                                            method: 'POST',
                                                                            body: uploadData,
                                                                            headers: {} // Let browser set multipart headers
                                                                        });
                                                                        
                                                                        // If local storage fails (file too large), try R2
                                                                        if (!res.ok && file.size > 2 * 1024 * 1024) {
                                                                            res = await apiCall('/admin/upload-r2', {
                                                                                method: 'POST',
                                                                                body: uploadData,
                                                                                headers: {}
                                                                            });
                                                                        }
                                                                        
                                                                        // If R2 not configured, fall back to external service
                                                                        if (!res.ok) {
                                                                            res = await apiCall('/admin/upload-image', {
                                                                                method: 'POST',
                                                                                body: uploadData,
                                                                                headers: {}
                                                                            });
                                                                        }
                                                                        
                                                                        if (res.ok) {
                                                                            const data = await res.json();
                                                                            // Use directUrl if available (for base64), otherwise use url
                                                                            const finalUrl = data.directUrl || data.url;
                                                                            console.log('Upload successful:', data.message, 'URL:', finalUrl);
                                                                            
                                                                            // Force update the form data
                                                                            setFormData(prev => ({
                                                                                ...prev,
                                                                                logo_url: finalUrl
                                                                            }));
                                                                            
                                                                            // Also update the input field directly if needed
                                                                            const urlInput = document.querySelector('input[type="url"][placeholder="https://example.com/logo.png"]');
                                                                            if (urlInput) {
                                                                                urlInput.value = finalUrl;
                                                                            }
                                                                            
                                                                            alert('圖片上傳成功！URL: ' + finalUrl.substring(0, 50) + '...');
                                                                        } else {
                                                                            let errorMsg = 'Upload failed';
                                                                            try {
                                                                                const error = await res.json();
                                                                                errorMsg = error.error || 'Unknown error';
                                                                            } catch (e) {
                                                                                errorMsg = 'Network error';
                                                                            }
                                                                            alert('Upload failed: ' + errorMsg);
                                                                            setFormData({...formData, logo_url: originalUrl});
                                                                        }
                                                                    } catch (err) {
                                                                        console.error('Upload error:', err);
                                                                        alert('Failed to upload image. Please try again.');
                                                                        setFormData({...formData, logo_url: originalUrl});
                                                                    }
                                                                }
                                                            }} />
                                                    </label>
                                                </div>
                                                \${formData.logo_url ? html\`
                                                    <div class="flex items-center space-x-3 p-2 border rounded bg-gray-50">
                                                        <img src="\${formData.logo_url}" 
                                                             class="h-12 w-16 object-contain border rounded" 
                                                             alt="Logo preview"
                                                             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'64\' height=\'48\' viewBox=\'0 0 64 48\'%3E%3Crect width=\'64\' height=\'48\' fill=\'%23e5e7eb\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%239ca3af\' font-family=\'sans-serif\' font-size=\'12\'%3ENo Image%3C/text%3E%3C/svg%3E'" />
                                                        <div class="flex-1">
                                                            <p class="text-xs text-gray-600 font-medium">Logo Preview</p>
                                                            <p class="text-xs text-gray-500 truncate">\${formData.logo_url.substring(0, 50)}...</p>
                                                        </div>
                                                        <button type="button"
                                                            onClick=\${() => setFormData({...formData, logo_url: ''})}
                                                            class="text-red-500 hover:text-red-700">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                \` : html\`
                                                    <p class="text-xs text-gray-500">
                                                        <i class="fas fa-info-circle mr-1"></i>
                                                        Enter URL or upload an image file (PNG, JPG, SVG)
                                                    </p>
                                                \`}
                                            </div>
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
                            
                            <!-- Table Info Tab (基本資訊表格) -->
                            \${activeTab === 'table-info' ? html\`
                                <div class="space-y-6">
                                    <div class="bg-blue-50 p-3 rounded">
                                        <p class="text-sm text-blue-800">This information appears in the casino details table on the frontend.</p>
                                    </div>
                                    
                                    <!-- Language Tabs -->
                                    <div class="border-b">
                                        <nav class="-mb-px flex space-x-4">
                                            <button type="button" 
                                                class="py-2 px-1 border-b-2 font-medium text-sm \${activeDetailTab === 'en' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}" 
                                                onClick=\${() => setActiveDetailTab('en')}>🇬🇧 English</button>
                                            <button type="button" 
                                                class="py-2 px-1 border-b-2 font-medium text-sm \${activeDetailTab === 'pt' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}" 
                                                onClick=\${() => setActiveDetailTab('pt')}>🇧🇷 Portuguese</button>
                                            <button type="button" 
                                                class="py-2 px-1 border-b-2 font-medium text-sm \${activeDetailTab === 'zh' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}" 
                                                onClick=\${() => setActiveDetailTab('zh')}>🇨🇳 Chinese</button>
                                        </nav>
                                    </div>
                                    
                                    <!-- Content for selected language -->
                                    <div class="border rounded-lg p-4">
                                        <div class="grid grid-cols-2 gap-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '營運公司' : activeDetailTab === 'pt' ? 'Empresa Operadora' : 'Operating Company'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    value=\${formData.info[activeDetailTab]?.company_info || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'company_info', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '成立時間' : activeDetailTab === 'pt' ? 'Ano de Fundação' : 'Established Year'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder=\${activeDetailTab === 'zh' ? '2017年' : '2017'}
                                                    value=\${formData.info[activeDetailTab]?.established_year || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'established_year', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '國際牌照與網站安全' : activeDetailTab === 'pt' ? 'Licenças e Segurança' : 'Licenses & Safety'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="Curaçao License, SSL Encryption"
                                                    value=\${formData.info[activeDetailTab]?.licenses_safety || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'licenses_safety', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '經營國家' : activeDetailTab === 'pt' ? 'Países de Operação' : 'Operating Countries'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="Brazil, Portugal, India"
                                                    value=\${formData.info[activeDetailTab]?.operating_countries || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'operating_countries', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '支援幣別' : activeDetailTab === 'pt' ? 'Moedas Suportadas' : 'Supported Currencies'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="BRL, USD, EUR, BTC"
                                                    value=\${formData.info[activeDetailTab]?.supported_currencies || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'supported_currencies', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '支援語系' : activeDetailTab === 'pt' ? 'Idiomas Suportados' : 'Supported Languages'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="Portuguese, English, Spanish"
                                                    value=\${formData.info[activeDetailTab]?.supported_languages || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'supported_languages', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '遊戲類型' : activeDetailTab === 'pt' ? 'Tipos de Jogos' : 'Game Types'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="Slots, Table Games, Live Casino, Sports"
                                                    value=\${formData.info[activeDetailTab]?.game_types || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'game_types', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '支付方式' : activeDetailTab === 'pt' ? 'Métodos de Pagamento' : 'Payment Methods'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="PIX, Credit Cards, Crypto, E-wallets"
                                                    value=\${formData.info[activeDetailTab]?.payment_methods || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'payment_methods', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '是否有APP' : activeDetailTab === 'pt' ? 'Aplicativos Móveis' : 'Mobile Apps'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="iOS, Android, Web App"
                                                    value=\${formData.info[activeDetailTab]?.mobile_apps || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'mobile_apps', e.target.value)} />
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '客服支援' : activeDetailTab === 'pt' ? 'Suporte ao Cliente' : 'Customer Support'}
                                                </label>
                                                <input type="text" class="w-full px-3 py-2 border rounded"
                                                    placeholder="24/7 Live Chat, Email, Phone"
                                                    value=\${formData.info[activeDetailTab]?.customer_support || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'customer_support', e.target.value)} />
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
                                    
                                    <!-- Language Tabs for Details -->
                                    <div class="border-b">
                                        <nav class="-mb-px flex space-x-4">
                                            <button type="button" 
                                                class="py-2 px-1 border-b-2 font-medium text-sm \${activeDetailTab === 'en' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500'}" 
                                                onClick=\${() => setActiveDetailTab('en')}>🇬🇧 English</button>
                                            <button type="button" 
                                                class="py-2 px-1 border-b-2 font-medium text-sm \${activeDetailTab === 'pt' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500'}" 
                                                onClick=\${() => setActiveDetailTab('pt')}>🇧🇷 Portuguese</button>
                                            <button type="button" 
                                                class="py-2 px-1 border-b-2 font-medium text-sm \${activeDetailTab === 'zh' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500'}" 
                                                onClick=\${() => setActiveDetailTab('zh')}>🇨🇳 Chinese</button>
                                        </nav>
                                    </div>
                                    
                                    <!-- Detailed Content for Selected Language -->
                                    <div class="border rounded-lg p-4">
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '為何選擇這間娛樂城？' : activeDetailTab === 'pt' ? 'Por que escolher este cassino?' : 'Why choose this casino?'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Explain why players should choose this casino..."
                                                    value=\${formData.info[activeDetailTab]?.why_choose || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'why_choose', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '娛樂城特色' : activeDetailTab === 'pt' ? 'Características do Cassino' : 'Casino Features'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Describe unique features and highlights..."
                                                    value=\${formData.info[activeDetailTab]?.casino_features || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'casino_features', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '國際牌照與網站安全詳細' : activeDetailTab === 'pt' ? 'Licenças e Segurança do Site' : 'Licenses & Website Security'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Detailed information about licensing and security measures..."
                                                    value=\${formData.info[activeDetailTab]?.licenses_safety_detail || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'licenses_safety_detail', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '經營國家詳細' : activeDetailTab === 'pt' ? 'Países de Operação Detalhes' : 'Operating Countries Detail'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Detailed information about operating regions..."
                                                    value=\${formData.info[activeDetailTab]?.operating_countries_detail || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'operating_countries_detail', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '遊戲種類詳細' : activeDetailTab === 'pt' ? 'Variedade de Jogos' : 'Game Variety Detail'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Detailed information about game selection and providers..."
                                                    value=\${formData.info[activeDetailTab]?.game_variety_detail || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'game_variety_detail', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '體育投注功能' : activeDetailTab === 'pt' ? 'Recursos de Apostas Esportivas' : 'Sports Betting Features'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Details about sports betting options..."
                                                    value=\${formData.info[activeDetailTab]?.sports_betting_features || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'sports_betting_features', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '特別優惠活動' : activeDetailTab === 'pt' ? 'Promoções Especiais' : 'Special Promotions'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Current promotions and bonuses..."
                                                    value=\${formData.info[activeDetailTab]?.special_promotions || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'special_promotions', e.target.value)}></textarea>
                                            </div>
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                                    \${activeDetailTab === 'zh' ? '適合玩家' : activeDetailTab === 'pt' ? 'Jogadores Adequados' : 'Suitable Players'}
                                                </label>
                                                <textarea class="w-full px-3 py-2 border rounded" rows="3"
                                                    placeholder="Who is this casino best suited for..."
                                                    value=\${formData.info[activeDetailTab]?.suitable_players || ''}
                                                    onChange=\${e => updateInfoField(activeDetailTab, 'suitable_players', e.target.value)}></textarea>
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
                            const savedData = await res.json();
                            await loadPlayerTypes();
                            setShowForm(false);
                            setEditingType(null);
                            return savedData; // Return the saved player type data
                        }
                    } catch (err) {
                        console.error('Failed to save player type:', err);
                    }
                    return null;
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
                
                const [allCasinos, setAllCasinos] = useState([]);
                const [selectedCasinos, setSelectedCasinos] = useState([]);
                const [loadingCasinos, setLoadingCasinos] = useState(true);
                
                const iconOptions = [
                    'fa-user', 'fa-user-plus', 'fa-dice', 'fa-fire', 'fa-calculator', 'fa-crown',
                    'fa-star', 'fa-trophy', 'fa-gem', 'fa-coins', 'fa-wallet', 'fa-chart-line'
                ];
                
                useEffect(() => {
                    loadCasinos();
                }, []);
                
                async function loadCasinos() {
                    setLoadingCasinos(true);
                    try {
                        // Load all available casinos
                        const casinosRes = await apiCall('/admin/casinos');
                        if (casinosRes.ok) {
                            const casinos = await casinosRes.json();
                            setAllCasinos(casinos);
                        }
                        
                        // If editing, load the selected casinos for this player type
                        if (playerType && playerType.id) {
                            const selectedRes = await apiCall('/admin/player-types/' + playerType.id + '/casinos');
                            if (selectedRes.ok) {
                                const selected = await selectedRes.json();
                                setSelectedCasinos(selected.map(c => c.id));
                            }
                        }
                    } catch (err) {
                        console.error('Failed to load casinos:', err);
                    }
                    setLoadingCasinos(false);
                }
                
                const handleCasinoToggle = (casinoId) => {
                    setSelectedCasinos(prev => {
                        if (prev.includes(casinoId)) {
                            return prev.filter(id => id !== casinoId);
                        } else {
                            return [...prev, casinoId];
                        }
                    });
                };
                
                const handleSubmit = async (e) => {
                    e.preventDefault();
                    
                    // First save the player type
                    const savedPlayerType = await onSave(formData);
                    
                    // If we have an ID (either from edit or from save response), update the casino associations
                    if (savedPlayerType && savedPlayerType.id) {
                        try {
                            await apiCall('/admin/player-types/' + savedPlayerType.id + '/casinos', {
                                method: 'POST',
                                body: JSON.stringify({ casinoIds: selectedCasinos })
                            });
                        } catch (err) {
                            console.error('Failed to update casino associations:', err);
                        }
                    }
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
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Associated Casinos</label>
                                    <div class="border rounded p-3 bg-gray-50 max-h-64 overflow-y-auto">
                                        \${loadingCasinos ? html\`
                                            <div class="text-gray-500 text-sm">Loading casinos...</div>
                                        \` : html\`
                                            <div class="space-y-2">
                                                \${allCasinos.length === 0 ? html\`
                                                    <div class="text-gray-500 text-sm">No casinos available</div>
                                                \` : allCasinos.map(casino => html\`
                                                    <label class="flex items-center">
                                                        <input type="checkbox" class="mr-2"
                                                            checked=\${selectedCasinos.includes(casino.id)}
                                                            onChange=\${() => handleCasinoToggle(casino.id)} />
                                                        <span class="text-sm">\${casino.name}</span>
                                                    </label>
                                                \`)}
                                            </div>
                                        \`}
                                    </div>
                                    <div class="mt-1 text-xs text-gray-500">
                                        \${selectedCasinos.length} casino(s) selected
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
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Publish Date</th>
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
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        \${post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                                                    </td>
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
            
            function BlogCategoriesManager({ categories, onUpdate }) {
                const [editingCategory, setEditingCategory] = useState(null);
                const [showForm, setShowForm] = useState(false);
                
                async function saveCategory(category) {
                    try {
                        const url = category.id ? '/admin/blog/categories/' + category.id : '/admin/blog/categories';
                        const method = category.id ? 'PUT' : 'POST';
                        
                        const res = await apiCall(url, {
                            method,
                            body: JSON.stringify(category)
                        });
                        
                        if (res.ok) {
                            await onUpdate();
                            setShowForm(false);
                            setEditingCategory(null);
                        }
                    } catch (err) {
                        console.error('Failed to save category:', err);
                    }
                }
                
                async function deleteCategory(id) {
                    if (confirm('Are you sure you want to delete this category?')) {
                        try {
                            const res = await apiCall('/admin/blog/categories/' + id, { method: 'DELETE' });
                            if (res.ok) {
                                await onUpdate();
                            }
                        } catch (err) {
                            console.error('Failed to delete category:', err);
                        }
                    }
                }
                
                if (showForm) {
                    return html\`
                        <div>
                            <button onClick=\${() => { setShowForm(false); setEditingCategory(null); }}
                                class="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                                <i class="fas fa-arrow-left mr-2"></i> Back
                            </button>
                            <\${BlogCategoryForm} 
                                category=\${editingCategory}
                                onSave=\${saveCategory}
                                onCancel=\${() => { setShowForm(false); setEditingCategory(null); }}
                            />
                        </div>
                    \`;
                }
                
                return html\`
                    <div>
                        <button onClick=\${() => setShowForm(true)}
                            class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            <i class="fas fa-plus mr-2"></i> Add Category
                        </button>
                        
                        <div class="bg-white rounded-lg shadow overflow-hidden">
                            <table class="w-full">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sort Order</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    \${categories.map(category => html\`
                                        <tr>
                                            <td class="px-6 py-4">
                                                <div class="text-sm">
                                                    <div class="font-medium text-gray-900">\${category.name_en}</div>
                                                    <div class="text-gray-500 text-xs">PT: \${category.name_pt || '-'}</div>
                                                    <div class="text-gray-500 text-xs">ZH: \${category.name_zh || '-'}</div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${category.slug}</td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${category.sort_order || 0}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    \${category.is_visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                                    \${category.is_visible ? 'Visible' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick=\${() => { setEditingCategory(category); setShowForm(true); }}
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
                \`;
            }
            
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
                                            value=\${formData.slug}
                                            onChange=\${e => setFormData({...formData, slug: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                                        <input type="number" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.sort_order}
                                            onChange=\${e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
                                    </div>
                                </div>
                                
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
                                
                                <div>
                                    <label class="flex items-center">
                                        <input type="checkbox" class="mr-2"
                                            checked=\${formData.is_visible}
                                            onChange=\${e => setFormData({...formData, is_visible: e.target.checked})} />
                                        <span class="text-sm font-medium text-gray-700">Visible</span>
                                    </label>
                                </div>
                                
                                <div class="flex space-x-3">
                                    <button type="submit" 
                                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                        <i class="fas fa-save mr-2"></i> Save
                                    </button>
                                    <button type="button" onClick=\${onCancel}
                                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
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
                
                const [activeLanguageTab, setActiveLanguageTab] = useState('en');
                
                const handleSubmit = (e) => {
                    e.preventDefault();
                    onSave(formData);
                };
                
                const languageTabs = [
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'pt', label: 'Português', flag: '🇧🇷' },
                    { code: 'zh', label: '中文', flag: '🇨🇳' }
                ];
                
                return html\`
                    <div class="bg-white rounded-lg shadow p-6">
                        <h3 class="text-lg font-bold mb-4">\${post ? 'Edit Post' : 'Add New Post'}</h3>
                        <form onSubmit=\${handleSubmit}>
                            <div class="space-y-4">
                                <!-- Basic Info -->
                                <div class="grid grid-cols-3 gap-4">
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
                                            placeholder="url-friendly-slug"
                                            value=\${formData.slug}
                                            onChange=\${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                                        <div class="space-y-2">
                                            <div class="flex items-center space-x-2">
                                                <input type="text" class="flex-1 px-3 py-2 border rounded"
                                                    placeholder="https://example.com/image.jpg"
                                                    value=\${formData.featured_image}
                                                    onChange=\${e => setFormData({...formData, featured_image: e.target.value})} />
                                                <label class="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
                                                    <i class="fas fa-upload mr-1"></i> Upload
                                                    <input type="file" 
                                                        accept="image/*"
                                                        class="hidden"
                                                        onChange=\${async (e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                // Check file size
                                                                if (file.size > 10 * 1024 * 1024) {
                                                                    alert('File size too large. Maximum 10MB allowed.');
                                                                    return;
                                                                }
                                                                
                                                                // Show loading state
                                                                const originalUrl = formData.featured_image;
                                                                setFormData({...formData, featured_image: 'uploading...'});
                                                                
                                                                try {
                                                                    // Create FormData for upload
                                                                    const uploadData = new FormData();
                                                                    uploadData.append('image', file);
                                                                    
                                                                    // Try local upload first (stores in your own database)
                                                                    let res = await apiCall('/admin/upload-local', {
                                                                        method: 'POST',
                                                                        body: uploadData,
                                                                        headers: {} // Let browser set multipart headers
                                                                    });
                                                                    
                                                                    // If local storage fails (file too large), try R2
                                                                    if (!res.ok && file.size > 2 * 1024 * 1024) {
                                                                        res = await apiCall('/admin/upload-r2', {
                                                                            method: 'POST',
                                                                            body: uploadData,
                                                                            headers: {}
                                                                        });
                                                                    }
                                                                    
                                                                    // If R2 not configured, fall back to external service
                                                                    if (!res.ok) {
                                                                        res = await apiCall('/admin/upload-image', {
                                                                            method: 'POST',
                                                                            body: uploadData,
                                                                            headers: {}
                                                                        });
                                                                    }
                                                                    
                                                                    if (res.ok) {
                                                                        const data = await res.json();
                                                                        // Use directUrl if available (for base64), otherwise use url
                                                                        const finalUrl = data.directUrl || data.url;
                                                                        console.log('Upload successful:', data.message, 'URL:', finalUrl);
                                                                        
                                                                        // Force update the form data
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            featured_image: finalUrl
                                                                        }));
                                                                        
                                                                        // Also update the input field directly if needed
                                                                        const urlInput = document.querySelector('input[type="text"][placeholder="https://example.com/image.jpg"]');
                                                                        if (urlInput) {
                                                                            urlInput.value = finalUrl;
                                                                        }
                                                                        
                                                                        alert('Image uploaded successfully!');
                                                                    } else {
                                                                        const error = await res.text();
                                                                        console.error('Upload failed:', error);
                                                                        alert('Failed to upload image: ' + error);
                                                                        setFormData({...formData, featured_image: originalUrl});
                                                                    }
                                                                } catch (err) {
                                                                    console.error('Upload error:', err);
                                                                    alert('Error uploading image: ' + err.message);
                                                                    setFormData({...formData, featured_image: originalUrl});
                                                                }
                                                            }
                                                        }} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                        <input type="text" class="w-full px-3 py-2 border rounded"
                                            placeholder="John Doe"
                                            value=\${formData.author}
                                            onChange=\${e => setFormData({...formData, author: e.target.value})} />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                                        <input type="date" class="w-full px-3 py-2 border rounded"
                                            value=\${formData.published_at?.split('T')[0]}
                                            onChange=\${e => setFormData({...formData, published_at: e.target.value})} />
                                    </div>
                                    <div class="flex items-center pt-7">
                                        <input type="checkbox" id="is_published" class="mr-2"
                                            checked=\${formData.is_published}
                                            onChange=\${e => setFormData({...formData, is_published: e.target.checked})} />
                                        <label for="is_published" class="text-sm font-medium text-gray-700">
                                            <i class="fas fa-globe mr-1"></i> Publish this post
                                        </label>
                                    </div>
                                </div>
                                
                                \${formData.featured_image && formData.featured_image !== 'uploading...' && html\`
                                    <div class="border rounded p-3 bg-gray-50">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1">
                                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                                    <i class="fas fa-image mr-1"></i> Featured Image Preview
                                                </label>
                                                <div class="flex items-start gap-4">
                                                    <img src=\${formData.featured_image} 
                                                        alt="Featured" 
                                                        class="max-h-40 max-w-xs rounded shadow object-cover"
                                                        onError=\${(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }} />
                                                    <div class="hidden items-center justify-center w-40 h-40 bg-gray-200 rounded">
                                                        <i class="fas fa-image-slash text-gray-400 text-3xl"></i>
                                                    </div>
                                                    <div class="flex-1">
                                                        <p class="text-xs text-gray-500 break-all">
                                                            \${formData.featured_image.startsWith('data:') ? 
                                                                'Image stored in database (Base64)' : 
                                                                formData.featured_image.startsWith('/api/images/') ? 
                                                                'Image stored in your database' :
                                                                formData.featured_image.startsWith('https://r2.') ?
                                                                'Image stored in R2 bucket' :
                                                                'External image URL'
                                                            }
                                                        </p>
                                                        <p class="text-xs text-gray-400 mt-1 break-all">
                                                            \${formData.featured_image.length > 100 ? 
                                                                formData.featured_image.substring(0, 100) + '...' : 
                                                                formData.featured_image
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="button"
                                                onClick=\${() => setFormData({...formData, featured_image: ''})}
                                                class="ml-2 text-red-500 hover:text-red-700"
                                                title="Remove image">
                                                <i class="fas fa-times-circle text-xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                \`}
                                
                                \${formData.featured_image === 'uploading...' && html\`
                                    <div class="border rounded p-3 bg-blue-50">
                                        <div class="flex items-center">
                                            <i class="fas fa-spinner fa-spin text-blue-500 mr-2"></i>
                                            <span class="text-sm text-blue-600">Uploading image...</span>
                                        </div>
                                    </div>
                                \`}
                                
                                <!-- Language Tabs -->
                                <div class="border-t pt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-3">
                                        <i class="fas fa-language mr-1"></i> Post Content by Language
                                    </label>
                                    
                                    <!-- Language Tab Headers -->
                                    <div class="flex space-x-1 mb-4 border-b">
                                        \${languageTabs.map(lang => html\`
                                            <button type="button"
                                                onClick=\${() => setActiveLanguageTab(lang.code)}
                                                class="px-4 py-2 font-medium text-sm transition-colors
                                                    \${activeLanguageTab === lang.code 
                                                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}">
                                                <span class="mr-1">\${lang.flag}</span>
                                                \${lang.label}
                                                \${lang.code !== 'zh' ? '*' : ''}
                                            </button>
                                        \`)}
                                    </div>
                                    
                                    <!-- Language Tab Content -->
                                    <div class="space-y-4">
                                        \${languageTabs.map(lang => html\`
                                            <div class="\${activeLanguageTab === lang.code ? '' : 'hidden'}">
                                                <div class="space-y-4">
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                                            Title (\${lang.label}) \${lang.code !== 'zh' ? '*' : ''}
                                                        </label>
                                                        <input type="text" 
                                                            class="w-full px-3 py-2 border rounded focus:ring-purple-500 focus:border-purple-500" 
                                                            required=\${lang.code !== 'zh'}
                                                            placeholder=\${lang.code === 'en' ? 'Enter post title' : lang.code === 'pt' ? 'Digite o título do post' : '輸入文章標題'}
                                                            value=\${formData['title_' + lang.code]}
                                                            onChange=\${e => setFormData({...formData, ['title_' + lang.code]: e.target.value})} />
                                                    </div>
                                                    
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                                            Excerpt (\${lang.label})
                                                        </label>
                                                        <textarea 
                                                            class="w-full px-3 py-2 border rounded focus:ring-purple-500 focus:border-purple-500" 
                                                            rows="3"
                                                            placeholder=\${lang.code === 'en' ? 'Brief summary of the post' : lang.code === 'pt' ? 'Breve resumo do post' : '文章簡短摘要'}
                                                            value=\${formData['excerpt_' + lang.code]}
                                                            onChange=\${e => setFormData({...formData, ['excerpt_' + lang.code]: e.target.value})}></textarea>
                                                    </div>
                                                    
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                                            Content (\${lang.label})
                                                        </label>
                                                        <textarea 
                                                            class="w-full px-3 py-2 border rounded focus:ring-purple-500 focus:border-purple-500" 
                                                            rows="12"
                                                            placeholder=\${lang.code === 'en' ? 'Write your post content here. Markdown is supported.' : lang.code === 'pt' ? 'Escreva o conteúdo do seu post aqui. Markdown é suportado.' : '在此輸入文章內容。支援Markdown格式。'}
                                                            value=\${formData['content_' + lang.code]}
                                                            onChange=\${e => setFormData({...formData, ['content_' + lang.code]: e.target.value})}></textarea>
                                                        <p class="text-xs text-gray-500 mt-1">
                                                            <i class="fab fa-markdown mr-1"></i>
                                                            Markdown supported (headings, bold, italic, lists, links, etc.)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        \`)}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6 flex space-x-2">
                                <button type="submit" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                                    <i class="fas fa-save mr-2"></i> Save Post
                                </button>
                                <button type="button" onClick=\${onCancel}
                                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                    <i class="fas fa-times mr-2"></i> Cancel
                                </button>
                            </div>
                        </form>
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