"use client";

import React, { createContext, useState, useRef, useCallback } from 'react';
import type { AppState, AppContextType, CallData } from '@/types';

const initialState: AppState = {
  activePanel: 'home',
  isCallActive: false,
  callData: {
    callerName: '',
    callerNumber: '',
    riskScore: 0,
    transcription: 'Awaiting call...',
    rationale: 'System is ready to analyze incoming calls.',
    analysis: {
        voiceprintMatch: 0,
        numberLegitimacy: 'Unknown',
        sentiment: 'Neutral',
        urgency: false,
        syntheticVoice: false,
    }
  },
  riskLevel: 'low',
};

export const AppContext = createContext<AppContextType>({
  ...initialState,
  setActivePanel: () => {},
  startMockCall: () => {},
  endCall: () => {},
});

const mockTranscription = [
  { speaker: 'Caller', text: "Mom... it's me, Aarav. Please don't panic... I've had an accident." },
  { speaker: 'You', text: "Oh my God! Aarav, are you alright? Where are you?" },
  { speaker: 'Caller', text: "I'm in the hospital. They won't treat me unless I pay the admission fee... ?50,000 right now. Please, Mom, I'm scared.", riskIncrease: 30, rationale: "Sudden accident claim and urgent demand for money are classic scam indicators.", analysis: { sentiment: 'Stressed' } },
  { speaker: 'You', text: "But... your phone sounds different." },
  { speaker: 'Caller', text: "It's the hospital's phone. Mom, there's no time, please transfer the money to this account immediately. I'll explain later.", riskIncrease: 40, rationale: "High-pressure tactics and a request for an immediate, unverified bank transfer are major red flags. Voice analysis suggests a potential deepfake.", analysis: { urgency: true, syntheticVoice: true } },
  { speaker: 'You', text: "This is all too fast. My phone is warning me this could be a scam. Let me call your father." },
  { speaker: 'Caller', text: "No, don't! There's no time! If you don't send the money in the next 5 minutes, it'll be too late!", riskIncrease: 20, rationale: "Extreme urgency and attempts to isolate the victim are hallmarks of a sophisticated scam.", analysis: { sentiment: 'Threatening' } }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptionIndexRef = useRef<number>(0);

  const endCall = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = null;
    transcriptionIndexRef.current = 0;
    setState((prevState) => ({
      ...prevState,
      isCallActive: false,
      activePanel: 'home',
      callData: initialState.callData,
      riskLevel: 'low',
    }));
  }, []);

  const startMockCall = () => {
    setState((prevState) => ({
      ...prevState,
      isCallActive: true,
      activePanel: 'live-call',
      callData: {
        callerName: 'Aarav (Son) - Impersonated',
        callerNumber: '+91 91234 56789',
        riskScore: 10,
        transcription: '',
        rationale: 'Call initiated. Voice analysis suggests potential voice cloning. Monitoring for suspicious activity.',
        analysis: {
            voiceprintMatch: 55,
            numberLegitimacy: 'Verified',
            sentiment: 'Neutral',
            urgency: false,
            syntheticVoice: true,
        }
      },
      riskLevel: 'low',
    }));

    intervalRef.current = setInterval(() => {
        if (transcriptionIndexRef.current >= mockTranscription.length) {
            endCall();
            return;
        }

        const currentSegment = mockTranscription[transcriptionIndexRef.current];
        transcriptionIndexRef.current += 1;
        
        setState(prevState => {
            const newTranscription = `${prevState.callData.transcription}${prevState.callData.transcription ? '\n\n' : ''}${currentSegment.speaker}: ${currentSegment.text}`;
            let newRiskScore = prevState.callData.riskScore;
            let newRationale = prevState.callData.rationale;
            let newAnalysis = { ...prevState.callData.analysis };
            
            if (currentSegment.riskIncrease) {
              newRiskScore = Math.min(100, newRiskScore + currentSegment.riskIncrease);
            }

            if(currentSegment.rationale) {
              newRationale = currentSegment.rationale;
            }

            if(currentSegment.analysis) {
                newAnalysis = { ...newAnalysis, ...currentSegment.analysis };
            }
            
            const newRiskLevel = newRiskScore > 75 ? 'high' : newRiskScore > 40 ? 'medium' : 'low';

            return {
                ...prevState,
                callData: {
                    ...prevState.callData,
                    transcription: newTranscription,
                    riskScore: newRiskScore,
                    rationale: newRationale,
                    analysis: newAnalysis,
                },
                riskLevel: newRiskLevel,
            }
        });

    }, 4000);
  };
  
  const setActivePanel = (panel: AppState['activePanel']) => {
    setState((prevState) => ({ ...prevState, activePanel: panel }));
  };

  return (
    <AppContext.Provider value={{ ...state, setActivePanel, startMockCall, endCall }}>
      {children}
    </AppContext.Provider>
  );
};
