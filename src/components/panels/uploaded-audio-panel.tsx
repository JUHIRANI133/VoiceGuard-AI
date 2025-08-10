
"use client";

import { useState, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileAudio, Clock, Pencil, FileText, Check, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { AppContext } from '@/contexts/app-context';
import type { UploadedFile } from '@/types';


export default function UploadedAudioPanel() {
    const { uploadedFiles, setUploadedFiles } = useContext(AppContext);
    const [transcriptToShow, setTranscriptToShow] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

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

  return (
    <>
        <div className="h-full flex flex-col gap-6 animate-text-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tighter">Uploaded Audio</h1>
                <p className="text-muted-foreground">Manage and analyze your uploaded audio files.</p>
            </div>
            <Card className="glassmorphic-card holographic-noise flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle>My Audio Files</CardTitle>
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
    </>
  );
}
