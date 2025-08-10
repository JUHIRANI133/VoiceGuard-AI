
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mic, Upload, Phone, Clock, AlertTriangle, CheckCircle, PlayCircle } from 'lucide-react';

// Mock data for call history
const callHistory = [
  { id: 1, type: 'Incoming', contact: 'Rohan Kumar', duration: '5:21', date: '2024-07-28', risk: 'high' },
  { id: 2, type: 'Outgoing', contact: 'Aanya Sharma', duration: '12:45', date: '2024-07-28', risk: 'low' },
  { id: 3, type: 'Incoming', contact: 'Unknown', duration: '2:03', date: '2024-07-27', risk: 'medium' },
  { id: 4, type: 'Incoming', contact: 'Aditya Verma', duration: '8:11', date: '2024-07-26', risk: 'low' },
  { id: 5, type: 'Outgoing', contact: 'Priya Singh (Mom)', duration: '22:30', date: '2024-07-26', risk: 'low' },
  { id: 6, type: 'Incoming', contact: 'Pizza Delivery', duration: '1:15', date: '2024-07-25', risk: 'low' },
  { id: 7, type: 'Incoming', contact: 'Spam Caller', duration: '0:35', date: '2024-07-25', risk: 'high' },
  { id: 8, type: 'Outgoing', contact: 'Vikram Reddy', duration: '7:55', date: '2024-07-24', risk: 'low' },
];

export default function HomePanel() {

  return (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlayCircle className="text-muted-foreground hover:text-primary" />
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
  );
}
