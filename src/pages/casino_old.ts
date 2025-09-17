import { Language, t } from '../utils/language';
import { renderLayout } from './layout';

export function renderCasinoPage(lang: Language, casino: any): string {
  const pros = casino.pros ? JSON.parse(casino.pros) : [];
  
  const content = `
    <div class="container mx-auto px-4 py-8">
        <!-- Casino Header with Logo -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row items-center justify-between">
                <div class="flex items-center mb-4 md:mb-0">
                    <div class="bg-white p-4 rounded-lg mr-6 shadow-lg">
                        ${casino.logo_url ? 
                          `<img src="${casino.logo_url}" alt="${casino.name}" class="h-20 w-32 object-contain">` :
                          `<div class="h-20 w-32 flex items-center justify-center">
                            <span class="text-2xl font-bold text-purple-600">${casino.name}</span>
                          </div>`
                        }
                    </div>
                    <div>
                        <h1 class="text-4xl font-bold mb-2">${casino.name}</h1>
                        ${casino.founded_year ? `<p class="text-purple-100">${t(lang, 'casino.founded')}: ${casino.founded_year}</p>` : ''}
                    </div>
                </div>
                
                <a href="${casino.affiliate_link || casino.website_url}" target="_blank" rel="noopener noreferrer" 
                   class="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition shadow-lg transform hover:scale-105">
                    <i class="fas fa-play-circle mr-2"></i> ${t(lang, 'casino.visitSite')}
                </a>
            </div>
        </div>
        
        <!-- Overview Table Section -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-gray-50 px-6 py-4 border-b">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-info-circle mr-2 text-purple-600"></i>
                    ${lang === 'pt' ? 'Visão Geral' : lang === 'zh' ? '概览' : 'Overview'}
                </h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <tbody class="divide-y divide-gray-200">
                        <!-- Welcome Bonus -->
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 w-1/3 flex items-center">
                                <i class="fas fa-gift mr-3 text-purple-500"></i>
                                ${lang === 'pt' ? 'Bônus de Boas-Vindas' : lang === 'zh' ? '欢迎奖金' : 'Welcome Bonus'}
                            </td>
                            <td class="py-4 px-6 text-gray-800 font-medium">
                                ${casino.welcome_bonus || lang === 'pt' ? 'Consulte o site' : lang === 'zh' ? '请查看网站' : 'Check website'}
                            </td>
                        </tr>
                        
                        <!-- Minimum Deposit -->
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-coins mr-3 text-green-500"></i>
                                ${lang === 'pt' ? 'Depósito Mínimo' : lang === 'zh' ? '最低存款' : 'Minimum Deposit'}
                            </td>
                            <td class="py-4 px-6 text-gray-800 font-medium">
                                ${casino.min_deposit || 'R$ 10'}
                            </td>
                        </tr>
                        
                        <!-- Payment Methods -->
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-credit-card mr-3 text-blue-500"></i>
                                ${lang === 'pt' ? 'Métodos de Pagamento' : lang === 'zh' ? '支付方式' : 'Payment Methods'}
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex flex-wrap gap-2">
                                    ${(casino.payment_methods || 'PIX, Credit Cards').split(',').map(method => 
                                      `<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">${method.trim()}</span>`
                                    ).join('')}
                                </div>
                            </td>
                        </tr>
                        
                        <!-- License -->
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-certificate mr-3 text-yellow-500"></i>
                                ${lang === 'pt' ? 'Licença' : lang === 'zh' ? '许可证' : 'License'}
                            </td>
                            <td class="py-4 px-6 text-gray-800 font-medium">
                                ${casino.license || 'Curacao'}
                            </td>
                        </tr>
                        
                        <!-- Customer Support -->
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-headset mr-3 text-orange-500"></i>
                                ${lang === 'pt' ? 'Suporte ao Cliente' : lang === 'zh' ? '客户支持' : 'Customer Support'}
                            </td>
                            <td class="py-4 px-6 text-gray-800">
                                ${lang === 'pt' ? '24/7 Chat ao Vivo, Email' : lang === 'zh' ? '24/7 在线聊天、电子邮件' : '24/7 Live Chat, Email'}
                            </td>
                        </tr>
                        
                        <!-- Mobile App -->
                        <tr class="hover:bg-gray-50">
                            <td class="py-4 px-6 font-semibold text-gray-700 flex items-center">
                                <i class="fas fa-mobile-alt mr-3 text-pink-500"></i>
                                ${lang === 'pt' ? 'Aplicativo Móvel' : lang === 'zh' ? '移动应用' : 'Mobile App'}
                            </td>
                            <td class="py-4 px-6 text-gray-800">
                                ${lang === 'pt' ? 'iOS e Android disponíveis' : lang === 'zh' ? 'iOS和Android可用' : 'iOS and Android available'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Advantages Section (Only Pros, No Cons) -->
        ${pros.length > 0 ? `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-green-500 px-6 py-4">
                <h3 class="text-xl font-bold text-white">
                    <i class="fas fa-star mr-2"></i>
                    ${lang === 'pt' ? 'Vantagens' : lang === 'zh' ? '优势' : 'Advantages'}
                </h3>
            </div>
            <div class="p-6">
                <div class="grid md:grid-cols-2 gap-4">
                    ${pros.map(pro => `
                        <div class="flex items-start">
                            <div class="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                <i class="fas fa-check text-green-600"></i>
                            </div>
                            <span class="ml-3 text-gray-700">${pro}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>` : ''}
        
        <!-- Detailed Information Sections -->
        <div class="mb-8">
            <h2 class="text-2xl font-bold mb-6 text-center">
                ${lang === 'pt' ? 'Informações Detalhadas' : lang === 'zh' ? '详细信息' : 'Detailed Information'}
            </h2>
            <div class="space-y-6">
                <!-- Bonus Information -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Bônus e Promoções' : lang === 'zh' ? '奖金和促销' : 'Bonuses & Promotions',
                  casino.bonus_description || getDefaultBonusText(lang, casino.name),
                  'fa-gift',
                  'purple'
                )}
                
                <!-- Games Section -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Jogos Disponíveis' : lang === 'zh' ? '可用游戏' : 'Available Games',
                  casino.games_description || getDefaultGamesText(lang),
                  'fa-gamepad',
                  'blue'
                )}
                
                <!-- Payment Options -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Opções de Pagamento' : lang === 'zh' ? '支付选项' : 'Payment Options',
                  casino.payment_description || getDefaultPaymentText(lang),
                  'fa-credit-card',
                  'green'
                )}
                
                <!-- Customer Support -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Atendimento ao Cliente' : lang === 'zh' ? '客户服务' : 'Customer Service',
                  casino.support_description || getDefaultSupportText(lang),
                  'fa-headset',
                  'orange'
                )}
                
                <!-- Mobile Experience -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Experiência Móvel' : lang === 'zh' ? '移动体验' : 'Mobile Experience',
                  casino.mobile_description || getDefaultMobileText(lang),
                  'fa-mobile-alt',
                  'pink'
                )}
                
                <!-- Security -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Segurança e Confiabilidade' : lang === 'zh' ? '安全与可靠性' : 'Security & Reliability',
                  casino.security_description || getDefaultSecurityText(lang),
                  'fa-shield-alt',
                  'red'
                )}
                
                <!-- Responsible Gaming -->
                ${renderDetailSection(
                  lang === 'pt' ? 'Jogo Responsável' : lang === 'zh' ? '负责任博彩' : 'Responsible Gaming',
                  casino.responsible_gaming_description || getDefaultResponsibleText(lang),
                  'fa-user-shield',
                  'indigo'
                )}
            </div>
        </div>
        
        <!-- Final CTA Section -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-center">
            <h3 class="text-3xl font-bold text-white mb-4">
                ${lang === 'pt' ? 
                  `Comece a jogar no ${casino.name} agora!` : 
                  lang === 'zh' ? 
                  `立即开始在${casino.name}游戏！` : 
                  `Start playing at ${casino.name} now!`}
            </h3>
            <p class="text-purple-100 mb-6 text-lg">
                ${lang === 'pt' ? 
                  'Cadastre-se em minutos e aproveite o bônus de boas-vindas exclusivo!' : 
                  lang === 'zh' ? 
                  '几分钟内注册并享受独家欢迎奖金！' : 
                  'Register in minutes and enjoy the exclusive welcome bonus!'}
            </p>
            <a href="${casino.affiliate_link || casino.website_url}" target="_blank" rel="noopener noreferrer" 
               class="inline-block bg-green-500 text-white px-12 py-5 rounded-lg font-bold text-xl hover:bg-green-600 transition shadow-lg transform hover:scale-105">
                <i class="fas fa-rocket mr-3"></i> 
                ${lang === 'pt' ? 'JOGAR AGORA' : lang === 'zh' ? '立即游戏' : 'PLAY NOW'}
            </a>
        </div>
    </div>
  `;
  
  return renderLayout(lang, `${casino.name} - ${t(lang, 'siteName')}`, content);
}

function renderDetailSection(title: string, content: string | null, icon: string, color: string = 'purple'): string {
  if (!content) return '';
  
  const colorClasses = {
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    pink: 'bg-pink-50 border-pink-200 text-pink-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600'
  };
  
  const bgColor = colorClasses[color] || colorClasses.purple;
  
  return `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="${bgColor.split(' ')[0]} px-6 py-4 border-b-2 ${bgColor.split(' ')[1]}">
            <h3 class="text-xl font-bold flex items-center">
                <i class="fas ${icon} mr-3 ${bgColor.split(' ')[2]}"></i>
                <span class="text-gray-800">${title}</span>
            </h3>
        </div>
        <div class="p-6">
            <div class="prose max-w-none text-gray-700">
                ${content}
            </div>
        </div>
    </div>
  `;
}

// Default text functions for missing content
function getDefaultBonusText(lang: Language, casinoName: string): string {
  if (lang === 'pt') {
    return `${casinoName} oferece um generoso pacote de boas-vindas para novos jogadores brasileiros. O bônus inclui um match no primeiro depósito e pode incluir rodadas grátis em slots populares. Verifique os termos e condições para requisitos de apostas.`;
  } else if (lang === 'zh') {
    return `${casinoName}为巴西新玩家提供慷慨的欢迎套餐。奖金包括首次存款匹配，可能包括热门老虎机的免费旋转。请查看条款和条件了解投注要求。`;
  }
  return `${casinoName} offers a generous welcome package for new Brazilian players. The bonus includes a first deposit match and may include free spins on popular slots. Check terms and conditions for wagering requirements.`;
}

function getDefaultGamesText(lang: Language): string {
  if (lang === 'pt') {
    return 'Ampla seleção de jogos incluindo caça-níqueis, jogos de mesa, cassino ao vivo e apostas esportivas. Parcerias com os principais provedores de software garantem jogos de alta qualidade e justos.';
  } else if (lang === 'zh') {
    return '广泛的游戏选择，包括老虎机、桌面游戏、真人娱乐场和体育博彩。与顶级软件供应商的合作确保高质量和公平的游戏。';
  }
  return 'Wide selection of games including slots, table games, live casino and sports betting. Partnerships with top software providers ensure high-quality and fair games.';
}

function getDefaultPaymentText(lang: Language): string {
  if (lang === 'pt') {
    return 'Métodos de pagamento convenientes para jogadores brasileiros incluindo PIX para transferências instantâneas, cartões de crédito/débito, e carteiras eletrônicas. Processamento rápido de depósitos e saques.';
  } else if (lang === 'zh') {
    return '为巴西玩家提供便捷的支付方式，包括用于即时转账的PIX、信用卡/借记卡和电子钱包。快速处理存款和提款。';
  }
  return 'Convenient payment methods for Brazilian players including PIX for instant transfers, credit/debit cards, and e-wallets. Fast processing of deposits and withdrawals.';
}

function getDefaultSupportText(lang: Language): string {
  if (lang === 'pt') {
    return 'Suporte ao cliente disponível 24/7 através de chat ao vivo e email. Equipe de suporte em português pronta para ajudar com qualquer questão ou problema.';
  } else if (lang === 'zh') {
    return '通过实时聊天和电子邮件提供24/7客户支持。葡萄牙语支持团队随时准备帮助解决任何问题。';
  }
  return '24/7 customer support available via live chat and email. Portuguese-speaking support team ready to help with any questions or issues.';
}

function getDefaultMobileText(lang: Language): string {
  if (lang === 'pt') {
    return 'Site totalmente otimizado para dispositivos móveis com aplicativos dedicados disponíveis para iOS e Android. Jogue seus jogos favoritos em qualquer lugar, a qualquer momento.';
  } else if (lang === 'zh') {
    return '网站完全优化用于移动设备，提供iOS和Android专用应用程序。随时随地玩您最喜欢的游戏。';
  }
  return 'Fully optimized website for mobile devices with dedicated apps available for iOS and Android. Play your favorite games anywhere, anytime.';
}

function getDefaultSecurityText(lang: Language): string {
  if (lang === 'pt') {
    return 'Licenciado e regulamentado por autoridades respeitadas. Utiliza criptografia SSL de última geração para proteger dados pessoais e financeiros. Jogos auditados regularmente para garantir justiça.';
  } else if (lang === 'zh') {
    return '由受尊敬的机构许可和监管。使用最先进的SSL加密来保护个人和财务数据。定期审核游戏以确保公平性。';
  }
  return 'Licensed and regulated by respected authorities. Uses state-of-the-art SSL encryption to protect personal and financial data. Games regularly audited to ensure fairness.';
}

function getDefaultResponsibleText(lang: Language): string {
  if (lang === 'pt') {
    return 'Comprometido com o jogo responsável oferecendo ferramentas como limites de depósito, autoexclusão e links para organizações de apoio. Promove um ambiente de jogo seguro e controlado.';
  } else if (lang === 'zh') {
    return '致力于负责任的博彩，提供存款限额、自我排除和支持组织链接等工具。促进安全和受控的游戏环境。';
  }
  return 'Committed to responsible gaming by offering tools such as deposit limits, self-exclusion and links to support organizations. Promotes a safe and controlled gaming environment.';
}