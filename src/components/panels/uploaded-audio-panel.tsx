
"use client";

import { useState, useContext, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { FileAudio, Clock, MoreHorizontal, Pencil, Trash2, FileText, Upload, PlayCircle, Volume2, Inbox } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { AppContext } from '@/contexts/app-context';
import type { UploadedFile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


export default function UploadedAudioPanel() {
    const { uploadedFiles, uploadAudioFile, updateUploadedFile, deleteUploadedFile } = useContext(AppContext);
    const [transcriptToShow, setTranscriptToShow] = useState<string | null>(null);
    const [fileToRename, setFileToRename] = useState<UploadedFile | null>(null);
    const [editingName, setEditingName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(false);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [currentAudioName, setCurrentAudioName] = useState<string>('');


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
          // Clear the input value so the same file can be uploaded again
          event.target.value = '';
        }
    };

    const handlePlayAudio = (audio: UploadedFile) => {
        if(audio.audioDataUri) {
            setAudioDataUri(audio.audioDataUri);
            setCurrentAudioName(audio.name);
            setIsAudioPlayerOpen(true);
        } else {
            toast({
                title: "Audio Not Available",
                description: "The audio for this file has not been processed yet.",
                variant: "destructive"
            });
        }
    }
    
    const handleRenameClick = (audio: UploadedFile) => {
        setFileToRename(audio);
        setEditingName(audio.name);
    }
    
    const handleSaveRename = () => {
        if (!fileToRename || !editingName.trim()) {
            toast({ title: "Invalid Name", description: "File name cannot be empty.", variant: "destructive" });
            return
        };
        updateUploadedFile(fileToRename.id, editingName.trim())
        setFileToRename(null);
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
                    <div>
                        <CardTitle>My Audio Files</CardTitle>
                        <CardDescription>Audio files you have uploaded for analysis.</CardDescription>
                    </div>
                    <Button variant="outline" className="glassmorphic border-primary text-primary hover:text-white" onClick={handleUploadClick}>
                        <Upload className="mr-2 h-4 w-4"/>
                        Upload New File
                    </Button>
                    <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/mp3, audio/wav, audio/mpeg, audio/m4a" className="hidden" />
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
                            {uploadedFiles.length > 0 ? uploadedFiles.map((audio) => (
                                <TableRow key={audio.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <FileAudio className="w-4 h-4 text-muted-foreground"/>
                                        <span className="truncate max-w-xs">{audio.name}</span>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-muted-foreground"/> {audio.duration}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePlayAudio(audio)}>
                                            <PlayCircle className="text-muted-foreground hover:text-primary" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShowTranscript(audio.transcript)}>
                                            <FileText className="text-muted-foreground hover:text-primary" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="glassmorphic">
                                                <DropdownMenuItem onClick={() => handleRenameClick(audio)}>
                                                    <Pencil className="mr-2 h-4 w-4"/>
                                                    <span>Rename</span>
                                                </DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                            <Trash2 className="mr-2 h-4 w-4"/>
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="glassmorphic-card">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete "{audio.name}" from the database and storage.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => deleteUploadedFile(audio.id)} className="bg-destructive hover:bg-destructive/80">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox className="w-10 h-10 text-muted-foreground"/>
                                            <h3 className="text-lg font-semibold">No audio files found</h3>
                                            <p className="text-muted-foreground">Click "Upload New File" to get started.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
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
                <DialogTitle className="truncate max-w-full">Playing: {currentAudioName}</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center p-8">
                {audioDataUri ? (
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
        <Dialog open={!!fileToRename} onOpenChange={(isOpen) => !isOpen && setFileToRename(null)}>
            <DialogContent className="glassmorphic-card">
                <DialogHeader>
                    <DialogTitle>Rename File</DialogTitle>
                    <DialogDescription>
                        Enter a new name for the file: "{fileToRename?.name}"
                    </DialogDescription>
                </DialogHeader>
                <Input 
                    value={editingName} 
                    onChange={(e) => setEditingName(e.target.value)} 
                    className="my-4"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveRename}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

    