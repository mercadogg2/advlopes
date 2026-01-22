
import React from 'react';
import { PRINCIPLES } from '../constants';

const About: React.FC = () => {
  const doctorImage = "https://i.postimg.cc/J4z1395b/Whats-App-Image-2026-01-15-at-14-09-31.jpg";

  return (
    <section id="sobre" className="py-32 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/4 h-full bg-accent/5 -skew-x-12 translate-x-1/2"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div>
              <p className="text-accent font-bold text-[10px] uppercase tracking-[0.4em] mb-4">Trajetória e Expertise</p>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Dr. Felipe Lopes de Amaral</h2>
              <div className="w-20 h-1 bg-accent/40 mb-10"></div>
              
              <div className="space-y-6 text-white/70 text-lg leading-relaxed font-light">
                <p>
                  Com uma trajetória de <strong className="text-white font-bold">10 anos</strong>, o Dr. Felipe Lopes consolidou-se como referência em <span className="text-accent">Direito do Trabalho e Previdenciário</span>, aliando rigor técnico à docência acadêmica.
                </p>
                <p>
                  Sua atuação "Business Oriented" oferece segurança jurídica para microempreendedores e grandes corporações, enquanto sua expertise em concursos públicos protege o futuro de servidores e aspirantes à carreira pública.
                </p>
                <p className="italic border-l-2 border-accent/20 pl-6 py-2">
                  "Advocacia não é apenas sobre leis, é sobre pessoas e os legados que elas constroem."
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              {[
                { title: 'Missão', text: PRINCIPLES.mission, icon: 'fa-bullseye' },
                { title: 'Visão', text: PRINCIPLES.vision, icon: 'fa-eye' },
                { title: 'Valores', text: PRINCIPLES.values, icon: 'fa-handshake' }
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <i className={`fa-solid ${item.icon} text-accent/40 group-hover:text-accent transition-colors mb-4 text-xl`}></i>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-white mb-3">{item.title}</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/5 rounded-3xl blur-2xl"></div>
            <div className="relative border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={doctorImage}
                className="w-full h-[600px] object-cover object-top opacity-90 hover:opacity-100 transition-opacity duration-700" 
                alt="Dr. Felipe Lopes de Amaral"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 hidden md:block">
              <div className="bg-primary border border-accent/20 p-10 rounded-full w-40 h-40 flex items-center justify-center text-center shadow-2xl">
                <p className="text-accent font-serif text-3xl font-bold leading-tight">10+<br/><span className="text-[8px] uppercase tracking-widest text-white/40 font-sans">Anos de Histórias</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
