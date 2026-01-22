
import React, { useEffect } from 'react';
import { CONTACT_INFO } from '../constants';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-primary pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <button 
          onClick={onBack}
          className="text-accent text-xs font-bold uppercase tracking-widest mb-12 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
        >
          <i className="fa-solid fa-arrow-left"></i> Voltar para o Início
        </button>

        <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">Política de <span className="gold-gradient">Privacidade</span></h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-white/70 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">1. Introdução</h2>
            <p>
              A <strong>F. Lopes Sociedade Individual de Advocacia</strong>, representada pelo Dr. Felipe Lopes de Amaral, valoriza a privacidade de seus usuários e clientes. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">2. Coleta de Dados</h2>
            <p>Coletamos informações que você nos fornece voluntariamente através de nossos formulários de contato e assistente virtual, tais como:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome completo;</li>
              <li>Número de telefone/WhatsApp;</li>
              <li>Endereço de e-mail;</li>
              <li>Informações breves sobre sua necessidade jurídica.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">3. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Responder a solicitações de consultoria e agendamentos;</li>
              <li>Prestar serviços jurídicos contratados;</li>
              <li>Enviar comunicações administrativas e atualizações relevantes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">4. Segurança dos Dados</h2>
            <p>
              Implementamos medidas técnicas e organizacionais rigorosas para proteger seus dados contra acessos não autorizados, perda ou destruição. O acesso às informações é restrito a profissionais autorizados e vinculados ao dever de sigilo profissional advocatício.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">5. Seus Direitos</h2>
            <p>
              Você possui o direito de solicitar a confirmação da existência de tratamento, acesso, correção, anonimização ou eliminação de seus dados pessoais a qualquer momento, através de nossos canais oficiais de contato.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">6. Contato</h2>
            <p>Para dúvidas sobre esta política, entre em contato via: <br />
              <strong>E-mail:</strong> {CONTACT_INFO.email}<br />
              <strong>Endereço:</strong> {CONTACT_INFO.address}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
