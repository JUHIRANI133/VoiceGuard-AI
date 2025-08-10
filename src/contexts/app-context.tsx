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
  "Hello? Is this grandma?",
  "Yes, it's me. Listen, I'm in a bit of trouble.",
  "What happened? Are you okay?",
  "I was arrested, and I need you to send $2,000 in gift cards right away. Don't tell anyone, especially mom and dad. It has to be a secret.",
  "Gift cards? That sounds strange. Are you sure it's you?",
  "Yes, of course, it's me! My voice is a little weird because I have a cold. You have to hurry, they're going to keep me here if you don't send the money now!",
  "This feels wrong. I'm getting an alert on my phone...",
  "Don't listen to that! It's a trick! Just send the gift cards to the address I'm texting you. Please, you have to do it now!"
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
        callerName: 'Unknown Number',
        callerNumber: '+1 (888) 555-0199',
        riskScore: 10,
        transcription: '',
        rationale: 'Call initiated. Monitoring for suspicious activity.',
        analysis: {
            voiceprintMatch: 88,
            numberLegitimacy: 'Verified',
            sentiment: 'Neutral',
            urgency: false,
            syntheticVoice: false,
        }
      },
      riskLevel: 'low',
    }));

    intervalRef.current = setInterval(() => {
        if (transcriptionIndexRef.current >= mockTranscription.length) {
            endCall();
            return;
        }

        const newPhrase = mockTranscription[transcriptionIndexRef.current];
        transcriptionIndexRef.current += 1;
        
        setState(prevState => {
            const newTranscription = `${prevState.callData.transcription}\n\nCaller: ${newPhrase}`;
            let newRiskScore = prevState.callData.riskScore;
            let newRationale = prevState.callData.rationale;
            let newAnalysis = { ...prevState.callData.analysis };
            
            if (transcriptionIndexRef.current > 1) {
                newRiskScore = Math.min(100, prevState.callData.riskScore + 15);
                newAnalysis.voiceprintMatch = Math.max(20, newAnalysis.voiceprintMatch - 10);
            }
             if (transcriptionIndexRef.current > 2) {
                newAnalysis.numberLegitimacy = 'Spoofed';
                newRationale = "Request for money and secrecy is a major red flag for grandparent scams.";
            }
            if (transcriptionIndexRef.current > 3) {
                 newAnalysis.sentiment = 'Negative';
                 newRationale = "Demand for payment via gift cards is a classic scam tactic.";
            }
            if (transcriptionIndexRef.current > 4) {
                newAnalysis.urgency = true;
                newAnalysis.syntheticVoice = true;
                newRationale = "High-pressure tactics and urgency detected. Synthetic voice analysis indicates a high probability of a deepfake.";
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

    }, 3000);
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
