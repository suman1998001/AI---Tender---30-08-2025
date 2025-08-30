import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bot, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: React.ReactNode;
  timestamp: Date;
}

interface InPageChatProps {
  document: any;
  vendor?: any;
  showHeader?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
}

const InPageChat: React.FC<InPageChatProps> = ({ 
  document, 
  vendor, 
  showHeader = true, 
  isExpanded: externalIsExpanded,
  onToggleExpanded 
}) => {
  console.log('InPageChatProps rendered with document:', document, 'vendor:', vendor);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant for procurement document evaluation. How can I help you analyze this tender submission?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Use external state if provided, otherwise use internal state
  const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = (expanded: boolean) => {
    if (onToggleExpanded) {
      onToggleExpanded(expanded);
    } else {
      setInternalIsExpanded(expanded);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setLoading(true);
    
    // Enhanced payload with vendor information
    const payload = {
      token: "rt35yfhbskfhsll8kfhsbka",
      s3_uri: document?.url || "",
      query: inputValue,
      role: "Office grade 1",
      model: "gpt-4o",
      save_screenshot: true
    };

    fetch('https://js2szovco3cs24gfd24ibcvr240dplmi.lambda-url.us-west-2.on.aws', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        let content:any = '';
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          if ('result' in data) {
            content = data.result;
          } else {
            const keys = Object.keys(data);
            if (keys.length === 1) {
              const key = keys[0];
              content = (
                <span>
                  <strong>{key}</strong>
                  <br />
                  {String(data[key])}
                </span>
              );
            } else {
              const contentElements = Object.entries(data).map(([k, v]) => {
                if (
                  k === 'source' &&
                  v &&
                  (v as { screenshot_url?: string }).screenshot_url &&
                  (v as { screenshot_url?: string }).screenshot_url!.trim() !== ""
                ) {
                  let url = (v as { screenshot_url: string }).screenshot_url;
                  if (url.startsWith('s3://')) {
                    url = url.replace('s3://document-vizion/', 'https://document-vizion.s3.amazonaws.com/');
                  }
                  return (
                    <Button
                      key="view-screenshot"
                      className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 text-xs"
                      style={{ borderRadius: '8px' }}
                      onClick={() => window.open(url, '_blank')}
                    >
                      View Screenshot
                    </Button>
                  );
                } else if (k !== 'source') {
                  return (
                    <span key={k}>
                      <strong>{k}</strong>
                      <br />
                      {String(v)}
                    </span>
                  );
                } else {
                  return null;
                }
              });
              content = (
                <div>
                  {contentElements.map((el, i) =>
                    el ? (
                      <React.Fragment key={i}>
                        {el}
                        {i < contentElements.length - 1 && (
                          <>
                            <br />
                            <br />
                          </>
                        )}
                      </React.Fragment>
                    ) : null
                  )}
                </div>
              );
            }
          }
        } else {
          content = '';
        }
        const aiMessage: ChatMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      })
      .catch((err) => {
        // Optionally handle error
        setLoading(false);
      });
  };

  return (
    <>
      {/* Chat Header - Only show if showHeader is true */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-foreground" />
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <span className="text-sm text-gray-600">Procurement evaluation expert</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 transition-colors"
            style={{ borderRadius: '15px' }}
            title={isExpanded ? "Collapse chat" : "Expand chat"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      )}

      {/* Chat Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-80' : 'max-h-0'}`}>
        <div className="flex flex-col h-[320px]">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      message.type === 'user' ? 'bg-primary' : 'bg-muted'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}>
                      {message.type === 'ai' ? (
                        <div>{message.content}</div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-100 p-4 bg-gray-25">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={vendor ? `Ask about ${vendor.name}'s submission...` : "Ask about the procurement document..."}
                className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent rounded-lg"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg"
              >
                {!loading ? (
                  <Send className="w-4 h-4" />
                ) : (
                  'Please Wait...'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InPageChat;
