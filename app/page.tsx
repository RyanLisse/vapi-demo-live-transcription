"use client";
import React from "react";
import useVapi from "@/hooks/use-vapi";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneOff, Loader, Bot } from "lucide-react";
import Transcriber from "@/components/transcriber";

export default function Home() {
  const { 
    toggleCall, 
    isSessionActive, 
    conversation, 
    assistantName, 
    volumeLevel,
    currentAssistantId,
    availableAssistants,
    selectAssistant,
    fetchAvailableAssistants,
    isStarting,
    lastError
  } = useVapi();
  const handleToggleCall = async () => {
    await toggleCall();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            VAPI Demo with Live Transcription
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Experience real-time voice AI with beautiful transcription
          </p>
          
          {/* Assistant Selection */}
          <div className="mb-6 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Assistant
              </label>
            </div>
            <Select 
              value={currentAssistantId} 
              onValueChange={selectAssistant}
              disabled={isSessionActive}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an assistant" />
              </SelectTrigger>
              <SelectContent>
                {availableAssistants.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full"></div>
                      <span>{assistant.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {assistant.llm?.provider} {assistant.llm?.model}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isSessionActive && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Cannot change assistant during active call
              </p>
            )}
            
            {/* Debug button - remove after testing */}
            <div className="mt-2 text-center">
              <Button 
                onClick={fetchAvailableAssistants} 
                variant="outline" 
                size="sm"
                disabled={isSessionActive}
              >
                Refresh Assistants ({availableAssistants.length})
              </Button>
            </div>
          </div>
          
          {/* Call Control Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button
              onClick={handleToggleCall}
              disabled={isStarting}
              size="lg"
              className={`px-8 py-3 text-white font-semibold rounded-full transition-all duration-200 ${
                isSessionActive
                  ? 'bg-red-500 hover:bg-red-600 shadow-red-200'
                  : 'bg-green-500 hover:bg-green-600 shadow-green-200'
              } shadow-lg hover:shadow-xl`}
            >
              {isStarting ? (
                <Loader className="w-5 h-5 animate-spin mr-2" />
              ) : isSessionActive ? (
                <PhoneOff className="w-5 h-5 mr-2" />
              ) : (
                <Phone className="w-5 h-5 mr-2" />
              )}
              {isStarting ? 'Starting...' : isSessionActive ? 'End Call' : 'Start Call'}
            </Button>
            
            {isSessionActive && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 dark:text-gray-300">Live</span>
                </div>
                {volumeLevel > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-600 dark:text-gray-300">Speaking</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {lastError && (
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-red-500 mt-0.5">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                      Call Failed
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {lastError}
                    </p>
                    {lastError.includes('pk_') && (
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/40 rounded border border-red-200 dark:border-red-700">
                        <p className="text-xs text-red-800 dark:text-red-300 font-medium mb-1">
                          How to fix:
                        </p>
                        <ol className="text-xs text-red-700 dark:text-red-400 list-decimal list-inside space-y-1">
                          <li>Go to your VAPI Dashboard</li>
                          <li>Copy the Public Key (should start with "pk_")</li>
                          <li>Update NEXT_PUBLIC_VAPI_PUBLIC_KEY in your .env file</li>
                          <li>Restart the development server</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Transcriber 
          conversation={conversation} 
          assistantName={assistantName}
          isSessionActive={isSessionActive}
        />
      </div>
    </div>
  );
}