
import React, { useState } from 'react';
import { CONTACT_INFO } from '../constants';

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    // Extração dos dados do formulário
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const description = formData.get('description') as string;

    // Formatação da mensagem para o WhatsApp
    const message = `Olá, Dr. Felipe Lopes!\n\n*Nova solicitação via Site:*\n\n*Nome:* ${name}\n*WhatsApp:* ${phone}\n*Situação:* ${description}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Limpeza do número de telefone (apenas dígitos)
    const purePhone = CONTACT_INFO.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${purePhone}?text=${encodedMessage}`;

    // Simulação de processamento e redirecionamento
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setStatus('success');
    }, 1200);
  };

  return (
    <section id="contato" className="py-32 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div>
              <p className="text-accent font-bold text-[10px] uppercase tracking-[0.5em] mb-4">Contato Oficial</p>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Inicie sua Defesa</h2>
              <p className="text-white/50 text-lg font-light leading-relaxed">
                Estamos prontos para ouvir sua história e construir a melhor estratégia jurídica. Sua privacidade e segurança são nossas maiores prioridades.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: 'fa-brands fa-instagram', label: 'Instagram', value: CONTACT_INFO.instagram, link: `https://instagram.com/${CONTACT_INFO.instagram.replace('@','')}` },
                { icon: 'fa-solid fa-phone', label: 'Telefone', value: CONTACT_INFO.phone, link: `tel:${CONTACT_INFO.phone}` },
                { icon: 'fa-solid fa-location-dot', label: 'Escritório', value: CONTACT_INFO.address, link: '#' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full bg-accent/5 flex items-center justify-center text-accent border border-accent/20 group-hover:bg-accent group-hover:text-primary transition-all duration-500">
                    <i className={`${item.icon} text-xl`}></i>
                  </div>
                  <div>
                    <p className="text-white/30 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">{item.label}</p>
                    <a href={item.link} className="text-white text-lg font-medium hover:text-accent transition-colors">{item.value}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/50 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-accent/20 shadow-3xl">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-24 h-24 bg-accent/10 text-accent rounded-full flex items-center justify-center text-4xl mb-8">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h4 className="text-2xl font-serif text-white mb-4">Mensagem Pronta</h4>
                <p className="text-white/50 font-light max-w-xs">Você foi redirecionado para o WhatsApp. Caso a conversa não tenha aberto automaticamente, clique no botão abaixo.</p>
                <button onClick={() => setStatus('idle')} className="mt-10 text-accent text-xs font-bold uppercase tracking-widest border-b border-accent/30 pb-1 hover:border-accent transition-all">Novo Envio</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Seu Nome</label>
                    <input name="name" required type="text" className="w-full bg-transparent border-b border-white/10 px-1 py-4 text-white outline-none focus:border-accent transition-colors font-light text-lg" placeholder="Como deseja ser chamado?" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">WhatsApp</label>
                    <input name="phone" required type="tel" className="w-full bg-transparent border-b border-white/10 px-1 py-4 text-white outline-none focus:border-accent transition-colors font-light text-lg" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Resumo da Necessidade</label>
                  <textarea name="description" rows={3} required className="w-full bg-transparent border-b border-white/10 px-1 py-4 text-white outline-none focus:border-accent transition-colors font-light text-lg resize-none" placeholder="Descreva brevemente sua situação..."></textarea>
                </div>
                <button 
                  disabled={status === 'sending'}
                  className="w-full gold-bg-gradient text-primary font-bold py-6 rounded-xl text-xs uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-accent/40 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  {status === 'sending' ? 'Processando...' : 'Conversar pelo WhatsApp'}
                </button>
                <p className="text-[9px] text-white/20 text-center uppercase tracking-widest">
                  <i className="fa-solid fa-shield-halved mr-2"></i> Transmissão segura e confidencial
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
