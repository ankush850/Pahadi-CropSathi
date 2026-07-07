import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Loader2, Minus } from 'lucide-react';
import { ChatMessage, PlantAnalysis, Language } from '../types';
import { chatWithAgriBot } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { getTranslation } from '../utils/translations';
import { AIInput } from './ui/ai-input';

interface ChatBotProps {
  analysisContext: PlantAnalysis | null;
  lang: Language;
}

export const ChatBot: React.FC<ChatBotProps> = ({ analysisContext, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = (key: string) => getTranslation(lang, key);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial Greeting based on Language
  useEffect(() => {
    const greeting = lang === 'en' ? 'Hello! I am your AI Crop Advisor.' : 
                     lang === 'hi' ? 'नमस्ते! मैं आपका एआई फसल सलाहकार हूं।' :
                     lang === 'pa' ? 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਏਆਈ ਫਸਲ ਸਲਾਹਕਾਰ ਹਾਂ।' :
                     'Hello! Ask me anything.';
    
    setMessages([{ 
      id: '1', 
      role: 'model', 
      text: greeting, 
      timestamp: new Date() 
    }]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const responseText = await chatWithAgriBot(messages, message, lang, analysisContext || undefined);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };



  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-cement-200 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-green-600 p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="./1000098217.png" 
              alt="AgriVision AI" 
              className="w-7 h-7 rounded-lg bg-white/10 p-0.5"
            />
            <div>
              <h3 className="font-bold text-white text-sm">{t('chatTitle')}</h3>
              <p className="text-green-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
                {t('online')}
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <Minus className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-cement-50 custom-scrollbar flex flex-col gap-3">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-cement-200' : 'bg-green-100'}`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-cement-600" /> : <Bot className="w-3.5 h-3.5 text-green-600" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-cement-800 text-white rounded-tr-none' 
                  : 'bg-white border border-cement-200 text-cement-800 rounded-tl-none shadow-sm'
              }`}>
                <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-green'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="self-start flex gap-2 ml-8">
               <div className="bg-white border border-cement-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                 <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-cement-100 bg-white rounded-b-2xl px-3 py-2">
          <AIInput
            placeholder={t('chatPlaceholder')}
            onSubmit={handleSend}
            className="py-0"
            minHeight={36}
            maxHeight={80}
          />
        </div>
      </div>
    </>
  );
};