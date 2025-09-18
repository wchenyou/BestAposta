// Import Preact and dependencies from CDN
import { h, render } from 'https://unpkg.com/preact@10.22.0/dist/preact.module.js?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.22.0/hooks/dist/hooks.module.js?module';
import htm from 'https://unpkg.com/htm@3.1.1/dist/htm.module.js?module';

const html = htm.bind(h);

console.log('Admin panel JavaScript loaded');

function AdminApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [casinos, setCasinos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCasino, setEditingCasino] = useState(null);
    
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
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                setIsLoggedIn(true);
                loadCasinos();
            } else {
                alert('登入失敗：帳號或密碼錯誤');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('登入失敗，請稍後再試');
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
    
    async function deleteCasino(id) {
        if (confirm('確定要刪除這個娛樂城嗎？')) {
            try {
                const response = await fetch(`/api/admin/casino/${id}`, { 
                    method: 'DELETE' 
                });
                if (response.ok) {
                    loadCasinos();
                }
            } catch (err) {
                console.error('Delete failed:', err);
            }
        }
    }
    
    if (loading) {
        return html`
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-xl">
                    <i class="fas fa-spinner fa-spin mr-2"></i>
                    載入中...
                </div>
            </div>
        `;
    }
    
    if (!isLoggedIn) {
        return html`
            <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                <div class="bg-white p-8 rounded-xl shadow-lg w-96">
                    <div class="text-center mb-6">
                        <i class="fas fa-dice text-5xl text-purple-600 mb-3"></i>
                        <h2 class="text-2xl font-bold text-gray-800">管理員登入</h2>
                    </div>
                    <form onSubmit=${handleLogin}>
                        <div class="mb-4">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                <i class="fas fa-envelope mr-1"></i>Email
                            </label>
                            <input type="email" name="email" required
                                value="wchenyou@gmail.com"
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />
                        </div>
                        <div class="mb-6">
                            <label class="block text-gray-700 text-sm font-bold mb-2">
                                <i class="fas fa-lock mr-1"></i>密碼
                            </label>
                            <input type="password" name="password" required
                                placeholder="請輸入密碼"
                                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" />
                        </div>
                        <button type="submit"
                            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition duration-200">
                            <i class="fas fa-sign-in-alt mr-2"></i>登入
                        </button>
                    </form>
                    <div class="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
                        <div class="font-semibold mb-1">測試帳號：</div>
                        <div>Email: wchenyou@gmail.com</div>
                        <div>密碼: Aaron12345678</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    return html`
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <div class="bg-white shadow-sm border-b">
                <div class="px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <i class="fas fa-dice text-2xl text-purple-600 mr-3"></i>
                            <h1 class="text-xl font-semibold text-gray-800">
                                娛樂城管理後台
                            </h1>
                        </div>
                        <div class="flex items-center">
                            <button onClick=${() => {
                                setIsLoggedIn(false);
                                setCasinos([]);
                            }}
                                class="text-gray-600 hover:text-gray-800 transition">
                                <i class="fas fa-sign-out-alt mr-2"></i>登出
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Content -->
            <div class="p-6">
                ${showForm ? html`
                    <${CasinoForm} 
                        casino=${editingCasino}
                        onSave=${() => { 
                            setShowForm(false); 
                            setEditingCasino(null);
                            loadCasinos(); 
                        }}
                        onCancel=${() => { 
                            setShowForm(false); 
                            setEditingCasino(null); 
                        }}
                    />
                ` : html`
                    <div class="max-w-7xl mx-auto">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">
                                <i class="fas fa-list mr-2"></i>娛樂城列表
                            </h2>
                            <button onClick=${() => { 
                                setEditingCasino(null); 
                                setShowForm(true); 
                            }}
                                class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition">
                                <i class="fas fa-plus mr-2"></i>新增娛樂城
                            </button>
                        </div>
                        
                        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名稱</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${casinos.length > 0 ? casinos.map(casino => html`
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                ${casino.logo_url ? html`
                                                    <img src=${casino.logo_url} alt=${casino.name} 
                                                        class="h-10 w-16 object-contain rounded" />
                                                ` : html`
                                                    <div class="h-10 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                        <i class="fas fa-image text-gray-400"></i>
                                                    </div>
                                                `}
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div class="text-sm font-medium text-gray-900">${casino.name}</div>
                                                <div class="text-sm text-gray-500">/casino/${casino.slug}</div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${casino.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                                    ${casino.is_active ? '啟用' : '停用'}
                                                </span>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                                <button onClick=${() => { 
                                                    setEditingCasino(casino); 
                                                    setShowForm(true); 
                                                }}
                                                    class="text-indigo-600 hover:text-indigo-900 mr-3">
                                                    <i class="fas fa-edit"></i> 編輯
                                                </button>
                                                <button onClick=${() => deleteCasino(casino.id)}
                                                    class="text-red-600 hover:text-red-900">
                                                    <i class="fas fa-trash"></i> 刪除
                                                </button>
                                            </td>
                                        </tr>
                                    `) : html`
                                        <tr>
                                            <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                                                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                                                <div>暫無娛樂城資料</div>
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
}

// Simple Casino Form Component  
function CasinoForm({ casino, onSave, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: casino?.name || '',
        slug: casino?.slug || '',
        logo_url: casino?.logo_url || '',
        website_url: casino?.website_url || '',
        affiliate_link: casino?.affiliate_link || '',
        is_active: casino?.is_active !== false,
        sort_order: casino?.sort_order || 0
    });
    
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        
        try {
            // For now, just save basic info
            // The full form with language tabs can be added later
            const method = casino?.id ? 'PUT' : 'POST';
            const url = casino?.id ? `/api/admin/casino/${casino.id}` : '/api/admin/casino';
            
            // Prepare the data with empty info for languages
            const dataToSend = {
                ...formData,
                info: {
                    en: {},
                    pt: {},
                    zh: {}
                }
            };
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            
            if (response.ok) {
                alert(casino ? '更新成功！' : '創建成功！');
                onSave();
            } else {
                const errorText = await response.text();
                console.error('Save error:', errorText);
                alert('操作失敗，請重試');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('操作失敗，請重試');
        } finally {
            setLoading(false);
        }
    }
    
    return html`
        <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">
                        <i class="fas ${casino?.id ? 'fa-edit' : 'fa-plus-circle'} mr-2 text-purple-600"></i>
                        ${casino?.id ? '編輯娛樂城' : '新增娛樂城'}
                    </h3>
                    <button onClick=${onCancel} class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <form onSubmit=${handleSubmit}>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    <i class="fas fa-dice mr-1 text-gray-400"></i>名稱 *
                                </label>
                                <input type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value=${formData.name}
                                    onInput=${e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    <i class="fas fa-link mr-1 text-gray-400"></i>URL Slug *
                                </label>
                                <input type="text" required
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    value=${formData.slug}
                                    onInput=${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                <p class="text-xs text-gray-500 mt-1">/casino/${formData.slug || 'name'}</p>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                <i class="fas fa-image mr-1 text-gray-400"></i>Logo URL
                            </label>
                            <input type="url"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="https://example.com/logo.png"
                                value=${formData.logo_url}
                                onInput=${e => setFormData({...formData, logo_url: e.target.value})} />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                <i class="fas fa-globe mr-1 text-gray-400"></i>網站 URL
                            </label>
                            <input type="url"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="https://casino.com"
                                value=${formData.website_url}
                                onInput=${e => setFormData({...formData, website_url: e.target.value})} />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                <i class="fas fa-external-link-alt mr-1 text-gray-400"></i>推廣連結 *
                            </label>
                            <input type="url" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="https://affiliate.com/link"
                                value=${formData.affiliate_link}
                                onInput=${e => setFormData({...formData, affiliate_link: e.target.value})} />
                        </div>
                        
                        <div class="flex items-center space-x-6">
                            <label class="flex items-center">
                                <input type="checkbox"
                                    class="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    checked=${formData.is_active}
                                    onChange=${e => setFormData({...formData, is_active: e.target.checked})} />
                                <span class="text-sm font-medium text-gray-700">啟用狀態</span>
                            </label>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700">
                                    <i class="fas fa-sort mr-1 text-gray-400"></i>排序
                                </label>
                                <input type="number"
                                    class="w-20 px-2 py-1 border border-gray-300 rounded"
                                    value=${formData.sort_order}
                                    onInput=${e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button type="button"
                            onClick=${onCancel}
                            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                            取消
                        </button>
                        <button type="submit" disabled=${loading}
                            class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50">
                            ${loading ? html`<i class="fas fa-spinner fa-spin mr-2"></i>保存中...` : html`<i class="fas fa-save mr-2"></i>保存`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Mount the app
console.log('Mounting admin app...');
try {
    const app = document.getElementById('app');
    if (app) {
        render(html`<${AdminApp} />`, app);
        console.log('Admin app mounted successfully');
    } else {
        console.error('App container not found');
    }
} catch (error) {
    console.error('Failed to mount admin app:', error);
}