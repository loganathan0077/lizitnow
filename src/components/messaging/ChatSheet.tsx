import { useState, useRef, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, Video, MoreVertical, CheckCheck, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'seller';
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}

interface ChatSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sellerName: string;
    sellerId: string;
    isOnline: boolean;
    listingTitle: string;
}

const ChatSheet = ({ open, onOpenChange, sellerName, isOnline, listingTitle }: ChatSheetProps) => {
    // ... existing state ...
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hi! I'm interested in your listing: ${listingTitle}. Is it still available?`,
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
            status: 'read'
        },
        {
            id: '1b',
            text: "Yes, it is! When would you like to see it?",
            sender: 'seller',
            timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
            status: 'read'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
            status: 'sent'
        };

        setMessages([...messages, newMessage]);
        setInputValue('');

        // Simulate Seller Reply
        if (isOnline) {
            setTimeout(() => {
                const reply: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Thanks for the message! I'm online right now. Let me check that for you.",
                    sender: 'seller',
                    timestamp: new Date(),
                    status: 'read'
                }
                setMessages(prev => [...prev, reply]);
            }, 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // User requested "like mobile display size", "reduce chat box".
    // We use a Dialog to center it and give it fixed dimensions like a phone frame.
    // Width: 375px (standard mobile), Height: 667px (or similar aspect ratio).
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="fixed !right-6 !bottom-4 !left-auto !top-auto !translate-x-0 !translate-y-0 p-0 gap-0 w-full max-w-[375px] h-[80vh] max-h-[700px] flex flex-col border-none shadow-2xl rounded-[32px] overflow-hidden bg-[#e5ddd5]/50 dark:bg-background/95 backdrop-blur-md data-[state=open]:!slide-in-from-right-10 data-[state=open]:!slide-in-from-bottom-10 data-[state=open]:!zoom-in-95 data-[state=closed]:!slide-out-to-right-10 data-[state=closed]:!slide-out-to-bottom-10 data-[state=closed]:!zoom-out-95 duration-200">

                {/* Status Bar / Notch Area Mock (Optional styling) */}
                {/* <div className="h-6 bg-primary w-full" /> */}

                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
                            <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">
                                {sellerName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-sm leading-tight">{sellerName}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-green-400" : "bg-red-400")} />
                                <span className="text-xs text-primary-foreground/80 font-medium">
                                    {isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Call Button - Functional */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9"
                            asChild
                        >
                            <a href="tel:+919876543210" aria-label="Call Seller">
                                <Phone className="h-4 w-4" />
                            </a>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-primary-foreground/10 h-9 w-9"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Chat Area */}
                <DialogTitle className="sr-only">Chat with {sellerName}</DialogTitle>
                <ScrollArea className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center dark:bg-none">
                    <div className="flex flex-col gap-3 min-h-full justify-end pb-2">
                        {/* Date Divider Mock */}
                        <div className="flex justify-center my-4">
                            <span className="bg-secondary/80 text-secondary-foreground text-[10px] font-medium px-2 py-1 rounded-lg shadow-sm">
                                Today
                            </span>
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex max-w-[85%]",
                                    msg.sender === 'user' ? "self-end justify-end" : "self-start justify-start"
                                )}
                            >
                                <div className={cn(
                                    "rounded-2xl px-3 py-2 shadow-sm relative text-sm",
                                    msg.sender === 'user'
                                        ? "bg-[#d9fdd3] dark:bg-primary text-foreground rounded-tr-sm"
                                        : "bg-white dark:bg-secondary text-foreground rounded-tl-sm"
                                )}>
                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[10px] text-muted-foreground/80">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {msg.sender === 'user' && (
                                            <CheckCheck className="h-3 w-3 text-blue-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-3 bg-background border-t border-border">
                    <div className="flex gap-2 items-end">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted shrink-0 rounded-full h-10 w-10">
                            <span className="text-xl">😊</span>
                        </Button>
                        <div className="flex-1 bg-secondary rounded-full flex items-center px-4 py-2">
                            <Input
                                placeholder="Message"
                                className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none placeholder:text-muted-foreground text-base"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                        </div>
                        <Button
                            onClick={handleSend}
                            className={cn(
                                "rounded-full h-10 w-10 shrink-0 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90",
                                !inputValue.trim() ? "opacity-50 cursor-not-allowed" : "opacity-100"
                            )}
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default ChatSheet;
