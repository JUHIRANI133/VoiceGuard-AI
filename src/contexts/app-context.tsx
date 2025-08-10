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
  "Namaste, is this Mrs. Sharma?",
  "Yes, speaking. Who is this?",
  "Ma'am, I am calling from your bank's KYC department. Your account will be blocked if you do not update your PAN card details immediately.",
  "Oh my! But I just did this last month. Are you sure?",
  "Yes ma'am, it is a new RBI mandate. To avoid suspension, you must click the link I just sent you via SMS and enter your details. It is very urgent.",
  "A link via SMS? My bank always says never to click such links. This sounds suspicious.",
  "Ma'am, this is a secure portal! Your account will be frozen in 10 minutes if you don't comply. Do you want to lose access to all your money? Think of the trouble!",
  "My phone is giving me a scam alert... I am not comfortable with this. I will visit the branch tomorrow.",
  "There is no time for that! You must do it now! This is your final warning!"
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
        callerName: 'Rohan Kumar',
        callerNumber: '+91 98765 43210',
        riskScore: 10,
        transcription: '',
        rationale: 'Call initiated. Monitoring for suspicious activity.',
        analysis: {
            voiceprintMatch: 92,
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
            const newTranscription = `${prevState.callData.transcription}${transcriptionIndexRef.current % 2 !== 0 ? '\n\nCaller: ' : '\n\nYou: '}${newPhrase}`;
            let newRiskScore = prevState.callData.riskScore;
            let newRationale = prevState.callData.rationale;
            let newAnalysis = { ...prevState.callData.analysis };
            
            if (transcriptionIndexRef.current > 2) {
                newRiskScore = Math.min(100, prevState.callData.riskScore + 20);
                newRationale = "Impersonating a bank official is a common tactic. The sense of urgency is a red flag.";
            }
             if (transcriptionIndexRef.current > 4) {
                newRiskScore = Math.min(100, prevState.callData.riskScore + 30);
                newAnalysis.numberLegitimacy = 'Spoofed';
                newAnalysis.sentiment = 'Negative';
                newRationale = "Requesting action via an unknown SMS link is a classic phishing attempt.";
            }
            if (transcriptionIndexRef.current > 6) {
                newRiskScore = 100;
                newAnalysis.urgency = true;
                newAnalysis.syntheticVoice = true;
                newRationale = "High-pressure tactics, threats, and urgency detected. Synthetic voice analysis indicates a high probability of a deepfake.";
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
