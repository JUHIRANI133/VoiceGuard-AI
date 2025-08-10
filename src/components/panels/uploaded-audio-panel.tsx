
"use client";

import { useState, useContext, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileAudio, Clock, Pencil, FileText, Check, X, Upload, PlayCircle, Loader, Volume2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { AppContext } from '@/contexts/app-context';
import type { UploadedFile } from '@/types';
import { useToast } from '@/hooks/use-toast';


export default function UploadedAudioPanel() {
    const { uploadedFiles, setUploadedFiles, uploadAudioFile } = useContext(AppContext);
    const [transcriptToShow, setTranscriptToShow] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);

    const handleRenameClick = (audio: UploadedFile) => {
        setUploadedFiles(uploadedFiles.map(a => a.id === audio.id ? { ...a, isRenaming: true } : { ...a, isRenaming: false }));
        setEditingName(audio.name);
    }
    
    const handleSaveRename = (id: number) => {
        setUploadedFiles(uploadedFiles.map(a => a.id === id ? { ...a, name: editingName, isRenaming: false } : a));
    }

    const handleCancelRename = (id: number) => {
        setUploadedFiles(uploadedFiles.map(a => a.id === id ? { ...a, isRenaming: false } : a));
    }

    const handleShowTranscript = (transcript: string) => {
        setTranscriptToShow(transcript);
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          uploadAudioFile(file);
          toast({
              title: "File Uploaded",
              description: `${file.name} is being processed and will appear in the call history.`,
          });
        }
    };

    const handlePlayAudio = (audio: UploadedFile) => {
        if(audio.audioDataUri) {
            setAudioDataUri(audio.audioDataUri);
            setIsAudioPlayerOpen(true);
        } else {
            toast({
                title: "Audio Not Available",
                description: "The audio for this file has not been processed yet.",
                variant: "destructive"
            });
        }
    }

  return (
    <>
        <div className="h-full flex flex-col gap-6 animate-text-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tighter">Uploaded Audio</h1>
                <p className="text-muted-foreground">Manage and analyze your uploaded audio files.</p>
            </div>
            <Card className="glassmorphic-card holographic-noise flex-grow flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Audio Files</CardTitle>
                    <Button variant="outline" className="glassmorphic border-primary text-primary" onClick={handleUploadClick}>
                        <Upload className="mr-2 h-4 w-4"/>
                        Upload New File
                    </Button>
                    <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
                </CardHeader>
                <CardContent className="flex-grow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {uploadedFiles.map((audio) => (
                                <TableRow key={audio.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileAudio className="w-4 h-4 text-muted-foreground"/>
                                        {audio.isRenaming ? (
                                            <Input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="h-8"
                                            />
                                        ) : (
                                            <span>{audio.name}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground"/> {audio.duration}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {audio.isRenaming ? (
                                            <>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSaveRename(audio.id)}>
                                                    <Check className="text-green-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCancelRename(audio.id)}>
                                                    <X className="text-red-500" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlayAudio(audio)}>
                                                    <PlayCircle className="text-muted-foreground hover:text-primary" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRenameClick(audio)}>
                                                    <Pencil className="text-muted-foreground hover:text-primary" />
                                                </Button>
                                                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShowTranscript(audio.transcript)}>
                                                    <FileText className="text-muted-foreground hover:text-primary" />
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <Dialog open={!!transcriptToShow} onOpenChange={(isOpen) => !isOpen && setTranscriptToShow(null)}>
            <DialogContent className="glassmorphic-card max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Audio Transcript</DialogTitle>
                    <DialogDescription>
                        The generated transcript for the selected audio file.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[50vh] my-4">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono p-4 glassmorphic rounded-md">
                        {transcriptToShow}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
        <Dialog open={isAudioPlayerOpen} onOpenChange={setIsAudioPlayerOpen}>
            <DialogContent className="glassmorphic-card">
              <DialogHeader>
                <DialogTitle>Playing Audio</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-8">
                {audioDataUri ? (
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
