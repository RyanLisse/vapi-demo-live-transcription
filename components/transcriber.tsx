"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function Transcriber({ 
  conversation, 
  assistantName = "AI Assistant",
  isSessionActive = false 
}: { 
  conversation: Array<{ role: string; text: string; timestamp: string; isFinal: boolean }>;
  assistantName?: string;
  isSessionActive?: boolean;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  const finalConversation = conversation.filter(msg => msg.isFinal);

  return (
    <div className="flex flex-col size-full max-w-2xl mx-auto bg-background rounded-xl shadow-2xl overflow-hidden border border-border">
      {/* Header */}
      <div className="bg-secondary/50 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              isSessionActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
            )}></div>
            <div className="font-semibold text-foreground">Live Transcript</div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {finalConversation.length} messages
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 min-h-[400px] max-h-[600px]">
        {finalConversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">{assistantName.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to chat with {assistantName}</h3>
              <p className="text-muted-foreground">Start a conversation to see the live transcript here.</p>
            </div>
          </div>
        ) : (
          finalConversation.map((message, index) => (
            <div key={index} className={cn(
              "flex items-start gap-4",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}>
              {message.role === 'assistant' && (
                <Avatar className="w-9 h-9 shrink-0 ring-2 ring-blue-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                    {assistantName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary/80 text-secondary-foreground border border-border'
              )}>
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className={cn(
                  "text-xs mt-2 opacity-70",
                  message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>
                  {message.timestamp}
                </div>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="w-9 h-9 shrink-0 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    You
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Transcriber;