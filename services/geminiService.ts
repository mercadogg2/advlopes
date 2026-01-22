
import { GoogleGenAI } from "@google/genai";

/**
 * SERVIÇO DE IA - F. LOPES ADVOCACIA
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
  // A chave deve vir exclusivamente do ambiente e ser limpa de espaços acidentais
  const rawKey = process.env.API_KEY;
  const apiKey = rawKey?.trim();

  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    console.error("Aviso: Chave de API não configurada corretamente no ambiente.");
    throw new Error("KEY_MISSING");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    
    const errorMsg = error.message || "";
    
    // Erros de permissão ou chave inválida
    if (errorMsg.includes("Requested entity was not found") || 
        errorMsg.includes("API key not valid") || 
        errorMsg.includes("403") ||
        errorMsg.includes("invalid_argument") ||
        errorMsg.includes("API_KEY_INVALID")) {
      throw new Error("KEY_INVALID");
    }
    
    throw error;
  }
};
