
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { callHistory } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle, Heart, Bot, Smile, Annoyed, Bomb, FileText, Frown } from 'lucide-react';
import { cn } from "@/lib/utils";

const emotionIcons: { [key: string]: { icon: React.ElementType, color: string } } = {
  Threatening: { icon: Bomb, color: 'text-red-500' },
  Stressed: { icon: Annoyed, color: 'text-yellow-500' },
  Loving: { icon: Heart, color: 'text-pink-500' },
  Happy: { icon: Smile, color: 'text-green-500' },
  Sad: { icon: Frown, color: 'text-blue-500' },
  Casual: { icon: Bot, color: 'text-gray-500' },
};

const callDescriptions: { [key: number]: string } = {
    1: "A classic KYC (Know Your Customer) scam where the caller impersonates a bank official to create urgency and steal personal information via a phishing link.",
    2: "A sophisticated voice cloning scam where the scammer uses the cloned voice of Aruna's son, Aarav, to feign an emergency and request immediate funds.",
    3: "An impersonation scam where the caller pretends to be Aruna's friend, Rohit, who is in a fabricated emergency situation requiring urgent financial help.",
    4: "A casual, low-risk conversation between Aruna and her brother, Ravi, catching up and making plans to meet.",
    5: "A romance scam scenario where a scammer uses a cloned voice of an online partner to manipulate the victim into sending money for a travel ticket.",
    6: "A standard, legitimate service call for ordering a pizza. This call serves as a baseline for normal, low-risk interactions.",
    7: "A targeted spear-phishing attempt where a scammer impersonates a known vendor to intercept a large payment by providing fake bank details.",
    8: "A warm, personal call between Aruna and her mother, Sunita. This is another example of a safe, low-risk conversation."
};

const renderTranscript = (transcript: string, contact: string) => {
    // This regex is designed to be more robust for various speaker labels in the mock data.
    const speakerRegex = /(Speaker[12]:|Mrs\. Mehta:|Aarav \(Scammer\):|Rohit \(Scammer\):|Emily \(Scammer\):|Rishab:|Ravi:|Rahul:|Neha:|Vendor Rep \(Scammer\):|Sunita Mehta:|Aruna:|Mother:)/g;
    
    const parts = transcript.split(speakerRegex).filter(part => part.trim() !== '');

    const chatBubbles = [];
    for (let i = 0; i < parts.length; i += 2) {
        const speakerLabel = parts[i];
        const text = parts[i+1] || '';

        let speakerName = 'Unknown';
        let isCaller = false;

        if (speakerLabel.includes('Speaker1') || speakerLabel.includes('(Scammer)') || /Rishab|Ravi|Rahul|Vendor/.test(speakerLabel)) {
            speakerName = contact;
            isCaller = true;
        } else if (speakerLabel.includes('Speaker2') || /Aruna|Neha|Mother/.test(speakerLabel)) {
            speakerName = 'You (Aruna)';
        } else if (speakerLabel.includes('Sunita Mehta')) {
             speakerName = contact;
             isCaller = true;
        }

        chatBubbles.push(
            <div key={i} className={cn('mb-4 p-3 rounded-lg', isCaller ? 'bg-primary/10' : 'bg-secondary/20')}>
                <p className={cn('font-bold mb-1', isCaller ? 'text-primary' : 'text-foreground')}>
                    {speakerName}
                </p>
                <p>{text.trim()}</p>
            </div>
        );
    }
    return chatBubbles;
};


export default function TranscriptPanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Transcripts & Analysis</h1>
        <p className="text-muted-foreground">Review call transcripts and their key features.</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {callHistory.map((call) => {
            const emotionInfo = emotionIcons[call.emotion] || emotionIcons['Casual'];
            return (
              <AccordionItem value={`item-${call.id}`} key={call.id} className="border-none">
                <Card className="glassmorphic-card holographic-noise">
                  <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-4 text-left">
                            <FileText className="text-primary w-6 h-6"/>
                            <div>
                                <h3 className="font-bold">{call.contact}</h3>
                                <p className="text-xs text-muted-foreground">{call.date} - {call.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className={cn("border-opacity-30 hidden md:inline-flex", emotionInfo.color.replace('text-', 'border-').replace('-500', '/50'))}>
                                <emotionInfo.icon className={cn("w-4 h-4 mr-2", emotionInfo.color)} />
                                {call.emotion}
                            </Badge>
                             <Badge variant={call.risk === 'high' ? 'destructive' : call.risk === 'medium' ? 'secondary' : 'default'}
                                    className={
                                      call.risk === 'high' ? 'bg-risk-danger/20 text-risk-danger border-risk-danger/30' :
                                      call.risk === 'medium' ? 'bg-risk-caution/20 text-risk-caution border-risk-caution/30' :
                                      'bg-risk-safe/20 text-risk-safe border-risk-safe/30'
                                    }>
                                  {call.risk === 'high' && <AlertTriangle className="w-3 h-3 mr-1"/>}
                                  {call.risk === 'low' && <CheckCircle className="w-3 h-3 mr-1"/>}
                                  {call.risk.charAt(0).toUpperCase() + call.risk.slice(1)}
                              </Badge>
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <CardContent className="pt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <h4 className="font-bold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground mb-4">{callDescriptions[call.id] || "No description available."}</p>
                          <h4 className="font-bold mb-2">Key Features</h4>
                           <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                                <li><strong>Risk Level:</strong> <span className={cn(call.risk === 'high' && 'text-risk-danger', call.risk === 'medium' && 'text-risk-caution')}>{call.risk}</span></li>
                                <li><strong>Emotional Intent:</strong> <span className={cn(emotionInfo.color)}>{call.emotion}</span></li>
                                {call.risk === 'high' && <li>Impersonation & Urgency Tactics</li>}
                                {call.id === 2 && <li>Voice Cloning Detected</li>}
                                {call.id === 5 && <li>Romance Scam Tactics</li>}
                                {call.id === 7 && <li>Spear-phishing & Invoice Fraud</li>}
                           </ul>
                      </div>
                      <ScrollArea className="h-72 pr-4">
                        <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono p-2 glassmorphic rounded-md">
                            {renderTranscript(call.transcript, call.contact)}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            )
        })}
      </Accordion>
    </div>
  );
}
