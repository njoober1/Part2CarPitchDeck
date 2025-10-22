import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from 'recharts';
import Header from './components/Header';
import AnimatedCounter from './components/AnimatedCounter';
import CookieInvestorPopup from './components/CookieInvestorPopup';
import PasswordOverlay from './components/PasswordOverlay';
import FinancialProjections from './components/FinancialProjections';
import PodcastPlayer from './components/PodcastPlayer';
import BusinessCaseStudy from './components/BusinessCaseStudy';
import { useOnScreen } from './hooks/useOnScreen';
import type { ProjectionData } from './types';

const USD_TO_AED_RATE = 3.67;

const translations = {
    en: {
        // Meta & Buttons
        contactUs: "Contact Us",
        scheduleMeeting: "Schedule a Meeting",
        print: "Print",
        downloadDeck: "Download Deck",
        podcast: "Podcast",
        viewAllPartners: "View All Partners",
        partnersModalTitle: "Our Valued Partners",
        comingSoon: "Coming Soon",
        newFeature: "In progress",
        businessCaseStudy: "Business Case Study",

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
            { num: '12-18%', title: 'Commission Rate', desc: 'Per transaction from suppliers, scaled by volume.', status: 'coming-soon' },
            { badge: 'Premium', title: 'Supplier Plans', desc: 'Enhanced visibility, analytics, and priority placement.' },
            { badge: 'SaaS', title: 'Vendors and Repair Shop tools', desc: 'SaaS suite including analytics, inventory management, and CRM for both vendors and repair shops.' }
        ],

        // Core Features Section
        featuresTitle: "Core Features",
        features: [
            { icon: '🤖', title: 'AI-Powered Search', desc: 'Advanced AI chatbot helps customers find the right part in seconds, not hours.', status: 'new' },
            { icon: '⚡️', title: 'Instant Quotes', desc: 'Real-time pricing from multiple suppliers with transparent comparison.' },
            { icon: '🛠️', title: 'Partners & Vendors AI Toolkit', desc: 'ML-driven inventory management and dynamic pricing to optimize stock and maximize profits.', status: 'new' },
            { icon: '📊', title: 'Datametra (RAG)', desc: 'In-house RAG AI helping vendors, partners, and users understand their data.' },
            { icon: '🔗', title: 'Instagram Sync', desc: 'Vendors publish once on Instagram, and their parts are automatically updated on Part2Car.', status: 'new' },
            { icon: '🏪', title: 'Vendor Storefronts', desc: 'Dedicated vendor pages with full contact details to enhance brand visibility and direct communication.' }
        ],
        
        // Partners Section
        partnersTitle: "Targetted Strategic Partners",
        insurancePartners: "Insurance Partners",
        insurancePartnerNames: ['AXA Gulf', 'Sukoon', 'Al Buhaira', 'ADNIC', 'Noor Takaful', 'RSA Middle East', 'Emirates Insurance', 'SALAMA', 'Dubai Insurance', 'Watania', 'GIG Gulf', 'Orient Insurance', 'Allianz', 'MetLife', 'Oman Insurance'],
        globalShipping: "Global Shipping",
        shippingPartnerNames: ['DHL Express', 'Aramex', 'FedEx', 'UPS', 'TNT Express', 'Posta Plus', 'SMSA Express', 'Fetchr', 'Naqel Express', 'Zajil Express', 'iMile', 'Shyft', 'Emirates Post', 'Sky Express', 'First Flight'],
        partnersNoteTitle: "A Note on Partnerships",
        partnersNoteBody: "Please note: These are our target strategic partners. We are actively engaged in discussions and aim to formalize these collaborations leading up to our inaugural partner summit in late 2025.",

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
        view5YearProjections: "View 5-Year Detailed Projections",

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
        modalBenefit: "P.S. Early investors get bragging rights for life. Just saying.",
        fullName: "Full Name",
        emailAddress: "Email Address",
        mobileNumber: "Mobile Number",
        message: "Message",
        sendMessage: "Send Message",
        
        // Investor Cookie Popup
        cookieTitle: "🧐 Just Checking...",
        cookieMessage: "We use cookies to ensure this pitch deck is as revolutionary as our business model. By clicking below, you're confirming you have an eye for billion-dollar opportunities. Are you in?",
        cookieAccept: "I'm a Visionary Investor",

        // Financials Page
        financials: {
            title: "Financial Projections",
            backToPitchDeck: "← Back to Pitch Deck",
            subtitle: "5-Year Growth Strategy (2026-2030)",
            agentGrowth: "Agent Growth",
            agentGrowthPercent: "+543%",
            revenueGrowth: "Global Revenue Growth",
            revenueGrowthPercent: "+973%",
            finalROI: "Final ROI",
            finalROIStat: "18%",
            finalROINote: "From -1% in 2026",
            profit2030: "2030 Profit",
            profit2030Note: "Net profit margin",
            chart1Title: "Global Revenue vs Expenses",
            chart2Title: "Revenue Streams Breakdown",
            chart3Title: "Agent Growth",
            chart4Title: "ROI Progression",
            yAxisAmount: (currency: string) => `Amount (${currency}M)`,
            yAxisROI: "ROI (%)",
            legendProfit: "Profit",
            legendGlobalRevenue: "Global Revenue",
            legendAgentRevenue: "Agent Revenue",
            legendOtherRevenue: "Other Revenue",
            legendExpenses: "Expenses",
            legendAgents: "Agents",
            legendNetROI: "Net ROI",
            tableTitle: "Detailed Projections",
            tableYear: "Year",
            tableAgents: "Agents",
            tableAgentRevenue: "Agent Revenue",
            tableOtherRevenue: "Other Revenue",
            tableGlobalRevenue: "Global Revenue",
            tableExpenses: "Expenses",
            tableProfit: "Profit",
            tableGrossMargin: "Gross Margin",
            tableROI: "ROI",
            footerNoteTitle: "Note:",
            footerNoteBody: "Agent revenue represents royalty fees per agent per year. Other revenue streams include additional business activities with consistent year-over-year growth.",
            tooltipROI: "ROI",
            tooltipAgents: "Agents",
        },
        caseStudy: {
            title: "Business Case Study: The Investment Thesis for Part2Car.ae",
            backToPitchDeck: "← Back to Pitch Deck",
            subtitle: "A deep dive into a high-growth, technology-driven venture poised to dominate the $12B GCC automotive aftermarket.",
            execSummaryTitle: "Executive Summary",
            execSummaryBody: "Part2Car.ae presents a compelling, time-sensitive investment opportunity to digitize and dominate the fragmented, inefficient, and rapidly growing GCC automotive parts aftermarket. By leveraging a proprietary AI-powered B2B marketplace, we connect thousands of suppliers with workshops, unlocking immense value through efficiency, transparency, and data monetization. We are seeking $2M in Series A funding to scale our proven model across the UAE and into key GCC markets, projecting a significant ROI driven by strong network effects and multiple revenue streams. This is an opportunity to back a first-mover with a clear path to market leadership and profitability.",
            keyMetrics: [
                { title: "Target Market (GCC)", value: "12B", unit: "$", isCurrency: true },
                { title: "Projected Y3 Revenue", value: "6.2M", unit: "$", isCurrency: true },
                { title: "Series A Ask", value: "2M", unit: "$", isCurrency: true },
                { title: "Projected 5Y ROI", value: "18%", unit: "" },
            ],
            
            problemOpportunityTitle: "1. Problem & Opportunity",
            problemOpportunitySubtitle: "A $12 Billion Market Paralyzed by Inefficiency",
            problemBody: "The GCC's automotive aftermarket is a massive, essential industry. However, it operates on legacy systems, creating significant, quantifiable pain points:",
            problemsList: [
                { title: "Financial Drain", desc: "Workshops lose an estimated 15-20% of revenue due to parts sourcing delays and incorrect orders." },
                { title: "Operational Bottlenecks", desc: "An average of 4-6 hours of skilled mechanic time is wasted per vehicle just on parts procurement." },
                { title: "Supplier Fragmentation", desc: "Over 1000+ small-to-medium suppliers operate in silos, creating price opacity and inconsistent quality." },
                { title: "Digital Void", desc: "With less than 5% digital penetration, the sector lags decades behind comparable B2B industries." },
            ],
            opportunityTitle: "Quantifying the Opportunity",
            opportunityBody: "The inefficiency is not just a problem; it's a multi-billion dollar value creation opportunity. By solving these core issues, we can capture a significant share of the market by delivering tangible value.",
            opportunityChartTitle: "Value Proposition: Market Size vs. Digital Penetration",

            solutionTitle: "2. Proposed Solution",
            solutionSubtitle: "A Vertically Integrated B2B Operating System",
            solutionBody: "Part2Car.ae is not merely a marketplace. It is a three-layered ecosystem designed to be the central nervous system for the entire aftermarket value chain.",
            solutionLayers: [
                { title: "Layer 1: The AI Marketplace Core", desc: "The foundation is our B2B marketplace connecting buyers and sellers with AI-powered search, real-time pricing, and integrated logistics." },
                { title: "Layer 2: The SaaS Toolkit", desc: "For suppliers and workshops, we provide a suite of tools (inventory management, CRM, analytics) that digitize their operations, creating stickiness and a recurring revenue stream." },
                { title: "Layer 3: The Data Intelligence Layer", desc: "As transactions flow, we build an unparalleled data asset on parts velocity, pricing elasticity, and failure rates—a highly monetizable strategic advantage." },
            ],

            strategicAlignmentTitle: "3. Strategic Alignment",
            strategicAlignmentSubtitle: "Capitalizing on Regional & Global Megatrends",
            strategicAlignmentBody: "Our venture is perfectly positioned at the confluence of several powerful economic and technological trends, ensuring tailwinds for growth.",
            alignmentPoints: [
                { title: "Government Digital Transformation", desc: "Aligned with UAE Vision and KSA Vision 2030 goals for a diversified, digitally-driven economy." },
                { title: "B2B E-commerce Boom", desc: "The global B2B e-commerce market is projected to hit $20 trillion. We are bringing this model to a virgin sector in the GCC." },
                { title: "AI & Data Monetization", desc: "We are building a foundational data asset for the region's automotive sector, a key pillar of the future data economy." },
                { title: "Logistics Infrastructure Maturity", desc: "Leveraging the world-class logistics network of the UAE as a launchpad for efficient regional distribution." },
            ],

            benefitsROITitle: "4. Expected Benefits & ROI",
            benefitsROISubtitle: "Creating a Win-Win-Win Scenario",
            benefitsBody: "Our model is designed to deliver quantifiable benefits across the value chain, leading to strong financial returns for investors.",
            benefitsTableTitle: "Stakeholder Value Proposition",
            benefitsHeaders: ["Stakeholder", "Primary Benefit", "Quantifiable Impact"],
            benefitsRows: [
                { stakeholder: "Workshops/Buyers", benefit: "Operational Efficiency", impact: "Up to 40% reduction in operational costs; 80% faster parts procurement." },
                { stakeholder: "Suppliers/Sellers", benefit: "Market Access & Growth", impact: "Access to thousands of buyers; data-driven sales increase of 25%+" },
                { stakeholder: "Investors", benefit: "Financial & Strategic Return", impact: "Projected 18% ROI, dominant position in a $12B market, strategic data asset." },
            ],
            financialROITitle: "Financial Return on Investment",
            financialROIBody: "Our detailed financial model, based on conservative market penetration assumptions, projects a compelling return profile. Key highlights include:",
            financialROIMetrics: [
                { label: "5-Year Net ROI", value: "18%" },
                { label: "Investor Payback Period", value: "~3.5 Years" },
                { label: "Year 5 EBITDA Margin", value: "45%" },
                { label: "Potential Exit Strategy", value: "Acquisition by major automotive group or larger B2B marketplace player within 5-7 years." },
            ],

            costRiskTimelineTitle: "5. Execution Plan: Cost, Risks & Timeline",
            costRiskTimelineSubtitle: "A Phased, De-Risked Approach to Market Dominance",
            costTitle: "Investment Ask & Use of Funds",
            costBody: "We are seeking $2M in Series A funding to execute our 18-month growth plan. The capital will be strategically allocated to fuel technology development, market expansion, and operational scaling.",
            timelineTitle: "18-Month Strategic Roadmap",
            timelinePhases: [
                { phase: "Phase 1 (Months 1-6)", title: "Foundation & Scale-Up", items: ["Scale UAE operations to 2,000+ workshops", "Enhance AI search & SaaS toolkit", "Strengthen logistics partnerships"] },
                { phase: "Phase 2 (Months 7-12)", title: "KSA Market Entry", items: ["Launch operations in Riyadh & Jeddah", "Onboard first 100 Saudi suppliers", "Localize platform and support"] },
                { phase: "Phase 3 (Months 13-18)", title: "Pan-GCC Expansion", items: ["Establish presence in Kuwait & Oman", "Launch advanced data analytics products", "Achieve regional brand leadership"] },
            ],
            riskTitle: "Risk Analysis & Mitigation Strategy",
            riskTableHeaders: ["Risk Category", "Description", "Likelihood", "Impact", "Mitigation Strategy"],
            riskTableRows: [
                { category: "Market Adoption", desc: "Slow uptake by traditional, non-tech-savvy workshops.", likelihood: "Medium", impact: "Medium", mitigation: "Dedicated onboarding teams, tiered SaaS model (freemium), and strong partner incentives." },
                { category: "Competition", desc: "Emergence of a well-funded competitor or retaliation from large incumbents.", likelihood: "Medium", impact: "High", mitigation: "Rapidly build network effects (our primary moat), secure supplier exclusivity, continuous tech innovation." },
                { category: "Operational", desc: "Logistics and fulfillment challenges in new markets.", likelihood: "High", impact: "Medium", mitigation: "Hybrid logistics model (own fleet + 3PL partners), phased rollout, strong local operations teams." },
                { category: "Execution", desc: "Failure to hit key milestones on roadmap due to internal factors.", likelihood: "Low", impact: "High", mitigation: "Experienced leadership team, agile development cycles, data-driven KPI tracking and management." },
            ],

            teamTitle: "The A-Team: Expertise-Driven Leadership",
            teamBody: "Our success is driven by a founding team that combines deep industry knowledge with world-class technological expertise. (Note: Full founder bios and advisory board details available upon request).",
            teamMembers: [
                { name: "Founder & CEO", desc: "15+ years in automotive logistics and B2B sales in the GCC. Proven track record of scaling startups." },
                { name: "Co-Founder & CTO", desc: "Lead AI/ML engineer with experience from top tech firms. Expert in building scalable marketplaces." },
                { name: "Head of Operations", desc: "Supply chain veteran with extensive experience managing large-scale logistics networks in the Middle East." },
            ],

            conclusionTitle: "Conclusion: An Unparalleled Opportunity",
            conclusionBody: "Part2Car.ae is at the inflection point of technology and market need. We are not just building a company; we are creating the digital infrastructure for an entire industry. This is a unique opportunity to partner with a seasoned team to capture a dominant position in a massive, underserved market. We invite you to join us in shaping the future of automotive commerce in the Middle East.",
            ctaButton: "Schedule a Private Briefing",
        },
    },
    ar: {
        // Meta & Buttons
        contactUs: "اتصل بنا",
        scheduleMeeting: "حدد اجتماعًا",
        print: "طباعة",
        downloadDeck: "تحميل العرض",
        podcast: "بودكاست",
        viewAllPartners: "عرض كل الشركاء",
        partnersModalTitle: "شركاؤنا الكرام",
        comingSoon: "قريباً",
        newFeature: "قيد التنفيذ",
        businessCaseStudy: "دراسة حالة العمل",

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
            { num: '12-18%', title: 'معدل العمولة', desc: 'لكل معاملة من الموردين، يتم تحديدها حسب الحجم.', status: 'coming-soon' },
            { badge: 'مميز', title: 'خطط الموردين', desc: 'رؤية معززة، تحليلات، ووضع ذو أولوية.' },
            { badge: 'برنامج كخدمة', title: 'أدوات للبائعين وورش التصليح', desc: 'مجموعة برامج كخدمة تشمل التحليلات، إدارة المخزون، وإدارة علاقات العملاء لكل من البائعين وورش التصليح.' }
        ],

        // Core Features Section
        featuresTitle: "الميزات الأساسية",
        features: [
            { icon: '🤖', title: 'بحث مدعوم بالذكاء الاصطناعي', desc: 'يساعد روبوت الدردشة المتقدم العملاء في العثور على القطعة المناسبة في ثوانٍ، وليس ساعات.', status: 'new' },
            { icon: '⚡️', title: 'عروض أسعار فورية', desc: 'أسعار فورية من موردين متعددين مع مقارنة شفافة.' },
            { icon: '🛠️', title: 'مجموعة أدوات الذكاء الاصطناعي للشركاء والبائعين', desc: 'إدارة مخزون تعتمد على التعلم الآلي وتسعير ديناميكي لتحسين المخزون وزيادة الأرباح.', status: 'new' },
            { icon: '📊', title: 'داتامترا (RAG)', desc: 'ذكاء اصطناعي (RAG) داخلي يساعد البائعين والشركاء والمستخدمين على فهم بياناتهم.' },
            { icon: '🔗', title: 'مزامنة مع انستغرام', desc: 'ينشر البائعون مرة واحدة على انستغرام، ويتم تحديث قطعهم تلقائيًا على Part2Car.', status: 'new' },
            { icon: '🏪', title: 'واجهات متاجر البائعين', desc: 'صفحات مخصصة للبائعين مع تفاصيل اتصال كاملة لتعزيز رؤية العلامة التجارية والتواصل المباشر.' }
        ],
        
        // Partners Section
        partnersTitle: "الشركاء الاستراتيجيون المستهدفون",
        insurancePartners: "شركاء التأمين",
        insurancePartnerNames: ['أكسا الخليج', 'سكون', 'البحيرة للتأمين', 'أدنيك', 'نور تكافل', 'آر إس إيه الشرق الأوسط', 'الإمارات للتأمين', 'سلامة', 'دبي للتأمين', 'وطنية', 'جي آي جي الخليج', 'أورينت للتأمين', 'أليانز', 'ميتلايف', 'عمان للتأمين'],
        globalShipping: "الشحن العالمي",
        shippingPartnerNames: ['دي إتش إل إكسبرس', 'أرامكس', 'فيديكس', 'يو بي إس', 'تي إن تي إكسبرس', 'بوستا بلس', 'سمسا إكسبرس', 'فتشر', 'ناقل إكسبرس', 'زاجل إكسبرس', 'آيمايل', 'شيفت', 'بريد الإمارات', 'سكاي إكسبرس', 'فيرست فلايت'],
        partnersNoteTitle: "ملاحظة حول الشراكات",
        partnersNoteBody: "يرجى ملاحظة: هؤلاء هم شركاؤنا الاستراتيجيون المستهدفون. نحن حاليًا في مناقشات نشطة ونهدف إلى إضفاء الطابع الرسمي على هذه الشراكات استعدادًا لقمة الشركاء الافتتاحية في أواخر عام 2025.",

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
        view5YearProjections: "عرض التوقعات التفصيلية لمدة 5 سنوات",

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
        modalBenefit: "ملاحظة: المستثمرون الأوائل يحصلون على حقوق التفاخر مدى الحياة. مجرد معلومة.",
        fullName: "الاسم الكامل",
        emailAddress: "البريد الإلكتروني",
        mobileNumber: "رقم الجوال",
        message: "الرسالة",
        sendMessage: "إرسال الرسالة",

        // Investor Cookie Popup
        cookieTitle: "🧐 لحظة من فضلك...",
        cookieMessage: "نحن نستخدم ملفات تعريف الارتباط (الكوكيز) لنتأكد من أن هذا العرض التقديمي ثوري مثل نموذج عملنا. بالنقر أدناه، فأنت تؤكد أن لديك نظرة ثاقبة للفرص المليارية. هل أنت معنا؟",
        cookieAccept: "أنا مستثمر صاحب رؤية",
        
        // Financials Page
        financials: {
            title: "التوقعات المالية",
            backToPitchDeck: "العودة إلى العرض التقديمي →",
            subtitle: "استراتيجية النمو لمدة 5 سنوات (2026-2030)",
            agentGrowth: "نمو الوكلاء",
            agentGrowthPercent: "+543%",
            revenueGrowth: "نمو الإيرادات العالمية",
            revenueGrowthPercent: "+973%",
            finalROI: "العائد على الاستثمار النهائي",
            finalROIStat: "18%",
            finalROINote: "من -1% في 2026",
            profit2030: "أرباح 2030",
            profit2030Note: "هامش الربح الصافي",
            chart1Title: "الإيرادات العالمية مقابل النفقات",
            chart2Title: "تفصيل مصادر الإيرادات",
            chart3Title: "نمو الوكلاء",
            chart4Title: "تطور العائد على الاستثمار",
            yAxisAmount: (currency: string) => `المبلغ (مليون ${currency})`,
            yAxisROI: "العائد (%)",
            legendProfit: "الربح",
            legendGlobalRevenue: "الإيرادات العالمية",
            legendAgentRevenue: "إيرادات الوكلاء",
            legendOtherRevenue: "إيرادات أخرى",
            legendExpenses: "النفقات",
            legendAgents: "الوكلاء",
            legendNetROI: "صافي العائد على الاستثمار",
            tableTitle: "التوقعات التفصيلية",
            tableYear: "السنة",
            tableAgents: "الوكلاء",
            tableAgentRevenue: "إيرادات الوكلاء",
            tableOtherRevenue: "إيرادات أخرى",
            tableGlobalRevenue: "الإيرادات العالمية",
            tableExpenses: "النفقات",
            tableProfit: "الربح",
            tableGrossMargin: "هامش الربح الإجمالي",
            tableROI: "العائد على الاستثمار",
            footerNoteTitle: "ملاحظة:",
            footerNoteBody: "تمثل إيرادات الوكلاء رسوم الامتياز لكل وكيل سنويًا. تشمل مصادر الإيرادات الأخرى أنشطة تجارية إضافية مع نمو سنوي ثابت.",
            tooltipROI: "العائد على الاستثمار",
            tooltipAgents: "الوكلاء",
        },
        caseStudy: {
            title: "دراسة حالة العمل: الأطروحة الاستثمارية لـ Part2Car.ae",
            backToPitchDeck: "→ العودة إلى العرض التقديمي",
            subtitle: "نظرة متعمقة على مشروع قائم على التكنولوجيا وعالي النمو، يستعد للسيطرة على سوق ما بعد البيع للسيارات في دول مجلس التعاون الخليجي الذي تبلغ قيمته 12 مليار دولار.",
            execSummaryTitle: "ملخص تنفيذي",
            execSummaryBody: "تقدم Part2Car.ae فرصة استثمارية جذابة وحساسة للوقت لرقمنة والسيطرة على سوق قطع غيار السيارات المجزأ وغير الفعال وسريع النمو في دول مجلس التعاون الخليجي. من خلال الاستفادة من سوق B2B الخاص بنا والمدعوم بالذكاء الاصطناعي، نربط آلاف الموردين بورش العمل، مما يطلق قيمة هائلة من خلال الكفاءة والشفافية واستثمار البيانات. نسعى للحصول على 2 مليون دولار في جولة تمويل (الفئة أ) لتوسيع نطاق نموذجنا المثبت في جميع أنحاء الإمارات العربية المتحدة وإلى الأسواق الرئيسية في دول مجلس التعاون الخليجي، مع توقع عائد استثمار كبير مدفوع بتأثيرات الشبكة القوية وتدفقات الإيرادات المتعددة. هذه فرصة لدعم المحرك الأول بمسار واضح لقيادة السوق والربحية.",
            keyMetrics: [
                { title: "حجم السوق المستهدف (الخليج)", value: "12B", unit: "$", isCurrency: true },
                { title: "إيرادات السنة الثالثة المتوقعة", value: "6.2M", unit: "$", isCurrency: true },
                { title: "المبلغ المطلوب (الفئة أ)", value: "2M", unit: "$", isCurrency: true },
                { title: "العائد المتوقع على الاستثمار (5 سنوات)", value: "18%", unit: "" },
            ],

            problemOpportunityTitle: "١. المشكلة والفرصة",
            problemOpportunitySubtitle: "سوق بقيمة ١٢ مليار دولار يعاني من عدم الكفاءة",
            problemBody: "يعتبر سوق ما بعد البيع للسيارات في دول مجلس التعاون الخليجي صناعة ضخمة وأساسية. ومع ذلك، فإنه يعمل بأنظمة قديمة، مما يخلق نقاط ضعف كبيرة وقابلة للقياس:",
            problemsList: [
                { title: "استنزاف مالي", desc: "تخسر ورش العمل ما يقدر بنحو ١٥-٢٠٪ من الإيرادات بسبب تأخيرات في الحصول على قطع الغيار والطلبات غير الصحيحة." },
                { title: "عقبات تشغيلية", desc: "يتم إهدار ما متوسطه ٤-٦ ساعات من وقت الميكانيكي الماهر لكل مركبة فقط في شراء قطع الغيار." },
                { title: "تجزئة الموردين", desc: "يعمل أكثر من ١٠٠٠ مورد صغير ومتوسط ​​في صوامع، مما يخلق غموضًا في الأسعار وجودة غير متسقة." },
                { title: "فراغ رقمي", desc: "مع اختراق رقمي أقل من ٥٪، يتخلف القطاع بعقود عن الصناعات المماثلة بين الشركات." },
            ],
            opportunityTitle: "قياس الفرصة",
            opportunityBody: "إن عدم الكفاءة ليس مجرد مشكلة؛ بل هو فرصة لخلق قيمة بمليارات الدولارات. من خلال حل هذه المشكلات الأساسية، يمكننا الاستحواذ على حصة كبيرة من السوق من خلال تقديم قيمة ملموسة.",
            opportunityChartTitle: "عرض القيمة: حجم السوق مقابل الاختراق الرقمي",
            
            solutionTitle: "٢. الحل المقترح",
            solutionSubtitle: "نظام تشغيل متكامل رأسيًا للأعمال (B2B)",
            solutionBody: "Part2Car.ae ليس مجرد سوق. إنه نظام بيئي ثلاثي الطبقات مصمم ليكون الجهاز العصبي المركزي لسلسلة القيمة الكاملة لما بعد البيع.",
            solutionLayers: [
                { title: "الطبقة الأولى: نواة السوق بالذكاء الاصطناعي", desc: "الأساس هو سوق B2B الخاص بنا الذي يربط المشترين والبائعين ببحث مدعوم بالذكاء الاصطناعي، وأسعار فورية، ولوجستيات متكاملة." },
                { title: "الطبقة الثانية: مجموعة أدوات SaaS", desc: "للموردين وورش العمل، نقدم مجموعة من الأدوات (إدارة المخزون، CRM، التحليلات) التي ترقمن عملياتهم، مما يخلق ولاءً وتدفق إيرادات متكرر." },
                { title: "الطبقة الثالثة: طبقة ذكاء البيانات", desc: "مع تدفق المعاملات، نبني أصل بيانات لا مثيل له حول سرعة دوران القطع، ومرونة التسعير، ومعدلات الأعطال - وهي ميزة استراتيجية قابلة للاستثمار بشكل كبير." },
            ],

            strategicAlignmentTitle: "٣. التوافق الاستراتيجي",
            strategicAlignmentSubtitle: "الاستفادة من الاتجاهات الكبرى الإقليمية والعالمية",
            strategicAlignmentBody: "يقع مشروعنا في موقع مثالي عند التقاء العديد من الاتجاهات الاقتصادية والتكنولوجية القوية، مما يضمن رياحًا دافعة للنمو.",
            alignmentPoints: [
                { title: "التحول الرقمي الحكومي", desc: "يتماشى مع رؤية الإمارات ورؤية السعودية ٢٠٣٠ لأهداف اقتصاد متنوع وموجه رقميًا." },
                { title: "ازدهار التجارة الإلكترونية B2B", desc: "من المتوقع أن يصل سوق التجارة الإلكترونية العالمي B2B إلى ٢٠ تريليون دولار. نحن نقدم هذا النموذج لقطاع بكر في دول مجلس التعاون الخليجي." },
                { title: "الذكاء الاصطناعي واستثمار البيانات", desc: "نقوم ببناء أصل بيانات أساسي لقطاع السيارات في المنطقة، وهو ركيزة أساسية لاقتصاد البيانات المستقبلي." },
                { title: "نضج البنية التحتية اللوجستية", desc: "الاستفادة من الشبكة اللوجستية عالمية المستوى في الإمارات كمنصة إطلاق لتوزيع إقليمي فعال." },
            ],

            benefitsROITitle: "٤. الفوائد المتوقعة والعائد على الاستثمار",
            benefitsROISubtitle: "خلق سيناريو مربح للجميع",
            benefitsBody: "تم تصميم نموذجنا لتقديم فوائد قابلة للقياس عبر سلسلة القيمة، مما يؤدي إلى عوائد مالية قوية للمستثمرين.",
            benefitsTableTitle: "عرض القيمة لأصحاب المصلحة",
            benefitsHeaders: ["صاحب المصلحة", "الفائدة الأساسية", "التأثير القابل للقياس"],
            benefitsRows: [
                { stakeholder: "ورش العمل/المشترون", benefit: "الكفاءة التشغيلية", impact: "تخفيض يصل إلى ٤٠٪ في التكاليف التشغيلية؛ شراء قطع أسرع بنسبة ٨٠٪." },
                { stakeholder: "الموردون/البائعون", benefit: "الوصول إلى السوق والنمو", impact: "الوصول إلى آلاف المشترين؛ زيادة المبيعات المعتمدة على البيانات بنسبة ٢٥٪ +." },
                { stakeholder: "المستثمرون", benefit: "عائد مالي واستراتيجي", impact: "عائد استثمار متوقع بنسبة ١٨٪، مكانة مهيمنة في سوق بقيمة ١٢ مليار دولار، أصل بيانات استراتيجي." },
            ],
            financialROITitle: "العائد المالي على الاستثمار",
            financialROIBody: "نموذجنا المالي المفصل، القائم على افتراضات متحفظة لاختراق السوق، يتوقع ملف عائد جذاب. تشمل أبرز النقاط:",
            financialROIMetrics: [
                { label: "صافي العائد على الاستثمار لمدة ٥ سنوات", value: "١٨٪" },
                { label: "فترة استرداد استثمار المستثمر", value: "حوالي ٣.٥ سنوات" },
                { label: "هامش الأرباح قبل الفوائد والضرائب والإهلاك في السنة الخامسة", value: "٤٥٪" },
                { label: "استراتيجية الخروج المحتملة", value: "الاستحواذ من قبل مجموعة سيارات كبرى أو لاعب سوق B2B أكبر في غضون ٥-٧ سنوات." },
            ],

            costRiskTimelineTitle: "٥. خطة التنفيذ: التكلفة والمخاطر والجدول الزمني",
            costRiskTimelineSubtitle: "نهج مرحلي ومنخفض المخاطر للسيطرة على السوق",
            costTitle: "الطلب الاستثماري واستخدام الأموال",
            costBody: "نسعى للحصول على تمويل بقيمة ٢ مليون دولار في جولة (الفئة أ) لتنفيذ خطة النمو الخاصة بنا لمدة ١٨ شهرًا. سيتم تخصيص رأس المال بشكل استراتيجي لدفع تطوير التكنولوجيا والتوسع في السوق وتوسيع نطاق العمليات.",
            timelineTitle: "خارطة طريق استراتيجية لمدة ١٨ شهرًا",
            timelinePhases: [
                { phase: "المرحلة ١ (الأشهر ١-٦)", title: "التأسيس والتوسع", items: ["توسيع عمليات الإمارات لتشمل أكثر من ٢٠٠٠ ورشة عمل", "تحسين البحث بالذكاء الاصطناعي ومجموعة أدوات SaaS", "تعزيز الشراكات اللوجستية"] },
                { phase: "المرحلة ٢ (الأشهر ٧-١٢)", title: "دخول سوق المملكة العربية السعودية", items: ["إطلاق العمليات في الرياض وجدة", "ضم أول ١٠٠ مورد سعودي", "توطين المنصة والدعم"] },
                { phase: "المرحلة ٣ (الأشهر ١٣-١٨)", title: "التوسع في دول مجلس التعاون الخليجي", items: ["تأسيس وجود في الكويت وعمان", "إطلاق منتجات تحليلات بيانات متقدمة", "تحقيق ريادة العلامة التجارية الإقليمية"] },
            ],
            riskTitle: "تحليل المخاطر واستراتيجية التخفيف",
            riskTableHeaders: ["فئة المخاطر", "الوصف", "الاحتمالية", "التأثير", "استراتيجية التخفيف"],
            riskTableRows: [
                { category: "تبني السوق", desc: "تباطؤ في تبني الحل من قبل ورش العمل التقليدية وغير المتمرسة تقنيًا.", likelihood: "متوسط", impact: "متوسط", mitigation: "فرق تأهيل مخصصة، نموذج SaaS متدرج (freemium)، وحوافز قوية للشركاء." },
                { category: "المنافسة", desc: "ظهور منافس ممول جيدًا أو رد فعل من الشركات الكبرى القائمة.", likelihood: "متوسط", impact: "مرتفع", mitigation: "بناء تأثيرات الشبكة بسرعة (حصننا الأساسي)، تأمين حصرية الموردين، والابتكار التكنولوجي المستمر." },
                { category: "التشغيل", desc: "تحديات لوجستية وتنفيذية في الأسواق الجديدة.", likelihood: "مرتفع", impact: "متوسط", mitigation: "نموذج لوجستي هجين (أسطول خاص + شركاء 3PL)، طرح مرحلي، فرق عمليات محلية قوية." },
                { category: "التنفيذ", desc: "الفشل في تحقيق المعالم الرئيسية في خارطة الطريق بسبب عوامل داخلية.", likelihood: "منخفض", impact: "مرتفع", mitigation: "فريق قيادي من ذوي الخبرة، دورات تطوير رشيقة، تتبع وإدارة مؤشرات الأداء الرئيسية المستندة إلى البيانات." },
            ],
            
            teamTitle: "الفريق المتميز: قيادة قائمة على الخبرة",
            teamBody: "نجاحنا مدفوع بفريق مؤسس يجمع بين المعرفة العميقة بالصناعة والخبرة التكنولوجية العالمية. (ملاحظة: السير الذاتية الكاملة للمؤسسين وتفاصيل المجلس الاستشاري متاحة عند الطلب).",
            teamMembers: [
                { name: "المؤسس والرئيس التنفيذي", desc: "أكثر من 15 عامًا في لوجستيات السيارات ومبيعات B2B في دول مجلس التعاون الخليجي. سجل حافل في توسيع نطاق الشركات الناشئة." },
                { name: "الشريك المؤسس والمدير التقني", desc: "مهندس رائد في الذكاء الاصطناعي/التعلم الآلي مع خبرة من كبرى شركات التكنولوجيا. خبير في بناء الأسواق القابلة للتطوير." },
                { name: "رئيس العمليات", desc: "خبير في سلسلة التوريد مع خبرة واسعة في إدارة شبكات لوجستية واسعة النطاق في الشرق الأوسط." },
            ],

            conclusionTitle: "الخاتمة: فرصة لا مثيل لها",
            conclusionBody: "تقف Part2Car.ae عند نقطة التقاء التكنولوجيا وحاجة السوق. نحن لا نبني شركة فحسب؛ بل ننشئ البنية التحتية الرقمية لصناعة بأكملها. هذه فرصة فريدة للشراكة مع فريق متمرس لاحتلال مكانة مهيمنة في سوق ضخم وغير مخدوم. ندعوكم للانضمام إلينا في تشكيل مستقبل تجارة السيارات في الشرق الأوسط.",
            ctaButton: "حدد موعدًا لجلسة إحاطة خاصة",
        },
    }
};


const PROJECTION_DATA: ProjectionData = {
  'Year 1': { revenue: 0.8, customers: 1200, orders: 50000, margin: -12.5, virtualShelves: 360000, partners: 20 },
  'Year 2': { revenue: 2.3, customers: 3500, orders: 150000, margin: 52.2, virtualShelves: 1000000, partners: 80 },
  'Year 3': { revenue: 6.2, customers: 8000, orders: 350000, margin: 79, virtualShelves: 2000000, partners: 200 },
};

const BASE_REVENUE_CHART_DATA = [
  { name: '0', revenue: 0 }, { name: '6', revenue: 0.4 }, { name: '12', revenue: 0.8 }, { name: '18', revenue: 1.5 }, { name: '24', revenue: 2.3 }, { name: '30', revenue: 4.0 }, { name: '36', revenue: 6.2 },
];

const BRAND_COLOR = '#517AE5';
const BRAND_COLOR_DARK = '#4367c6';

const USE_OF_FUNDS_COLORS = [BRAND_COLOR, '#10B981', '#F59E0B'];

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
        {preTitle && <p className="text-[#517AE5] font-semibold mb-2">{preTitle}</p>}
        <h2 className="text-3xl lg:text-5xl font-bold text-white">{children}</h2>
        {subTitle && <p className="text-slate-400 mt-4 max-w-3xl mx-auto text-lg">{subTitle}</p>}
    </div>
);

const Fireworks: React.FC = () => {
    const fireworks = [
      { top: '20%', left: '15%', delay: '0s' },
      { top: '30%', left: '80%', delay: '1.2s' },
      { top: '50%', left: '50%', delay: '0.6s' },
      { top: '60%', left: '25%', delay: '1.8s' },
      { top: '40%', left: '90%', delay: '2.2s' },
      { top: '70%', left: '10%', delay: '0.3s' },
      { top: '25%', left: '65%', delay: '1.5s' },
    ];
  
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {fireworks.map((fw, i) => (
          <div
            key={i}
            className="firework-particle"
            style={{
              top: fw.top,
              left: fw.left,
              animationDelay: fw.delay,
            }}
          />
        ))}
      </div>
    );
};

const App: React.FC = () => {
    const checkAuth = () => {
        const authTimestamp = localStorage.getItem('authTimestamp');
        if (authTimestamp) {
            const lastAuthTime = parseInt(authTimestamp, 10);
            const tenMinutesInMillis = 10 * 60 * 1000;
            if (Date.now() - lastAuthTime < tenMinutesInMillis) {
                return true;
            } else {
                localStorage.removeItem('authTimestamp');
            }
        }
        return false;
    };

    const [isAuthenticated, setIsAuthenticated] = useState(checkAuth);
    const [showFinancials, setShowFinancials] = useState(false);
    const [showCaseStudy, setShowCaseStudy] = useState(false);
    const [activeProjection, setActiveProjection] = useState('Year 1');
    const [language, setLanguage] = useState<'en' | 'ar'>('en');
    const [currency, setCurrency] = useState<'USD' | 'AED'>('USD');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isPartnersModalOpen, setIsPartnersModalOpen] = useState(false);
    const [isPodcastPlayerOpen, setIsPodcastPlayerOpen] = useState(false);
    const [showCookiePopup, setShowCookiePopup] = useState(false);
    
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);
    
    useEffect(() => {
        // Ensure the page is scrolled to the top on initial load.
        window.scrollTo(0, 0);
    }, []); // Empty dependency array ensures this runs only once on mount.
    
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

    const handleSuccessfulAuth = () => {
        localStorage.setItem('authTimestamp', Date.now().toString());
        setIsAuthenticated(true);
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

    const handlePrint = () => {
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

    if (showCaseStudy) {
        return (
            <BusinessCaseStudy
                onBack={() => setShowCaseStudy(false)}
                language={language}
                currency={currency}
                content={content.caseStudy}
                useOfFundsData={useOfFundsData}
            />
        );
    }
    
    return (
        <div className="text-white">
            <Header 
                language={language} 
                setLanguage={setLanguage} 
                currency={currency} 
                setCurrency={setCurrency} 
                onPrint={handlePrint}
                printTitle={content.print}
                downloadTitle={content.downloadDeck}
                onPodcastClick={() => setIsPodcastPlayerOpen(true)}
                podcastTitle={content.podcast}
            />

            {showFinancials ? (
                <FinancialProjections
                    onBack={() => setShowFinancials(false)}
                    language={language}
                    currency={currency}
                    content={content.financials}
                />
            ) : (
                <>
                    <main>
                        {/* 1. Hero Section */}
                        <section id="hero" className="min-h-screen flex items-center bg-gradient-to-b from-transparent to-black/50 relative">
                            <Fireworks />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-5"></div>
                            <div className="container mx-auto px-6 text-center z-10">
                                <FadeInSection>
                                    <p className="text-[#517AE5] font-semibold mb-4">{content.heroPreTitle}</p>
                                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">{content.heroTitle}</h1>
                                    <p className="max-w-3xl mx-auto text-slate-300 text-lg lg:text-xl mb-10">{content.heroSubtitle}</p>
                                    <div className="flex justify-center gap-4 no-print">
                                        <a href="https://calendly.com/njoober/30min" target="_blank" rel="noopener noreferrer" className="bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg">{content.scheduleMeeting}</a>
                                        <button onClick={() => setIsContactModalOpen(true)} className="border-2 border-slate-500 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg">{content.contactUs}</button>
                                    </div>
                                </FadeInSection>
                            </div>
                        </section>

                        {/* 2. About Section */}
                        <Section id="about" className="bg-black/25">
                           <FadeInSection className="max-w-4xl mx-auto text-center">
                                <SectionTitle>{content.aboutTitle}</SectionTitle>
                                <p className="text-2xl lg:text-3xl text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: content.aboutSubtitle.replace(/AI-powered/g, `<span class="text-[#517AE5]">AI-powered</span>`).replace(/intelligent automation/g, `<span class="text-[#517AE5]">intelligent automation</span>`).replace(/مدعوم بالذكاء الاصطناعي/g, `<span class="text-[#517AE5]">مدعوم بالذكاء الاصطناعي</span>`).replace(/الأتمتة الذكية/g, `<span class="text-[#517AE5]">الأتمتة الذكية</span>`) }}></p>
                           </FadeInSection>
                        </Section>
                        
                        {/* 3. Revenue Model Section */}
                        <Section id="revenue">
                            <FadeInSection>
                                <SectionTitle subTitle={content.revenueModelSubtitle}>{content.revenueModelTitle}</SectionTitle>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                                    {content.revenueStreams.map((item, index) => (
                                        <div key={index} className="relative overflow-hidden glassmorphism p-8 rounded-xl text-center transform hover:-translate-y-2 transition-transform duration-300">
                                            {item.status === 'coming-soon' && (
                                                <div className="absolute top-4 -right-12 w-40 text-center transform rotate-45 bg-red-600 text-white text-xs font-bold py-1 shadow-lg">
                                                    {content.comingSoon}
                                                </div>
                                            )}
                                            {item.num ? <p className="text-5xl font-bold text-[#517AE5] mb-4">{item.num}</p> : <span className="inline-block bg-[#517AE5]/20 text-[#93adf5] font-semibold px-4 py-1 rounded-full mb-4">{item.badge}</span>}
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
                                        <div key={i} className="relative overflow-hidden glassmorphism p-8 rounded-xl text-center transition-all duration-300 hover:bg-white/10 hover:scale-105">
                                            {feature.status === 'new' && (
                                                <div className="absolute top-4 -right-12 w-40 text-center transform rotate-45 bg-green-600 text-white text-xs font-bold py-1 shadow-lg">
                                                    {content.newFeature}
                                                </div>
                                            )}
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
                                            {content.insurancePartnerNames.slice(0, 6).map(name => (
                                                <div key={name} className="glassmorphism p-4 rounded-lg">
                                                    <p className="text-slate-300 font-medium text-md">{name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                     <div className="text-center">
                                        <h3 className="text-2xl font-semibold mb-6 text-slate-300">{content.globalShipping}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                                            {content.shippingPartnerNames.slice(0, 6).map(name => (
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
                                                        ? 'border-b-2 border-[#517AE5] text-white'
                                                        : 'text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {content.yearKeys[year]}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center mb-12">
                                        {[
                                            { label: content.projectedRevenue, value: PROJECTION_DATA[activeProjection].revenue, prefix: currency === 'USD' ? '$' : '', suffix: `M${currency === 'AED' ? ' AED' : ''}`, convert: true },
                                            { label: content.activeCustomers, value: PROJECTION_DATA[activeProjection].customers },
                                            { label: content.monthlyOrders, value: PROJECTION_DATA[activeProjection].orders },
                                            { label: content.grossMargin, value: PROJECTION_DATA[activeProjection].margin, suffix: '%' },
                                            { label: content.virtualShelves, value: PROJECTION_DATA[activeProjection].virtualShelves },
                                            { label: content.partners, value: PROJECTION_DATA[activeProjection].partners },
                                        ].map(stat => (
                                            <div key={stat.label} className="glassmorphism p-4 rounded-lg">
                                                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                                                <p className={`text-2xl font-bold ${stat.value < 0 ? 'text-red-500' : 'text-[#93adf5]'}`}>
                                                    <AnimatedCounter
                                                        end={stat.convert ? convertCurrency(stat.value) : stat.value}
                                                        prefix={stat.prefix || ''}
                                                        suffix={stat.suffix || ''}
                                                    />
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
                                                        <stop offset="5%" stopColor="#517AE5" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#517AE5" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <Area type="monotone" dataKey="revenue" stroke="#517AE5" fillOpacity={1} fill="url(#colorRevenue)" name={content.projectedRevenue} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="text-center mt-12 no-print">
                                        <button
                                            onClick={() => {
                                                setShowFinancials(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg"
                                        >
                                            {content.view5YearProjections}
                                        </button>
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
                                            <p className="text-5xl font-bold text-[#517AE5] mb-4">
                                                <AnimatedCounter 
                                                    end={marketStatValues[i].value}
                                                    prefix={marketStatValues[i].prefix || (currency === 'USD' && marketStatValues[i].unit !== '%' ? '$' : '')}
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
                                                            style={{ width: `${entry.value}%`, backgroundColor: USE_OF_FUNDS_COLORS[index % USE_OF_FUNDS_COLORS.length] }}
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
                                        <a href="https://calendly.com/njoober/30min" target="_blank" rel="noopener noreferrer" className="bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg">{content.scheduleMeeting}</a>
                                        <button onClick={() => setIsContactModalOpen(true)} className="border-2 border-slate-500 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 text-lg">{content.contactUs}</button>
                                    </div>
                                </div>
                            </FadeInSection>
                        </Section>
                    </main>

                    <footer className="py-8 bg-black/30 border-t border-slate-800">
                        <div className="container mx-auto px-6 text-center text-slate-400">
                            <div className="flex justify-center items-center space-x-6 mb-4">
                                <a href="https://part2car.ae" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Official Website">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9m-9 9a9 9 0 00-9-9" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/company/part2car/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn Profile">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                                <button onClick={() => {
                                    setShowCaseStudy(true);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} className="text-slate-400 hover:text-white transition-colors font-medium">{content.businessCaseStudy}</button>
                            </div>
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
                                <p className="text-amber-400/80 italic text-sm text-center mb-6 bg-amber-900/20 p-3 rounded-lg border border-amber-500/30">{content.modalBenefit}</p>
                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">{content.fullName}</label>
                                        <input type="text" id="name" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#517AE5]" />
                                    </div>
                                     <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">{content.emailAddress}</label>
                                        <input type="email" id="email" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#517AE5]" />
                                    </div>
                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-1">{content.mobileNumber}</label>
                                        <input type="tel" id="mobile" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#517AE5]" />
                                    </div>
                                     <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">{content.message}</label>
                                        <textarea id="message" rows={4} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#517AE5]"></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105">{content.sendMessage}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {isPartnersModalOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] no-print" onClick={() => setIsPartnersModalOpen(false)}>
                            <div
                                className="glassmorphism rounded-xl p-8 max-w-2xl w-full m-4 animate-fade-in-up flex flex-col max-h-[90vh]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                                    <h3 className="text-2xl font-bold">{content.partnersModalTitle}</h3>
                                    <button onClick={() => setIsPartnersModalOpen(false)} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
                                </div>
                                <div className="overflow-y-auto">
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-xl font-semibold mb-4 text-[#517AE5]">{content.insurancePartners}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {content.insurancePartnerNames.map(name => (
                                                    <div key={name} className="bg-slate-800/50 p-3 rounded-lg text-center">
                                                        <p className="text-slate-300 font-medium text-sm">{name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold mb-4 text-[#517AE5]">{content.globalShipping}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                {content.shippingPartnerNames.map(name => (
                                                    <div key={name} className="bg-slate-800/50 p-3 rounded-lg text-center">
                                                        <p className="text-slate-300 font-medium text-sm">{name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg mt-8">
                                        <h5 className="font-bold text-slate-200 mb-2">{content.partnersNoteTitle}</h5>
                                        <p className="text-sm text-slate-400">{content.partnersNoteBody}</p>
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
                </>
            )}

            {isPodcastPlayerOpen && (
                <PodcastPlayer
                    isOpen={isPodcastPlayerOpen}
                    onClose={() => setIsPodcastPlayerOpen(false)}
                    audioSrc="https://upcdn.io/223k2S3/raw/Part2Car.ae__AI-Powered_Disruption_in_the_%244.m4a"
                    title={content.podcast}
                />
            )}

            {!isAuthenticated && <PasswordOverlay onSuccess={handleSuccessfulAuth} />}
        </div>
    );
};

export default App;
