
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';
import { CONTACT_INFO } from '../constants';

// Fix: Use the AIStudio type for window.aistudio to match global declarations and resolve property mismatch error.
declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'chatting' | 'qualifying' | 'finalized' | 'error'>('chatting');
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
  }, [messages, isLoading, status]);

  // Fix: Check for API key selection when the assistant is opened to guide the user if needed.
  useEffect(() => {
    if (isOpen) {
      const checkKey = async () => {
        if (window.aistudio?.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
            setStatus('error');
          }
        }
      };
      checkKey();
    }
  }, [isOpen]);

  // Fix: handleOpenKeySelector now assumes success after triggering the dialog to avoid race conditions.
  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // Fix: Assume the key selection was successful after triggering openSelectKey() and proceed to the app.
        setStatus('chatting');
        setMessages(prev => [...prev, { role: 'assistant', content: 'Conexão restabelecida! Como podemos prosseguir com seu caso?' }]);
      } catch (e) {
        console.error("Erro ao abrir seletor de chave:", e);
        setStatus('error');
      }
    }
  };

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-accent font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <p key={i} className={line.trim() === '' ? 'h-3' : 'mb-2 last:mb-0'}>{formattedLine}</p>;
    });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
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
        const cleanResponse = responseText.split('[TRIAGEM_SCORE:')[0].trim();
        setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse || "Análise concluída." }]);
        setStatus('finalized');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error: any) {
      // Fix: Reset status to error if key is missing or invalid so the user can select a new one.
      if (error.message === "KEY_MISSING" || error.message === "KEY_INVALID") {
        setStatus('error');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, tive uma oscilação técnica. Pode repetir?" }]);
      }
    } finally {
      setIsLoading(false);
    }
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
          <div className="bg-secondary p-5 flex justify-between items-center text-white border-b border-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30">
                <i className={`fa-solid ${status === 'error' ? 'fa-key text-accent' : 'fa-robot text-accent'}`}></i>
              </div>
              <div>
                <p className="font-bold text-[9px] uppercase tracking-[0.2em] text-accent">Assistente IA</p>
                <p className="text-white text-[11px] font-serif italic">F. Lopes Advocacia</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white p-2"><i className="fa-solid fa-xmark text-lg"></i></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            <>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] ${m.role === 'user' ? 'bg-accent text-primary font-bold' : 'bg-secondary/60 text-white/90 border border-white/5'}`}>
                    {m.role === 'assistant' ? renderFormattedText(m.content) : m.content}
                  </div>
                </div>
              ))}
              
              {status === 'error' && (
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-4">
                  <p className="text-white text-xs">Para utilizar nosso assistente jurídico via IA, é necessário selecionar uma chave de API válida vinculada a um projeto com faturamento.</p>
                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full bg-white text-primary font-bold py-3 rounded-lg text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-colors"
                  >
                    Selecionar Chave (Google AI Studio)
                  </button>
                  <p className="text-[9px] text-white/40">Consulte <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-accent">documentação de faturamento</a> se necessário.</p>
                  <a href={`https://wa.me/55${CONTACT_INFO.phone}`} className="block text-accent font-bold text-xs underline">Falar com Humano no WhatsApp</a>
                </div>
              )}

              {status === 'finalized' && (
                <div className="p-6 rounded-3xl border bg-accent/5 border-accent/30">
                  <h5 className="font-serif text-white text-base mb-4 text-center">Triagem Concluída</h5>
                  <button 
                    onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=Olá! Acabei de realizar a triagem no site e gostaria de atendimento.`, '_blank')}
                    className="w-full gold-bg-gradient text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    Falar com Dr. Felipe
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/50 p-4 rounded-2xl flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </>
          </div>

          {status !== 'finalized' && status !== 'error' && (
            <div className="p-6 bg-secondary/90 border-t border-accent/10 flex gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua resposta..."
                className="flex-1 text-[13px] bg-primary/50 text-white outline-none border border-white/10 rounded-2xl px-5 py-4 focus:border-accent/50"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-accent text-primary w-14 h-14 rounded-2xl flex items-center justify-center disabled:opacity-30"
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
