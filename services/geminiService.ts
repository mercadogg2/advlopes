
import { GoogleGenAI } from "@google/genai";

/**
 * SERVIÇO DE IA - F. LOPES ADVOCACIA
 * Este serviço gerencia a comunicação com o Gemini 3 Flash.
 */

const SYSTEM_INSTRUCTION = `
Você é o assistente virtual de triagem do escritório F. Lopes Advocacia (Maceió-AL).
Seu objetivo é qualificar leads interessados em: Trabalhista, Previdenciário, Condominial e Concursos Públicos.

REGRAS:
1. Seja formal e use "Dr. Felipe Lopes" como referência.
2. Obtenha: Nome, Localização e WhatsApp.
3. Finalize com [TRIAGEM_SCORE: QUENTE] quando tiver os dados de contato.
`;

export const getGeminiResponse = async (history: { role: string, parts: { text: string }[] }[]) => {
  // Tenta obter a chave do processo de build (Ambiente)
  const apiKey = process.env.API_KEY?.trim();

  // Se a chave for inválida ou undefined, lançamos erro para o componente tratar
  if (!apiKey || apiKey === "undefined" || apiKey === "" || apiKey.length < 10) {
    throw new Error("KEY_NOT_CONFIGURED");
  }

  try {
    // Sempre criamos uma nova instância para garantir o uso da chave mais recente
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    return response.text || "Desculpe, não consegui processar sua resposta agora.";
  } catch (error: any) {
    const msg = error.message || "";
    console.error("Erro Gemini API:", msg);

    if (msg.includes("403") || msg.includes("API key not valid") || msg.includes("not found")) {
      throw new Error("KEY_INVALID");
    }
    
    throw new Error("API_ERROR");
  }
};
