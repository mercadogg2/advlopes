
import { GoogleGenAI } from "@google/genai";

/**
 * SISTEMA DE DIAGNÓSTICO E TRIAGEM - F. LOPES ADVOCACIA
 * Status: Aguardando sincronização de Variáveis de Ambiente (API_KEY).
 * Última verificação de integridade: ${new Date().toLocaleString('pt-BR')}
 */

const SYSTEM_INSTRUCTION = `
Você é o "Algoritmo de Qualificação Jurídica" do escritório F. Lopes Advocacia.
Seu objetivo é filtrar e qualificar leads de alta conversão.

FLUXO DE TRIAGEM:
1. Nome e Localização.
2. Área (Trabalhista, Previdenciário, Condominial ou Servidor).
3. Pergunta de corte técnica para a área.
4. WhatsApp para contato.

IMPORTANTE: Responda de forma elegante e profissional.
Ao final da triagem, você DEVE incluir: [TRIAGEM_SCORE: QUENTE] e uma [FICHA_TECNICA] resumida.
`;

export const getGeminiResponse = async (history: { role: string, parts: { text: string }[] }[]) => {
  // A API_KEY deve ser configurada no painel da Netlify como Environment Variable
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    console.error("❌ ERRO DE CONFIGURAÇÃO: A 'API_KEY' não foi detectada no ambiente da Netlify.");
    console.info("Acesse: Site Settings > Environment Variables e adicione a chave com o nome API_KEY.");
    return "O assistente está em manutenção técnica de conexão. Por favor, utilize o botão de WhatsApp abaixo para falar diretamente com o Dr. Felipe enquanto sincronizamos nosso sistema.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.15, // Menor temperatura para respostas mais precisas
      },
    });

    if (!response || !response.text) {
      throw new Error("Resposta da IA veio vazia.");
    }

    return response.text;
  } catch (error: any) {
    console.error("❌ ERRO NA CHAMADA GEMINI:", error.message);
    
    if (error.message?.includes("API key not valid")) {
      return "Ops! A chave de acesso configurada parece estar incorreta. Por favor, verifique as configurações no painel da Netlify.";
    }

    return "Tivemos uma pequena oscilação na rede. Você pode tentar novamente ou clicar no botão de WhatsApp para atendimento imediato.";
  }
};
