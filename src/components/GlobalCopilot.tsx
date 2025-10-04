import { useState, useRef, useEffect } from "react";
import { useCopilot } from "@/contexts/CopilotContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Bot, 
  X, 
  Send, 
  Trash2, 
  Loader2,
  Sparkles,
  Paperclip,
  FileIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalCopilot() {
  const { 
    isOpen, 
    messages, 
    isProcessing, 
    closeCopilot, 
    sendMessage, 
    clearMessages 
  } = useCopilot();
  
  const [input, setInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || isProcessing) return;
    
    const message = input.trim() || "Arquivos anexados";
    const files = attachedFiles;
    
    setInput("");
    setAttachedFiles([]);
    
    await sendMessage(message, files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed z-50 animate-in slide-in-from-bottom-4",
      isMobile 
        ? "inset-x-2 bottom-2 top-2" 
        : "bottom-4 right-4 w-[400px] h-[600px]"
    )}>
      <Card className="h-full flex flex-col shadow-2xl border-2">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-6 w-6 text-primary" />
              <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Copilot</h3>
              <p className="text-xs text-muted-foreground">Assistente IA Global</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              className="h-8 w-8"
              title="Limpar conversa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeCopilot}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 animate-in fade-in-50 slide-in-from-bottom-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[85%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs opacity-80">
                          <FileIcon className="h-3 w-3" />
                          <span>{file.name}</span>
                          <span>({(file.size / 1024).toFixed(1)}KB)</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold">U</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3 animate-in fade-in-50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Input */}
        <div className="p-4">
          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg text-xs"
                >
                  <FileIcon className="h-3 w-3" />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-destructive/20"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="*/*"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex-shrink-0"
              title="Anexar arquivo"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && attachedFiles.length === 0) || isProcessing}
              size="icon"
              className="flex-shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter para enviar • Shift+Enter para quebra de linha
          </p>
        </div>
      </Card>
    </div>
  );
}
