import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import Header from './components/Header';
import AnimatedCounter from './components/AnimatedCounter';
import CookieInvestorPopup from './components/CookieInvestorPopup';
import PasswordOverlay from './components/PasswordOverlay';
import { useOnScreen } from './hooks/useOnScreen';
import type { ProjectionData } from './types';

const USD_TO_AED_RATE = 3.67;

const translations = {
    en: {
        // Meta & Buttons
        contactUs: "Contact Us",
        scheduleMeeting: "Schedule a Meeting",
        downloadPDF: "Download PDF",
        viewAllPartners: "View All Partners",
        partnersModalTitle: "Our Valued Partners",

        // Hero Section
        heroPreTitle: "Series A Investment Opportunity",
        heroTitle: "Revolutionizing the UAE's Automotive Parts Market & Shipping Globally",
        heroSubtitle: "Part2Car.ae is the region's first comprehensive B2B automotive parts marketplace, connecting suppliers, workshops, and retailers through innovative technology.",
        
        // About Section
        aboutTitle: "About Part2Car.ae",
        aboutSubtitle: "The first AI-powered automotive parts marketplace in the GCC, connecting repair shops with verified suppliers through intelligent automation.",
        
        // Revenue Model Section
        revenueModelTitle: "Revenue Model",
        revenueModelSubtitle: "Multiple revenue streams ensuring sustainable growth",
        revenueStreams: [
            { badge: 'Recurring', title: 'Part Shelves Fees', desc: 'Suppliers pay recurring fees to list products on our virtual shelves, ensuring a stable baseline income.' },
            { num: '12-18%', title: 'Commission Rate', desc: 'Per transaction from suppliers, scaled by volume.' },
            { badge: 'Premium', title: 'Supplier Plans', desc: 'Enhanced visibility, analytics, and priority placement.' },
            { badge: 'SaaS', title: 'Vendors and Repair Shop tools', desc: 'SaaS suite including analytics, inventory management, and CRM for both vendors and repair shops.' }
        ],

        // Core Features Section
        featuresTitle: "Core Features",
        features: [
            { icon: '🤖', title: 'AI-Powered Search', desc: 'Advanced AI chatbot helps customers find the right part in seconds, not hours.' },
            { icon: '⚡️', title: 'Instant Quotes', desc: 'Real-time pricing from multiple suppliers with transparent comparison.' },
            { icon: '🛠️', title: 'Partners & Vendors AI Toolkit', desc: 'ML-driven inventory management and dynamic pricing to optimize stock and maximize profits.' },
            { icon: '📊', title: 'Datametra (RAG)', desc: 'In-house RAG AI helping vendors, partners, and users understand their data.' },
            { icon: '🔗', title: 'Instagram Sync', desc: 'Vendors publish once on Instagram, and their parts are automatically updated on Part2Car.' },
            { icon: '🏪', title: 'Vendor Storefronts', desc: 'Dedicated vendor pages with full contact details to enhance brand visibility and direct communication.' }
        ],
        
        // Partners Section
        partnersTitle: "Strategic Partners",
        insurancePartners: "Insurance Partners",
        insurancePartnerNames: ['AXA Gulf', 'Oman Insurance', 'Al Buhaira', 'ADNIC', 'Noor Takaful', 'RSA Middle East'],
        globalShipping: "Global Shipping",
        shippingPartnerNames: ['DHL Express', 'Aramex', 'FedEx', 'UPS', 'TNT Express', 'Posta Plus'],

        // Projections Section
        projectionsTitle: "3-Year Growth Projections",
        projectionsSubtitle: "Ambitious yet achievable targets backed by market validation and operational excellence",
        yearKeys: { 'Year 1': 'Year 1', 'Year 2': 'Year 2', 'Year 3': 'Year 3' },
        projectedRevenue: "Projected Revenue",
        activeCustomers: "Active Customers",
        monthlyOrders: "Monthly Orders",
        grossMargin: "Gross Margin",
        virtualShelves: "Virtual Shelves Occupied",
        partners: "Partners",
        chartMonthsLabel: "Months",
        chartRevenueLabel: (currency: string) => `Projected Revenue (${currency} M)`,

        // Problem & Solution Section
        problemTitle: "The Problem",
        problemSubtitle: "The UAE automotive aftermarket is worth $4.8B but remains highly inefficient:",
        problems: [
            'Fragmented supply chain with 1000+ small suppliers', 'Scattered data on parts, compatibility, and prices',
            'No price transparency or quality standards', 'Outdated, traditional business practices',
            'Average 2-3 days lead time for parts delivery', 'High operational costs for workshops (15-20%)'
        ],
        solutionTitle: "Our Solution",
        solutionSubtitle: "Part2Car.ae transforms the industry through technology and innovation:",
        solutions: [
            'Unified digital marketplace connecting all stakeholders', 'AI-powered pricing engine becoming the market reference for fair pricing',
            'Streamlined worldwide shipping & same-day local delivery', 'State-of-the-art AI & automation tools for partners and vendors',
            'Reduced operational costs by up to 40% through our platform'
        ],

        // Market Section
        marketTitle: "Massive Market Opportunity",
        marketSubtitle: "Capturing share in a rapidly growing, under-digitized market",
        marketStats: [
            { label: 'UAE Automotive Aftermarket' }, { label: 'GCC Market Size' },
            { label: 'Projected CAGR' }, { label: 'Digital Penetration' },
        ],
        
        // Why Now Section
        whyNowTitle: "Why Now?",
        marketDynamicsTitle: "Market Dynamics",
        marketDynamics: [
            '3.5M vehicles on UAE roads (growing 8% annually)', '4,500+ automotive workshops nationwide',
            'Increasing demand for premium OEM parts', 'Government push for digital transformation'
        ],
        competitiveEdgeTitle: "Competitive Edge",
        competitiveEdge: [
            'First-mover advantage in B2B marketplace', 'Proprietary AI pricing and inventory system',
            'Strategic partnerships with 200+ suppliers', 'Regulatory compliance and trade licenses'
        ],

        // Business Model Section
        businessModelTitle: "Proven Business Model",
        businessModelSubtitle: "Multiple revenue streams with strong unit economics and high scalability",
        businessModelData: [
            { name: 'Platform Commission', description: '7-12% commission on all transactions' },
            { name: 'Logistics Services', description: 'Last-mile delivery and warehousing' },
            { name: 'Premium Features', description: 'Analytics, API access, and priority support' },
            { name: 'Financing Services', description: 'Trade credit and payment solutions' },
        ],
        avgOrderValue: "Average Order Value",
        annualPurchases: "Annual Purchases / Customer",
        paybackPeriod: "Payback Period",
        
        // Investment Section
        investmentTitle: "Investment Opportunity",
        investmentPreTitle: "Series A",
        investmentSubtitle: "Series A round to accelerate growth and regional expansion",
        roundDetails: "Round Details",
        seeking: "Seeking:",
        valuation: "Valuation:",
        equityOffered: "Equity Offered:",
        minInvestment: "Min. Investment:",
        targetsTitle: "18-Month Targets",
        annualRevenue: "Annual Revenue:",
        activeCustomersLabel: "Active Customers:",
        gccMarkets: "GCC Markets:",
        cities: "Cities",
        useOfFunds: "Use of Funds",
        useOfFundsData: [
            { name: 'Technology & Product', description: 'AI/ML capabilities, mobile apps, and API infrastructure' },
            { name: 'Market Expansion', description: 'GCC expansion and new city launches' },
            { name: 'Operations & Logistics', description: 'Warehouses, delivery fleet, and team growth' },
        ],
        
        // CTA Section
        ctaTitle: "Ready to Transform the Industry?",
        ctaSubtitle: "Join us in building the future of automotive commerce in the Middle East",

        // Footer
        footerText: "All Rights Reserved.",

        // Contact Modal
        modalTitle: "Contact Us",
        modalSubtitle: "Have a question or want to discuss the opportunity? Fill out the form below.",
        fullName: "Full Name",
        emailAddress: "Email Address",
        message: "Message",
        sendMessage: "Send Message",
        
        // Investor Cookie Popup
        cookieTitle: "🧐 Just Checking...",
        cookieMessage: "We use cookies to ensure this pitch deck is as revolutionary as our business model. By clicking below, you're confirming you have an eye for billion-dollar opportunities. Are you in?",
        cookieAccept: "I'm a Visionary Investor",
    },
    ar: {
        // Meta & Buttons
        contactUs: "اتصل بنا",
        scheduleMeeting: "حدد اجتماعًا",
        downloadPDF: "تحميل PDF",
        viewAllPartners: "عرض كل الشركاء",
        partnersModalTitle: "شركاؤنا الكرام",

        // Hero Section
        heroPreTitle: "فرصة استثمارية (الفئة أ)",
        heroTitle: "ثورة في سوق قطع غيار السيارات في الإمارات، مع الشحن العالمي",
        heroSubtitle: "Part2Car.ae هي أول سوق شامل لقطع غيار السيارات بين الشركات في المنطقة، وتربط الموردين وورش العمل وتجار التجزئة من خلال التكنولوجيا المبتكرة.",
        
        // About Section
        aboutTitle: "عن Part2Car.ae",
        aboutSubtitle: "أول سوق لقطع غيار السيارات مدعوم بالذكاء الاصطناعي في دول مجلس التعاون الخليجي، يربط ورش التصليح بالموردين المعتمدين من خلال الأتمتة الذكية.",
        
        // Revenue Model Section
        revenueModelTitle: "نموذج الإيرادات",
        revenueModelSubtitle: "تدفقات إيرادات متعددة تضمن نموًا مستدامًا",
        revenueStreams: [
            { badge: 'متكرر', title: 'رسوم الرفوف الافتراضية', desc: 'يدفع الموردون رسومًا متكررة لإدراج منتجاتهم على رفوفنا الافتراضية، مما يضمن دخلاً أساسيًا ثابتًا.' },
            { num: '12-18%', title: 'معدل العمولة', desc: 'لكل معاملة من الموردين، يتم تحديدها حسب الحجم.' },
            { badge: 'مميز', title: 'خطط الموردين', desc: 'رؤية معززة، تحليلات، ووضع ذو أولوية.' },
            { badge: 'برنامج كخدمة', title: 'أدوات للبائعين وورش التصليح', desc: 'مجموعة برامج كخدمة تشمل التحليلات، إدارة المخزون، وإدارة علاقات العملاء لكل من البائعين وورش التصليح.' }
        ],

        // Core Features Section
        featuresTitle: "الميزات الأساسية",
        features: [
            { icon: '🤖', title: 'بحث مدعوم بالذكاء الاصطناعي', desc: 'يساعد روبوت الدردشة المتقدم العملاء في العثور على القطعة المناسبة في ثوانٍ، وليس ساعات.' },
            { icon: '⚡️', title: 'عروض أسعار فورية', desc: 'أسعار فورية من موردين متعددين مع مقارنة شفافة.' },
            { icon: '🛠️', title: 'مجموعة أدوات الذكاء الاصطناعي للشركاء والبائعين', desc: 'إدارة مخزون تعتمد على التعلم الآلي وتسعير ديناميكي لتحسين المخزون وزيادة الأرباح.' },
            { icon: '📊', title: 'داتامترا (RAG)', desc: 'ذكاء اصطناعي (RAG) داخلي يساعد البائعين والشركاء والمستخدمين على فهم بياناتهم.' },
            { icon: '🔗', title: 'مزامنة مع انستغرام', desc: 'ينشر البائعون مرة واحدة على انستغرام، ويتم تحديث قطعهم تلقائيًا على Part2Car.' },
            { icon: '🏪', title: 'واجهات متاجر البائعين', desc: 'صفحات مخصصة للبائعين مع تفاصيل اتصال كاملة لتعزيز رؤية العلامة التجارية والتواصل المباشر.' }
        ],
        
        // Partners Section
        partnersTitle: "الشركاء الاستراتيجيون",
        insurancePartners: "شركاء التأمين",
        insurancePartnerNames: ['أكسا الخليج', 'عمان للتأمين', 'البحيرة للتأمين', 'أدنيك', 'نور تكافل', 'آر إس إيه الشرق الأوسط'],
        globalShipping: "الشحن العالمي",
        shippingPartnerNames: ['دي إتش إل إكسبرس', 'أرامكس', 'فيديكس', 'يو بي إس', 'تي إن تي إكسبرس', 'بوستا بلس'],

        // Projections Section
        projectionsTitle: "توقعات النمو لمدة 3 سنوات",
        projectionsSubtitle: "أهداف طموحة ولكنها قابلة للتحقيق مدعومة بالتحقق من السوق والتميز التشغيلي",
        yearKeys: { 'Year 1': 'السنة الأولى', 'Year 2': 'السنة الثانية', 'Year 3': 'السنة الثالثة' },
        projectedRevenue: "الإيرادات المتوقعة",
        activeCustomers: "العملاء النشطون",
        monthlyOrders: "الطلبات الشهرية",
        grossMargin: "هامش الربح الإجمالي",
        virtualShelves: "الرفوف الافتراضية المشغولة",
        partners: "الشركاء",
        chartMonthsLabel: "أشهر",
        chartRevenueLabel: (currency: string) => `الإيرادات المتوقعة (مليون ${currency})`,

        // Problem & Solution Section
        problemTitle: "المشكلة",
        problemSubtitle: "تبلغ قيمة سوق ما بعد البيع للسيارات في الإمارات 4.8 مليار دولار ولكنه لا يزال غير فعال إلى حد كبير:",
        problems: [
            'سلسلة توريد مجزأة مع أكثر من 1000 مورد صغير', 'بيانات متناثرة حول القطع والتوافق والأسعار',
            'لا توجد شفافية في الأسعار أو معايير جودة', 'ممارسات تجارية قديمة وتقليدية',
            'متوسط وقت التسليم للقطع من 2-3 أيام', 'تكاليف تشغيلية عالية للورش (15-20%)'
        ],
        solutionTitle: "حلنا",
        solutionSubtitle: "Part2Car.ae يغير الصناعة من خلال التكنولوجيا والابتكار:",
        solutions: [
            'سوق رقمي موحد يربط جميع أصحاب المصلحة', 'محرك تسعير مدعوم بالذكاء الاصطناعي يصبح مرجع السوق للتسعير العادل',
            'شحن عالمي مبسط وتوصيل محلي في نفس اليوم', 'أحدث أدوات الذكاء الاصطناعي والأتمتة للشركاء والبائعين',
            'تقليل التكاليف التشغيلية بنسبة تصل إلى 40% من خلال منصتنا'
        ],

        // Market Section
        marketTitle: "فرصة سوقية هائلة",
        marketSubtitle: "الاستحواذ على حصة في سوق ينمو بسرعة ويعاني من نقص الرقمنة",
        marketStats: [
            { label: 'سوق ما بعد البيع للسيارات في الإمارات' }, { label: 'حجم سوق دول مجلس التعاون الخليجي' },
            { label: 'معدل النمو السنوي المركب المتوقع' }, { label: 'الاختراق الرقمي' },
        ],
        
        // Why Now Section
        whyNowTitle: "لماذا الآن؟",
        marketDynamicsTitle: "ديناميكيات السوق",
        marketDynamics: [
            '3.5 مليون مركبة على طرق الإمارات (تنمو بنسبة 8% سنويًا)', 'أكثر من 4,500 ورشة سيارات على مستوى الدولة',
            'زيادة الطلب على قطع غيار أصلية عالية الجودة', 'توجه حكومي نحو التحول الرقمي'
        ],
        competitiveEdgeTitle: "الميزة التنافسية",
        competitiveEdge: [
            'ميزة المحرك الأول في سوق B2B', 'نظام تسعير ومخزون خاص يعتمد على الذكاء الاصطناعي',
            'شراكات استراتيجية مع أكثر من 200 مورد', 'الامتثال التنظيمي والتراخيص التجارية'
        ],

        // Business Model Section
        businessModelTitle: "نموذج عمل مثبت",
        businessModelSubtitle: "تدفقات إيرادات متعددة مع اقتصاديات وحدة قوية وقابلية عالية للتوسع",
        businessModelData: [
            { name: 'عمولة المنصة', description: 'عمولة 7-12% على جميع المعاملات' },
            { name: 'الخدمات اللوجستية', description: 'توصيل الميل الأخير والتخزين' },
            { name: 'الميزات المميزة', description: 'التحليلات، الوصول إلى API، والدعم ذو الأولوية' },
            { name: 'خدمات التمويل', description: 'الائتمان التجاري وحلول الدفع' },
        ],
        avgOrderValue: "متوسط قيمة الطلب",
        annualPurchases: "المشتريات السنوية / عميل",
        paybackPeriod: "فترة الاسترداد",
        
        // Investment Section
        investmentTitle: "فرصة استثمارية",
        investmentPreTitle: "الفئة أ",
        investmentSubtitle: "جولة استثمارية (الفئة أ) لتسريع النمو والتوسع الإقليمي",
        roundDetails: "تفاصيل الجولة",
        seeking: "المبلغ المطلوب:",
        valuation: "التقييم:",
        equityOffered: "الحصة المعروضة:",
        minInvestment: "الحد الأدنى للاستثمار:",
        targetsTitle: "أهداف الـ 18 شهرًا",
        annualRevenue: "الإيرادات السنوية:",
        activeCustomersLabel: "العملاء النشطون:",
        gccMarkets: "أسواق دول مجلس التعاون:",
        cities: "مدن",
        useOfFunds: "استخدام الأموال",
        useOfFundsData: [
            { name: 'التكنولوجيا والمنتج', description: 'قدرات الذكاء الاصطناعي/التعلم الآلي، تطبيقات الجوال، والبنية التحتية لـ API' },
            { name: 'توسيع السوق', description: 'التوسع في دول مجلس التعاون الخليجي وإطلاق مدن جديدة' },
            { name: 'العمليات والخدمات اللوجستية', description: 'المستودعات، أسطول التوصيل، ونمو الفريق' },
        ],
        
        // CTA Section
        ctaTitle: "هل أنت مستعد لتغيير الصناعة؟",
        ctaSubtitle: "انضم إلينا في بناء مستقبل تجارة السيارات في الشرق الأوسط",

        // Footer
        footerText: "جميع الحقوق محفوظة.",

        // Contact Modal
        modalTitle: "اتصل بنا",
        modalSubtitle: "لديك سؤال أو ترغب في مناقشة الفرصة؟ املأ النموذج أدناه.",
        fullName: "الاسم الكامل",
        emailAddress: "البريد الإلكتروني",
        message: "الرسالة",
        sendMessage: "إرسال الرسالة",

        // Investor Cookie Popup
        cookieTitle: "🧐 لحظة من فضلك...",
        cookieMessage: "نحن نستخدم ملفات تعريف الارتباط (الكوكيز) لنتأكد من أن هذا العرض التقديمي ثوري مثل نموذج عملنا. بالنقر أدناه، فأنت تؤكد أن لديك نظرة ثاقبة للفرص المليارية. هل أنت معنا؟",
        cookieAccept: "أنا مستثمر صاحب رؤية",
    }
};


const PROJECTION_DATA: ProjectionData = {
  'Year 1': { revenue: 0.8, customers: 1200, orders: 50000, margin: 42, virtualShelves: 360000, partners: 20 },
  'Year 2': { revenue: 2.3, customers: 3500, orders: 150000, margin: 45, virtualShelves: 1000000, partners: 80 },
  'Year 3': { revenue: 6.2, customers: 8000, orders: 350000, margin: 48, virtualShelves: 2000000, partners: 200 },
};

const BASE_REVENUE_CHART_DATA = [
  { name: '0', revenue: 0 }, { name: '6', revenue: 0.4 }, { name: '12', revenue: 0.8 }, { name: '18', revenue: 1.5 }, { name: '24', revenue: 2.3 }, { name: '30', revenue: 4.0 }, { name: '36', revenue: 6.2 },
];

const BUSINESS_MODEL_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

const USE_OF_FUNDS_VALUES = [
    { value: 40 }, { value: 30 }, { value: 30 },
];

const FadeInSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

const Section: React.FC<{id: string, children: React.ReactNode, className?: string}> = ({ id, children, className = 'bg-transparent' }) => (
    <section id={id} className={`py-20 lg:py-32 ${className}`}>
        <div className="container mx-auto px-6">
            {children}
        </div>
    </section>
);

const SectionTitle: React.FC<{preTitle?: string, children: React.ReactNode, subTitle?: string}> = ({ preTitle, children, subTitle }) => (
    <div className="text-center mb-12">
        {preTitle && <p className="text-blue-500 font-semibold mb-2">{preTitle}</p>}
        <h2 className="text-3xl lg:text-5xl font-bold text-white">{children}</h2>
        {subTitle && <p className="text-slate-400 mt-4 max-w-3xl mx-auto text-lg">{subTitle}</p>}
    </div>
);

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeProjection, setActiveProjection] = useState('Year 1');
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const [currency, setCurrency] = useState<'USD' | 'AED'>('USD');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);
    const [showCookiePopup, setShowCookiePopup] = useState(false);
    
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);
    
    useEffect(() => {
        if (isAuthenticated) {
            window.scrollTo(0, 0);
        }
    }, [isAuthenticated]);
    
    useEffect(() => {
        const consent = localStorage.getItem('investor_consent');
        if (!consent) {
          const timer = setTimeout(() => {
            setShowCookiePopup(true);
          }, 1500);
          return () => clearTimeout(timer);
        }
    }, []);
    
    const handleAcceptCookies = () => {
        localStorage.setItem('investor_consent', 'true');
        setShowCookiePopup(false);
    };

    const content = translations[language];

    const convertCurrency = (value: number) => {
        return currency === 'AED' ? value * USD_TO_AED_RATE : value;
    };
    
    const formatCurrency = (value: number, unit: 'M' | 'B' | 'K' | '' = '') => {
        const convertedValue = convertCurrency(value);
        const symbol = currency === 'USD' ? '$' : '';
        const code = currency === 'AED' ? ' AED' : '';
        const num = convertedValue.toLocaleString(undefined, { maximumFractionDigits: 1 });
        return `${symbol}${num}${unit}${code}`;
    };

    const handleDownloadPDF = () => {
        window.print();
    };
    
    const revenueChartData = BASE_REVENUE_CHART_DATA.map(d => ({...d, revenue: convertCurrency(d.revenue)}));

    const useOfFundsData = useMemo(() => {
        return USE_OF_FUNDS_VALUES.map((item, index) => ({
            ...item,
            name: content.useOfFundsData[index].name,
            description: content.useOfFundsData[index].description,
        }))
    }, [content]);

    const marketStatValues = useMemo(() => {
        const values = [
            { value: 4.8, unit: 'B' },
            { value: 12, unit: 'B' },
            { value: 7.5, unit: '%' },
            { value: 5, unit: '%', prefix: '<' }
        ];
        return values.map(v => ({
            ...v,
            value: currency === 'AED' && v.unit === 'B' ? v.value * USD_TO_AED_RATE : v.value
        }));
    }, [currency]);

    return (
        <div className="text-white">
            <Header 
                language={language} 
                setLanguage={setLanguage} 
                currency={currency} 
                setCurrency={setCurrency} 
                onDownloadPDF={handleDownloadPDF}
            />
            <main>
                {/* 1. Hero Section */}
                <section id="hero" className="min-h-screen flex items-center bg-gradient-to-b from-transparent to-black/50 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-5"></div>
                    <div className="container mx-auto px-6 text-center z-10">
                        <FadeInSection>
                            <p className="text-blue-500 font-semibold mb-4">{content.heroPreTitle}</p>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">{content.heroTitle}</h1>
                            <p className="max-w-3xl mx-auto text-slate-300 text-lg lg:text-xl mb-10">{content.heroSubtitle}</p>
                            <div className="flex justify-center gap-4 no-print">
                                <a href="https://calendly.com/njoober/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg">{content.scheduleMeeting}</a>
                                <button onClick={() => setIsContactModalOpen(true)} className="border-2 border-slate-500 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg">{content.contactUs}</button>
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* 2. About Section */}
                <Section id="about" className="bg-black/25">
                   <FadeInSection className="max-w-4xl mx-auto text-center">
                        <SectionTitle>{content.aboutTitle}</SectionTitle>
                        <p className="text-2xl lg:text-3xl text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.aboutSubtitle.replace(/AI-powered/g, '<span class="text-blue-400">AI-powered</span>').replace(/intelligent automation/g, '<span class="text-blue-400">intelligent automation</span>').replace(/مدعوم بالذكاء الاصطناعي/g, '<span class="text-blue-400">مدعوم بالذكاء الاصطناعي</span>').replace(/الأتمتة الذكية/g, '<span class="text-blue-400">الأتمتة الذكية</span>') }}></p>
                   </FadeInSection>
                </Section>
                
                {/* 3. Revenue Model Section */}
                <Section id="revenue">
                    <FadeInSection>
                        <SectionTitle subTitle={content.revenueModelSubtitle}>{content.revenueModelTitle}</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {content.revenueStreams.map((item, index) => (
                                <div key={index} className="glassmorphism p-8 rounded-xl text-center transform hover:-translate-y-2 transition-transform duration-300">
                                    {item.num ? <p className="text-5xl font-bold text-blue-500 mb-4">{item.num}</p> : <span className="inline-block bg-blue-500/20 text-blue-400 font-semibold px-4 py-1 rounded-full mb-4">{item.badge}</span>}
                                    <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                                    <p className="text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>
                </Section>
                
                {/* 4. Core Features Section */}
                <Section id="features" className="bg-black/25">
                    <FadeInSection>
                        <SectionTitle>{content.featuresTitle}</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             {content.features.map((feature, i) => (
                                <div key={i} className="glassmorphism p-8 rounded-xl text-center transition-all duration-300 hover:bg-white/10 hover:scale-105">
                                    <div className="text-6xl mb-4">{feature.icon}</div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-slate-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>
                </Section>

                {/* 5. Strategic Partners Section */}
                <Section id="partners">
                    <FadeInSection>
                        <SectionTitle>{content.partnersTitle}</SectionTitle>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
                            <div className="text-center">
                                <h3 className="text-2xl font-semibold mb-6 text-slate-300">{content.insurancePartners}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                                    {content.insurancePartnerNames.slice(0, 3).map(name => (
                                        <div key={name} className="glassmorphism p-4 rounded-lg">
                                            <p className="text-slate-300 font-medium text-md">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div className="text-center">
                                <h3 className="text-2xl font-semibold mb-6 text-slate-300">{content.globalShipping}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                                    {content.shippingPartnerNames.slice(0, 3).map(name => (
                                        <div key={name} className="glassmorphism p-4 rounded-lg">
                                            <p className="text-slate-300 font-medium text-md">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="text-center no-print">
                            <button onClick={() => setIsPartnersModalOpen(true)} className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg">
                                {content.viewAllPartners}
                            </button>
                        </div>
                    </FadeInSection>
                </Section>

                {/* 6. Projections Section */}
                <Section id="projections" className="bg-black/25">
                    <FadeInSection>
                        <SectionTitle subTitle={content.projectionsSubtitle}>
                            {content.projectionsTitle}
                        </SectionTitle>
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-center mb-8 border-b border-slate-700">
                                {Object.keys(PROJECTION_DATA).map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setActiveProjection(year)}
                                        className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 focus:outline-none ${
                                            activeProjection === year
                                                ? 'border-b-2 border-blue-500 text-white'
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {content.yearKeys[year]}
                                    </button>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center mb-12">
                                {[
                                    { label: content.projectedRevenue, value: PROJECTION_DATA[activeProjection].revenue, prefix: currency === 'USD' ? '$' : '', suffix: `M${currency === 'AED' ? ' AED' : ''}`, isFloat: true, convert: true },
                                    { label: content.activeCustomers, value: PROJECTION_DATA[activeProjection].customers },
                                    { label: content.monthlyOrders, value: PROJECTION_DATA[activeProjection].orders },
                                    { label: content.grossMargin, value: PROJECTION_DATA[activeProjection].margin, suffix: '%' },
                                    { label: content.virtualShelves, value: PROJECTION_DATA[activeProjection].virtualShelves },
                                    { label: content.partners, value: PROJECTION_DATA[activeProjection].partners },
                                ].map(stat => (
                                    <div key={stat.label} className="glassmorphism p-4 rounded-lg">
                                        <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-blue-400">
                                            {stat.prefix || ''}
                                            {(stat.convert ? convertCurrency(stat.value) : stat.value).toLocaleString(undefined, { maximumFractionDigits: stat.isFloat ? 1 : 0 })}
                                            {stat.suffix || ''}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="h-96 glassmorphism p-4 rounded-xl">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                        <XAxis dataKey="name" stroke="#94A3B8" label={{ value: content.chartMonthsLabel, position: 'insideBottom', offset: -15, fill: '#94A3B8' }} />
                                        <YAxis stroke="#94A3B8" label={{ value: content.chartRevenueLabel(currency), angle: -90, position: 'insideLeft', fill: '#94A3B8' }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(5px)' }} />
                                        <Legend wrapperStyle={{ color: '#E2E8F0', paddingTop: '20px' }} />
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" name={content.projectedRevenue} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </FadeInSection>
                </Section>
                
                {/* 7. Problem & Solution Section */}
                <Section id="problem-solution">
                    <FadeInSection>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                             <div>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{content.problemTitle}</h2>
                                <p className="text-slate-400 mb-8 text-lg">{content.problemSubtitle}</p>
                                <ul className="space-y-4">
                                    {content.problems.map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span className="text-slate-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div className="glassmorphism p-8 rounded-xl mt-8 lg:mt-0">
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-green-400">{content.solutionTitle}</h2>
                                <p className="text-slate-300 mb-8 text-lg">{content.solutionSubtitle}</p>
                                <ul className="space-y-4">
                                    {content.solutions.map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            <span className="text-slate-200">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </FadeInSection>
                </Section>

                {/* 8. Market Section */}
                <Section id="market" className="bg-black/25">
                    <FadeInSection>
                        <SectionTitle subTitle={content.marketSubtitle}>{content.marketTitle}</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">
                            {content.marketStats.map((stat, i) => (
                                <div key={i} className="glassmorphism p-8 rounded-xl transform hover:-translate-y-2 transition-transform duration-300">
                                    <p className="text-5xl font-bold text-blue-500 mb-4">
                                        <AnimatedCounter 
                                            end={marketStatValues[i].value}
                                            prefix={marketStatValues[i].prefix || (currency === 'USD' ? '$' : '')}
                                            suffix={`${marketStatValues[i].unit || ''}${currency === 'AED' && (marketStatValues[i].unit === 'B' || marketStatValues[i].unit === 'M') ? ' AED' : ''}`}
                                        />
                                    </p>
                                    <h3 className="text-xl font-semibold text-slate-300">{stat.label}</h3>
                                </div>
                            ))}
                        </div>
                    </FadeInSection>
                </Section>

                {/* 9. Investment Section */}
                <Section id="investment">
                    <FadeInSection>
                        <SectionTitle preTitle={content.investmentPreTitle} subTitle={content.investmentSubtitle}>
                            {content.investmentTitle}
                        </SectionTitle>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                            <div className="lg:col-span-3 glassmorphism p-8 rounded-xl">
                                <h3 className="text-2xl font-bold mb-6">{content.roundDetails}</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.seeking}</span><span className="text-2xl font-semibold">{formatCurrency(2, 'M')}</span></div>
                                    <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.valuation}</span><span className="text-2xl font-semibold">{formatCurrency(12, 'M')} (Pre-money)</span></div>
                                    <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.equityOffered}</span><span className="text-2xl font-semibold">15%</span></div>
                                    <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.minInvestment}</span><span className="text-2xl font-semibold">{formatCurrency(50, 'K')}</span></div>
                                </div>
                                <div className="border-t border-slate-700 pt-6">
                                    <h3 className="text-2xl font-bold mb-6">{content.targetsTitle}</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.annualRevenue}</span><span className="text-xl font-semibold">{formatCurrency(5, 'M')}</span></div>
                                        <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.activeCustomersLabel}</span><span className="text-xl font-semibold">10,000+</span></div>
                                        <div className="flex justify-between items-baseline"><span className="text-slate-400">{content.gccMarkets}</span><span className="text-xl font-semibold">3 {content.cities}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 glassmorphism p-8 rounded-xl flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-6 text-center">{content.useOfFunds}</h3>
                                <div className="space-y-6">
                                    {useOfFundsData.map((entry, index) => (
                                        <div key={entry.name}>
                                            <div className="flex justify-between items-center mb-1 text-slate-300">
                                                <span>{entry.name}</span>
                                                <span className="font-semibold text-white">{entry.value}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-4">
                                                <div
                                                    className="h-4 rounded-full transition-all duration-500"
                                                    style={{ width: `${entry.value}%`, backgroundColor: BUSINESS_MODEL_COLORS[index % BUSINESS_MODEL_COLORS.length] }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </Section>
                
                {/* 10. CTA Section */}
                <Section id="cta" className="bg-gradient-to-t from-black/50 to-transparent">
                    <FadeInSection>
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-4">{content.ctaTitle}</h2>
                            <p className="text-slate-300 text-lg mb-8">{content.ctaSubtitle}</p>
                            <div className="flex justify-center gap-4 no-print">
                                <a href="https://calendly.com/njoober/30min" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg">{content.scheduleMeeting}</a>
                                <button onClick={() => setIsContactModalOpen(true)} className="border-2 border-slate-500 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg">{content.contactUs}</button>
                            </div>
                        </div>
                    </FadeInSection>
                </Section>
            </main>

            <footer className="py-8 bg-black/30 border-t border-slate-800">
                <div className="container mx-auto px-6 text-center text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Part2Car.ae. {content.footerText}</p>
                </div>
            </footer>
            
            {isContactModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] no-print" onClick={() => setIsContactModalOpen(false)}>
                    <div
                        className="glassmorphism rounded-xl p-8 max-w-lg w-full m-4 animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold">{content.modalTitle}</h3>
                            <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <p className="text-slate-400 mb-6">{content.modalSubtitle}</p>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">{content.fullName}</label>
                                <input type="text" id="name" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">{content.emailAddress}</label>
                                <input type="email" id="email" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                             <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">{content.message}</label>
                                <textarea id="message" rows={4} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105">{content.sendMessage}</button>
                        </form>
                    </div>
                </div>
            )}

            {isPartnersModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] no-print" onClick={() => setIsPartnersModalOpen(false)}>
                    <div
                        className="glassmorphism rounded-xl p-8 max-w-2xl w-full m-4 animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">{content.partnersModalTitle}</h3>
                            <button onClick={() => setIsPartnersModalOpen(false)} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                        </div>
                        <div className="space-y-8">
                             <div>
                                <h4 className="text-xl font-semibold mb-4 text-blue-400">{content.insurancePartners}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {content.insurancePartnerNames.map(name => (
                                        <div key={name} className="bg-slate-800/50 p-3 rounded-lg text-center">
                                            <p className="text-slate-300 font-medium text-sm">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="text-xl font-semibold mb-4 text-blue-400">{content.globalShipping}</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                     {content.shippingPartnerNames.map(name => (
                                        <div key={name} className="bg-slate-800/50 p-3 rounded-lg text-center">
                                            <p className="text-slate-300 font-medium text-sm">{name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CookieInvestorPopup 
                isVisible={showCookiePopup}
                onAccept={handleAcceptCookies}
                content={{
                    title: content.cookieTitle,
                    message: content.cookieMessage,
                    accept: content.cookieAccept
                }}
            />

            {!isAuthenticated && <PasswordOverlay onSuccess={() => setIsAuthenticated(true)} />}
        </div>
    );
};

export default App;