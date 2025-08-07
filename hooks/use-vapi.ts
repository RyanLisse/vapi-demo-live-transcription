import { useEffect, useRef, useState, useCallback } from "react";
import Vapi from "@vapi-ai/web";

const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "";
const defaultAssistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

// Debug logging
console.log("VAPI Environment Variables:");
console.log("Public Key:", publicKey ? `${publicKey.substring(0, 8)}...` : "MISSING");
console.log("Assistant ID:", defaultAssistantId ? `${defaultAssistantId.substring(0, 8)}...` : "MISSING");

const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [lastError, setLastError] = useState<string>("");
  const [assistantName, setAssistantName] = useState<string>("");
  const [currentAssistantId, setCurrentAssistantId] = useState<string>(defaultAssistantId);
  const [availableAssistants, setAvailableAssistants] = useState<Array<{id: string, name: string, llm: any}>>([]);
  const [conversation, setConversation] = useState<
    { role: string; text: string; timestamp: string; isFinal: boolean }[]
  >([]);
  const vapiRef = useRef<any>(null);

  const fetchAvailableAssistants = useCallback(async () => {
    console.log('🔍 Fetching available assistants from API...');
    
    try {
      const response = await fetch('/api/assistants');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const assistants = await response.json();
      console.log('✅ Available assistants fetched:', assistants);
      setAvailableAssistants(assistants);
      
      // Set current assistant name
      const currentAssistant = assistants.find((a: any) => a.id === currentAssistantId);
      console.log('🎯 Current assistant:', currentAssistant?.name || 'Not found');
      setAssistantName(currentAssistant?.name || 'AI Assistant');
      
    } catch (error) {
      console.error('❌ Failed to fetch assistants:', error);
      
      // Fallback to hardcoded assistants if API fails
      const fallbackAssistants = [
        {
          id: "9a086592-7734-4aac-8e73-0284543d6fae",
          name: "Test",
          llm: { provider: "groq", model: "llama3-70b-8192" }
        },
        {
          id: "10d273d9-c388-403f-9783-745777e7c631", 
          name: "Test (GPT-4o)",
          llm: { provider: "openai", model: "gpt-4o" }
        },
        {
          id: "5b9da430-109f-4159-87be-7d8bb5d8d4ac",
          name: "Alex", 
          llm: { provider: "groq", model: "llama-3.1-8b-instant" }
        },
        {
          id: "cc460219-bfec-47de-a1a5-1f379e5e05e4",
          name: "Jamie",
          llm: { provider: "openai", model: "gpt-4o" }
        }
      ];
      
      console.log('🔄 Using fallback assistants');
      setAvailableAssistants(fallbackAssistants);
      
      const currentAssistant = fallbackAssistants.find((a: any) => a.id === currentAssistantId);
      setAssistantName(currentAssistant?.name || 'AI Assistant');
    }
  }, [currentAssistantId]);

  const initializeVapi = useCallback(() => {
    if (!vapiRef.current) {
      const vapiInstance = new Vapi(publicKey);
      vapiRef.current = vapiInstance;
      
      // Fetch available assistants when initializing
      fetchAvailableAssistants();

      vapiInstance.on("call-start", () => {
        setIsSessionActive(true);
        setIsStarting(false);
        setLastError("");
      });

      vapiInstance.on("call-end", () => {
        setIsSessionActive(false);
        setIsStarting(false);
        setConversation([]); // Reset conversation on call end
      });

      vapiInstance.on("volume-level", (volume: number) => {
        setVolumeLevel(volume);
      });

      vapiInstance.on("message", (message: any) => {
        if (message.type === "transcript") {
          setConversation((prev) => {
            const timestamp = new Date().toLocaleTimeString();
            const updatedConversation = [...prev];
            if (message.transcriptType === "final") {
              // Find the partial message to replace it with the final one
              const partialIndex = updatedConversation.findIndex(
                (msg) => msg.role === message.role && !msg.isFinal,
              );
              if (partialIndex !== -1) {
                updatedConversation[partialIndex] = {
                  role: message.role,
                  text: message.transcript,
                  timestamp: updatedConversation[partialIndex].timestamp,
                  isFinal: true,
                };
              } else {
                updatedConversation.push({
                  role: message.role,
                  text: message.transcript,
                  timestamp,
                  isFinal: true,
                });
              }
            } else {
              // Add partial message or update the existing one
              const partialIndex = updatedConversation.findIndex(
                (msg) => msg.role === message.role && !msg.isFinal,
              );
              if (partialIndex !== -1) {
                updatedConversation[partialIndex] = {
                  ...updatedConversation[partialIndex],
                  text: message.transcript,
                };
              } else {
                updatedConversation.push({
                  role: message.role,
                  text: message.transcript,
                  timestamp,
                  isFinal: false,
                });
              }
            }
            return updatedConversation;
          });
        }

        if (
          message.type === "function-call" &&
          message.functionCall.name === "changeUrl"
        ) {
          const command = message.functionCall.parameters.url.toLowerCase();
          console.log(command);
          if (command) {
            window.location.href = command;
          } else {
            console.error("Unknown route:", command);
          }
        }
      });

      vapiInstance.on("error", (e: any) => {
        console.error("🚨 VAPI Error Details:", {
          error: e,
          message: e?.message,
          status: e?.status,
          statusText: e?.statusText,
          response: e?.response,
          type: e?.type,
          stage: e?.stage
        });
      });
    }
  }, [fetchAvailableAssistants]);

  useEffect(() => {
    initializeVapi();

    // Cleanup function to end call and dispose Vapi instance
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, [initializeVapi]);

  const toggleCall = async () => {
    try {
      if (isSessionActive) {
        console.log("🛑 Stopping VAPI call...");
        await vapiRef.current.stop();
      } else {
        setIsStarting(true);
        setLastError("");
        console.log("🚀 Starting VAPI call with:");
        console.log("- Public Key:", publicKey ? `${publicKey.substring(0, 8)}...${publicKey.substring(-8)}` : "MISSING");
        console.log("- Assistant ID:", currentAssistantId);
        console.log("- Current Assistant Name:", assistantName);
        
        if (!vapiRef.current) {
          console.error("❌ VAPI instance not initialized");
          setLastError("VAPI instance not initialized");
          setIsStarting(false);
          return;
        }
        
        await vapiRef.current.start(currentAssistantId);
      }
    } catch (err: any) {
      console.error("❌ Error toggling Vapi session:", {
        error: err,
        message: err?.message,
        status: err?.status,
        statusText: err?.statusText,
        response: err?.response,
        stack: err?.stack
      });
      setLastError(err?.message || "Failed to start call");
      setIsStarting(false);
    }
  };

  const sendMessage = (role: string, content: string) => {
    if (vapiRef.current) {
      vapiRef.current.send({
        type: "add-message",
        message: { role, content },
      });
    }
  };

  const say = (message: string, endCallAfterSpoken = false) => {
    if (vapiRef.current) {
      vapiRef.current.say(message, endCallAfterSpoken);
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      const newMuteState = !isMuted;
      vapiRef.current.setMuted(newMuteState);
      setIsMuted(newMuteState);
    }
  };

  const selectAssistant = (assistantId: string) => {
    if (!isSessionActive) {
      setCurrentAssistantId(assistantId);
      const selectedAssistant = availableAssistants.find(a => a.id === assistantId);
      setAssistantName(selectedAssistant?.name || 'AI Assistant');
      setConversation([]); // Clear conversation when switching assistants
    }
  };

  return {
    volumeLevel,
    isSessionActive,
    conversation,
    toggleCall,
    sendMessage,
    say,
    toggleMute,
    isMuted,
    assistantName,
    currentAssistantId,
    availableAssistants,
    selectAssistant,
    fetchAvailableAssistants,
    isStarting,
    lastError,
  };
};

export default useVapi;