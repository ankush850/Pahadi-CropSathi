import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User as UserIcon, 
  CornerDownLeft, 
  Mountain
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  audioUrl?: string; // simulation for speech output
}

export const Chat: React.FC = () => {
  const { t, farmProfile, language } = useSettings();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: language === 'pah' 
        ? "भल मान्याँ! मैं पहाड़ कृषिखैं क्रॉपसाथि एआई सलाहकार छूँ। आपुणी फसल अर माटु का बारे मैं कुछ भी पूछो।"
        : "Namaskar! I am your CropSathi AI Assistant. Ask me anything about high-altitude farming, terracing, crop diseases, or market rates for your farm.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    {
      en: "Best apple varieties for 1800m altitude?",
      hi: "1800 मीटर की ऊंचाई के लिए सेब की बेहतरीन किस्में?",
      pah: "1800 मीटर मा स्याउ की भल फसल कुन हून?"
    },
    {
      en: "How to prevent slope runoff during monsoon?",
      hi: "मानसून में सीढ़ीदार खेतों में मिट्टी का कटाव कैसे रोकें?",
      pah: "बरसात मा माटुक बहण कस कै रोकण?"
    },
    {
      en: "Best composting tips for cold climates?",
      hi: "ठंडी जलवायु में कंपोस्ट खाद बनाने के नुस्खे?",
      pah: "ठंड मा खात बणाणै तरीक बताओ?"
    },
    {
      en: "Mandi rates for off-season ginger?",
      hi: "बेमौसम अदरक के लिए मंडी भाव क्या हैं?",
      pah: "अदरक क मंडी भाव कतुक छन?"
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // AI Mock response generator based on elevation/keywords
  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    const isPahadi = language === 'pah';

    if (q.includes('apple') || q.includes('स्याउ') || q.includes('सेब')) {
      if (isPahadi) {
        return "स्याउ क लीजै 1500m है ऊपर की ऊंचाई ठीक रूँ। रॉयल डिलीशियस अर स्पर किस्में लगो। पाणि जमा नी होण दीजो, जड़ सड़ सकद।";
      }
      return `For your elevation of ${farmProfile.elevation}m, Royal Delicious and Red Chief spur varieties are highly recommended. Apple crops here need well-drained red acidic soil. Pruning should be finished during dry dormancy in January.`;
    }
    
    if (q.includes('runoff') || q.includes('monsoon') || q.includes('कटाव') || q.includes('बहण') || q.includes('ढलान') || q.includes('slope')) {
      return "On steep slopes, design crop contour ridges perpendicular to the slope direction. Plant dense Napier or Vetiver grass along terrace edges. This slows rain speed and holds nutrient-rich topsoil.";
    }

    if (q.includes('compost') || q.includes('खाद') || q.includes('ठंड')) {
      return "In cold mountain climates, organic breakdown slows down. Insulate compost pits with high-nitrogen leaves, cow dung, and wrap the pit top with black plastic tarp to trap geothermal heat. Digging shallow rather than deep pits also helps catch solar radiation.";
    }

    if (q.includes('ginger') || q.includes('अदरक')) {
      return `Currently, the Almora and Haldwani Mandis show standard Ginger trading at ₹90 to ₹110 per Kg. Since your farm soil is ${t(farmProfile.soilType).toLowerCase()}, make sure beds are raised by 15cm to avoid rhizome rot during rain spells.`;
    }

    // Default response
    return `Thank you for asking. Regarding your farm in ${farmProfile.location} (altitude ${farmProfile.elevation}m, soil: ${t(farmProfile.soilType)}), CropSathi recommends keeping moisture levels controlled. Let me know if you would like me to draft a step-by-step planting schedule for your main crop: ${farmProfile.primaryCrops[0] || 'Apples'}.`;
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI typing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const botMessage: Message = {
      id: Math.random().toString(),
      sender: 'bot',
      text: getAIResponse(textToSend),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate sending the spoken text
      handleSend(language === 'pah' ? "स्याउ मा रोग क इलाज बताओ" : "Best apple varieties for my elevation");
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[800px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-3xl overflow-hidden fade-in">
      
      {/* Chat Header */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center text-sm">
              CropSathi AI Advisor
              <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-3xs font-extrabold uppercase">
                Active
              </span>
            </h3>
            <p className="text-2xs text-slate-400 font-semibold mt-0.5">
              Assisting in English, हिन्दी, & पहाड़ी dialects
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-2xs font-extrabold text-slate-400 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          <Mountain className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <span>Profile: {farmProfile.elevation}m</span>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}
            >
              <div className={`p-2 rounded-xl border flex-shrink-0 ${
                isBot 
                  ? 'bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                  : 'bg-slate-100 border-slate-200/50 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}>
                {isBot ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm font-semibold leading-relaxed border ${
                  isBot 
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200/40 dark:border-slate-800/80' 
                    : 'bg-emerald-600 text-white border-emerald-600'
                }`}>
                  <p>{msg.text}</p>
                </div>
                <span className="text-3xs text-slate-400 font-semibold px-2 block">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Section */}
      <div className="px-6 py-3 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/20">
        <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
          {t('suggestedQuestions')}
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => {
            const questionText = language === 'pah' ? q.pah : language === 'hi' ? q.hi : q.en;
            return (
              <button
                key={idx}
                onClick={() => handleSend(questionText)}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
              >
                {questionText}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-3">
          
          {/* Audio voice simulation button */}
          <button
            onClick={toggleVoiceRecording}
            className={`p-3 rounded-2xl border transition-all ${
              isRecording 
                ? 'bg-red-500 border-red-500 text-white animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border-transparent'
            }`}
            title={isRecording ? "Stop Recording" : "Ask by speaking"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <div className="flex-1 relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-transparent focus-within:border-emerald-500 transition-all px-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
              placeholder={isRecording ? "Listening to your voice..." : t('askPlaceholder')}
              className="flex-1 py-3 bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400 font-semibold"
              disabled={isRecording}
            />
            
            {/* Quick helper tip */}
            <span className="hidden md:flex items-center text-3xs text-slate-400 font-extrabold uppercase ml-2 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
              Enter <CornerDownLeft className="w-2.5 h-2.5 ml-0.5" />
            </span>
          </div>

          {/* Send Trigger */}
          <button
            onClick={() => handleSend(inputText)}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all"
            disabled={!inputText.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isRecording && (
          <div className="mt-2 text-2xs text-red-500 font-bold text-center animate-pulse flex items-center justify-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Speak now: "How do I care for my Apple orchard?"</span>
          </div>
        )}
      </div>

    </div>
  );
};
