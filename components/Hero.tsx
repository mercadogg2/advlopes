
import React from 'react';
import { CONTACT_INFO } from '../constants';

const Hero: React.FC = () => {
  const whatsappUrl = `https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=Olá!%20Gostaria%20de%20agendar%20uma%20reunião%20com%20o%20Dr.%20Felipe%20Lopes.`;
  const heroImage = "https://i.postimg.cc/RCspskLD/Whats-App-Image-2026-01-15-at-12-33-30.jpg";

  return (
    <section id="inicio" className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-primary">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover" 
          alt="Escritório"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 border border-accent/30 rounded-full bg-accent/5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em]">Excelência Jurídica em Alagoas</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-[1.1]">
              Advocacia <span className="gold-gradient italic">Estratégica</span> para Desafios Complexos.
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              Mais de 10 anos de atuação especializada em Maceió, com presença marcante nos Tribunais Superiores e foco absoluto em resultados.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-bg-gradient text-primary px-10 py-5 rounded font-bold text-xs uppercase tracking-[0.2em] text-center hover:shadow-2xl hover:shadow-accent/40 transition-all"
            >
              Agendar Reunião
            </a>
            <div className="flex items-center gap-4 text-white/40 border-l border-white/10 pl-6">
              <i className="fa-solid fa-scale-balanced text-2xl text-accent/50"></i>
              <span className="text-[10px] uppercase tracking-widest leading-tight">Compromisso com o<br/><span className="text-white font-bold">Sigilo e a Ética</span></span>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative">
          <div className="absolute -inset-10 bg-accent/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="relative border-2 border-accent/20 p-2 rounded-2xl">
            <img 
              src={heroImage} 
              className="rounded-xl w-full h-[600px] object-cover object-top transition-all duration-1000 shadow-2xl" 
              alt="Dr. Felipe Lopes"
            />
            <div className="absolute bottom-10 -left-10 bg-secondary border border-accent/30 p-6 rounded-lg shadow-2xl max-w-xs">
              <p className="text-accent font-serif text-2xl mb-1">STJ & STF</p>
              <p className="text-white/50 text-[10px] uppercase tracking-widest">Atuação em instâncias superiores para garantir seus direitos em última instância.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-accent/30 animate-bounce cursor-pointer">
        <a href="#sobre" aria-label="Rolar para baixo">
          <i className="fa-solid fa-mouse text-xl"></i>
        </a>
      </div>
    </section>
  );
};

export default Hero;
