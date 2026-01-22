
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import MediaSection from './components/MediaSection';
import ContactForm from './components/ContactForm';
import GeminiAssistant from './components/GeminiAssistant';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import { CONTACT_INFO } from './constants';

type AppView = 'home' | 'privacy' | 'terms';

function App() {
  const [view, setView] = useState<AppView>('home');

  const startTriage = () => {
    window.dispatchEvent(new CustomEvent('open-triage'));
  };

  const renderContent = () => {
    switch (view) {
      case 'privacy':
        return <PrivacyPolicy onBack={() => setView('home')} />;
      case 'terms':
        return <TermsOfUse onBack={() => setView('home')} />;
      default:
        return (
          <>
            <Hero />
            
            {/* Seção de Captação IA (Diagnóstico Inteligente) */}
            <section className="bg-primary py-12">
              <div className="container mx-auto px-6">
                 <div className="bg-gradient-to-br from-secondary to-primary border border-accent/20 p-8 md:p-12 rounded-[2rem] flex flex-col lg:flex-row items-center justify-between gap-12 shadow-3xl">
                    <div className="max-w-2xl space-y-6">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>
                          <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Tecnologia Jurídica Alagoana</span>
                       </div>
                       <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                         Inicie seu <span className="gold-gradient italic">Diagnóstico Jurídico</span> via Inteligência Artificial agora.
                       </h2>
                       <p className="text-white/50 text-base md:text-lg font-light leading-relaxed">
                         Nossa IA especializada realiza uma triagem técnica do seu caso em 2 minutos, agilizando seu atendimento com o Dr. Felipe Lopes.
                       </p>
                    </div>
                    <button 
                      onClick={startTriage}
                      className="whitespace-nowrap bg-accent text-primary px-10 py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                    >
                      <i className="fa-solid fa-robot text-lg"></i>
                      Começar Avaliação Grátis
                    </button>
                 </div>
              </div>
            </section>

            {/* Imprensa/Presença Local Bar */}
            <div className="bg-secondary/80 backdrop-blur-md py-20 border-y border-white/5">
              <div className="container mx-auto px-6 text-center">
                <h4 className="text-accent/40 text-[9px] uppercase tracking-[0.5em] font-bold mb-12">Destaque na Imprensa e Prestação de Serviço</h4>
                <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-30 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0">
                  <span className="text-white font-serif text-3xl font-bold italic tracking-tighter">CBN Maceió</span>
                  <span className="text-white font-serif text-3xl font-bold tracking-tight underline decoration-accent/20">NovaBrasil FM</span>
                  <span className="text-white font-serif text-3xl font-bold uppercase tracking-[0.1em]">Painel Alagoas</span>
                </div>
                <p className="mt-12 text-white/20 text-[10px] italic font-light tracking-widest">Presença constante nos principais veículos de comunicação de Alagoas.</p>
              </div>
            </div>

            <About />
            <Services />
            
            {/* Tribunais Superiores Highlight */}
            <section className="py-32 bg-secondary relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent"></div>
              </div>
              <div className="container mx-auto px-6 text-center max-w-4xl relative z-10">
                <h3 className="text-3xl md:text-6xl font-serif font-bold mb-10 leading-tight">Presença em <span className="gold-gradient italic">Tribunais Superiores</span></h3>
                <p className="text-xl text-white/50 mb-16 font-light leading-relaxed">
                  Atuação técnica e estratégica no STJ, STF e TST para garantir que seus direitos sejam defendidos com excelência técnica em todas as instâncias do país.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16">
                  {[
                    { acronym: 'STJ', label: 'Superior Tribunal de Justiça' },
                    { acronym: 'STF', label: 'Supremo Tribunal Federal' },
                    { acronym: 'TST', label: 'Tribunal Superior do Trabalho' }
                  ].map((court, i) => (
                    <div key={i} className="group">
                      <p className="text-6xl font-serif font-black text-white/10 group-hover:text-accent/40 transition-all duration-500 mb-4">{court.acronym}</p>
                      <div className="w-8 h-0.5 bg-accent/20 mx-auto group-hover:w-16 transition-all duration-500 mb-4"></div>
                      <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 group-hover:text-white transition-colors">{court.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seção de Vídeos "Na Mídia" */}
            <MediaSection />

            <ContactForm />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen font-sans bg-primary selection:bg-accent selection:text-primary overflow-x-hidden">
      <Header onGoHome={() => setView('home')} />
      <main>
        {renderContent()}
      </main>
      
      <Footer onNavigate={setView} />
      
      {/* AI Assistant - Elegante e Evoluído */}
      <GeminiAssistant />
      
      {/* Botão flutuante de WhatsApp Nobre */}
      <a 
        href={`https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 left-8 z-[100] gold-bg-gradient text-primary w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border border-accent/20"
      >
        <i className="fa-brands fa-whatsapp text-3xl"></i>
      </a>
    </div>
  );
}

export default App;
