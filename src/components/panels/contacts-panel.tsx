"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, User, Briefcase, Heart } from 'lucide-react';

const contacts = [
    { name: 'Rishab Mehta', relationship: 'Husband', phone: '+91 98765 43210', avatar: 'https://placehold.co/100x100.png', fallback: 'RM', hint: 'indian man' },
    { name: 'Aarav Mehta', relationship: 'Son', phone: '+91 91234 56789', avatar: 'https://placehold.co/100x100.png', fallback: 'AM', hint: 'indian teenage boy' },
    { name: 'Ravi Mehta', relationship: 'Brother', phone: '+91 87654 32109', avatar: 'https://placehold.co/100x100.png', fallback: 'RM', hint: 'indian young man' },
    { name: 'Rohit Sharma', relationship: 'Friend', phone: '+91 76543 21098', avatar: 'https://placehold.co/100x100.png', fallback: 'RS', hint: 'indian man portrait' },
    { name: 'Priya Das', relationship: 'Colleague', phone: '+91 88888 77777', avatar: 'https://placehold.co/100x100.png', fallback: 'PD', hint: 'indian woman' },
    { name: 'Sunita Mehta', relationship: 'Mother', phone: '+91 99999 88888', avatar: 'https://placehold.co/100x100.png', fallback: 'SM', hint: 'indian senior woman' },
];

const relationshipIcons: { [key: string]: React.ReactElement } = {
    'Husband': <Heart className="w-4 h-4 text-muted-foreground" />,
    'Son': <User className="w-4 h-4 text-muted-foreground" />,
    'Brother': <User className="w-4 h-4 text-muted-foreground" />,
    'Friend': <User className="w-4 h-4 text-muted-foreground" />,
    'Colleague': <Briefcase className="w-4 h-4 text-muted-foreground" />,
    'Mother': <Heart className="w-4 h-4 text-muted-foreground" />,
}

export default function ContactsPanel() {
  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter">Contacts</h1>
        <p className="text-muted-foreground">Your trusted network.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
            <Card key={index} className="glassmorphic-card holographic-noise shine-sweep">
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/30">
                            <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint={contact.hint} />
                            <AvatarFallback>{contact.fallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-primary">{contact.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {relationshipIcons[contact.relationship]}
                                <span>{contact.relationship}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground p-2 glassmorphic rounded-md">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{contact.phone}</span>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
