
import React, { useState, useEffect } from 'react';
import { CONTACT_INFO } from '../constants';

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Início', href: '#inicio', id: 'inicio' },
    { name: 'O Advogado', href: '#sobre', id: 'sobre' },
    { name: 'Atuação', href: '#servicos', id: 'servicos' },
    { name: 'Contatos', href: '#contato', id: 'contato' },
  ];

  const logoUrl = "https://i.postimg.cc/DZ8n1sT4/logo-lopes-removebg-preview.png";
  const whatsappUrl = `https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=Olá!%20Gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Felipe%20Lopes.`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    navLinks.forEach(link => {
      const section = document.getElementById(link.id);
      if (section) observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onGoHome(); // Reset view to home first
    
    // Use timeout to ensure DOM is updated if coming from another view
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 10);
    
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-primary/95 backdrop-blur-lg py-4 shadow-2xl border-b border-accent/20' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => { onGoHome(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex flex-col group cursor-pointer text-left"
        >
          <img 
            src={logoUrl} 
            alt="F. Lopes Advocacia" 
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[9px] text-accent uppercase tracking-[0.4em] font-medium mt-1">{CONTACT_INFO.oab}</span>
        </button>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em]">
          {navLinks.map((link) => (
            <a 
              key={link.id}
              href={link.href} 
              onClick={(e) => scrollToSection(e, link.id)}
              className={`nav-link transition-all duration-300 ${activeSection === link.id ? 'active' : 'text-white/60 hover:text-white'}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button & Toggle */}
        <div className="flex items-center gap-4">
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-block gold-bg-gradient text-primary font-bold px-8 py-2.5 rounded shadow-lg shadow-accent/20 transition-all transform hover:scale-105 active:scale-95 text-[10px] uppercase tracking-[0.2em]"
          >
            Agendar Consulta
          </a>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:text-accent transition-colors focus:outline-none"
            aria-label="Abrir Menu"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-primary z-[110] transition-all duration-500 flex flex-col items-center justify-center gap-8 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible translate-y-full'}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-8 right-8 text-white/50 hover:text-white"
        >
          <i className="fa-solid fa-xmark text-3xl"></i>
        </button>

        {navLinks.map((link) => (
          <a 
            key={link.id}
            href={link.href} 
            onClick={(e) => scrollToSection(e, link.id)}
            className={`text-2xl font-serif tracking-widest transition-all ${activeSection === link.id ? 'text-accent' : 'text-white/60 hover:text-white'}`}
          >
            {link.name}
          </a>
        ))}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 gold-bg-gradient text-primary font-bold px-12 py-4 rounded text-xs uppercase tracking-[0.3em] shadow-xl"
        >
          Solicitar Atendimento
        </a>
      </div>
    </header>
  );
};

export default Header;
