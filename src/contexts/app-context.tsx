
"use client";

import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import type { AppState, AppContextType, UploadedFile, CallLog } from '@/types';
import { initialCallHistory } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

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
  uploadedFiles: [],
  callHistory: initialCallHistory,
};

export const AppContext = createContext<AppContextType>({
  ...initialState,
  setActivePanel: () => {},
  startMockCall: () => {},
  endCall: () => {},
  uploadAudioFile: () => {},
  setUploadedFiles: () => {},
  setCallHistory: () => {},
  updateUploadedFile: async () => {},
  deleteUploadedFile: async () => {},
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
  const { toast } = useToast();

  const fetchUploadedFiles = useCallback(async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "audioFiles"));
        const files: UploadedFile[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            files.push({
                id: doc.id,
                name: data.name,
                duration: data.duration,
                transcript: data.transcript,
                audioDataUri: data.url,
            });
        });
        setState(prevState => ({ ...prevState, uploadedFiles: files }));
    } catch (error) {
        console.error("Error fetching uploaded files: ", error);
        toast({ title: "Error", description: "Could not fetch uploaded files from the database.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);


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
    const randomCall = state.callHistory[Math.floor(Math.random() * state.callHistory.length)];
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

  const uploadAudioFile = async (file: File) => {
    if (!file) return;

    toast({ title: "Uploading...", description: "Your file is being uploaded and processed." });

    try {
        const storageRef = ref(storage, `audio/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(uploadResult.ref);
        
        const placeholderDuration = "0:00";
        const newTranscript = `(Transcript for ${file.name} would be generated via speech-to-text AI)`;

        const docRef = await addDoc(collection(db, "audioFiles"), {
            name: file.name,
            duration: placeholderDuration,
            transcript: newTranscript,
            url: downloadURL,
            createdAt: new Date(),
        });
        
        const newUploadedFile: UploadedFile = {
            id: docRef.id,
            name: file.name,
            duration: placeholderDuration,
            transcript: newTranscript,
            audioDataUri: downloadURL,
        }

        const newCallLog: CallLog = {
          id: docRef.id,
          type: 'Uploaded',
          contact: file.name,
          duration: placeholderDuration,
          date: new Date().toISOString().split('T')[0],
          risk: 'low',
          emotion: 'Casual',
          transcript: newTranscript,
          audioDataUri: downloadURL,
        };

        setState(prevState => ({
          ...prevState,
          uploadedFiles: [newUploadedFile, ...prevState.uploadedFiles],
          callHistory: [newCallLog, ...prevState.callHistory],
        }));
        
        toast({ title: "Success", description: "File uploaded and saved to the database." });

        // Asynchronously update duration
        const audio = new Audio(downloadURL);
        audio.onloadedmetadata = async () => {
            const duration = audio.duration;
            const formattedDuration = `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`;
            await updateDoc(doc(db, "audioFiles", docRef.id), { duration: formattedDuration });
            setState(prevState => ({
                ...prevState,
                uploadedFiles: prevState.uploadedFiles.map(f => f.id === docRef.id ? { ...f, duration: formattedDuration } : f),
                callHistory: prevState.callHistory.map(c => c.id === docRef.id ? { ...c, duration: formattedDuration } : c)
            }));
        };
        audio.onerror = () => {
             console.error("Could not load audio metadata to calculate duration.");
        }

    } catch (error) {
        console.error("Error uploading file: ", error);
        toast({ title: "Upload Failed", description: "There was an error uploading your file.", variant: "destructive" });
    }
  };
  
  const setUploadedFiles = (files: UploadedFile[]) => {
      setState(prevState => ({ ...prevState, uploadedFiles: files }));
  }
  
  const updateUploadedFile = async (id: string, newName: string) => {
    try {
        const fileDocRef = doc(db, 'audioFiles', id);
        await updateDoc(fileDocRef, { name: newName });
        setState(prevState => ({
            ...prevState,
            uploadedFiles: prevState.uploadedFiles.map(f => f.id === id ? { ...f, name: newName } : f)
        }));
        toast({ title: "Success", description: "File renamed successfully." });
    } catch (error) {
        console.error("Error renaming file:", error);
        toast({ title: "Error", description: "Failed to rename file.", variant: "destructive" });
    }
  };

  const deleteUploadedFile = async (id: string) => {
      try {
          await deleteDoc(doc(db, "audioFiles", id));
          setState(prevState => ({
              ...prevState,
              uploadedFiles: prevState.uploadedFiles.filter(f => f.id !== id),
              callHistory: prevState.callHistory.filter(c => c.id !== id || c.type !== 'Uploaded'),
          }));
          toast({ title: "File Deleted", variant: "destructive" });
      } catch (error) {
          console.error("Error deleting file:", error);
          toast({ title: "Error", description: "Failed to delete file.", variant: "destructive" });
      }
  };

  const setCallHistory = (callHistory: CallLog[]) => {
    setState(prevState => ({ ...prevState, callHistory }));
  }


  return (
    <AppContext.Provider value={{ ...state, setActivePanel, startMockCall, endCall, uploadAudioFile, setUploadedFiles, setCallHistory, updateUploadedFile, deleteUploadedFile }}>
      {children}
    </AppContext.Provider>
  );
};
