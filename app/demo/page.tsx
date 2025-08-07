"use client";
import { Button } from "@/components/ui/button";
import useVapi from "@/hooks/use-vapi";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";

export default function VapiDemo() {
  const { 
    isSessionActive, 
    volumeLevel, 
    conversation, 
    toggleCall, 
    isMuted, 
    toggleMute 
  } = useVapi();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">VAPI Assistant Demo</h1>
        
        {/* Status Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Assistant: Alex</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSessionActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">{isSessionActive ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
          
          {/* Volume Indicator */}
          {isSessionActive && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-400">Volume Level</span>
                <span className="text-sm">{Math.round(volumeLevel * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${volumeLevel * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex gap-4">
            <Button
              onClick={toggleCall}
              size="lg"
              variant={isSessionActive ? "destructive" : "default"}
              className="flex-1"
            >
              {isSessionActive ? (
                <>
                  <PhoneOff className="mr-2 h-5 w-5" />
                  End Call
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  Start Call
                </>
              )}
            </Button>
            
            {isSessionActive && (
              <Button
                onClick={toggleMute}
                size="lg"
                variant={isMuted ? "secondary" : "outline"}
              >
                {isMuted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Conversation Display */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Conversation</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {conversation.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Start a call to begin the conversation
              </p>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={`${msg.role}-${msg.timestamp}-${index}`}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">
                        {msg.role === 'user' ? 'You' : 'Alex'}
                      </span>
                      <span className="text-xs opacity-60">{msg.timestamp}</span>
                      {!msg.isFinal && (
                        <span className="text-xs bg-yellow-500 text-black px-1 rounded">
                          partial
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400">
          <p className="mb-2">Click &quot;Start Call&quot; to begin talking with Alex</p>
          <p className="text-sm">Make sure your microphone permissions are enabled</p>
        </div>
      </div>
    </div>
  );
}