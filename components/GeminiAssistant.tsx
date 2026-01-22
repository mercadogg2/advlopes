
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';
import { CONTACT_INFO } from '../constants';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'chatting' | 'qualifying' | 'finalized'>('chatting');
  const [leadScore, setLeadScore] = useState<'QUENTE' | 'MORNO' | 'FRIO' | null>(null);
  const [triageSummary, setTriageSummary] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou a assistente digital do Dr. Felipe Lopes. Para uma análise rápida da viabilidade do seu caso, como posso te chamar?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const handleOpenTriage = () => setIsOpen(true);
    window.addEventListener('open-triage', handleOpenTriage);
    return () => window.removeEventListener('open-triage', handleOpenTriage);
  }, []);

  // Função para formatar o texto (Negritos e Parágrafos)
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Processa negritos **texto**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-accent font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return (
        <p key={i} className={line.trim() === '' ? 'h-3' : 'mb-2 last:mb-0'}>
          {formattedLine}
        </p>
      );
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const history = [
      ...messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: userMsg }] }
    ];

    const responseText = await getGeminiResponse(history as any);
    
    const scoreMatch = responseText.match(/\[TRIAGEM_SCORE:\s*(\w+)\]/);
    
    if (scoreMatch) {
      const score = scoreMatch[1];
      const cleanResponse = responseText.split('[TRIAGEM_SCORE:')[0].trim();
      
      let summary = "";
      if (responseText.includes('[FICHA_TECNICA]')) {
        summary = responseText.split('[FICHA_TECNICA]')[1].trim();
      } else {
        summary = responseText.substring(responseText.indexOf(scoreMatch[0]) + scoreMatch[0].length).trim();
      }

      setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse || "Análise técnica concluída com sucesso." }]);
      setLeadScore(score as any);
      setTriageSummary(summary);
      setStatus('finalized');
    } else {
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      setStatus('chatting');
    }
    
    setIsLoading(false);
  };

  const handleFinalizeWhatsApp = () => {
    const fallbackSummary = triageSummary || messages.map(m => `${m.role === 'user' ? 'Cliente' : 'IA'}: ${m.content}`).join('\n');
    const text = `*NOVA TRIAGEM QUALIFICADA (SITE)*\n\n*Status:* ${leadScore === 'QUENTE' ? '🔥 QUENTE' : leadScore === 'MORNO' ? '⚡ MORNO' : '❄️ FRIO'}\n\n*Resumo:*\n${fallbackSummary}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[150]">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="relative bg-primary text-accent w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border border-accent/20 group"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center animate-bounce shadow-lg">
             <i className="fa-solid fa-bolt-lightning text-[10px] text-primary"></i>
          </div>
          <i className="fa-solid fa-scale-unbalanced-flip text-2xl group-hover:rotate-12 transition-transform"></i>
        </button>
      ) : (
        <div className="bg-primary w-[350px] sm:w-[420px] h-[600px] rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] flex flex-col border border-accent/20 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-secondary p-5 flex justify-between items-center text-white border-b border-accent/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30">
                  <i className={`fa-solid ${status === 'finalized' ? 'fa-certificate' : 'fa-robot'} text-accent`}></i>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-secondary"></span>
              </div>
              <div>
                <p className="font-bold text-[9px] uppercase tracking-[0.2em] text-accent">Assistente Inteligente</p>
                <p className="text-white text-[11px] font-serif italic">F. Lopes Advocacia</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors p-2">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-0.5 bg-white/5 w-full">
            <div className={`h-full bg-accent transition-all duration-1000 ease-out ${status === 'chatting' ? 'w-1/3' : status === 'qualifying' ? 'w-2/3' : 'w-full shadow-[0_0_10px_#C5A059]'}`}></div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(circle_at_top_right,_rgba(197,160,89,0.05),_transparent_50%)]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-accent text-primary font-bold rounded-tr-none shadow-lg' 
                  : 'bg-secondary/60 border border-white/5 text-white/90 rounded-tl-none backdrop-blur-sm'
                }`}>
                  {m.role === 'assistant' ? renderFormattedText(m.content) : m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 border border-white/5 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            {status === 'finalized' && (
              <div className="animate-in fade-in zoom-in-95 duration-700 delay-300">
                <div className={`p-6 rounded-3xl border ${leadScore === 'QUENTE' ? 'bg-accent/5 border-accent/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${leadScore === 'QUENTE' ? 'bg-accent text-primary' : 'bg-white/10 text-white'}`}>
                      <i className={`fa-solid ${leadScore === 'QUENTE' ? 'fa-fire-flame-curved' : 'fa-check'}`}></i>
                    </div>
                    <div>
                      <h5 className="font-serif text-white text-base">Relatório de Triagem</h5>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">
                        Status: <span className={leadScore === 'QUENTE' ? 'text-accent' : 'text-white/60'}>{leadScore}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {triageSummary.split('\n').filter(l => l.includes(':')).map((line, idx) => {
                      const [label, ...val] = line.split(':');
                      return (
                        <div key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-2">
                          <span className="text-[9px] uppercase tracking-tighter text-white/30 font-bold">{label.trim()}</span>
                          <span className="text-[12px] text-white/80">{val.join(':').trim()}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={handleFinalizeWhatsApp}
                    className="w-full gold-bg-gradient text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    Falar com Dr. Felipe
                  </button>
                  
                  <p className="mt-4 text-[9px] text-center text-white/20 uppercase tracking-[0.2em]">
                    Dados protegidos por sigilo profissional
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {status !== 'finalized' && (
            <div className="p-6 bg-secondary/90 border-t border-accent/10 flex gap-3 relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Responda aqui..."
                className="flex-1 text-[13px] bg-primary/50 text-white outline-none border border-white/10 rounded-2xl px-5 py-4 focus:border-accent/50 transition-all placeholder:text-white/20 shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-accent text-primary w-14 h-14 rounded-2xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all active:scale-90 disabled:opacity-30"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;
