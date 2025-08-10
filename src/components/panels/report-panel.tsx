
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, ShieldCheck, Cpu, Database, Users, Languages } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useContext, useState, useMemo } from "react";
import { AppContext } from "@/contexts/app-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subDays, format } from 'date-fns';


export default function ReportPanel() {
    const { callHistory, t } = useContext(AppContext);
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

    const chartConfig = useMemo(() => ({
      high: { label: t('riskHigh'), color: "hsl(var(--color-risk-danger))" },
      medium: { label: t('riskMedium'), color: "hsl(var(--color-risk-caution))" },
      low: { label: t('riskLow'), color: "hsl(var(--color-risk-safe))" },
    }), [t]);

    const riskData = useMemo(() => {
        const now = new Date();
        let startDate: Date;
        let groupByFormat: string;

        switch (timeframe) {
            case 'week':
                startDate = subDays(now, 6);
                groupByFormat = 'EEE'; // Day of week (e.g., 'Mon')
                break;
            case 'month':
                startDate = subDays(now, 29);
                groupByFormat = 'MMM d'; // Month and day (e.g., 'Jul 28')
                break;
            case 'year':
            default:
                startDate = subDays(now, 364);
                groupByFormat = 'MMM'; // Month (e.g., 'Jul')
                break;
        }

        const filteredCalls = callHistory.filter(call => new Date(call.date) >= startDate);
        
        const data = filteredCalls.reduce((acc, call) => {
            const date = format(new Date(call.date), groupByFormat);
            const existing = acc.find(d => d.date === date);
            if (existing) {
                existing[call.risk]++;
            } else {
                acc.push({ date, high: 0, medium: 0, low: 0, [call.risk]: 1 });
            }
            return acc;
        }, [] as {date: string, high: number, medium: number, low: number}[]);

        // For week and month, we want to ensure all days/weeks are present even if there's no data
        if (timeframe === 'week') {
            const weekData = [];
            for (let i = 6; i >= 0; i--) {
                const date = subDays(now, i);
                const formattedDate = format(date, groupByFormat);
                const existingData = data.find(d => d.date === formattedDate);
                weekData.push(existingData || { date: formattedDate, high: 0, medium: 0, low: 0 });
            }
            return weekData;
        }
        
        if (timeframe === 'year') {
             const monthOrder = Array.from({ length: 12 }, (_, i) => format(subDays(now, i * 30), 'MMM')).reverse();
             data.sort((a, b) => monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date));
        } else {
            data.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        return data;

    }, [callHistory, timeframe]);


  return (
    <div className="h-full flex flex-col gap-6 p-2 md:p-4 animate-text-fade-in">
        <Card className="glassmorphic-card holographic-noise shine-sweep w-full mx-auto">
            <CardHeader className="text-center space-y-2 pb-4">
                 <div className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-glow-cyan">
                    <ShieldCheck className="w-8 h-8"/>
                    <h1>{t('aboutTitle')}</h1>
                 </div>
                 <p className="text-muted-foreground">{t('aboutSubtitle')}</p>
            </CardHeader>
            <Separator/>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-2">{t('aboutExecSummaryTitle')}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('aboutExecSummaryContent')}
                            </p>
                        </section>
                         <section>
                            <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> {t('aboutKeyFeaturesTitle')}</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>{t('aboutKeyFeaturesItem1')}</li>
                                <li>{t('aboutKeyFeaturesItem2')}</li>
                                <li>{t('aboutKeyFeaturesItem3')}</li>
                                <li>{t('aboutKeyFeaturesItem4')}</li>
                                <li>{t('aboutKeyFeaturesItem5')}</li>
                                <li>{t('aboutKeyFeaturesItem6')}</li>
                            </ul>
                        </section>
                    </div>
                    <div className="space-y-6">
                       <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-primary flex items-center gap-2"><BarChart className="w-5 h-5"/> {t('aboutRiskAnalysisTitle')}</h2>
                                <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)} className="w-auto">
                                    <TabsList className="glassmorphic p-1 h-auto">
                                        <TabsTrigger value="week" className="px-3 py-1 text-xs">{t('aboutRiskAnalysisWeek')}</TabsTrigger>
                                        <TabsTrigger value="month" className="px-3 py-1 text-xs">{t('aboutRiskAnalysisMonth')}</TabsTrigger>
                                        <TabsTrigger value="year" className="px-3 py-1 text-xs">{t('aboutRiskAnalysisYear')}</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <Card className="glassmorphic">
                                <CardContent className="p-4">
                                     <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                                        <RechartsBarChart data={riskData} accessibilityLayer>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="low" stackId="a" fill="var(--color-low)" radius={[0, 0, 4, 4]} name={chartConfig.low.label}/>
                                            <Bar dataKey="medium" stackId="a" fill="var(--color-medium)" radius={[0, 0, 4, 4]} name={chartConfig.medium.label} />
                                            <Bar dataKey="high" stackId="a" fill="var(--color-high)" radius={[4, 4, 0, 0]} name={chartConfig.high.label}/>
                                        </RechartsBarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </section>
                         <section>
                            <h2 className="text-xl font-bold text-primary mb-2">{t('aboutTechStackTitle')}</h2>
                            <div className="grid grid-cols-2 gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2"><Cpu className="text-primary w-5 h-5"/>Next.js & React</div>
                                <div className="flex items-center gap-2"><Database className="text-primary w-5 h-5"/>Firebase & Firestore</div>
                                <div className="flex items-center gap-2"><ShieldCheck className="text-primary w-5 h-5"/>Genkit AI</div>
                                <div className="flex items-center gap-2"><Users className="text-primary w-5 h-5"/>ShadCN UI</div>
                                <div className="flex items-center gap-2"><Languages className="text-primary w-5 h-5"/>Tailwind CSS</div>
                            </div>
                        </section>
                    </div>
                </div>
                 <Separator className="my-6"/>
                 <section className="text-center">
                    <h2 className="text-xl font-bold text-primary mb-2">{t('aboutConclusionTitle')}</h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                        {t('aboutConclusionContent')}
                    </p>
                </section>
            </CardContent>
        </Card>
    </div>
  );
}
