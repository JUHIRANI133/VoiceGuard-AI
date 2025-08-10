export type Panel = 'home' | 'reports' | 'knowledge' | 'settings' | 'live-call';

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

export interface AppState {
    activePanel: Panel;
    isCallActive: boolean;
    callData: CallData;
    riskLevel: RiskLevel;
}

export interface AppContextType extends AppState {
    setActivePanel: (panel: Panel) => void;
    startMockCall: () => void;
    endCall: () => void;
}
