"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Briefcase, BookOpenText, Cake, MapPin, Users, ShieldAlert } from 'lucide-react';
import { Separator } from "../ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

const emergencyContacts = [
    { name: 'Rishab Mehta', relation: 'Husband', phone: '+91 98765 43210', profession: 'Civil Engineer' },
    { name: 'Aarav Mehta', relation: 'Son', phone: '+91 91234 56789', profession: 'Computer Science Student' },
];

export default function ProfilePanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Profile</h1>
        <p className="text-muted-foreground">Your personal and professional information.</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
            <Card className="glassmorphic-card holographic-noise shine-sweep">
                <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center text-center md:text-left md:space-x-8 space-y-4 md:space-y-0">
                    <Avatar className="w-28 h-28 border-4 border-primary/50 shadow-lg">
                    <AvatarImage src="https://placehold.co/128x128.png" alt="Aruna Mehta" data-ai-hint="indian woman professor" />
                    <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                    <h2 className="text-2xl font-bold text-glow-cyan">Aruna Mehta</h2>
                     <div className="text-muted-foreground">
                        <Badge variant="outline" className="border-primary/50 text-primary">Premium User</Badge>
                     </div>
                    <div className="mt-2 flex items-center justify-center md:justify-start gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Professor at KIIT, Orissa</span>
                        </div>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="glassmorphic-card holographic-noise">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpenText className="text-primary"/> Bio</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground leading-relaxed">
                        Aruna Mehta is a dedicated professor with over 15 years of experience in Computer Science at KIIT, Orissa. She is passionate about mentoring the next generation of tech innovators and is a respected figure in her community. A loving wife and mother, Aruna is the primary user of VoiceGuard AI, leveraging its technology to protect her family from the increasing threat of phone scams.
                    </p>
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col gap-6">
            <Card className="glassmorphic-card holographic-noise">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <Cake className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">15 July 1983 (Age 42)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">a.mehta@kiit.ac.in</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">+91 12345 67890</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Orissa, India</span>
                    </div>
                </CardContent>
            </Card>
            <Card className="glassmorphic-card holographic-noise">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldAlert className="text-primary"/> Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {emergencyContacts.map(contact => (
                         <li key={contact.name} className="p-3 glassmorphic rounded-lg">
                            <p className="font-bold text-primary">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.relation} - {contact.profession}</p>
                            <p className="text-sm mt-1">{contact.phone}</p>
                         </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
