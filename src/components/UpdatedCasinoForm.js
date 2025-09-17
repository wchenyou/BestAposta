// Updated Casino Form to Match Frontend Structure Exactly
function UpdatedCasinoForm({ html, casino, onSave, onCancel }) {
    const [activeTab, setActiveTab] = useState('basic');
    const [activeLang, setActiveLang] = useState('en');
    const [loading, setLoading] = useState(false);
    
    // Initialize form data with proper structure matching database
    const [formData, setFormData] = useState({
        // Basic casino info
        name: casino?.name || '',
        slug: casino?.slug || '',
        logo_url: casino?.logo_url || '',
        website_url: casino?.website_url || '',
        affiliate_link: casino?.affiliate_link || '',
        rating: casino?.rating || 4.5,
        bonus_percentage: casino?.bonus_percentage || 100,
        is_active: casino?.is_active !== false,
        sort_order: casino?.sort_order || 0,
        
        // Language-specific casino_info data
        info: {
            en: {
                // Table fields (displayed in info table)
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
                
                // Detail fields (expandable sections)
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

    // Load casino data if editing
    useEffect(() => {
        if (casino && casino.id) {
            loadCasinoFullData(casino.id);
        }
    }, [casino]);

    const loadCasinoFullData = async (casinoId) => {
        setLoading(true);
        try {
            // Fetch the casino with all info
            const response = await fetch(`/api/admin/casino/${casinoId}/full`);
            if (response.ok) {
                const data = await response.json();
                
                // Update form data with loaded casino info
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
            console.error('Error loading casino data:', error);
        } finally {
            setLoading(false);
        }
    };

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
            const method = casino?.id ? 'PUT' : 'POST';
            const url = casino?.id ? `/api/admin/casino/${casino.id}` : '/api/admin/casino';
            
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert(casino ? '娛樂城更新成功！' : '娛樂城創建成功！');
                onSave();
            } else {
                alert('保存失敗，請重試。');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('保存失敗，請重試。');
        } finally {
            setLoading(false);
        }
    };

    const langLabels = {
        en: { flag: '🇬🇧', name: 'English' },
        pt: { flag: '🇧🇷', name: 'Português' },
        zh: { flag: '🇨🇳', name: '中文' }
    };

    // Field labels matching frontend exactly
    const tableFieldLabels = {
        company_info: {
            en: 'Operating Company',
            pt: 'Empresa Operadora',
            zh: '營運公司'
        },
        established_year: {
            en: 'Established',
            pt: 'Ano de Fundação',
            zh: '成立時間'
        },
        licenses_safety: {
            en: 'Licenses & Safety',
            pt: 'Licenças e Segurança',
            zh: '國際牌照與網站安全'
        },
        operating_countries: {
            en: 'Operating Countries',
            pt: 'Países de Operação',
            zh: '經營國家'
        },
        supported_currencies: {
            en: 'Supported Currencies',
            pt: 'Moedas Suportadas',
            zh: '支援幣別'
        },
        supported_languages: {
            en: 'Supported Languages',
            pt: 'Idiomas Suportados',
            zh: '支援語系'
        },
        game_types: {
            en: 'Game Types',
            pt: 'Tipos de Jogos',
            zh: '遊戲類型'
        },
        payment_methods: {
            en: 'Payment Methods',
            pt: 'Métodos de Pagamento',
            zh: '支付方式'
        },
        mobile_apps: {
            en: 'Mobile Apps',
            pt: 'Aplicativos Móveis',
            zh: '是否有APP'
        },
        customer_support: {
            en: 'Customer Support',
            pt: 'Suporte ao Cliente',
            zh: '客服支援'
        }
    };

    const detailFieldLabels = {
        why_choose: {
            en: 'Why choose this casino?',
            pt: 'Por que escolher este cassino?',
            zh: '為何選擇這間娛樂城？'
        },
        casino_features: {
            en: 'Casino Features',
            pt: 'Características do Cassino',
            zh: '娛樂城特色'
        },
        licenses_safety_detail: {
            en: 'Licenses & Website Security',
            pt: 'Licenças e Segurança do Site',
            zh: '國際牌照與網站安全'
        },
        operating_countries_detail: {
            en: 'Operating Countries',
            pt: 'Países de Operação',
            zh: '經營國家'
        },
        game_variety_detail: {
            en: 'Game Variety',
            pt: 'Variedade de Jogos',
            zh: '遊戲種類'
        },
        sports_betting_features: {
            en: 'Sports Betting Features',
            pt: 'Recursos de Apostas Esportivas',
            zh: '體育投注功能'
        },
        special_promotions: {
            en: 'Special Promotions',
            pt: 'Promoções Especiais',
            zh: '特別優惠活動'
        },
        suitable_players: {
            en: 'Suitable Players',
            pt: 'Jogadores Adequados',
            zh: '適合玩家'
        }
    };

    return html`
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">
                    ${casino?.id ? '編輯娛樂城' : '新增娛樂城'}
                </h2>
                <button onClick=${onCancel} class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form onSubmit=${handleSubmit}>
                <!-- Main Tabs -->
                <div class="border-b mb-6">
                    <nav class="flex space-x-6">
                        <button type="button"
                            onClick=${() => setActiveTab('basic')}
                            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'basic' 
                                ? 'border-purple-500 text-purple-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }">
                            <i class="fas fa-info-circle mr-2"></i>基本資訊
                        </button>
                        <button type="button"
                            onClick=${() => setActiveTab('table')}
                            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'table' 
                                ? 'border-purple-500 text-purple-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }">
                            <i class="fas fa-table mr-2"></i>資訊表格內容
                        </button>
                        <button type="button"
                            onClick=${() => setActiveTab('detail')}
                            class="py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'detail' 
                                ? 'border-purple-500 text-purple-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }">
                            <i class="fas fa-file-alt mr-2"></i>詳細說明內容
                        </button>
                    </nav>
                </div>

                <!-- Basic Info Tab -->
                ${activeTab === 'basic' ? html`
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    娛樂城名稱 *
                                </label>
                                <input type="text" required
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    value=${formData.name}
                                    onChange=${e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    URL 代稱 *
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
                                    Logo 圖片網址
                                </label>
                                <input type="url"
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://example.com/logo.png"
                                    value=${formData.logo_url}
                                    onChange=${e => setFormData({...formData, logo_url: e.target.value})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    官方網站
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
                                推廣連結 *
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
                                    評分
                                </label>
                                <input type="number" step="0.1" min="0" max="5"
                                    class="w-full px-4 py-2 border rounded-lg"
                                    value=${formData.rating}
                                    onChange=${e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    排序順序
                                </label>
                                <input type="number"
                                    class="w-full px-4 py-2 border rounded-lg"
                                    value=${formData.sort_order}
                                    onChange=${e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    狀態
                                </label>
                                <select class="w-full px-4 py-2 border rounded-lg"
                                    value=${formData.is_active}
                                    onChange=${e => setFormData({...formData, is_active: e.target.value === 'true'})}>
                                    <option value="true">啟用</option>
                                    <option value="false">停用</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Table Data Tab (資訊表格內容) -->
                ${activeTab === 'table' ? html`
                    <div>
                        <!-- Language Tabs -->
                        <div class="bg-gray-100 p-1 rounded-lg mb-6">
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

                        <!-- Table Fields (matching frontend display exactly) -->
                        <div class="space-y-4">
                            ${Object.entries(tableFieldLabels).map(([field, labels]) => html`
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        ${labels[activeLang]}
                                    </label>
                                    ${field === 'payment_methods' || field === 'game_types' ? html`
                                        <textarea rows="2"
                                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                            value=${formData.info[activeLang][field]}
                                            onChange=${e => updateLangField(activeLang, field, e.target.value)}
                                            placeholder=${
                                                field === 'payment_methods' ? 'PIX, Boleto, 信用卡, 加密貨幣' :
                                                '老虎機, 真人娛樂, 體育投注, 撲克'
                                            }></textarea>
                                    ` : html`
                                        <input type="text"
                                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                            value=${formData.info[activeLang][field]}
                                            onChange=${e => updateLangField(activeLang, field, e.target.value)}
                                            placeholder=${
                                                field === 'established_year' ? '2020' :
                                                field === 'supported_currencies' ? 'BRL, USD, EUR, BTC' :
                                                field === 'supported_languages' ? '葡萄牙語, 英語, 中文' :
                                                field === 'mobile_apps' ? 'iOS, Android' :
                                                field === 'customer_support' ? '24/7 線上客服, Email, 電話' :
                                                field === 'licenses_safety' ? 'Curacao eGaming, SSL 加密' :
                                                field === 'operating_countries' ? '巴西, 葡萄牙, 全球' :
                                                ''
                                            } />
                                    `}
                                </div>
                            `)}
                        </div>
                    </div>
                ` : ''}

                <!-- Detail Content Tab (詳細說明內容) -->
                ${activeTab === 'detail' ? html`
                    <div>
                        <!-- Language Tabs -->
                        <div class="bg-gray-100 p-1 rounded-lg mb-6">
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

                        <!-- Detail Fields (matching frontend sections exactly) -->
                        <div class="space-y-6">
                            ${Object.entries(detailFieldLabels).map(([field, labels]) => html`
                                <div class="bg-gray-50 p-4 rounded-lg">
                                    <label class="block text-sm font-bold text-gray-800 mb-3">
                                        <i class="fas ${
                                            field === 'why_choose' ? 'fa-question-circle' :
                                            field === 'casino_features' ? 'fa-star' :
                                            field === 'licenses_safety_detail' ? 'fa-shield-alt' :
                                            field === 'operating_countries_detail' ? 'fa-globe' :
                                            field === 'game_variety_detail' ? 'fa-gamepad' :
                                            field === 'sports_betting_features' ? 'fa-futbol' :
                                            field === 'special_promotions' ? 'fa-gift' :
                                            field === 'suitable_players' ? 'fa-users' : 'fa-info-circle'
                                        } text-purple-600 mr-2"></i>
                                        ${labels[activeLang]}
                                    </label>
                                    <textarea rows="5"
                                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                                        value=${formData.info[activeLang][field]}
                                        onChange=${e => updateLangField(activeLang, field, e.target.value)}
                                        placeholder="請輸入詳細說明內容..."></textarea>
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
                        取消
                    </button>
                    <button type="submit"
                        disabled=${loading}
                        class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                        ${loading ? html`<i class="fas fa-spinner fa-spin mr-2"></i>保存中...` : 
                          casino?.id ? '更新娛樂城' : '創建娛樂城'}
                    </button>
                </div>
            </form>
        </div>
    `;
}

export default UpdatedCasinoForm;