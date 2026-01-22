
import React, { useEffect } from 'react';
import { CONTACT_INFO } from '../constants';

const TermsOfUse: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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

        <h1 className="text-4xl md:text-5xl font-serif text-white mb-8">Termos de <span className="gold-gradient">Uso</span></h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-white/70 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar o site da <strong>F. Lopes Sociedade Individual de Advocacia</strong>, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">2. Uso do Conteúdo</h2>
            <p>
              O conteúdo deste site é fornecido apenas para fins informativos gerais e não constitui aconselhamento jurídico formal. A visualização das informações ou o envio de mensagens através do formulário de contato não estabelece uma relação advogado-cliente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">3. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo original deste site, incluindo textos, logotipos, imagens e design, é de propriedade exclusiva da <strong>F. Lopes Advocacia</strong> e está protegido por leis de direitos autorais e propriedade intelectual. É proibida a reprodução parcial ou total sem autorização prévia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">4. Limitações</h2>
            <p>
              Em nenhum caso a F. Lopes Advocacia será responsável por quaisquer danos decorrentes do uso ou da incapacidade de usar os materiais em seu site, mesmo que tenhamos sido notificados oralmente ou por escrito da possibilidade de tais danos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">5. Modificações</h2>
            <p>
              Podemos revisar estes termos de uso a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-4 border-b border-accent/20 pb-2">6. Foro</h2>
            <p>
              Qualquer reclamação relativa ao site será regida pelas leis do Estado de Alagoas, com renúncia expressa a qualquer outro foro por mais privilegiado que seja.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
