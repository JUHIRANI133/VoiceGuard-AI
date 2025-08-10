
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mic, Upload, Phone, Clock, AlertTriangle, CheckCircle, PlayCircle, Loader, Volume2, FileText, X } from 'lucide-react';
import { generateSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '../ui/scroll-area';
import { AppContext } from '@/contexts/app-context';
import { useContext } from 'react';
import type { CallLog } from '@/types';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';

export default function HomePanel() {
  const { callHistory, startMockCall, uploadAudioFile, setActivePanel } = useContext(AppContext);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallLog | null>(null);
  const audioCache = useRef<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const handlePlayAudio = async (call: CallLog) => {
    setCurrentCall(call);
    setIsAudioPlayerOpen(true);
    setAudioDataUri(null);
    setIsLoadingAudio(true);

    // If the call is an uploaded file, it will have its own data URI.
    if (call.audioDataUri) {
        setAudioDataUri(call.audioDataUri);
        setIsLoadingAudio(false);
        return;
    }

    if (audioCache.current[call.id]) {
      setAudioDataUri(audioCache.current[call.id]);
      setIsLoadingAudio(false);
      return;
    }

    try {
      const { audioDataUri } = await generateSpeech({ text: call.transcript, voice: call.voice || 'algenib' });
      audioCache.current[call.id as string] = audioDataUri;
      setAudioDataUri(audioDataUri);
    } catch (error) {
      console.error("Failed to generate speech:", error);
      toast({
        title: "Audio Generation Failed",
        description: "Could not generate audio for this call. You may have exceeded the API rate limit.",
        variant: "destructive"
      });
      setAudioDataUri(null);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleShowTranscript = (call: CallLog) => {
    setCurrentCall(call);
    setIsTranscriptOpen(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAudioFile(file);
      event.target.value = '';
    }
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
              <Button size="lg" className="w-full font-bold" onClick={startMockCall}>
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
              <Button size="lg" variant="outline" className="w-full font-bold glassmorphic border-primary text-primary hover:shadow-[0_0_15px_hsl(var(--primary))] hover:border-primary/80 hover:text-white" onClick={handleUploadClick}>
                  <Upload className="mr-2" /> Upload Audio
              </Button>
              <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/mp3, audio/wav, audio/mpeg" className="hidden" />
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
                    <audio src={audioDataUri} controls autoPlay onEnded={() => setIsAudioPlayerOpen(false)} className="w-full">
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
                  {currentCall?.transcript.split(/Speaker\d:|Mrs\. Mehta:|Aarav \(Scammer\):|Rohit \(Scammer\):|Emily \(Scammer\):|Rishab:|Rahul:|Neha:|Vendor Rep \(Scammer\):/).map((part, index) => {
                      if (index === 0) return part.trim() ? <p key={index}>{part.trim()}</p> : null;
                      
                      const fullMatch = currentCall?.transcript.match(/(Speaker\d:|Mrs\. Mehta:|Aarav \(Scammer\):|Rohit \(Scammer\):|Emily \(Scammer\):|Rishab:|Rahul:|Neha:|Vendor Rep \(Scammer\):)/g);
                      const speakerLabel = fullMatch ? fullMatch[index - 1] : '';

                      let speakerName = 'Unknown';
                      let isCaller = false;
                      if (speakerLabel.startsWith('Speaker1') || speakerLabel.includes('(Scammer)') || speakerLabel.startsWith('Rishab') || speakerLabel.startsWith('Rahul') || speakerLabel.startsWith('Vendor')) {
                          speakerName = currentCall?.contact || 'Caller';
                          isCaller = true;
                      } else if (speakerLabel.startsWith('Speaker2') || speakerLabel.startsWith('Mrs. Mehta') || speakerLabel.startsWith('Neha')) {
                          speakerName = 'You';
                      }

                      return (
                          <div key={index} className={`mb-4 p-3 rounded-lg ${isCaller ? 'bg-primary/10' : 'bg-secondary/20'}`}>
                              <p className={`font-bold mb-1 ${isCaller ? 'text-primary' : 'text-foreground'}`}>
                                {speakerName}
                              </p>
                              <p>{part.trim()}</p>
                          </div>
                      );
                  })}
                </div>
            </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );

    
    