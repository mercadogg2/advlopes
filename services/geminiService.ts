
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
  // Always use process.env.API_KEY directly as required by guidelines
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === "undefined" || apiKey.length < 5) {
    throw new Error("KEY_MISSING");
  }

  try {
    // Re-initialize for each call to ensure latest session settings/keys
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    // Extract text output using the .text property directly
    const text = response.text;
    if (!text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return text;
  } catch (error: any) {
    console.error("Erro na API Gemini:", error);
    
    const errorMsg = error.message || "";
    
    // Check for common key/project related errors to prompt user for re-authentication if necessary
    if (errorMsg.includes("Requested entity was not found") || 
        errorMsg.includes("API key not valid") || 
        errorMsg.includes("403") ||
        errorMsg.includes("expired")) {
      throw new Error("KEY_INVALID");
    }
    
    throw error;
  }
};
