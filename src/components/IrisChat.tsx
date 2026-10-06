import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Product, BespokeFitProfile } from '../types';
import {
  Sparkles,
  X,
  Send,
  Camera,
  Layers,
  Heart,
  Bot,
  User,
  Scissors,
  ArrowRight
} from 'lucide-react';

interface IrisChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner: () => void;
  onOpenTryOn: () => void;
  currentProduct?: Product | null;
  activeProfile: BespokeFitProfile | null;
}

export const IrisChat: React.FC<IrisChatProps> = ({
  isOpen,
  onClose,
  onOpenScanner,
  onOpenTryOn,
  currentProduct,
  activeProfile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content:
        "Hey babe! ♡ I'm **Iris**, your personal fashion stylist & bespoke atelier tailor here at **aw-fit**! ✨\n\nIf standard off-the-rack sizes are sold out or never fit your curves right, don't worry! I can scan your photo, calculate your exact measurements, and have ANY of our viral pieces custom-stitched for your body at $0 extra cost! How can I style you today?",
      timestamp: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const quickPrompts = [
    { text: 'Scan my silhouette for custom sizing 📸', action: 'scan' },
    { text: 'Why do off-rack clothes gap at my waist? 📏', action: 'ask' },
    { text: 'Can I custom-make the sold-out size? 🎀', action: 'ask' },
    { text: 'Show me how this looks in Virtual Try-On 🪞', action: 'tryon' },
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          currentProduct,
          userProfile: activeProfile?.measurements,
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I'm always here to help you get the dream fit! ♡ Try scanning your body in our Sizing Studio!";

      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: reply,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content:
          "Finding the right fit is our specialty! Tap **'Scan My Silhouette'** to upload or take a photo, and I'll calibrate your bespoke sizing chart for zero waist gap! ♡",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden flex flex-col h-[580px] animate-slide-up">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg shadow-inner">
              🎀
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm tracking-tight">Iris</h3>
              <span className="bg-white/25 text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full">
                AI Atelier Stylist
              </span>
            </div>
            <div className="text-[11px] text-pink-100 flex items-center gap-1">
              <span>aw-fit Bespoke Sizing Assistant</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Profile or Product Context Strip */}
      <div className="bg-pink-50/80 px-4 py-2 border-b border-pink-100 flex items-center justify-between text-[11px] text-zinc-600">
        {currentProduct ? (
          <span className="truncate">
            Viewing: <strong className="text-zinc-800">{currentProduct.name}</strong>
          </span>
        ) : activeProfile ? (
          <span className="truncate">
            Bespoke Profile: <strong className="text-rose-700">{activeProfile.bodyType}</strong>
          </span>
        ) : (
          <span>Tailoring consultation mode active ✨</span>
        )}

        <div className="flex gap-2">
          <button
            onClick={onOpenScanner}
            className="text-pink-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Camera className="w-3 h-3" /> Scan Body
          </button>
          <button
            onClick={onOpenTryOn}
            className="text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            🪞 Try-On
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-white to-[#FFFDFD]">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                  🎀
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isModel
                    ? 'bg-pink-50/70 border border-pink-100 text-zinc-800 rounded-tl-xs shadow-xs'
                    : 'bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-tr-xs shadow-sm font-medium'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Sizing Actions inside Iris chat */}
                {isModel && (
                  <div className="mt-2.5 pt-2 border-t border-pink-200/60 flex flex-wrap gap-1.5">
                    <button
                      onClick={onOpenScanner}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-100 text-pink-700 font-bold text-[10px] border border-pink-200 shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Scan Body Silhouette</span>
                    </button>
                    <button
                      onClick={onOpenTryOn}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-700 font-bold text-[10px] border border-purple-200 shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>🪞</span>
                      <span>Launch Try-On</span>
                    </button>
                  </div>
                )}
              </div>

              {!isModel && (
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-pink-600 bg-pink-50/60 p-2.5 rounded-2xl w-fit border border-pink-100">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-pink-500" />
            <span>Iris is formulating your fit advice... ♡</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-3 py-1.5 bg-white border-t border-pink-100 flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (qp.action === 'scan') {
                onOpenScanner();
              } else if (qp.action === 'tryon') {
                onOpenTryOn();
              } else {
                handleSend(qp.text);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-800 text-[10px] font-semibold whitespace-nowrap border border-pink-200 transition cursor-pointer shrink-0"
          >
            {qp.text}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-pink-100 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask Iris for sizing tips, body scan, or custom fit..."
          className="flex-1 px-3.5 py-2 rounded-full bg-pink-50/50 hover:bg-pink-50/80 focus:bg-white text-xs border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder:text-zinc-400"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white disabled:opacity-40 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
