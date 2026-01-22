
import { Service, Testimonial, FAQItem } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Assessoria Jurídica',
    description: 'Foco em Empresas, Sindicatos e Condomínios. Atuação preventiva e consultiva completa.',
    icon: 'fa-building-shield',
  },
  {
    id: '2',
    title: 'Servidores e Concursos',
    description: 'Especialista em causas para servidores públicos e litígios em concursos públicos.',
    icon: 'fa-user-tie',
  },
  {
    id: '3',
    title: 'Advocacia Full Service',
    description: 'Atendimento jurídico abrangente em diversas áreas do direito com excelência técnica.',
    icon: 'fa-briefcase',
  },
  {
    id: '4',
    title: 'Precatório e RPV',
    description: 'Gestão e recuperação de valores de precatórios e requisições de pequeno valor.',
    icon: 'fa-money-bill-trend-up',
  },
];

export const PRINCIPLES = {
  mission: "Preservar direitos, prevenir conflitos e apoiar o desenvolvimento tecnológico, com soluções jurídicas especializadas, rápidas, seguras, com excelência e ética.",
  vision: "Ser reconhecido como um escritório de excelência na advocacia corporativa.",
  values: "Ética. Transparência. Parceria. Inovação. Flexibilidade. Compliance."
};

export const CONTACT_INFO = {
  phone: "82993220227",
  email: "contato.flopesadvocacia@gmail.com",
  instagram: "@felipelopesadvocacia",
  address: "Empresarial Millenium Tower - Rua Jangadeiros Alagoanos, nº 1188, sala 206, Pajuçara - Maceió-AL",
  oab: "OAB/AL RE 611/18"
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Associação de Moradores',
    role: 'Condomínio',
    content: 'Assessoria jurídica preventiva e consultiva de alta qualidade, fundamental para nossa gestão.',
    image: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: '2',
    name: 'Servidor Público Estadual',
    role: 'Cliente',
    content: 'O Dr. Felipe Lopes demonstrou total domínio técnico na defesa dos meus direitos funcionais.',
    image: 'https://picsum.photos/100/100?random=2',
  },
];
