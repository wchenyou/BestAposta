// Casino Form Component with Language Tabs
function CasinoFormWithLangTabs({ html, casino, onSave, onCancel }) {
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
        
        // Language-specific data structure
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const method = casino ? 'PUT' : 'POST';
            const url = casino ? `/api/casinos/${casino.id}` : '/api/casinos';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    casino_info: formData.info
                })
            });
            
            if (response.ok) {
                alert(casino ? 'Casino updated!' : 'Casino created!');
                onSave();
            }
        } finally {
            setLoading(false);
        }
    };

    const langLabels = {
        en: { flag: '🇬🇧', name: 'English' },
        pt: { flag: '🇧🇷', name: 'Português' },
        zh: { flag: '🇨🇳', name: '中文' }
    };

    const fieldLabels = {
        company_info: { en: 'Operating Company', pt: 'Empresa Operadora', zh: '營運公司' },
        established_year: { en: 'Established Year', pt: 'Ano de Fundação', zh: '成立時間' },
        licenses_safety: { en: 'Licenses & Safety', pt: 'Licenças e Segurança', zh: '國際牌照與網站安全' },
        operating_countries: { en: 'Operating Countries', pt: 'Países de Operação', zh: '經營國家' },
        supported_currencies: { en: 'Supported Currencies', pt: 'Moedas Suportadas', zh: '支援幣別' },
        supported_languages: { en: 'Supported Languages', pt: 'Idiomas Suportados', zh: '支援語系' },
        game_types: { en: 'Game Types', pt: 'Tipos de Jogos', zh: '遊戲類型' },
        payment_methods: { en: 'Payment Methods', pt: 'Métodos de Pagamento', zh: '支付方式' },
        mobile_apps: { en: 'Mobile Apps', pt: 'Aplicativos Móveis', zh: '手機APP' },
        customer_support: { en: 'Customer Support', pt: 'Suporte ao Cliente', zh: '客服支援' },
        why_choose: { en: 'Why Choose This Casino', pt: 'Por que Escolher Este Cassino', zh: '為何選擇' },
        casino_features: { en: 'Casino Features', pt: 'Características do Cassino', zh: '娛樂城特色' },
        licenses_safety_detail: { en: 'Licenses Detail', pt: 'Detalhes das Licenças', zh: '牌照詳細' },
        operating_countries_detail: { en: 'Countries Detail', pt: 'Detalhes dos Países', zh: '國家詳細' },
        game_variety_detail: { en: 'Game Variety Detail', pt: 'Variedade de Jogos', zh: '遊戲種類詳細' },
        sports_betting_features: { en: 'Sports Betting', pt: 'Apostas Esportivas', zh: '體育投注' },
        special_promotions: { en: 'Special Promotions', pt: 'Promoções Especiais', zh: '特別優惠' },
        suitable_players: { en: 'Suitable For', pt: 'Adequado Para', zh: '適合玩家' }
    };

    return html`
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold">${casino ? 'Edit Casino' : 'Add New Casino'}</h2>
                <button onClick=${onCancel} class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form onSubmit=${handleSubmit}>
                <!-- Main Tabs -->
                <div class="border-b mb-6">
                    <nav class="flex space-x-8">
                        <button type="button"
                            onClick=${() => setActiveTab('basic')}
                            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'basic' 
                                ? 'border-purple-500 text-purple-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }">
                            <i class="fas fa-info-circle mr-2"></i>Basic Info
                        </button>
                        <button type="button"
                            onClick=${() => setActiveTab('table')}
                            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'table' 
                                ? 'border-purple-500 text-purple-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }">
                            <i class="fas fa-table mr-2"></i>Table Data
                        </button>
                        <button type="button"
                            onClick=${() => setActiveTab('detail')}
                            class="py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'detail' 
                                ? 'border-purple-500 text-purple-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }">
                            <i class="fas fa-file-alt mr-2"></i>Detail Content
                        </button>
                    </nav>
                </div>

                <!-- Basic Info Tab -->
                ${activeTab === 'basic' ? html`
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-dice mr-1"></i>Casino Name *
                                </label>
                                <input type="text" required
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    value=${formData.name}
                                    onChange=${e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-link mr-1"></i>URL Slug *
                                </label>
                                <input type="text" required
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    value=${formData.slug}
                                    onChange=${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                <p class="text-xs text-gray-500 mt-1">/casino/${formData.slug || 'name'}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-image mr-1"></i>Logo URL
                                </label>
                                <input type="url"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://example.com/logo.png"
                                    value=${formData.logo_url}
                                    onChange=${e => setFormData({...formData, logo_url: e.target.value})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-globe mr-1"></i>Website URL
                                </label>
                                <input type="url"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://casino.com"
                                    value=${formData.website_url}
                                    onChange=${e => setFormData({...formData, website_url: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                <i class="fas fa-external-link-alt mr-1"></i>Affiliate Link *
                            </label>
                            <input type="url" required
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="https://affiliate.com/link"
                                value=${formData.affiliate_link}
                                onChange=${e => setFormData({...formData, affiliate_link: e.target.value})} />
                        </div>

                        <div class="grid grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-star mr-1"></i>Rating
                                </label>
                                <input type="number" step="0.1" min="0" max="5"
                                    class="w-full px-4 py-2 border rounded-lg"
                                    value=${formData.rating}
                                    onChange=${e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-sort mr-1"></i>Sort Order
                                </label>
                                <input type="number"
                                    class="w-full px-4 py-2 border rounded-lg"
                                    value=${formData.sort_order}
                                    onChange=${e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    <i class="fas fa-toggle-on mr-1"></i>Status
                                </label>
                                <select class="w-full px-4 py-2 border rounded-lg"
                                    value=${formData.is_active}
                                    onChange=${e => setFormData({...formData, is_active: e.target.value === 'true'})}>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Table Data Tab -->
                ${activeTab === 'table' ? html`
                    <div>
                        <!-- Language Tabs -->
                        <div class="bg-gray-50 p-1 rounded-lg mb-6">
                            <div class="flex space-x-1">
                                ${Object.entries(langLabels).map(([lang, label]) => html`
                                    <button type="button"
                                        onClick=${() => setActiveLang(lang)}
                                        class="flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                                            activeLang === lang
                                            ? 'bg-white text-purple-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }">
                                        <span class="text-lg mr-2">${label.flag}</span>
                                        ${label.name}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Language-specific fields -->
                        <div class="space-y-4">
                            ${['company_info', 'established_year', 'licenses_safety', 'operating_countries', 
                               'supported_currencies', 'supported_languages', 'game_types', 'payment_methods', 
                               'mobile_apps', 'customer_support'].map(field => html`
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        ${fieldLabels[field][activeLang]}
                                    </label>
                                    <input type="text"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value=${formData.info[activeLang][field]}
                                        onChange=${e => updateLangField(activeLang, field, e.target.value)}
                                        placeholder=${field === 'payment_methods' ? 'e.g., PIX, Boleto, Credit Card' :
                                                     field === 'supported_currencies' ? 'e.g., BRL, USD, EUR' :
                                                     field === 'supported_languages' ? 'e.g., Portuguese, English, Spanish' :
                                                     field === 'established_year' ? 'e.g., 2020' : ''} />
                                </div>
                            `)}
                        </div>
                    </div>
                ` : ''}

                <!-- Detail Content Tab -->
                ${activeTab === 'detail' ? html`
                    <div>
                        <!-- Language Tabs -->
                        <div class="bg-gray-50 p-1 rounded-lg mb-6">
                            <div class="flex space-x-1">
                                ${Object.entries(langLabels).map(([lang, label]) => html`
                                    <button type="button"
                                        onClick=${() => setActiveLang(lang)}
                                        class="flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                                            activeLang === lang
                                            ? 'bg-white text-purple-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-800'
                                        }">
                                        <span class="text-lg mr-2">${label.flag}</span>
                                        ${label.name}
                                    </button>
                                `)}
                            </div>
                        </div>

                        <!-- Detail fields -->
                        <div class="space-y-4">
                            ${['why_choose', 'casino_features', 'licenses_safety_detail', 
                               'operating_countries_detail', 'game_variety_detail', 
                               'sports_betting_features', 'special_promotions', 'suitable_players'].map(field => html`
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        ${fieldLabels[field][activeLang]}
                                    </label>
                                    <textarea rows="4"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                        value=${formData.info[activeLang][field]}
                                        onChange=${e => updateLangField(activeLang, field, e.target.value)}></textarea>
                                </div>
                            `)}
                        </div>
                    </div>
                ` : ''}

                <!-- Submit Buttons -->
                <div class="flex justify-end space-x-3 mt-8 pt-6 border-t">
                    <button type="button"
                        onClick=${onCancel}
                        class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                        disabled=${loading}
                        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                        ${loading ? html`<i class="fas fa-spinner fa-spin mr-2"></i>Saving...` : 
                          casino ? 'Update Casino' : 'Create Casino'}
                    </button>
                </div>
            </form>
        </div>
    `;
}

export default CasinoFormWithLangTabs;