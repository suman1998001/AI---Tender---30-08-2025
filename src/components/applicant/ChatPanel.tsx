import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Bot, User, Loader2, X, Check, X as XIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  selectedText?: string;
  applied?: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  selectedText: string;
  isOpen: boolean;
  onClose: () => void;
  isGenerating: boolean;
  onApplyResponse: (messageId: string, newText: string, originalText: string) => void;
}

export const ChatPanel = ({ 
  messages, 
  onSendMessage, 
  selectedText, 
  isOpen, 
  onClose, 
  isGenerating,
  onApplyResponse
}: ChatPanelProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("MSTRL");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const aiModels = [
    { value: "MSTRL", label: "MSTRL" },
    { value: "MSTRL-turbo", label: "MSTRL" },
    { value: "claude-3", label: "Claude 3" },
    { value: "gemini-pro", label: "Gemini Pro" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && selectedText) {
      textareaRef.current?.focus();
    }
  }, [isOpen, selectedText]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleApply = (messageId: string, newText: string, originalText: string) => {
    onApplyResponse(messageId, newText, originalText);
  };

  const handleCancel = (messageId: string) => {
    // Mark message as cancelled - you could add a cancelled state if needed
    console.log(`Cancelled message: ${messageId}`);
  };

  return (
    <Card className={`bg-white border border-gray-200 h-full flex flex-col transition-all duration-300 ${
      isOpen ? 'ring-2 ring-red-200' : ''
    }`}>
      <CardHeader className="border-b border-gray-100 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare size={20} />
            AI Document Assistant
          </CardTitle>
          <div className="flex items-center gap-3">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-40 h-8 text-sm border-gray-200 bg-white">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {aiModels.map((model) => (
                  <SelectItem 
                    key={model.value} 
                    value={model.value}
                    className="text-sm hover:bg-gray-50 focus:bg-red-50"
                  >
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
        {selectedText && (
          <div className="mt-2 p-3 bg-red-50 rounded border border-red-200">
            <p className="text-sm font-medium text-red-800 mb-1">Selected Text:</p>
            <p className="text-sm text-red-700 italic">"{selectedText}"</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm">
                  Select text in the document and press Ctrl/Cmd + L to start a conversation
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {message.type === 'user' ? (
                        <User size={16} className="text-red-700" />
                      ) : (
                        <Bot size={16} className="text-gray-600" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.selectedText && (
                          <div className="mb-2 p-2 bg-black bg-opacity-10 rounded text-xs">
                            <strong>Regarding:</strong> "{message.selectedText}"
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Apply/Cancel buttons for AI responses */}
                  {message.type === 'assistant' && message.selectedText && !message.applied && (
                    <div className="flex justify-start ml-11 gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApply(message.id, message.content, message.selectedText!)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs"
                      >
                        <Check size={12} className="mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancel(message.id)}
                        className="border-gray-300 hover:bg-gray-50 px-3 py-1 text-xs"
                      >
                        <XIcon size={12} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                  
                  {message.applied && (
                    <div className="flex justify-start ml-11">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        Applied
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isGenerating && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-gray-100">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-gray-100 p-4 bg-gray-25">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={selectedText ? "How would you like to modify the selected text?" : "Select text in the document first..."}
              className="flex-1 min-h-[80px] resize-none border-gray-200 focus:border-red-300 focus:ring-red-200"
              disabled={!selectedText || isGenerating}
            />
            <Button
              onClick={handleSend}
              disabled={!inputMessage.trim() || !selectedText || isGenerating}
              className="bg-red-500 hover:bg-red-600 text-white px-4"
            >
              {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </Button>
          </div>
          {selectedText && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift + Enter for new line
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
