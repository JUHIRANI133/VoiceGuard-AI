
"use client";

import { useState, useContext, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { FileAudio, Clock, MoreHorizontal, Pencil, Trash2, FileText, Upload, PlayCircle, Volume2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { AppContext } from '@/contexts/app-context';
import type { UploadedFile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


export default function UploadedAudioPanel() {
    const { uploadedFiles, setUploadedFiles, uploadAudioFile } = useContext(AppContext);
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
          toast({
              title: "File Uploaded",
              description: `${file.name} is being processed. It will appear here and in the call history.`,
          });
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
        if (!fileToRename) return;
        setUploadedFiles(uploadedFiles.map(a => a.id === fileToRename.id ? { ...a, name: editingName } : a));
        toast({
            title: "File Renamed",
            description: `Renamed to ${editingName}`
        })
        setFileToRename(null);
    }

    const handleDeleteFile = (id: number) => {
        setUploadedFiles(uploadedFiles.filter(a => a.id !== id));
         toast({
            title: "File Deleted",
            variant: "destructive"
        })
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
                                        <span>{audio.name}</span>
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
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Trash2 className="mr-2 h-4 w-4 text-destructive"/>
                                                            <span className="text-destructive">Delete</span>
                                                        </DropdownMenuItem>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="glassmorphic-card">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action cannot be undone. This will permanently delete the audio file.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteFile(audio.id)} className="bg-destructive hover:bg-destructive/80">Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
                <DialogTitle>Playing: {currentAudioName}</DialogTitle>
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
        <Dialog open={!!fileToRename} onOpenChange={(isOpen) => !isOpen && setFileToRename(null)}>
            <DialogContent className="glassmorphic-card">
                <DialogHeader>
                    <DialogTitle>Rename File</DialogTitle>
                    <DialogDescription>
                        Enter a new name for the file: {fileToRename?.name}
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
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveRename}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
