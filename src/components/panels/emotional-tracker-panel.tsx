
"use client";

import { useState, useRef, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Clock, PlayCircle, Loader, Volume2, Smile, Frown, Annoyed, Heart, Bomb, Bot } from 'lucide-react';
import { Button } from '@/components/button';
import { AppContext } from '@/contexts/app-context';
import type { CallLog } from '@/types';
import { generateSpeech } from '@/ai/flows/text-to-speech';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


const emotionIcons: { [key: string]: { icon: React.ElementType, color: string } } = {
  Threatening: { icon: Bomb, color: 'text-red-500' },
  Stressed: { icon: Annoyed, color: 'text-yellow-500' },
  Loving: { icon: Heart, color: 'text-pink-500' },
  Happy: { icon: Smile, color: 'text-green-500' },
  Sad: { icon: Frown, color: 'text-blue-500' },
  Casual: { icon: Bot, color: 'text-gray-500' },
};

export default function EmotionalTrackerPanel() {
  const { callHistory } = useContext(AppContext);
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallLog | null>(null);
  const audioCache = useRef<Record<string, string>>({});
  const { toast } = useToast();

  const handlePlayAudio = async (call: CallLog) => {
    setCurrentCall(call);
    setIsAudioPlayerOpen(true);
    setAudioDataUri(null);
    setIsLoadingAudio(true);
    
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


  return (
    <>
      <div className="h-full flex flex-col gap-6 animate-text-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">Emotional Tracker</h1>
          <p className="text-muted-foreground">Analyze emotional sentiment and intent from past calls.</p>
        </div>
        <Card className="glassmorphic-card holographic-noise flex-grow flex flex-col">
          <CardHeader>
            <CardTitle>Call Emotional Analysis</CardTitle>
            <CardDescription>
              Review the detected emotional state for each call.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Audio</TableHead>
                  <TableHead className="text-right">Emotional Intent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {callHistory.map((call) => {
                   const emotionInfo = emotionIcons[call.emotion] || emotionIcons['Casual'];
                   return (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium">{call.contact}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground"/> {call.duration}
                        </TableCell>
                        <TableCell>{call.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlayAudio(call)}>
                              <PlayCircle className="text-muted-foreground hover:text-primary" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={cn("border-opacity-30", emotionInfo.color.replace('text-', 'border-').replace('-500', '/50'))}>
                            <emotionInfo.icon className={cn("w-4 h-4 mr-2", emotionInfo.color)} />
                            {call.emotion}
                          </Badge>
                        </TableCell>
                      </TableRow>
                   )
                })}
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
    </>
  );
}

    