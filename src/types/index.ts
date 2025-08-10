
export type Panel = 'home' | 'contacts' | 'uploaded-audio' | 'emotional-tracker' | 'transcript' | 'scam-map' | 'settings' | 'live-call' | 'profile';

export type RiskLevel = 'low' | 'medium' | 'high';

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
    id: number;
    name: string;
    duration: string;
    transcript: string;
    isRenaming: boolean;
    audioDataUri: string | null;
}

export interface CallLog {
    id: number;
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
}

export interface AppContextType extends AppState {
    setActivePanel: (panel: Panel) => void;
    startMockCall: () => void;
    endCall: () => void;
    uploadAudioFile: (file: File) => void;
    setUploadedFiles: (files: UploadedFile[]) => void;
    setCallHistory: (callHistory: CallLog[]) => void;
}
