import { Context } from 'hono';

export type Language = 'en' | 'pt' | 'zh';

export const translations = {
  en: {
    siteName: 'Your Best Casino',
    tagline: 'The Best Online Casino Reviews',
    subtitle: 'Find the perfect casino for your playing style. We compare bonuses, games, and security for you.',
    nav: {
      home: 'Home',
      casinos: 'All Casinos',
      blog: 'Related Articles',
      contact: 'Contact',
      admin: 'Admin'
    },
    playerTypes: {
      title: 'Personalized Recommendations',
      subtitle: 'Discover casinos tailored to your playing style'
    },
    casino: {
      visitSite: 'Visit Casino',
      bonus: 'Welcome Bonus',
      minDeposit: 'Min. Deposit',
      paymentMethods: 'Payment Methods',
      license: 'License',
      founded: 'Founded',
      pros: 'Pros',
      cons: 'Cons',
      overview: 'Overview',
      details: 'Detailed Review',
      games: 'Games & Software',
      payments: 'Payment Options',
      support: 'Customer Support',
      mobile: 'Mobile Experience',
      security: 'Security & Fairness',
      responsibleGaming: 'Responsible Gaming'
    },
    ratings: {
      overall: 'Overall Rating',
      bonus: 'Bonus',
      games: 'Games',
      payment: 'Payment',
      support: 'Support',
      mobile: 'Mobile'
    },
    blog: {
      readMore: 'Read More',
      categories: 'Categories',
      recentPosts: 'Recent Posts',
      views: 'views'
    },
    contact: {
      title: 'Contact Us',
      email: 'Email',
      message: 'Message',
      send: 'Send Message'
    },
    footer: {
      copyright: '© 2025 Your Best Casino. All rights reserved.',
      disclaimer: 'Please gamble responsibly. 18+'
    }
  },
  pt: {
    siteName: 'Your Best Casino',
    tagline: 'As Melhores Análises de Cassinos Online',
    subtitle: 'Encontre o cassino perfeito para seu estilo de jogo. Comparamos bônus, jogos e segurança para você.',
    nav: {
      home: 'Início',
      casinos: 'Todos os Cassinos',
      blog: 'Artigos Relacionados',
      contact: 'Contato',
      admin: 'Admin'
    },
    playerTypes: {
      title: 'Recomendações Personalizadas',
      subtitle: 'Descubra cassinos adequados ao seu estilo de jogo'
    },
    casino: {
      visitSite: 'Visitar Cassino',
      bonus: 'Bônus de Boas-Vindas',
      minDeposit: 'Depósito Mínimo',
      paymentMethods: 'Métodos de Pagamento',
      license: 'Licença',
      founded: 'Fundado',
      pros: 'Prós',
      cons: 'Contras',
      overview: 'Visão Geral',
      details: 'Análise Detalhada',
      games: 'Jogos e Software',
      payments: 'Opções de Pagamento',
      support: 'Suporte ao Cliente',
      mobile: 'Experiência Móvel',
      security: 'Segurança e Justiça',
      responsibleGaming: 'Jogo Responsável'
    },
    ratings: {
      overall: 'Classificação Geral',
      bonus: 'Bônus',
      games: 'Jogos',
      payment: 'Pagamento',
      support: 'Suporte',
      mobile: 'Móvel'
    },
    blog: {
      readMore: 'Leia Mais',
      categories: 'Categorias',
      recentPosts: 'Posts Recentes',
      views: 'visualizações'
    },
    contact: {
      title: 'Fale Conosco',
      email: 'E-mail',
      message: 'Mensagem',
      send: 'Enviar Mensagem'
    },
    footer: {
      copyright: '© 2025 Your Best Casino. Todos os direitos reservados.',
      disclaimer: 'Jogue com responsabilidade. 18+'
    }
  },
  zh: {
    siteName: 'Your Best Casino',
    tagline: '最佳線上賭場評論',
    subtitle: '找到適合您遊戲風格的完美賭場。我們為您比較獎金、遊戲和安全性。',
    nav: {
      home: '首頁',
      casinos: '所有娛樂城',
      blog: '相關文章',
      contact: '聯繫我們',
      admin: '管理'
    },
    playerTypes: {
      title: '客製化推薦',
      subtitle: '發現適合您遊戲風格的娛樂城'
    },
    casino: {
      visitSite: '立即游戏',
      bonus: '欢迎奖金',
      minDeposit: '最低存款',
      paymentMethods: '支付方式',
      license: '许可证',
      founded: '成立年份',
      pros: '优点',
      cons: '缺点',
      overview: '概览',
      details: '详细评论',
      games: '游戏与软件',
      payments: '支付选项',
      support: '客户支持',
      mobile: '移动体验',
      security: '安全与公平',
      responsibleGaming: '负责任博彩'
    },
    ratings: {
      overall: '总体评分',
      bonus: '奖金',
      games: '游戏',
      payment: '支付',
      support: '支持',
      mobile: '移动'
    },
    blog: {
      readMore: '阅读更多',
      categories: '分类',
      recentPosts: '最新文章',
      views: '浏览'
    },
    contact: {
      title: '联系我们',
      email: '电子邮件',
      message: '消息',
      send: '发送消息'
    },
    footer: {
      copyright: '© 2025 Your Best Casino. 版权所有。',
      disclaimer: '请负责任地博彩。18岁以上'
    }
  }
};

export function detectLanguage(c: Context): Language {
  // Check for language cookie
  const cookies = c.req.header('Cookie');
  if (cookies) {
    const langMatch = cookies.match(/lang=([^;]+)/);
    if (langMatch && ['en', 'pt', 'zh'].includes(langMatch[1])) {
      return langMatch[1] as Language;
    }
  }

  // Check subdomain for Chinese
  const host = c.req.header('host') || '';
  if (host.startsWith('cn.') || host.startsWith('zh.')) {
    return 'zh';
  }

  // Check query parameter
  const url = new URL(c.req.url);
  const langParam = url.searchParams.get('lang');
  if (langParam && ['en', 'pt', 'zh'].includes(langParam)) {
    return langParam as Language;
  }

  // Check Accept-Language header for Portuguese (Brazil)
  const acceptLang = c.req.header('Accept-Language') || '';
  if (acceptLang.includes('pt-BR') || acceptLang.includes('pt')) {
    // Check if IP is from Brazil (simplified check - in production use geo-ip service)
    const cfCountry = c.req.header('CF-IPCountry');
    if (cfCountry === 'BR') {
      return 'pt';
    }
  }

  // Check for Chinese in Accept-Language
  if (acceptLang.includes('zh')) {
    return 'zh';
  }

  // Default to English
  return 'en';
}

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  // Fallback to English if translation not found
  if (!value && lang !== 'en') {
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
  }
  
  return value || key;
}