
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';
import { CONTACT_INFO } from '../constants';

// The AIStudio interface and Window declaration are removed as they are already 
// provided by the environment, avoiding "Subsequent property declarations" errors.

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
    const handleOpenTriage = () => {
      setIsOpen(true);
      setTimeout(() => {
        const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
        inputEl?.focus();
      }, 500);
    };

    window.addEventListener('open-triage', handleOpenTriage);
    return () => window.removeEventListener('open-triage', handleOpenTriage);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, status]);

  const handleOpenKeySelector = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Use type casting to safely access aistudio which is provided by the host environment
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
      try {
        await aistudio.openSelectKey();
        setStatus('chatting');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Conexão estabelecida com sucesso! Como posso ajudar você hoje?' 
        }]);
      } catch (e) {
        console.error("Falha ao abrir seletor:", e);
      }
    }
  };

  const handleRetry = () => {
    setStatus('chatting');
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'Tentando restabelecer conexão... Pode enviar sua mensagem novamente.' 
    }]);
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

      const responseText = await getGeminiResponse(history);
      const scoreMatch = responseText.match(/\[TRIAGEM_SCORE:\s*(\w+)\]/);
      
      if (scoreMatch) {
        const cleanResponse = responseText.split('[TRIAGEM_SCORE:')[0].trim();
        setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse || "Sua triagem foi concluída com sucesso." }]);
        setStatus('finalized');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error: any) {
      console.error("Erro no processamento:", error);
      if (error.message === "KEY_MISSING" || error.message === "KEY_INVALID") {
        setStatus('error');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Houve uma instabilidade na conexão. Por favor, tente enviar novamente." }]);
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
          title="Abrir Chat de Triagem"
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
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center border border-accent/30 shadow-inner">
                <i className={`fa-solid ${status === 'error' ? 'fa-triangle-exclamation text-red-400' : 'fa-robot text-accent'}`}></i>
              </div>
              <div>
                <p className="font-bold text-[9px] uppercase tracking-[0.2em] text-accent">Assistente de Triagem</p>
                <p className="text-white text-[11px] font-serif italic">F. Lopes Advocacia</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white p-2 transition-colors rounded-lg hover:bg-white/5">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-accent text-primary font-bold border border-accent/10' : 'bg-secondary/60 text-white/90 border border-white/5'}`}>
                  {m.role === 'assistant' ? renderFormattedText(m.content) : m.content}
                </div>
              </div>
            ))}
            
            {status === 'error' && (
              <div className="p-8 bg-accent/5 border border-accent/20 rounded-2xl text-center space-y-5 animate-in fade-in duration-500">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-accent/30">
                  <i className="fa-solid fa-shield-halved text-accent text-2xl"></i>
                </div>
                <div>
                  <h4 className="text-white font-serif text-lg mb-2">Conexão Pendente</h4>
                  <p className="text-white/40 text-[11px] leading-relaxed">
                    Ainda não conseguimos detectar sua chave de acesso. Se você acabou de configurá-la, tente o botão abaixo ou atualize a página.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleRetry}
                    className="w-full bg-white/5 text-white font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                  >
                    <i className="fa-solid fa-rotate-right mr-2"></i> Tentar Novamente
                  </button>

                  {(window as any).aistudio && (
                    <button 
                      onClick={handleOpenKeySelector}
                      className="w-full gold-bg-gradient text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-accent/20"
                    >
                      <i className="fa-solid fa-key mr-2"></i> Selecionar Chave
                    </button>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <a 
                    href={`https://wa.me/55${CONTACT_INFO.phone}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-accent font-bold text-xs hover:underline"
                  >
                    <i className="fa-brands fa-whatsapp"></i> Falar Direto no WhatsApp
                  </a>
                </div>
              </div>
            )}

            {status === 'finalized' && (
              <div className="p-8 rounded-3xl border bg-accent/5 border-accent/30 text-center space-y-6 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                   <i className="fa-solid fa-circle-check text-accent text-4xl"></i>
                </div>
                <div>
                  <h5 className="font-serif text-white text-xl mb-2">Triagem Concluída</h5>
                  <p className="text-white/50 text-[11px] leading-relaxed">A análise inicial está pronta. Clique abaixo para enviar as informações ao Dr. Felipe.</p>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=Olá! Acabei de realizar a triagem no site e gostaria de atendimento.`, '_blank')}
                  className="w-full gold-bg-gradient text-primary font-bold py-5 rounded-xl text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
                >
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                  Iniciar Atendimento Humano
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary/50 p-4 rounded-2xl flex gap-1.5 border border-white/5">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-150"></div>
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-300"></div>
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
                placeholder="Descreva seu caso aqui..."
                className="flex-1 text-[13px] bg-primary/50 text-white outline-none border border-white/10 rounded-2xl px-5 py-4 focus:border-accent/50 transition-all placeholder:text-white/20 shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-accent text-primary w-14 h-14 rounded-2xl flex items-center justify-center disabled:opacity-20 hover:brightness-110 active:scale-90 transition-all shadow-lg"
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
