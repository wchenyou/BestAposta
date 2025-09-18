export function renderAdminReactPage(): string {
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
            const [casinos, setCasinos] = useState([]);
            const [showForm, setShowForm] = useState(false);
            const [editingCasino, setEditingCasino] = useState(null);
            const [activeTab, setActiveTab] = useState('pt');
            
            useEffect(() => {
                checkAuth();
            }, []);
            
            useEffect(() => {
                if (isLoggedIn) {
                    loadCasinos();
                }
            }, [isLoggedIn]);
            
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
                        loadCasinos();
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
                                    <h1 className="text-xl font-bold text-white">Admin Panel - Your Best Casino</h1>
                                </div>
                                <button onClick={handleLogout}
                                    className="text-gray-300 hover:text-white px-4 py-2">
                                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                                </button>
                            </div>
                        </div>
                    </nav>
                    
                    <div className="container mx-auto px-4 py-8">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Manage Casinos</h2>
                                <button 
                                    onClick={() => {
                                        setEditingCasino(null);
                                        setShowForm(true);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                    <i className="fas fa-plus mr-2"></i>Add Casino
                                </button>
                            </div>
                            
                            {showForm ? (
                                <CasinoForm 
                                    casino={editingCasino}
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
                                            <p className="mt-2">Click "Add Casino" to get started</p>
                                        </div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Logo</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bonus</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                                {casinos.map(casino => (
                                                    <tr key={casino.id} className="hover:bg-gray-750">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {casino.logo_url ? (
                                                                <img src={casino.logo_url} alt={casino.name} className="h-10 w-20 object-contain" />
                                                            ) : (
                                                                <div className="h-10 w-20 bg-gray-600 rounded flex items-center justify-center">
                                                                    <i className="fas fa-image text-gray-400"></i>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{casino.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            <div className="flex items-center">
                                                                <i className="fas fa-star text-yellow-400 mr-1"></i>
                                                                {casino.rating}/5
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                            {casino.bonus_amount || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={\`px-2 py-1 text-xs rounded-full \${casino.is_active ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}\`}>
                                                                {casino.is_active ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <button 
                                                                onClick={() => {
                                                                    // Load full casino data before editing
                                                                    fetch(\`/api/admin/casino/\${casino.id}/full\`)
                                                                        .then(res => res.json())
                                                                        .then(data => {
                                                                            setEditingCasino(data);
                                                                            setShowForm(true);
                                                                        })
                                                                        .catch(err => {
                                                                            console.error('Failed to load casino:', err);
                                                                            alert('Failed to load casino data');
                                                                        });
                                                                }}
                                                                className="text-blue-400 hover:text-blue-300 mr-3">
                                                                <i className="fas fa-edit mr-1"></i>Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteCasino(casino.id)}
                                                                className="text-red-400 hover:text-red-300">
                                                                <i className="fas fa-trash mr-1"></i>Delete
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
                    </div>
                </div>
            );
        }
        
        function CasinoForm({ casino, onSave, onCancel }) {
            const [activeTab, setActiveTab] = useState('pt');
            const [formData, setFormData] = useState(casino || {
                name: '',
                logo_url: '',
                website_url: '',
                description: '',
                rating: 4.5,
                bonus_amount: '',
                bonus_code: '',
                features: '',
                payment_methods: '',
                is_active: true,
                casino_info: {
                    pt: {},
                    en: {},
                    zh: {}
                }
            });
            
            async function handleSubmit(e) {
                e.preventDefault();
                
                try {
                    const url = casino ? \`/api/admin/casino/\${casino.id}\` : '/api/admin/casino';
                    const method = casino ? 'PUT' : 'POST';
                    
                    const response = await fetch(url, {
                        method,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData)
                    });
                    
                    if (response.ok) {
                        alert('Casino saved successfully!');
                        onSave();
                    } else {
                        const error = await response.text();
                        alert('Failed to save casino: ' + error);
                    }
                } catch (err) {
                    alert('Error saving casino: ' + err.message);
                }
            }
            
            function updateCasinoInfo(lang, field, value) {
                setFormData(prev => ({
                    ...prev,
                    casino_info: {
                        ...prev.casino_info,
                        [lang]: {
                            ...prev.casino_info[lang],
                            [field]: value
                        }
                    }
                }));
            }
            
            const currentLangData = formData.casino_info[activeTab] || {};
            
            return (
                <div className="bg-gray-800 rounded-lg p-6 max-h-screen overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-4">
                        {casino ? 'Edit Casino' : 'Add New Casino'}
                    </h3>
                    
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="mb-6 bg-gray-700 rounded-lg p-4">
                            <h4 className="text-lg font-semibold text-white mb-3">
                                <i className="fas fa-info-circle mr-2"></i>Basic Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Name *</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Logo URL</label>
                                    <input 
                                        type="url" 
                                        value={formData.logo_url}
                                        onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                                        placeholder="https://example.com/logo.png"
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Website URL *</label>
                                    <input 
                                        type="url" 
                                        value={formData.website_url}
                                        onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                                        required
                                        placeholder="https://example.com"
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Rating</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        min="0" 
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Bonus Amount</label>
                                    <input 
                                        type="text" 
                                        value={formData.bonus_amount}
                                        onChange={(e) => setFormData({...formData, bonus_amount: e.target.value})}
                                        placeholder="R$ 500"
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Bonus Code</label>
                                    <input 
                                        type="text" 
                                        value={formData.bonus_code}
                                        onChange={(e) => setFormData({...formData, bonus_code: e.target.value})}
                                        placeholder="WELCOME100"
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        rows="3"
                                        placeholder="Brief description of the casino..."
                                        className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        {/* Language-specific content */}
                        <div className="mb-6">
                            <div className="flex space-x-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('pt')}
                                    className={\`px-4 py-2 rounded transition-colors \${activeTab === 'pt' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}\`}>
                                    <i className="fas fa-flag mr-2"></i>Português
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('en')}
                                    className={\`px-4 py-2 rounded transition-colors \${activeTab === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}\`}>
                                    <i className="fas fa-flag-usa mr-2"></i>English
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('zh')}
                                    className={\`px-4 py-2 rounded transition-colors \${activeTab === 'zh' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}\`}>
                                    <i className="fas fa-language mr-2"></i>中文
                                </button>
                            </div>
                            
                            {/* Table Information */}
                            <div className="mb-6 bg-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">
                                    <i className="fas fa-table mr-2"></i>Table Information ({activeTab.toUpperCase()})
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Company Name</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.company_name || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'company_name', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Established Year</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.established_year || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'established_year', e.target.value)}
                                            placeholder="2020"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Licenses & Safety</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.licenses_display || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'licenses_display', e.target.value)}
                                            placeholder="MGA, UKGC"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Operating Countries</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.countries_display || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'countries_display', e.target.value)}
                                            placeholder="Brazil, Portugal, UK"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Supported Currencies</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.currencies || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'currencies', e.target.value)}
                                            placeholder="BRL, USD, EUR"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Supported Languages</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.languages || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'languages', e.target.value)}
                                            placeholder="Portuguese, English, Spanish"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Game Types</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.game_types || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'game_types', e.target.value)}
                                            placeholder="Slots, Table Games, Live Casino"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Payment Methods (Brazil)</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.payment_methods || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'payment_methods', e.target.value)}
                                            placeholder="PIX, Credit Card, Boleto"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Mobile Apps</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.mobile_apps || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'mobile_apps', e.target.value)}
                                            placeholder="iOS, Android"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Customer Support</label>
                                        <input 
                                            type="text"
                                            value={currentLangData.customer_support || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'customer_support', e.target.value)}
                                            placeholder="24/7 Live Chat, Email"
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Detail Information */}
                            <div className="bg-gray-700 rounded-lg p-4">
                                <h4 className="text-lg font-semibold text-white mb-3">
                                    <i className="fas fa-file-alt mr-2"></i>Detail Information ({activeTab.toUpperCase()})
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Why Choose</label>
                                        <textarea
                                            value={currentLangData.why_choose || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'why_choose', e.target.value)}
                                            rows="3"
                                            placeholder="Reasons why players should choose this casino..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Casino Features</label>
                                        <textarea
                                            value={currentLangData.casino_features || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'casino_features', e.target.value)}
                                            rows="3"
                                            placeholder="Key features and benefits..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Licenses Detail</label>
                                        <textarea
                                            value={currentLangData.licenses_detail || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'licenses_detail', e.target.value)}
                                            rows="3"
                                            placeholder="Detailed information about licenses..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Operating Countries Detail</label>
                                        <textarea
                                            value={currentLangData.countries_detail || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'countries_detail', e.target.value)}
                                            rows="3"
                                            placeholder="Details about operating regions..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Game Variety</label>
                                        <textarea
                                            value={currentLangData.game_variety || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'game_variety', e.target.value)}
                                            rows="3"
                                            placeholder="Detailed game selection information..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Sports Betting Features</label>
                                        <textarea
                                            value={currentLangData.sports_betting || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'sports_betting', e.target.value)}
                                            rows="3"
                                            placeholder="Sports betting options and features..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Special Promotions</label>
                                        <textarea
                                            value={currentLangData.special_promotions || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'special_promotions', e.target.value)}
                                            rows="3"
                                            placeholder="Current promotions and bonuses..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-bold mb-2">Suitable Players</label>
                                        <textarea
                                            value={currentLangData.suitable_players || ''}
                                            onChange={(e) => updateCasinoInfo(activeTab, 'suitable_players', e.target.value)}
                                            rows="3"
                                            placeholder="Who is this casino best suited for..."
                                            className="w-full px-3 py-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center mb-6">
                            <label className="flex items-center text-gray-300 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    className="mr-2 w-5 h-5" />
                                <span className="font-semibold">Active Casino</span>
                            </label>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button 
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                                <i className="fas fa-times mr-2"></i>Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                <i className="fas fa-save mr-2"></i>Save Casino
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