import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';
import { CONTACT_INFO } from '../constants';

// Proper interface definition for AI Studio environment
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    // Fix: Making aistudio optional and using any to avoid modifier and type conflicts with existing global declarations
    aistudio?: any;
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

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, status]);

  // Monitor key status when chat is opened
  useEffect(() => {
    if (isOpen) {
      const checkKey = async () => {
        if (window.aistudio?.hasSelectedApiKey) {
          try {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey) {
              setStatus('error');
            }
          } catch (e) {
            console.error("Erro ao verificar chave:", e);
          }
        }
      };
      checkKey();
    }
  }, [isOpen]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        console.log("Tentando abrir seletor de chave...");
        await window.aistudio.openSelectKey();
        
        // Assume success and try to resume chatting to avoid race conditions
        setStatus('chatting');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Conexão configurada! Já podemos prosseguir com sua análise. Como posso ajudar?' 
        }]);
      } catch (e) {
        console.error("Erro ao abrir seletor de chave:", e);
        alert("Ocorreu um erro ao abrir o seletor. Verifique se o bloqueador de pop-ups está ativo.");
      }
    } else {
      alert("Seletor de chave não disponível neste navegador. Por favor, certifique-se de que as variáveis de ambiente foram configuradas corretamente no painel administrativo.");
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
      
      // Look for a score in the response to finalize
      const scoreMatch = responseText.match(/\[TRIAGEM_SCORE:\s*(\w+)\]/);
      
      if (scoreMatch) {
        const cleanResponse = responseText.split('[TRIAGEM_SCORE:')[0].trim();
        setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse || "Análise concluída com sucesso." }]);
        setStatus('finalized');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error: any) {
      console.error("Erro no chat:", error);
      if (error.message === "KEY_MISSING" || error.message === "KEY_INVALID") {
        setStatus('error');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Desculpe, tive uma breve interrupção. Poderia enviar novamente?" }]);
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
          aria-label="Abrir Assistente"
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
                <i className={`fa-solid ${status === 'error' ? 'fa-triangle-exclamation text-accent' : 'fa-robot text-accent'}`}></i>
              </div>
              <div>
                <p className="font-bold text-[9px] uppercase tracking-[0.2em] text-accent">Inteligência Artificial</p>
                <p className="text-white text-[11px] font-serif italic">Triagem Especializada</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white p-2 transition-colors">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed ${m.role === 'user' ? 'bg-accent text-primary font-bold shadow-lg' : 'bg-secondary/60 text-white/90 border border-white/5'}`}>
                  {m.role === 'assistant' ? renderFormattedText(m.content) : m.content}
                </div>
              </div>
            ))}
            
            {status === 'error' && (
              <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <i className="fa-solid fa-shield-halved text-accent text-2xl mb-2"></i>
                <p className="text-white text-xs font-light">Para realizar sua triagem automática, é necessário estabelecer uma conexão segura com o serviço de Inteligência Artificial.</p>
                
                <button 
                  onClick={handleOpenKeySelector}
                  className="w-full gold-bg-gradient text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-accent/10 cursor-pointer"
                >
                  <i className="fa-solid fa-key mr-2"></i>
                  Configurar Conexão Agora
                </button>

                <div className="pt-2">
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-3">Ou fale com um advogado</p>
                  <a 
                    href={`https://wa.me/55${CONTACT_INFO.phone}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-accent font-bold text-xs hover:underline decoration-accent/30"
                  >
                    Atendimento via WhatsApp <i className="fa-solid fa-arrow-right-long ml-1"></i>
                  </a>
                </div>
              </div>
            )}

            {status === 'finalized' && (
              <div className="p-8 rounded-3xl border bg-accent/5 border-accent/30 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                   <i className="fa-solid fa-check text-accent text-2xl"></i>
                </div>
                <div>
                  <h5 className="font-serif text-white text-lg mb-2">Análise Concluída</h5>
                  <p className="text-white/50 text-[11px] leading-relaxed">Sua triagem inicial está pronta. O Dr. Felipe precisa validar as informações para enviar seu parecer.</p>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=Olá! Acabei de realizar a triagem no site e gostaria de atendimento.`, '_blank')}
                  className="w-full gold-bg-gradient text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                >
                  <i className="fa-brands fa-whatsapp text-lg"></i>
                  Falar com o Advogado
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 p-4 rounded-2xl flex gap-1.5 border border-white/5">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {status !== 'finalized' && status !== 'error' && (
            <div className="p-6 bg-secondary/90 border-t border-accent/10 flex gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escreva sua mensagem..."
                className="flex-1 text-[13px] bg-primary/50 text-white outline-none border border-white/10 rounded-2xl px-5 py-4 focus:border-accent/50 transition-colors placeholder:text-white/20"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-accent text-primary w-14 h-14 rounded-2xl flex items-center justify-center disabled:opacity-20 hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiAssistant;