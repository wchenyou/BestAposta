// Casino Form Component with Proper Field Structure
const CasinoForm = ({ html, editingCasino, setEditingCasino, refreshCasinos, setShowForm }) => {
    const [activeTab, setActiveTab] = useState('table');
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
        if (editingCasino) {
            // Load existing data
            setFormData({
                ...editingCasino,
                // Map casino_info fields from different languages
                company_info_en: editingCasino.info_en?.company_info || '',
                company_info_pt: editingCasino.info_pt?.company_info || '',
                company_info_zh: editingCasino.info_zh?.company_info || '',
                
                established_year_en: editingCasino.info_en?.established_year || '',
                established_year_pt: editingCasino.info_pt?.established_year || '',
                established_year_zh: editingCasino.info_zh?.established_year || '',
                
                licenses_safety_en: editingCasino.info_en?.licenses_safety || '',
                licenses_safety_pt: editingCasino.info_pt?.licenses_safety || '',
                licenses_safety_zh: editingCasino.info_zh?.licenses_safety || '',
                
                operating_countries_en: editingCasino.info_en?.operating_countries || '',
                operating_countries_pt: editingCasino.info_pt?.operating_countries || '',
                operating_countries_zh: editingCasino.info_zh?.operating_countries || '',
                
                supported_currencies_en: editingCasino.info_en?.supported_currencies || '',
                supported_currencies_pt: editingCasino.info_pt?.supported_currencies || '',
                supported_currencies_zh: editingCasino.info_zh?.supported_currencies || '',
                
                supported_languages_en: editingCasino.info_en?.supported_languages || '',
                supported_languages_pt: editingCasino.info_pt?.supported_languages || '',
                supported_languages_zh: editingCasino.info_zh?.supported_languages || '',
                
                game_types_en: editingCasino.info_en?.game_types || '',
                game_types_pt: editingCasino.info_pt?.game_types || '',
                game_types_zh: editingCasino.info_zh?.game_types || '',
                
                payment_methods_en: editingCasino.info_en?.payment_methods || '',
                payment_methods_pt: editingCasino.info_pt?.payment_methods || '',
                payment_methods_zh: editingCasino.info_zh?.payment_methods || '',
                
                mobile_apps_en: editingCasino.info_en?.mobile_apps || '',
                mobile_apps_pt: editingCasino.info_pt?.mobile_apps || '',
                mobile_apps_zh: editingCasino.info_zh?.mobile_apps || '',
                
                customer_support_en: editingCasino.info_en?.customer_support || '',
                customer_support_pt: editingCasino.info_pt?.customer_support || '',
                customer_support_zh: editingCasino.info_zh?.customer_support || '',
                
                // Detail fields
                why_choose_en: editingCasino.info_en?.why_choose || '',
                why_choose_pt: editingCasino.info_pt?.why_choose || '',
                why_choose_zh: editingCasino.info_zh?.why_choose || '',
                
                casino_features_en: editingCasino.info_en?.casino_features || '',
                casino_features_pt: editingCasino.info_pt?.casino_features || '',
                casino_features_zh: editingCasino.info_zh?.casino_features || '',
                
                licenses_safety_detail_en: editingCasino.info_en?.licenses_safety_detail || '',
                licenses_safety_detail_pt: editingCasino.info_pt?.licenses_safety_detail || '',
                licenses_safety_detail_zh: editingCasino.info_zh?.licenses_safety_detail || '',
                
                operating_countries_detail_en: editingCasino.info_en?.operating_countries_detail || '',
                operating_countries_detail_pt: editingCasino.info_pt?.operating_countries_detail || '',
                operating_countries_detail_zh: editingCasino.info_zh?.operating_countries_detail || '',
                
                game_variety_detail_en: editingCasino.info_en?.game_variety_detail || '',
                game_variety_detail_pt: editingCasino.info_pt?.game_variety_detail || '',
                game_variety_detail_zh: editingCasino.info_zh?.game_variety_detail || '',
                
                sports_betting_features_en: editingCasino.info_en?.sports_betting_features || '',
                sports_betting_features_pt: editingCasino.info_pt?.sports_betting_features || '',
                sports_betting_features_zh: editingCasino.info_zh?.sports_betting_features || '',
                
                special_promotions_en: editingCasino.info_en?.special_promotions || '',
                special_promotions_pt: editingCasino.info_pt?.special_promotions || '',
                special_promotions_zh: editingCasino.info_zh?.special_promotions || '',
                
                suitable_players_en: editingCasino.info_en?.suitable_players || '',
                suitable_players_pt: editingCasino.info_pt?.suitable_players || '',
                suitable_players_zh: editingCasino.info_zh?.suitable_players || ''
            });
        }
    }, [editingCasino]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const method = editingCasino ? 'PUT' : 'POST';
        const url = editingCasino ? `/api/casinos/${editingCasino.id}` : '/api/casinos';
        
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
                ...formData,
                casino_info: casinoInfo
            })
        });
        
        if (response.ok) {
            alert(editingCasino ? 'Casino updated!' : 'Casino created!');
            setEditingCasino(null);
            setShowForm(false);
            refreshCasinos();
        }
    };

    return html`
        <div class="bg-white rounded-lg p-6 border-2 border-gray-200">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold">${editingCasino ? 'Edit Casino' : 'Add New Casino'}</h3>
                <button onClick=${() => { setEditingCasino(null); setShowForm(false); }}
                    class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Tabs -->
            <div class="border-b mb-4">
                <nav class="flex space-x-4">
                    <button type="button"
                        class="py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'table' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                        onClick=${() => setActiveTab('table')}>
                        表格資料 / Table Data
                    </button>
                    <button type="button"
                        class="py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'detail' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
                        onClick=${() => setActiveTab('detail')}>
                        詳細內容 / Detail Content
                    </button>
                </nav>
            </div>
            
            <form onSubmit=${handleSubmit}>
                <!-- Table Data Tab -->
                ${activeTab === 'table' ? html`
                    <div class="space-y-6">
                        <!-- Basic Casino Info -->
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-medium text-gray-900 mb-3">基本資訊 / Basic Info</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">娛樂城名稱 / Casino Name *</label>
                                    <input type="text" required
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData.name}
                                        onChange=${e => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">營運公司 / Operating Company</label>
                                    <div class="space-y-2">
                                        <input type="text" placeholder="English"
                                            class="w-full px-3 py-2 border rounded"
                                            value=${formData.company_info_en}
                                            onChange=${e => setFormData({...formData, company_info_en: e.target.value})} />
                                        <input type="text" placeholder="Português"
                                            class="w-full px-3 py-2 border rounded"
                                            value=${formData.company_info_pt}
                                            onChange=${e => setFormData({...formData, company_info_pt: e.target.value})} />
                                        <input type="text" placeholder="中文"
                                            class="w-full px-3 py-2 border rounded"
                                            value=${formData.company_info_zh}
                                            onChange=${e => setFormData({...formData, company_info_zh: e.target.value})} />
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
                                        value=${formData.established_year_en}
                                        onChange=${e => setFormData({...formData, established_year_en: e.target.value})} />
                                    <input type="text" placeholder="Português (e.g., 2020)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.established_year_pt}
                                        onChange=${e => setFormData({...formData, established_year_pt: e.target.value})} />
                                    <input type="text" placeholder="中文 (e.g., 2020年)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.established_year_zh}
                                        onChange=${e => setFormData({...formData, established_year_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Licenses & Safety -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">國際牌照與網站安全 / Licenses & Safety</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.licenses_safety_en}
                                        onChange=${e => setFormData({...formData, licenses_safety_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.licenses_safety_pt}
                                        onChange=${e => setFormData({...formData, licenses_safety_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.licenses_safety_zh}
                                        onChange=${e => setFormData({...formData, licenses_safety_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Operating Countries -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">經營國家 / Operating Countries</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English (e.g., Brazil, Portugal)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.operating_countries_en}
                                        onChange=${e => setFormData({...formData, operating_countries_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.operating_countries_pt}
                                        onChange=${e => setFormData({...formData, operating_countries_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.operating_countries_zh}
                                        onChange=${e => setFormData({...formData, operating_countries_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Supported Currencies -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">支援幣別 / Supported Currencies</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English (e.g., BRL, USD, EUR)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.supported_currencies_en}
                                        onChange=${e => setFormData({...formData, supported_currencies_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.supported_currencies_pt}
                                        onChange=${e => setFormData({...formData, supported_currencies_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.supported_currencies_zh}
                                        onChange=${e => setFormData({...formData, supported_currencies_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Supported Languages -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">支援語系 / Supported Languages</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English (e.g., Portuguese, English)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.supported_languages_en}
                                        onChange=${e => setFormData({...formData, supported_languages_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.supported_languages_pt}
                                        onChange=${e => setFormData({...formData, supported_languages_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.supported_languages_zh}
                                        onChange=${e => setFormData({...formData, supported_languages_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Game Types -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">遊戲類型 / Game Types</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.game_types_en}
                                        onChange=${e => setFormData({...formData, game_types_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.game_types_pt}
                                        onChange=${e => setFormData({...formData, game_types_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.game_types_zh}
                                        onChange=${e => setFormData({...formData, game_types_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Payment Methods (Brazil) -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">巴西支付方式 / Payment Methods (Brazil)</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English (e.g., PIX, Boleto)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.payment_methods_en}
                                        onChange=${e => setFormData({...formData, payment_methods_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.payment_methods_pt}
                                        onChange=${e => setFormData({...formData, payment_methods_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.payment_methods_zh}
                                        onChange=${e => setFormData({...formData, payment_methods_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Mobile Apps -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">是否有APP / Mobile Apps</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English (e.g., iOS, Android)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.mobile_apps_en}
                                        onChange=${e => setFormData({...formData, mobile_apps_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.mobile_apps_pt}
                                        onChange=${e => setFormData({...formData, mobile_apps_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.mobile_apps_zh}
                                        onChange=${e => setFormData({...formData, mobile_apps_zh: e.target.value})} />
                                </div>
                            </div>

                            <!-- Customer Support -->
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">客服支援 / Customer Support</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <input type="text" placeholder="English (e.g., 24/7 Live Chat)"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.customer_support_en}
                                        onChange=${e => setFormData({...formData, customer_support_en: e.target.value})} />
                                    <input type="text" placeholder="Português"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.customer_support_pt}
                                        onChange=${e => setFormData({...formData, customer_support_pt: e.target.value})} />
                                    <input type="text" placeholder="中文"
                                        class="px-3 py-2 border rounded"
                                        value=${formData.customer_support_zh}
                                        onChange=${e => setFormData({...formData, customer_support_zh: e.target.value})} />
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
                                        value=${formData.slug}
                                        onChange=${e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                                    <input type="url"
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData.logo_url}
                                        onChange=${e => setFormData({...formData, logo_url: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                    <input type="url"
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData.website_url}
                                        onChange=${e => setFormData({...formData, website_url: e.target.value})} />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Affiliate Link *</label>
                                    <input type="url" required
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData.affiliate_link}
                                        onChange=${e => setFormData({...formData, affiliate_link: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Detail Content Tab -->
                ${activeTab === 'detail' ? html`
                    <div class="space-y-6">
                        <div class="bg-yellow-50 p-3 rounded">
                            <p class="text-sm text-yellow-800">這些詳細內容將顯示在娛樂城詳情頁面的可展開區塊中。</p>
                        </div>
                        
                        <!-- Detail Fields -->
                        ${[
                            { field: 'why_choose', label: '為何選擇這間娛樂城 / Why Choose This Casino' },
                            { field: 'casino_features', label: '娛樂城特色 / Casino Features' },
                            { field: 'licenses_safety_detail', label: '國際牌照與網站安全(詳細) / Licenses & Safety (Detail)' },
                            { field: 'operating_countries_detail', label: '經營國家(詳細) / Operating Countries (Detail)' },
                            { field: 'game_variety_detail', label: '遊戲種類(詳細) / Game Variety (Detail)' },
                            { field: 'sports_betting_features', label: '體育投注功能 / Sports Betting Features' },
                            { field: 'special_promotions', label: '特別優惠活動 / Special Promotions' },
                            { field: 'suitable_players', label: '適合玩家 / Suitable for Players' }
                        ].map(({ field, label }) => html`
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <label class="block text-sm font-medium text-gray-700 mb-2">${label}</label>
                                <div class="space-y-2">
                                    <textarea placeholder="English" rows="3"
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData[field + '_en']}
                                        onChange=${e => setFormData({...formData, [field + '_en']: e.target.value})}></textarea>
                                    <textarea placeholder="Português" rows="3"
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData[field + '_pt']}
                                        onChange=${e => setFormData({...formData, [field + '_pt']: e.target.value})}></textarea>
                                    <textarea placeholder="中文" rows="3"
                                        class="w-full px-3 py-2 border rounded"
                                        value=${formData[field + '_zh']}
                                        onChange=${e => setFormData({...formData, [field + '_zh']: e.target.value})}></textarea>
                                </div>
                            </div>
                        `)}
                    </div>
                ` : ''}
                
                <!-- Submit Buttons -->
                <div class="flex justify-end space-x-2 mt-6">
                    <button type="button"
                        onClick=${() => { setEditingCasino(null); setShowForm(false); }}
                        class="px-4 py-2 border rounded hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                        ${editingCasino ? 'Update Casino' : 'Create Casino'}
                    </button>
                </div>
            </form>
        </div>
    `;
};

export default CasinoForm;