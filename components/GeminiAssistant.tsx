
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';
import { CONTACT_INFO } from '../constants';

const GeminiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'chatting' | 'finalized' | 'error'>('chatting');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou a assistente do Dr. Felipe Lopes. Para iniciarmos sua triagem jurídica, como posso te chamar?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'missing' | 'invalid' | 'generic'>('generic');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Função para checar a chave de forma dinâmica
  const checkKeyAvailability = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.length < 10) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!checkKeyAvailability()) {
      setStatus('error');
      setErrorType('missing');
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, status]);

  const handleOpenKeySelector = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
      try {
        await aistudio.openSelectKey();
        // Após abrir o seletor, damos ao usuário a chance de tentar novamente
        setStatus('chatting');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Conexão manual estabelecida. Pode enviar sua mensagem agora!' 
        }]);
      } catch (e) {
        console.error("Erro ao selecionar chave", e);
      }
    }
  };

  const handleManualRetry = () => {
    if (checkKeyAvailability()) {
      setStatus('chatting');
      setErrorType('generic');
    } else {
      // Se ainda não detectou, apenas "pisca" o estado para mostrar que tentou
      setStatus('error');
      const btn = document.getElementById('retry-btn');
      btn?.classList.add('animate-shake');
      setTimeout(() => btn?.classList.remove('animate-shake'), 500);
    }
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
      
      if (responseText.includes('[TRIAGEM_SCORE:')) {
        const cleanText = responseText.split('[TRIAGEM_SCORE:')[0].trim();
        setMessages(prev => [...prev, { role: 'assistant', content: cleanText }]);
        setStatus('finalized');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error: any) {
      if (error.message === "KEY_NOT_CONFIGURED") {
        setStatus('error');
        setErrorType('missing');
      } else if (error.message === "KEY_INVALID") {
        setStatus('error');
        setErrorType('invalid');
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Houve um erro de conexão. Tente novamente ou conecte manualmente abaixo." }]);
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
          className="bg-primary text-accent w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border border-accent/20 relative"
        >
          <i className="fa-solid fa-comments text-2xl"></i>
          {status === 'error' && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-primary"></span>
            </span>
          )}
        </button>
      ) : (
        <div className="bg-primary w-[350px] sm:w-[400px] h-[600px] rounded-3xl shadow-3xl flex flex-col border border-accent/20 overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-secondary p-5 flex justify-between items-center border-b border-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <i className={`fa-solid ${status === 'error' ? 'fa-shield-halved text-red-400' : 'fa-robot text-accent'}`}></i>
              </div>
              <div>
                <span className="text-white font-serif text-sm block leading-none">Assistente Virtual</span>
                <span className="text-[9px] text-accent uppercase tracking-widest">Triagem Técnica</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/30 hover:text-white p-2">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          {/* Chat Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-accent text-primary font-bold' : 'bg-secondary text-white/80 border border-white/5'}`}>
                  {m.content}
                </div>
              </div>
            ))}

            {status === 'error' && (
              <div className="bg-secondary/80 border border-accent/30 rounded-2xl p-6 text-center space-y-5 animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                   <i className="fa-solid fa-key"></i>
                </div>
                <div className="space-y-2">
                  <h4 className="text-white text-sm font-bold uppercase tracking-wider">Chave não Detectada</h4>
                  <p className="text-white/40 text-[11px] leading-relaxed">
                    O servidor do site ainda não carregou sua configuração de API. Isso é comum em novos deploys.
                  </p>
                  <p className="text-accent text-[11px] font-bold">
                    Resolva isso agora clicando no botão dourado abaixo e selecionando sua chave.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full gold-bg-gradient text-primary font-bold py-4 rounded-xl text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-accent/10"
                  >
                    Conectar Chave Manualmente
                  </button>
                  
                  <button 
                    id="retry-btn"
                    onClick={handleManualRetry}
                    className="w-full bg-white/5 text-white/40 font-bold py-3 rounded-xl text-[9px] uppercase tracking-[0.2em] border border-white/5 hover:bg-white/10 transition-all"
                  >
                    Tentar Re-validar Automático
                  </button>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <a 
                    href={`https://wa.me/55${CONTACT_INFO.phone}`} 
                    target="_blank" 
                    className="flex items-center justify-center gap-2 text-white/30 text-[9px] font-bold uppercase hover:text-accent transition-colors"
                  >
                    <i className="fa-brands fa-whatsapp"></i> Chamar no WhatsApp Direto
                  </a>
                </div>
              </div>
            )}

            {status === 'finalized' && (
              <div className="bg-accent/5 border border-accent/30 rounded-2xl p-8 text-center space-y-6 animate-in zoom-in-95">
                <i className="fa-solid fa-circle-check text-accent text-4xl"></i>
                <div className="space-y-2">
                  <h5 className="text-white font-serif text-lg">Triagem Realizada</h5>
                  <p className="text-white/50 text-xs">Seus dados foram enviados. O Dr. Felipe entrará em contato em breve.</p>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/55${CONTACT_INFO.phone}`, '_blank')}
                  className="w-full gold-bg-gradient text-primary font-bold py-5 rounded-xl text-[10px] uppercase tracking-widest shadow-2xl"
                >
                  Confirmar no WhatsApp
                </button>
              </div>
            )}

            {isLoading && (
              <div className="flex gap-1.5 p-3 bg-secondary/30 w-fit rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-150"></div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {status === 'chatting' && (
            <div className="p-4 bg-secondary border-t border-accent/10 flex gap-3">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Como posso ajudar hoje?"
                className="flex-1 bg-primary/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-accent/50 transition-all placeholder:text-white/20"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-accent text-primary w-14 h-14 rounded-2xl flex items-center justify-center disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-lg"
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
