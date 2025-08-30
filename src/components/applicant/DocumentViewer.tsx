
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit3 } from "lucide-react";
import type { Applicant } from "@/pages/ApplicantTracking";

interface DocumentHighlight {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  aiGenerated?: boolean;
  originalText?: string;
}

interface DocumentViewerProps {
  content: string;
  highlights: DocumentHighlight[];
  onTextSelection: (text: string) => void;
  applicant: Applicant;
  onContentUpdate: (newContent: string) => void;
}

export const DocumentViewer = ({ 
  content, 
  highlights, 
  onTextSelection, 
  applicant, 
  onContentUpdate 
}: DocumentViewerProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [currentContent, setCurrentContent] = useState<string>(content);

  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const text = selection.toString().trim();
        setSelectedText(text);
        onTextSelection(text);
      } else {
        setSelectedText("");
        onTextSelection("");
      }
    };

    // Only add selection listeners to the document viewer
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('mouseup', handleSelection);
      contentElement.addEventListener('keyup', handleSelection);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('mouseup', handleSelection);
        contentElement.removeEventListener('keyup', handleSelection);
      }
    };
  }, [onTextSelection]);

  const replaceTextInContent = (originalText: string, newText: string) => {
    const updatedContent = currentContent.replace(originalText, newText);
    setCurrentContent(updatedContent);
    onContentUpdate(updatedContent);
    
    // Clear selection after replacement
    setSelectedText("");
    onTextSelection("");
    
    // Clear any existing selection in the browser
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  };

  const renderContentWithHighlights = () => {
    if (!highlights.length) {
      return currentContent;
    }

    let result = currentContent;
    let offset = 0;

    // Sort highlights by start index
    const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);

    sortedHighlights.forEach((highlight) => {
      const actualStart = highlight.startIndex + offset;
      const actualEnd = highlight.endIndex + offset;
      
      const beforeText = result.substring(0, actualStart);
      const highlightedText = result.substring(actualStart, actualEnd);
      const afterText = result.substring(actualEnd);

      const highlightSpan = `<span class="bg-red-100 border-l-2 border-red-500 px-1 relative group cursor-pointer ${
        highlight.aiGenerated ? 'bg-red-50' : 'bg-red-100'
      }" title="${highlight.aiGenerated ? 'AI Modified' : 'Original'}">
        ${highlightedText}
        ${highlight.aiGenerated ? '<span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>' : ''}
      </span>`;

      result = beforeText + highlightSpan + afterText;
      offset += highlightSpan.length - highlightedText.length;
    });

    return result;
  };

  return (
    <Card className="bg-white border border-gray-200 h-full flex flex-col">
      <CardHeader className="border-b border-gray-100 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-black flex items-center gap-2">
            <FileText size={20} />
            Document Viewer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white text-black border-gray-200">
              {applicant.applicantName}
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-gray-200">
              <Edit3 size={12} className="mr-1" />
              Interactive
            </Badge>
          </div>
        </div>
        {selectedText && (
          <div className="mt-2 p-2 bg-white rounded border-l-2 border-red-500">
            <p className="text-sm text-black">Selected: "{selectedText}"</p>
            <p className="text-xs text-black mt-1">Press Ctrl/Cmd + L to open chat</p>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-6">
        <div 
          ref={contentRef}
          className="prose prose-sm max-w-none text-black leading-relaxed select-text"
          style={{ userSelect: 'text' }}
          dangerouslySetInnerHTML={{ __html: renderContentWithHighlights() }}
        />
      </CardContent>

      <div className="border-t border-gray-100 p-4 bg-white">
        <div className="flex items-center justify-between text-xs text-black">
          <span>Select text and press Ctrl/Cmd + L to modify with AI</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-100 border border-red-300 rounded"></div>
              <span>AI Modified</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-100 border border-red-300 rounded"></div>
              <span>Highlighted</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
