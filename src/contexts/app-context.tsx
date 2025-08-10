"use client";

import React, { createContext, useState, useRef, useCallback } from 'react';
import type { AppState, AppContextType, CallData } from '@/types';
import { callHistory } from '@/lib/mock-data';

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

const parseTranscript = (transcript: string, contact: string) => {
    const speakerRegex = /(Speaker[12]:|Mrs\. Mehta:|Aarav \(Scammer\):|Rohit \(Scammer\):|Emily \(Scammer\):|Rishab:|Ravi:|Rahul:|Neha:|Vendor Rep \(Scammer\):|Sunita Mehta:|Aruna:|Mother:)/g;
    const parts = transcript.split(speakerRegex).filter(part => part.trim() !== '');

    const chatSegments = [];
    for (let i = 0; i < parts.length; i += 2) {
        const speakerLabel = parts[i];
        const text = parts[i+1] || '';

        let speakerName = 'You';
        if (speakerLabel.includes('Speaker1') || speakerLabel.includes('(Scammer)') || /Rishab|Ravi|Rahul|Vendor|Sunita Mehta/.test(speakerLabel)) {
            speakerName = 'Caller';
        }
        chatSegments.push({ speaker: speakerName, text: text.trim() });
    }
    return chatSegments;
};


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptionIndexRef = useRef<number>(0);
  const mockCallSegments = useRef<{ speaker: string, text: string }[]>([]);

  const endCall = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = null;
    transcriptionIndexRef.current = 0;
    mockCallSegments.current = [];
    setState((prevState) => ({
      ...prevState,
      isCallActive: false,
      activePanel: 'home',
      callData: initialState.callData,
      riskLevel: 'low',
    }));
  }, []);

  const startMockCall = () => {
    // Select a random call from history
    const randomCall = callHistory[Math.floor(Math.random() * callHistory.length)];
    mockCallSegments.current = parseTranscript(randomCall.transcript, randomCall.contact);
    
    setState((prevState) => ({
      ...prevState,
      isCallActive: true,
      activePanel: 'live-call',
      callData: {
        callerName: randomCall.contact,
        callerNumber: 'Unknown Number',
        riskScore: 10,
        transcription: '',
        rationale: 'Call initiated. Monitoring for suspicious activity.',
        analysis: {
            voiceprintMatch: Math.floor(Math.random() * 40) + 55, // 55-95%
            numberLegitimacy: 'Verified',
            sentiment: 'Neutral',
            urgency: false,
            syntheticVoice: randomCall.risk === 'high', // Assume high risk calls might use synthetic voices
        }
      },
      riskLevel: 'low',
    }));

    intervalRef.current = setInterval(() => {
        if (transcriptionIndexRef.current >= mockCallSegments.current.length) {
            endCall();
            return;
        }

        const currentSegment = mockCallSegments.current[transcriptionIndexRef.current];
        transcriptionIndexRef.current += 1;
        
        setState(prevState => {
            const newTranscription = `${prevState.callData.transcription}${prevState.callData.transcription ? '\n\n' : ''}${currentSegment.speaker}: ${currentSegment.text}`;
            
            // Simplified risk scoring for demo
            const riskIncrease = (currentSegment.text.match(/urgent|immediately|now|don't tell|account|money|bank|transfer/gi) || []).length * 15;
            let newRiskScore = Math.min(100, prevState.callData.riskScore + riskIncrease);
            
            let newRationale = prevState.callData.rationale;
            if (riskIncrease > 0) {
              newRationale = "Detected suspicious keywords related to financial urgency.";
            }

            const newRiskLevel = newRiskScore > 75 ? 'high' : newRiskScore > 40 ? 'medium' : 'low';

            return {
                ...prevState,
                callData: {
                    ...prevState.callData,
                    transcription: newTranscription,
                    riskScore: newRiskScore,
                    rationale: newRationale,
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
