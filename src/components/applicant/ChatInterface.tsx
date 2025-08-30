
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentViewer } from "./DocumentViewer";
import { ChatPanel } from "./ChatPanel";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Applicant } from "@/pages/ApplicantTracking";

interface ChatInterfaceProps {
  applicant: Applicant;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  selectedText?: string;
  applied?: boolean;
}

interface DocumentHighlight {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  aiGenerated?: boolean;
  originalText?: string;
}

export const ChatInterface = ({ applicant }: ChatInterfaceProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");
  const [chatPanelOpen, setChatPanelOpen] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<DocumentHighlight[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [documentContent, setDocumentContent] = useState<string>(`
    Cloud Infrastructure Services Request for Proposal

    1. Executive Summary
    TechCorp Solutions is pleased to submit our comprehensive proposal for your cloud infrastructure services requirements. Our team brings over 15 years of experience in enterprise cloud solutions, having successfully migrated over 200 companies to scalable cloud architectures.

    2. Technical Approach
    Our proposed solution leverages industry-leading cloud platforms including AWS, Azure, and Google Cloud Platform. We implement a multi-cloud strategy that ensures high availability, disaster recovery, and cost optimization.

    Key technical components include:
    - Container orchestration using Kubernetes
    - Infrastructure as Code (IaC) using Terraform
    - Continuous Integration/Continuous Deployment (CI/CD) pipelines
    - Comprehensive monitoring and alerting systems
    - Advanced security implementations including zero-trust architecture

    3. Project Timeline
    Phase 1: Assessment and Planning (4 weeks)
    Phase 2: Infrastructure Setup (6 weeks)
    Phase 3: Migration and Testing (8 weeks)
    Phase 4: Go-Live and Support (2 weeks)

    4. Team Qualifications
    Our dedicated team consists of certified cloud architects, DevOps engineers, and security specialists. All team members hold relevant industry certifications including AWS Solutions Architect, Azure Expert, and Kubernetes Administrator.

    5. Cost Structure
    Our competitive pricing model includes transparent costs with no hidden fees. We offer flexible payment terms and provide detailed cost breakdowns for all services.
  `);

  const [originalContent] = useState<string>(documentContent);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          setSelectedText(selection.toString().trim());
          setChatPanelOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      selectedText: selectedText
    };

    setChatMessages(prev => [...prev, newMessage]);
    setIsGenerating(true);

    // Mock AI response - in real app this would call actual AI API
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Here's the suggested revision: "${selectedText.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1))}" - I've improved the text based on your request: "${message}".`,
        timestamp: new Date(),
        selectedText: selectedText
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleApplyResponse = (messageId: string, newText: string, originalText: string) => {
    // Replace the original text with the AI-generated text in the document
    const updatedContent = documentContent.replace(originalText, newText);
    setDocumentContent(updatedContent);
    
    // Mark the message as applied
    setChatMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, applied: true } : msg
      )
    );
    
    // Add highlight for the modified text
    const newHighlight: DocumentHighlight = {
      id: Date.now().toString(),
      startIndex: updatedContent.indexOf(newText),
      endIndex: updatedContent.indexOf(newText) + newText.length,
      text: newText,
      aiGenerated: true,
      originalText: originalText
    };
    setHighlights(prev => [...prev, newHighlight]);
    
    // Clear selected text and mark as changed
    setSelectedText("");
    setHasChanges(true);
  };

  const handleTextSelection = (text: string) => {
    setSelectedText(text);
  };

  const handleContentUpdate = (newContent: string) => {
    setDocumentContent(newContent);
    setHasChanges(newContent !== originalContent);
  };

  const handleSave = () => {
    // Mock save functionality - in real app this would save to backend
    toast({
      title: "Document Saved",
      description: "Your changes have been saved successfully.",
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      {/* Save Button Header */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 ${
            hasChanges 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Save size={16} />
          Save Changes
        </Button>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[800px]">
        <ChatPanel
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          selectedText={selectedText}
          isOpen={chatPanelOpen}
          onClose={() => setChatPanelOpen(false)}
          isGenerating={isGenerating}
          onApplyResponse={handleApplyResponse}
        />
        
        <DocumentViewer
          content={documentContent}
          highlights={highlights}
          onTextSelection={handleTextSelection}
          applicant={applicant}
          onContentUpdate={handleContentUpdate}
        />
      </div>
    </div>
  );
};
