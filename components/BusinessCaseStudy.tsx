import React from 'react';

interface BusinessCaseStudyProps {
  onBack: () => void;
  language: 'en' | 'ar';
  currency: 'USD' | 'AED';
  content: any;
  useOfFundsData: { name: string; value: number }[];
}

const BRAND_COLOR = '#517AE5';
const COLORS = [BRAND_COLOR, '#10B981', '#F59E0B', '#6366F1', '#EC4899'];

const Section: React.FC<{title: string, subtitle: string, children: React.ReactNode}> = ({ title, subtitle, children }) => (
    <section className="mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-white">{title}</h2>
        <p className="text-slate-400 mt-2 mb-8 max-w-3xl">{subtitle}</p>
        {children}
    </section>
);

const RiskRating: React.FC<{ level: 'Low' | 'Medium' | 'High' }> = ({ level }) => {
    const levelMap = {
        Low: 'bg-green-500/20 text-green-400',
        Medium: 'bg-yellow-500/20 text-yellow-400',
        High: 'bg-red-500/20 text-red-400',
    };
    const levelMapAr = {
        منخفض: 'bg-green-500/20 text-green-400',
        متوسط: 'bg-yellow-500/20 text-yellow-400',
        مرتفع: 'bg-red-500/20 text-red-400',
    };

    const styles = levelMap[level] || levelMapAr[level as keyof typeof levelMapAr] || '';

    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles}`}>{level}</span>;
}


const BusinessCaseStudy: React.FC<BusinessCaseStudyProps> = ({ onBack, currency, content, useOfFundsData }) => {
    
  return (
    <main className="pt-24 pb-12 bg-slate-900">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8 print:hidden no-print">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{content.title}</h1>
                    <p className="text-slate-400 mt-2 max-w-4xl">{content.subtitle}</p>
                </div>
                <button
                    onClick={onBack}
                    className="bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-2 px-6 rounded-lg transition-transform duration-200 hover:scale-105 flex-shrink-0"
                >
                    {content.backToPitchDeck}
                </button>
            </div>

            <div className="space-y-16">
                
                {/* Executive Summary */}
                <section>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-100 mb-4 border-b-2 border-[#517AE5] pb-2">{content.execSummaryTitle}</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">{content.execSummaryBody}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {content.keyMetrics.map((metric: any) => (
                            <div key={metric.title} className="glassmorphism rounded-lg p-4 text-center border-t-4 border-[#517AE5]">
                                <p className="text-slate-400 text-sm mb-1">{metric.title}</p>
                                <p className="text-3xl font-bold text-white">
                                    {metric.isCurrency && currency === 'USD' ? metric.unit : ''}
                                    {metric.value}
                                    {metric.isCurrency && currency === 'AED' ? 'B AED' : metric.isCurrency ? 'B' : '%'}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* 1. Problem & Opportunity */}
                <Section title={content.problemOpportunityTitle} subtitle={content.problemOpportunitySubtitle}>
                    <p className="text-slate-300 text-lg mb-6">{content.problemBody}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {content.problemsList.map((problem: any) => (
                             <div key={problem.title} className="glassmorphism p-6 rounded-lg">
                                <h3 className="font-bold text-xl text-red-400 mb-2">{problem.title}</h3>
                                <p className="text-slate-300">{problem.desc}</p>
                            </div>
                        ))}
                    </div>
                     <h3 className="font-bold text-2xl text-slate-100 mt-10 mb-4">{content.opportunityTitle}</h3>
                    <p className="text-slate-300 text-lg">{content.opportunityBody}</p>
                </Section>
                
                {/* 2. Proposed Solution */}
                <Section title={content.solutionTitle} subtitle={content.solutionSubtitle}>
                    <p className="text-slate-300 text-lg mb-8">{content.solutionBody}</p>
                    <div className="flex flex-col md:flex-row gap-6">
                        {content.solutionLayers.map((layer: any, index: number) => (
                             <div key={layer.title} className="flex-1 glassmorphism p-6 rounded-lg border-t-4" style={{borderColor: COLORS[index % COLORS.length]}}>
                                <h3 className="font-bold text-xl text-slate-100 mb-2">{layer.title}</h3>
                                <p className="text-slate-300">{layer.desc}</p>
                            </div>
                        ))}
                    </div>
                </Section>
                
                {/* 3. Strategic Alignment */}
                <Section title={content.strategicAlignmentTitle} subtitle={content.strategicAlignmentSubtitle}>
                     <p className="text-slate-300 text-lg mb-8">{content.strategicAlignmentBody}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {content.alignmentPoints.map((point: any) => (
                             <div key={point.title} className="glassmorphism p-6 rounded-lg flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#517AE5]/20 flex items-center justify-center mt-1">
                                    <span className="text-[#93adf5] font-bold">✓</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-100 mb-1">{point.title}</h3>
                                    <p className="text-slate-400">{point.desc}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                </Section>
                
                {/* 4. Expected Benefits & ROI */}
                <Section title={content.benefitsROITitle} subtitle={content.benefitsROISubtitle}>
                     <p className="text-slate-300 text-lg mb-8">{content.benefitsBody}</p>
                     <div className="glassmorphism p-6 rounded-lg mb-10 overflow-x-auto">
                        <h3 className="font-bold text-2xl text-slate-100 mb-4">{content.benefitsTableTitle}</h3>
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b-2 border-slate-700 text-left">
                                    {content.benefitsHeaders.map((header: string) => <th key={header} className="p-3 font-semibold text-slate-300">{header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {content.benefitsRows.map((row: any) => (
                                    <tr key={row.stakeholder} className="border-b border-slate-800">
                                        <td className="p-3 font-bold">{row.stakeholder}</td>
                                        <td className="p-3">{row.benefit}</td>
                                        <td className="p-3 text-green-400">{row.impact}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>

                    <h3 className="font-bold text-2xl text-slate-100 mb-4">{content.financialROITitle}</h3>
                    <p className="text-slate-300 text-lg mb-6">{content.financialROIBody}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {content.financialROIMetrics.map((metric: any) => (
                            <div key={metric.label} className="glassmorphism p-4 rounded-lg text-center">
                                <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                                <p className="text-3xl font-bold text-white">{metric.value}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 5. Execution Plan */}
                 <Section title={content.costRiskTimelineTitle} subtitle={content.costRiskTimelineSubtitle}>
                    <h3 className="font-bold text-2xl text-slate-100 mb-4">{content.costTitle}</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <p className="text-slate-300 text-lg">{content.costBody}</p>
                        <div className="space-y-4">
                            {useOfFundsData.map((entry, index) => (
                                <div key={entry.name}>
                                    <div className="flex justify-between items-center mb-1 text-slate-300">
                                        <span>{entry.name}</span>
                                        <span className="font-semibold text-white">{entry.value}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-3">
                                        <div className="h-3 rounded-full" style={{ width: `${entry.value}%`, backgroundColor: COLORS[index % COLORS.length] }}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-2xl text-slate-100 mb-6 mt-12">{content.timelineTitle}</h3>
                    <div className="relative border-l-2 border-[#517AE5] ml-4 pl-8 space-y-12">
                        {content.timelinePhases.map((phase: any) => (
                            <div key={phase.phase} className="relative">
                                <div className="absolute -left-[42px] top-1 w-4 h-4 bg-[#517AE5] rounded-full border-4 border-slate-900"></div>
                                <p className="text-sm font-semibold text-[#517AE5]">{phase.phase}</p>
                                <h4 className="text-xl font-bold text-slate-100 mb-2">{phase.title}</h4>
                                <ul className="list-disc list-inside text-slate-400 space-y-1">
                                    {phase.items.map((item: string) => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>

                     <h3 className="font-bold text-2xl text-slate-100 mb-6 mt-12">{content.riskTitle}</h3>
                     <div className="glassmorphism rounded-lg overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead>
                                <tr className="border-b-2 border-slate-700">
                                    {content.riskTableHeaders.map((h: string) => <th key={h} className="p-3 font-semibold text-slate-300">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {content.riskTableRows.map((row: any) => (
                                    <tr key={row.category} className="border-b border-slate-800 text-slate-400 text-sm">
                                        <td className="p-3 font-bold text-slate-200">{row.category}</td>
                                        <td className="p-3 max-w-xs">{row.desc}</td>
                                        <td className="p-3"><RiskRating level={row.likelihood} /></td>
                                        <td className="p-3"><RiskRating level={row.impact} /></td>
                                        <td className="p-3 max-w-sm">{row.mitigation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>

                </Section>
                
                {/* Conclusion */}
                <section className="text-center bg-slate-800/50 p-8 rounded-lg">
                     <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{content.conclusionTitle}</h2>
                     <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-4xl mx-auto">{content.conclusionBody}</p>
                     <a href="https://calendly.com/njoober/30min" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#517AE5] hover:bg-[#4367c6] text-white font-semibold py-3 px-8 rounded-lg transition-transform duration-200 hover:scale-105 text-lg no-print">
                        {content.ctaButton}
                    </a>
                </section>
            </div>
        </div>
    </main>
  );
};

export default BusinessCaseStudy;
