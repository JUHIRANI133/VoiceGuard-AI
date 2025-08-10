
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart, ShieldCheck, Cpu, Database, Users, Languages } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useContext } from "react";
import { AppContext } from "@/contexts/app-context";


const chartConfig = {
  high: { label: "High Risk", color: "hsl(var(--color-risk-danger))" },
  medium: { label: "Medium Risk", color: "hsl(var(--color-risk-caution))" },
  low: { label: "Low Risk", color: "hsl(var(--color-risk-safe))" },
};

export default function ReportPanel() {
    const { callHistory } = useContext(AppContext);

    const riskData = callHistory.reduce((acc, call) => {
        const date = new Date(call.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = acc.find(d => d.date === date);
        if (existing) {
            existing[call.risk]++;
        } else {
            acc.push({ date, high: 0, medium: 0, low: 0, [call.risk]: 1 });
        }
        return acc;
    }, [] as {date: string, high: number, medium: number, low: number}[]).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <div className="h-full flex flex-col gap-6 p-2 md:p-4 animate-text-fade-in">
        <Card className="glassmorphic-card holographic-noise shine-sweep w-full mx-auto">
            <CardHeader className="text-center space-y-2 pb-4">
                 <div className="inline-flex items-center justify-center gap-2 text-2xl font-bold text-glow-cyan">
                    <ShieldCheck className="w-8 h-8"/>
                    <h1>VoiceGuard AI</h1>
                 </div>
                 <p className="text-muted-foreground">Your guardian against digital deception</p>
            </CardHeader>
            <Separator/>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-primary mb-2">Executive Summary</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                VoiceGuard AI is a sophisticated, multilingual security application designed to protect users from real-time phone scams and digital deception. Built with a modern Next.js and Firebase stack, the app offers a comprehensive suite of features centered around a futuristic, intuitive dashboard, providing users with unparalleled protection and peace of mind.
                            </p>
                        </section>
                         <section>
                            <h2 className="text-xl font-bold text-primary mb-2 flex items-center gap-2"><Cpu className="w-5 h-5"/> Key Features</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li><strong>Live Call Analysis:</strong> Real-time transcription, scam pattern detection, and risk assessment.</li>
                                <li><strong>AI-Powered Detection:</strong> Utilizes Genkit AI for emotional manipulation and synthetic voice identification.</li>
                                <li><strong>Multilingual Support:</strong> Interface and analysis available in English, Hindi, Spanish, and French.</li>
                                <li><strong>User-Centric Dashboard:</strong> Centralized hub for call history, emotional tracking, and scam case files.</li>
                                <li><strong>Prevention Suite:</strong> Advanced settings including live GPS sharing and emergency contact alerts.</li>
                                <li><strong>Secure & Scalable:</strong> Built on Firebase for robust data management and cloud functions.</li>
                            </ul>
                        </section>
                    </div>
                    <div className="space-y-6">
                       <section>
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2"><BarChart className="w-5 h-5"/> Risk Analysis Trend</h2>
                            <Card className="glassmorphic">
                                <CardContent className="p-4">
                                     <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                                        <RechartsBarChart data={riskData} accessibilityLayer>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="low" fill="var(--color-low)" radius={4} name="Low Risk"/>
                                            <Bar dataKey="medium" fill="var(--color-medium)" radius={4} name="Medium Risk" />
                                            <Bar dataKey="high" fill="var(--color-high)" radius={4} name="High Risk"/>
                                        </RechartsBarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </section>
                         <section>
                            <h2 className="text-xl font-bold text-primary mb-2">Technical Stack</h2>
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
                    <h2 className="text-xl font-bold text-primary mb-2">Conclusion</h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                        VoiceGuard AI stands as a testament to the power of modern web technologies and artificial intelligence in solving real-world problems. Its robust feature set and user-friendly design make it an indispensable tool in the fight against digital fraud, setting a new standard for personal security applications.
                    </p>
                </section>
            </CardContent>
        </Card>
    </div>
  );
}
