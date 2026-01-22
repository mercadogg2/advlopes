
import React from 'react';
import { CONTACT_INFO } from '../constants';

interface FooterProps {
  onNavigate: (view: 'home' | 'privacy' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const logoUrl = "https://i.postimg.cc/DZ8n1sT4/logo-lopes-removebg-preview.png";

  const handleInternalNav = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    onNavigate('home');
    
    // Pequeno delay para garantir que o componente Home foi montado
    setTimeout(() => {
      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }, 50);
  };

  return (
    <footer className="bg-primary pt-24 pb-12 border-t border-accent/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
          <div className="max-w-sm">
            <button 
              onClick={(e) => handleInternalNav(e, 'top')}
              className="mb-4 block transition-transform hover:scale-105 active:scale-95"
            >
              <img 
                src={logoUrl} 
                alt="F. Lopes Advocacia" 
                className="h-16 w-auto object-contain"
              />
            </button>
            <p className="text-accent text-[10px] uppercase tracking-[0.4em] font-bold mb-6">{CONTACT_INFO.oab}</p>
            <p className="text-white/30 text-xs leading-relaxed font-light mb-6">
              Escritório dedicado à advocacia de excelência, com foco em resultados práticos e segurança jurídica permanente para nossos clientes.
            </p>
            <div className="flex items-center gap-3 text-white/60 hover:text-accent transition-colors group">
              <i className="fa-solid fa-phone text-xs group-hover:animate-shake"></i>
              <a href={`tel:${CONTACT_INFO.phone}`} className="text-xs font-bold tracking-[0.2em]">{CONTACT_INFO.phone}</a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-6">Navegação</h4>
              <ul className="space-y-4 text-white/40 text-[10px] uppercase tracking-widest">
                <li>
                  <button onClick={(e) => handleInternalNav(e, 'top')} className="hover:text-accent transition-colors">Início</button>
                </li>
                <li>
                  <button onClick={(e) => handleInternalNav(e, 'sobre')} className="hover:text-accent transition-colors">O Advogado</button>
                </li>
                <li>
                  <button onClick={(e) => handleInternalNav(e, 'servicos')} className="hover:text-accent transition-colors">Atuação</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-6">Jurídico</h4>
              <ul className="space-y-4 text-white/40 text-[10px] uppercase tracking-widest text-left">
                <li><button onClick={() => onNavigate('privacy')} className="hover:text-accent transition-colors">Privacidade</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-accent transition-colors">Termos de Uso</button></li>
                <li>
                  <button onClick={(e) => handleInternalNav(e, 'contato')} className="hover:text-accent transition-colors">Contato</button>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-widest mb-6">Redes</h4>
              <ul className="space-y-4 text-white/40 text-[10px] uppercase tracking-widest">
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-accent transition-colors cursor-not-allowed opacity-50">LinkedIn</a>
                </li>
                <li>
                  <a href={`https://instagram.com/${CONTACT_INFO.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Instagram</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[9px] uppercase tracking-[0.3em] font-medium">
          <p>© {new Date().getFullYear()} F. LOPES SOCIEDADE INDIVIDUAL DE ADVOCACIA.</p>
          <div className="flex gap-8">
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-gavel text-[8px] text-accent/20"></i> Rigor Técnico
            </span>
            <span className="text-accent/30 font-serif lowercase italic tracking-normal">legalis pro design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
