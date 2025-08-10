
"use client";

import { useState, useContext } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Shield, Bell, Globe, PhoneIncoming, Siren, Users, KeyRound, PlusCircle, Trash2, Edit, Palette, Sun, Moon, MapPin, LocateFixed, Navigation } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AppContext } from '@/contexts/app-context';
import type { EmergencyContact, Language } from '@/types';
import { useToast } from '@/hooks/use-toast';


export default function SettingsPanel() {
  const { emergencyContacts, addEmergencyContact, removeEmergencyContact, appPin, setAppPin, t, language, setLanguage } = useContext(AppContext);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', profession: '' });
  const [pin, setPin] = useState('');
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleAddContact = () => {
    if (newContact.name && newContact.relation && newContact.phone) {
      addEmergencyContact(newContact);
      setNewContact({ name: '', relation: '', phone: '', profession: '' });
    } else {
      toast({ title: "Missing Fields", description: "Please fill out at least name, relation, and phone.", variant: "destructive" });
    }
  };

  const handleSetPin = () => {
    if (pin.length === 4 && /^\d{4}$/.test(pin)) {
      setAppPin(pin);
      setIsPinModalOpen(false);
      setPin('');
    } else {
      toast({ title: "Invalid PIN", description: "PIN must be 4 digits.", variant: "destructive" });
    }
  };

  const handleRemovePin = () => {
    setAppPin(null);
    setIsPinModalOpen(false);
  };

  return (
    <>
      <div className="h-full flex flex-col gap-6 animate-text-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">{t('settingsTitle')}</h1>
          <p className="text-muted-foreground">{t('settingsDescription')}</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-6">
          <AccordionItem value="item-1" className="border-none">
            <Card className="glassmorphic-card border-primary/20">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardHeader className="p-0 text-left">
                  <CardTitle className="flex items-center gap-2"><Shield className="text-primary"/> {t('protectionTitle')}</CardTitle>
                  <CardDescription>{t('protectionDescription')}</CardDescription>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-6 pt-0">
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <PhoneIncoming className="w-5 h-5 text-primary" />
                      <Label htmlFor="record-unknown">{t('recordUnknownLabel')}</Label>
                    </div>
                    <Switch id="record-unknown" defaultChecked/>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <Siren className="w-5 h-5 text-primary" />
                      <Label htmlFor="sos-alert">{t('sosAlertLabel')}</Label>
                    </div>
                    <Switch id="sos-alert" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <Label>{t('editEmergencyContactLabel')}</Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsContactsModalOpen(true)}>{t('editButton')}</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <KeyRound className="w-5 h-5 text-primary" />
                      <Label>{appPin ? t('changePinLabel') : t('addPinLabel')}</Label>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsPinModalOpen(true)}>{appPin ? t('editButton') : t('addButton')}</Button>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
          
           <AccordionItem value="item-3" className="border-none">
            <Card className="glassmorphic-card border-primary/20">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardHeader className="p-0 text-left">
                  <CardTitle className="flex items-center gap-2"><Palette className="text-primary"/> {t('appearanceTitle')}</CardTitle>
                  <CardDescription>{t('appearanceDescription')}</CardDescription>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-6 pt-0">
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                        <Label htmlFor="dark-mode">{t('darkModeLabel')}</Label>
                      </div>
                    </div>
                    <Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-none">
            <Card className="glassmorphic-card border-primary/20">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardHeader className="p-0 text-left">
                  <CardTitle className="flex items-center gap-2"><Bell className="text-primary"/> {t('alertsAndLanguageTitle')}</CardTitle>
                  <CardDescription>{t('alertsAndLanguageDescription')}</CardDescription>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-6 pt-0">
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <Label htmlFor="alert-sound">{t('alertSoundLabel')}</Label>
                    <Switch id="alert-sound" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <Label htmlFor="haptic-feedback">{t('hapticFeedbackLabel')}</Label>
                    <Switch id="haptic-feedback" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <Label htmlFor="language"><Globe className="inline-block mr-2 h-4 w-4"/> {t('languageLabel')}</Label>
                    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                      <SelectTrigger id="language" className="w-[180px] glassmorphic">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="glassmorphic">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-none">
            <Card className="glassmorphic-card border-primary/20">
              <AccordionTrigger className="p-6 hover:no-underline">
                <CardHeader className="p-0 text-left">
                  <CardTitle className="flex items-center gap-2"><MapPin className="text-primary"/> {t('preventionTitle')}</CardTitle>
                  <CardDescription>{t('preventionDescription')}</CardDescription>
                </CardHeader>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="space-y-6 pt-0">
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-5 h-5 text-primary" />
                      <Label htmlFor="send-gps">{t('sendGpsLabel')}</Label>
                    </div>
                    <Switch id="send-gps" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <Siren className="w-5 h-5 text-primary" />
                      <Label htmlFor="contact-police">{t('contactPoliceLabel')}</Label>
                    </div>
                    <Switch id="contact-police" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg glassmorphic">
                    <div className="flex items-center gap-3">
                      <LocateFixed className="w-5 h-5 text-primary" />
                      <Label htmlFor="detect-location">{t('detectLocationLabel')}</Label>
                    </div>
                    <Switch id="detect-location" />
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-end mt-auto">
          <Button className="font-bold">{t('saveChangesButton')}</Button>
        </div>
      </div>

      <Dialog open={isContactsModalOpen} onOpenChange={setIsContactsModalOpen}>
        <DialogContent className="glassmorphic-card">
          <DialogHeader>
            <DialogTitle>Edit Emergency Contacts</DialogTitle>
            <DialogDescription>Add or remove trusted contacts for S.O.S alerts.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            {emergencyContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 glassmorphic rounded-lg">
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.relation}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeEmergencyContact(contact.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-2 p-3 glassmorphic rounded-lg">
            <h4 className="font-semibold">Add New Contact</h4>
            <Input placeholder="Name" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} />
            <Input placeholder="Relation (e.g., Husband, Son)" value={newContact.relation} onChange={e => setNewContact({...newContact, relation: e.target.value})} />
            <Input placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} />
            <Input placeholder="Profession (optional)" value={newContact.profession} onChange={e => setNewContact({...newContact, profession: e.target.value})} />
          </div>
          <DialogFooter>
            <Button onClick={handleAddContact}><PlusCircle className="mr-2 h-4 w-4" /> Add Contact</Button>
            <DialogClose asChild><Button variant="outline">Done</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
        <DialogContent className="glassmorphic-card">
          <DialogHeader>
            <DialogTitle>{appPin ? 'Change Your PIN' : 'Set App PIN'}</DialogTitle>
            <DialogDescription>Secure your app with a 4-digit PIN.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-6">
            <Input 
              type="password"
              maxLength={4}
              placeholder="****"
              value={pin}
              onChange={e => setPin(e.target.value)}
              className="w-32 text-2xl text-center tracking-[0.5em]"
            />
          </div>
          <DialogFooter className="flex justify-between w-full">
            {appPin && <Button variant="destructive" onClick={handleRemovePin}>Remove PIN</Button>}
            <div className="flex gap-2 ml-auto">
               <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
               <Button onClick={handleSetPin}>Set PIN</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
