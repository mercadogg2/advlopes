
import React from 'react';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Experiências Reais</h2>
          <h3 className="text-4xl font-serif text-primary">O que dizem nossos clientes</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="text-accent mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <i key={i} className="fa-solid fa-star text-sm"></i>)}
              </div>
              <p className="text-gray-600 text-lg italic mb-8">"{t.content}"</p>
              <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full mb-4 border-2 border-accent/20" />
              <div>
                <p className="font-bold text-primary">{t.name}</p>
                <p className="text-gray-400 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
