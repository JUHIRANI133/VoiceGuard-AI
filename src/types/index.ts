
export type Panel = 'home' | 'contacts' | 'uploaded-audio' | 'emotional-tracker' | 'transcript' | 'scam-map' | 'settings' | 'live-call' | 'profile';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface EmergencyContact {
    id: string;
    name: string;
    relation: string;
    phone: string;
    profession: string;
}

export interface CallAnalysis {
    voiceprintMatch: number;
    numberLegitimacy: 'Verified' | 'Unknown' | 'Spoofed';
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    urgency: boolean;
    syntheticVoice: boolean;
}

export interface CallData {
    callerName: string;
    callerNumber: string;
    riskScore: number;
    transcription: string;
    rationale: string;
    analysis: CallAnalysis;
}

export interface UploadedFile {
    id: string;
    name: string;
    duration: string;
    transcript: string;
    audioDataUri: string | null;
}

export interface CallLog {
    id: string | number;
    type: 'Incoming' | 'Outgoing' | 'Uploaded';
    contact: string;
    duration: string;
    date: string;
    risk: RiskLevel;
    emotion: 'Threatening' | 'Stressed' | 'Happy' | 'Loving' | 'Casual' | 'Sad';
    transcript: string;
    voice?: string;
    audioDataUri?: string;
}

export interface AppState {
    activePanel: Panel;
    isCallActive: boolean;
    callData: CallData;
    riskLevel: RiskLevel;
    uploadedFiles: UploadedFile[];
    callHistory: CallLog[];
    emergencyContacts: EmergencyContact[];
    appPin: string | null;
    isAppLocked: boolean;
}

export interface AppContextType extends AppState {
    setActivePanel: (panel: Panel) => void;
    startMockCall: () => void;
    endCall: () => void;
    uploadAudioFile: (file: File) => void;
    setUploadedFiles: (files: UploadedFile[]) => void;
    setCallHistory: (callHistory: CallLog[]) => void;
    updateUploadedFile: (id: string, newName: string) => Promise<void>;
    deleteUploadedFile: (id: string) => Promise<void>;
    addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
    removeEmergencyContact: (id: string) => void;
    updateEmergencyContact: (contact: EmergencyContact) => void;
    setAppPin: (pin: string | null) => void;
    toggleLock: () => void;
}
