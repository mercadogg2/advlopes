
import { GoogleGenAI } from "@google/genai";

/**
 * SERVIÇO DE IA - F. LOPES ADVOCACIA
 * Implementação resiliente que suporta variáveis de ambiente e seletor manual.
 */

const SYSTEM_INSTRUCTION = `
Você é o assistente virtual de triagem do escritório F. Lopes Advocacia (Maceió-AL).
Seu objetivo é qualificar leads interessados em: Trabalhista, Previdenciário, Condominial e Concursos Públicos.

REGRAS DE OURO:
1. Seja formal, mas acolhedor.
2. Identifique o Nome e a Localização do cliente.
3. Identifique a área do problema.
4. Peça o WhatsApp para que o Dr. Felipe possa enviar o parecer técnico.
5. Finalize com [TRIAGEM_SCORE: QUENTE|MORNO|FRIO] e a [FICHA_TECNICA].
`;

export const getGeminiResponse = async (history: { role: string, parts: { text: string }[] }[]) => {
  // Tenta obter a chave do processo ou do ambiente global
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || "";

  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    throw new Error("KEY_MISSING");
  }

  try {
    // Instancia o cliente no momento da chamada para garantir o uso da chave atual
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    if (!response || !response.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return response.text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    
    // Se a entidade não for encontrada (erro comum de chave), sinaliza para reconfigurar
    if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key not valid")) {
      throw new Error("KEY_INVALID");
    }
    
    throw error;
  }
};
