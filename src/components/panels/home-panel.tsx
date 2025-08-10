
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Mic, Upload, Phone, Clock, AlertTriangle, CheckCircle, PlayCircle, Loader, Volume2, FileText, X } from 'lucide-react';
import { generateSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '../ui/scroll-area';

// Mock data for call history
const callHistory = [
  { id: 1, type: 'Incoming', contact: 'Rohan Kumar', duration: '5:21', date: '2024-07-28', risk: 'high', transcript: "Speaker1: Namaste, is this Mrs. Sharma? Speaker2: Yes, speaking. Who is this? Speaker1: Ma'am, I am calling from your bank's KYC department. Your account will be blocked if you do not update your PAN card details immediately. Speaker2: Oh my! But I just did this last month. Are you sure? Speaker1: Yes ma'am, it is a new RBI mandate. To avoid suspension, you must click the link I just sent you via SMS and enter your details. It is very urgent. Speaker2: A link via SMS? My bank always says never to click such links. This sounds suspicious. Speaker1: Ma'am, this is a secure portal! Your account will be frozen in 10 minutes if you don't comply. Do you want to lose access to all your money? Think of the trouble! Speaker2: My phone is giving me a scam alert... I am not comfortable with this. I will visit the branch tomorrow. Speaker1: There is no time for that! You must do it now! This is your final warning!", voice: 'Algenib' },
  { id: 2, type: 'Outgoing', contact: 'Aanya Sharma', duration: '12:45', date: '2024-07-28', risk: 'low', transcript: "Speaker1: Hi Aanya, it's me. Just wanted to see how you were doing. Speaker2: Hey! I'm good, just got back from the market. How are you? Speaker1: I'm well. Let's catch up this weekend?", voice: 'Sirius' },
  { id: 3, type: 'Incoming', contact: 'Unknown', duration: '2:03', date: '2024-07-27', risk: 'medium', transcript: "Speaker1: Hello, you have won a lottery for 1 million rupees! To claim your prize, please pay a small transaction fee of 5000 rupees. Speaker2: A lottery? I don't remember entering one. This sounds like a scam. Speaker1: Sir, this is a legitimate offer! Don't miss this chance!", voice: 'Arcturus' },
  { id: 4, type: 'Incoming', contact: 'Aditya Verma', duration: '8:11', date: '2024-07-26', risk: 'low', transcript: "Speaker1: Hi Aditya, I was calling about the project report. Have you had a chance to look at it? Speaker2: Yes, I have. It looks good, just a few minor changes needed. I'll send you an email.", voice: 'Vega' },
  { id: 5, type: 'Outgoing', contact: 'Priya Singh (Mom)', duration: '22:30', date: '2024-07-26', risk: 'low', transcript: "Speaker1: Hi Mom, how are you? Speaker2: I'm good beta. Have you eaten? Don't work too late. Speaker1: Yes mom, I've eaten. I'll call you tomorrow.", voice: 'Capella' },
  { id: 6, type: 'Incoming', contact: 'Pizza Delivery', duration: '1:15', date: '2024-07-25', risk: 'low', transcript: "Speaker1: Hello, I'm at your door with your pizza order. Speaker2: Great, coming!", voice: 'Rigel' },
  { id: 7, type: 'Incoming', contact: 'Spam Caller', duration: '0:35', date: '2024-07-25', risk: 'high', transcript: "Speaker1: We are calling about your car's extended warranty. Speaker2: Please remove me from your list.", voice: 'Procyon' },
  { id: 8, type: 'Outgoing', contact: 'Vikram Reddy', duration: '7:55', date: '2024-07-24', risk: 'low', transcript: "Speaker1: Vikram, it's me. Are we still on for the movie tonight? Speaker2: Yes, of course. See you at 7.", voice: 'Achernar' },
];

export default function HomePanel() {
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentCall, setCurrentCall] = useState<(typeof callHistory)[0] | null>(null);

  const handlePlayAudio = async (call: typeof callHistory[0]) => {
    setCurrentCall(call);
    setIsAudioPlayerOpen(true);
    setIsLoadingAudio(true);
    try {
      const { audioDataUri } = await generateSpeech({ text: call.transcript, voice: call.voice });
      setAudioDataUri(audioDataUri);
    } catch (error) {
      console.error("Failed to generate speech:", error);
      // You could show a toast notification here
      setAudioDataUri(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleShowTranscript = (call: typeof callHistory[0]) => {
    setCurrentCall(call);
    setIsTranscriptOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full gap-6 animate-text-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Home</h1>
          <p className="text-muted-foreground">
            Record, upload, or review your calls for security analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glassmorphic-card holographic-noise shine-sweep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="text-primary"/>
                Record a Call
              </CardTitle>
              <CardDescription>
                Start a new recording to analyze a live conversation in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click the button below to begin recording your microphone. All analysis will be performed securely.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full font-bold">
                <Mic className="mr-2" /> Start Recording
              </Button>
            </CardFooter>
          </Card>

          <Card className="glassmorphic-card holographic-noise shine-sweep">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="text-primary"/>
                Input an Audio File
              </CardTitle>
              <CardDescription>
                Upload a pre-recorded audio file (.mp3, .wav) for a detailed scam analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your files are processed securely and are not stored after analysis is complete.
              </p>
            </CardContent>
            <CardFooter>
              <Button size="lg" variant="outline" className="w-full font-bold glassmorphic border-primary text-primary hover:shadow-[0_0_15px_hsl(var(--primary))] hover:border-primary/80 hover:text-white">
                  <Upload className="mr-2" /> Upload Audio
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="glassmorphic-card holographic-noise flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Call History</CardTitle>
            <CardDescription>
              Review your recent calls and their risk analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Audio</TableHead>
                  <TableHead>Transcript</TableHead>
                  <TableHead className="text-right">Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callHistory.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground"/> {call.type}
                    </TableCell>
                    <TableCell>{call.contact}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground"/> {call.duration}
                    </TableCell>
                    <TableCell>{call.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlayAudio(call)}>
                          <PlayCircle className="text-muted-foreground hover:text-primary" />
                      </Button>
                    </TableCell>
                    <TableCell>
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShowTranscript(call)}>
                          <FileText className="text-muted-foreground hover:text-primary" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isAudioPlayerOpen} onOpenChange={setIsAudioPlayerOpen}>
        <DialogContent className="glassmorphic-card">
          <DialogHeader>
            <DialogTitle>Playing Audio</DialogTitle>
            <DialogDescription>
              Call with {currentCall?.contact} on {currentCall?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            {isLoadingAudio ? (
              <div className="flex flex-col items-center gap-4">
                <Loader className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating audio...</p>
              </div>
            ) : audioDataUri ? (
                <div className="flex flex-col items-center gap-4">
                    <Volume2 className="w-12 h-12 text-primary" />
                    <audio src={audioDataUri} controls autoPlay onEnded={() => setIsAudioPlayerOpen(false)}>
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ) : (
              <p className="text-destructive">Could not load audio.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
        <DialogContent className="glassmorphic-card max-w-2xl">
          <DialogHeader>
            <DialogTitle>Call Transcript</DialogTitle>
             <DialogDescription>
              Call with {currentCall?.contact} on {currentCall?.date}
            </DialogDescription>
          </DialogHeader>
           <ScrollArea className="h-[50vh] my-4">
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono p-4">
                  {currentCall?.transcript.split('Speaker').map((part, index) => {
                      if (index === 0) return part;
                      const speakerId = part.substring(0, 1);
                      const text = part.substring(2);
                      const isCaller = speakerId === '1';
                      return (
                          <div key={index} className={`mb-4 p-3 rounded-lg ${isCaller ? 'bg-primary/10' : 'bg-secondary/20'}`}>
                              <p className={`font-bold mb-1 ${isCaller ? 'text-primary' : 'text-foreground'}`}>
                                {isCaller ? 'Caller' : 'You'}
                              </p>
                              <p>{text.trim()}</p>
                          </div>
                      );
                  })}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
