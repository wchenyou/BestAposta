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
    </head>
    <body class="bg-gray-100">
        <div id="app" class="min-h-screen"></div>
        
        <script type="module">
            import { html, render, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js';
            
            const API_BASE = '/api/admin';
            let authToken = localStorage.getItem('adminToken');
            
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
                        <div class="flex-1 overflow-y-auto">
                            <div class="p-8">
                                <h2 class="text-3xl font-bold mb-6">
                                    \${activeTab === 'casinos' ? 'Manage Casinos' : ''}
                                    \${activeTab === 'players' ? 'Manage Player Types' : ''}
                                    \${activeTab === 'blog' ? 'Manage Blog' : ''}
                                    \${activeTab === 'contact' ? 'Contact Settings' : ''}
                                </h2>
                                
                                <div class="bg-white rounded-lg shadow p-6">
                                    <p class="text-gray-600">
                                        Select a section from the sidebar to manage content.
                                    </p>
                                </div>
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