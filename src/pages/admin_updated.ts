// This file contains the updated PlayerTypeForm with casino selection functionality
// and updated BlogManager with category management

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
        is_active: true,
        casinos: [] // Selected casino IDs
    });
    
    const [availableCasinos, setAvailableCasinos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const iconOptions = [
        'fa-user', 'fa-user-plus', 'fa-dice', 'fa-fire', 'fa-calculator', 'fa-crown',
        'fa-star', 'fa-trophy', 'fa-gem', 'fa-coins', 'fa-wallet', 'fa-chart-line'
    ];
    
    useEffect(() => {
        loadCasinos();
    }, []);
    
    async function loadCasinos() {
        try {
            const res = await apiCall('/api/casinos');
            if (res.ok) {
                const data = await res.json();
                setAvailableCasinos(data.filter(c => c.is_active));
            }
        } catch (err) {
            console.error('Failed to load casinos:', err);
        }
        setLoading(false);
    }
    
    const handleCasinoToggle = (casinoId) => {
        const casinos = formData.casinos || [];
        if (casinos.includes(casinoId)) {
            setFormData({
                ...formData,
                casinos: casinos.filter(id => id !== casinoId)
            });
        } else {
            setFormData({
                ...formData,
                casinos: [...casinos, casinoId]
            });
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    if (loading) {
        return html`<div class="text-center py-8">Loading casinos...</div>`;
    }
    
    return html`
        <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-bold mb-4">${playerType ? 'Edit Player Type' : 'Add New Player Type'}</h3>
            <form onSubmit=${handleSubmit}>
                <div class="space-y-4">
                    <!-- Name fields -->
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                            <input type="text" class="w-full px-3 py-2 border rounded" required
                                value=${formData.name_en}
                                onChange=${e => setFormData({...formData, name_en: e.target.value})} />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name (Portuguese) *</label>
                            <input type="text" class="w-full px-3 py-2 border rounded" required
                                value=${formData.name_pt}
                                onChange=${e => setFormData({...formData, name_pt: e.target.value})} />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name (Chinese)</label>
                            <input type="text" class="w-full px-3 py-2 border rounded"
                                value=${formData.name_zh}
                                onChange=${e => setFormData({...formData, name_zh: e.target.value})} />
                        </div>
                    </div>
                    
                    <!-- Description fields -->
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                            <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                value=${formData.description_en}
                                onChange=${e => setFormData({...formData, description_en: e.target.value})}></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Portuguese)</label>
                            <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                value=${formData.description_pt}
                                onChange=${e => setFormData({...formData, description_pt: e.target.value})}></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description (Chinese)</label>
                            <textarea class="w-full px-3 py-2 border rounded" rows="2"
                                value=${formData.description_zh}
                                onChange=${e => setFormData({...formData, description_zh: e.target.value})}></textarea>
                        </div>
                    </div>
                    
                    <!-- Icon, Sort, Status -->
                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                            <select class="w-full px-3 py-2 border rounded"
                                value=${formData.icon}
                                onChange=${e => setFormData({...formData, icon: e.target.value})}>
                                ${iconOptions.map(icon => html`
                                    <option value=${icon}>${icon}</option>
                                `)}
                            </select>
                            <div class="mt-2">
                                <i class="fas ${formData.icon} text-purple-600 text-2xl"></i>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                            <input type="number" class="w-full px-3 py-2 border rounded"
                                value=${formData.sort_order}
                                onChange=${e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <div class="mt-2">
                                <input type="checkbox" id="player_active" class="mr-2"
                                    checked=${formData.is_active}
                                    onChange=${e => setFormData({...formData, is_active: e.target.checked})} />
                                <label for="player_active">Active</label>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Casino Selection -->
                    <div class="border-t pt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-3">
                            <i class="fas fa-dice mr-1"></i> Associated Casinos
                        </label>
                        <div class="bg-gray-50 rounded p-4">
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                ${availableCasinos.map(casino => html`
                                    <label class="flex items-center bg-white p-2 rounded border cursor-pointer hover:bg-blue-50">
                                        <input type="checkbox" class="mr-2"
                                            checked=${(formData.casinos || []).includes(casino.id)}
                                            onChange=${() => handleCasinoToggle(casino.id)} />
                                        <div class="flex items-center">
                                            ${casino.logo_url ? html`
                                                <img src="${casino.logo_url}" class="h-6 w-10 mr-2 object-contain" />
                                            ` : html`
                                                <div class="h-6 w-10 mr-2 bg-gray-200 rounded"></div>
                                            `}
                                            <span class="text-sm">${casino.name}</span>
                                        </div>
                                    </label>
                                `)}
                            </div>
                            <p class="text-xs text-gray-500 mt-2">
                                Selected: ${(formData.casinos || []).length} casinos
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" onClick=${onCancel}
                            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Cancel
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            <i class="fas fa-save mr-2"></i>
                            ${playerType ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    `;
}