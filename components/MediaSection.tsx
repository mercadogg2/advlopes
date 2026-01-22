
import React from 'react';

const MediaSection: React.FC = () => {
  const videos = [
    { 
      id: 'LvE_mcWVB0w', 
      title: 'Direito do Trabalho em Pauta',
      category: 'Entrevista Exclusiva',
      description: 'Análise detalhada sobre as recentes mudanças na legislação trabalhista e seus impactos na sociedade alagoana.'
    },
    { 
      id: 'fNACz9nHBpQ', 
      title: 'Justiça e Cidadania',
      category: 'Debate Jurídico',
      description: 'Discussão técnica sobre direitos fundamentais e as novas diretrizes dos tribunais superiores.'
    }
  ];

  return (
    <section id="midia" className="py-32 bg-primary relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
      <div className="absolute -right-64 bottom-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <p className="text-accent font-bold text-[10px] uppercase tracking-[0.6em] mb-4">Reconhecimento e Autoridade</p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Na Mídia</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {videos.map((video) => (
            <div key={video.id} className="group relative flex flex-col">
              {/* Container do Link para o YouTube - Agora abre em nova aba para evitar erros 153 */}
              <a 
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl group-hover:border-accent/30 transition-all duration-700 block group/btn cursor-pointer"
                aria-label={`Assistir ${video.title} no YouTube`}
              >
                {/* Thumbnail do YouTube com Overlay */}
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                  onError={(e) => {
                    // Fallback caso a miniatura maxres não exista
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                
                {/* Camada de Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60"></div>
                
                {/* Botão de Play Centralizado */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center backdrop-blur-sm group-hover/btn:bg-accent group-hover/btn:scale-110 transition-all duration-500 shadow-2xl shadow-accent/20">
                    <i className="fa-solid fa-play text-accent text-2xl ml-1 group-hover/btn:text-primary transition-colors"></i>
                  </div>
                </div>

                {/* Badge Flutuante Informativa */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 flex items-center gap-2 shadow-xl">
                   <span className="text-[8px] text-white/90 uppercase tracking-widest font-bold">Assistir no YouTube</span>
                   <i className="fa-solid fa-arrow-up-right-from-square text-[8px] text-accent"></i>
                </div>
              </a>

              {/* Informações Complementares do Vídeo */}
              <div className="mt-8 space-y-4 px-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-accent font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                    {video.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-serif text-white group-hover:text-accent transition-colors duration-500">
                  {video.title}
                </h3>
                
                <p className="text-white/40 text-sm font-light leading-relaxed max-w-md">
                  {video.description}
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Conteúdo Externo Disponível</span>
                   <div className="flex gap-4">
                     <i className="fa-solid fa-signal text-[10px] text-accent/20"></i>
                     <i className="fa-solid fa-volume-high text-[10px] text-accent/20"></i>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-medium">
            Clique na imagem para abrir o conteúdo em uma nova aba do YouTube
          </p>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
