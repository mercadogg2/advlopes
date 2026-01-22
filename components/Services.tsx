
import React from 'react';
import { SERVICES, CONTACT_INFO } from '../constants';

const Services: React.FC = () => {
  const whatsappUrl = `https://wa.me/55${CONTACT_INFO.phone.replace(/\D/g, '')}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20assessoria%20jurídica%20da%20F.%20Lopes.`;
  const consultoriaImage = "https://i.postimg.cc/NjYmsG6k/Whats-App-Image-2026-01-15-at-12-33-30.jpg";

  return (
    <section id="servicos" className="py-32 bg-primary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <p className="text-accent font-bold text-[10px] uppercase tracking-[0.5em] mb-4">Expertise Jurídica</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Soluções Sob Medida</h2>
          <p className="text-white/50 text-lg font-light">Atuamos de forma multidisciplinar para garantir a proteção dos seus interesses em diversas frentes do direito contemporâneo.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <div key={service.id} className="group relative bg-secondary p-8 rounded-xl border border-white/5 hover:border-accent/40 transition-all duration-500 hover:-translate-y-2">
              <div className="w-14 h-14 bg-accent/5 rounded-lg flex items-center justify-center text-accent text-2xl mb-8 group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <h4 className="text-xl font-bold text-white mb-4 tracking-tight uppercase group-hover:text-accent transition-colors">{service.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed mb-8 font-light">
                {service.description}
              </p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] text-white/20 uppercase tracking-[0.3em]">Área de Atuação</span>
                <i className="fa-solid fa-arrow-right-long text-accent/30 group-hover:text-accent transition-all group-hover:translate-x-2"></i>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-32 flex flex-col md:flex-row items-center gap-12 bg-secondary/50 p-12 rounded-2xl border border-white/5 overflow-hidden">
          <div className="flex-1 space-y-6">
             <h3 className="text-3xl font-serif text-white">Consultoria Full Service</h3>
             <p className="text-white/60 leading-relaxed font-light">Oferecemos um ecossistema jurídico completo, desde a gestão de condomínios até causas trabalhistas complexas, sempre com o mesmo padrão de excelência.</p>
             <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-3 text-accent text-xs font-bold uppercase tracking-widest border-b-2 border-accent/20 hover:border-accent pb-2 transition-all group"
             >
              Saber mais sobre nossa assessoria
              <i className="fa-brands fa-whatsapp text-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0"></i>
             </a>
          </div>
          <div className="flex-1 w-full group relative min-h-[400px]">
            <div className="absolute inset-0 bg-accent/5 group-hover:bg-transparent transition-colors duration-500 z-10 rounded-xl"></div>
            <img 
              src={consultoriaImage} 
              className="rounded-xl w-full h-[400px] object-cover object-top shadow-2xl transition-all duration-700 group-hover:scale-[1.02]" 
              alt="Consultoria Especializada F. Lopes"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
