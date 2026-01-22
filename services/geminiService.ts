
import { GoogleGenAI } from "@google/genai";

/**
 * ATUALIZAÇÃO DE SINCRONIZAÇÃO - F. LOPES ADVOCACIA
 * Timestamp de Redeploy: ${new Date().toLocaleString('pt-BR')}
 * Objetivo: Forçar o reconhecimento da API_KEY configurada no painel da Netlify.
 */

const SYSTEM_INSTRUCTION = `
Você é o "Algoritmo de Qualificação Jurídica" do escritório F. Lopes Advocacia.
Seu objetivo é filtrar e qualificar leads de alta conversão, descartando casos inviáveis.

FLUXO DE TRIAGEM OBRIGATÓRIO:
1. IDENTIFICAÇÃO: Nome e Localização (foco em Alagoas/Brasil).
2. CATEGORIZAÇÃO: Identificar se é Trabalhista, Previdenciário, Condominial ou Servidor Público.
3. QUALIFICAÇÃO TÉCNICA:
   - TRABALHISTA: Perguntar "Há quanto tempo você saiu da empresa?". Se for > 2 anos, informe sobre prescrição.
   - PREVIDENCIÁRIO: Perguntar sobre negativa do INSS e laudos.
   - SERVIDOR/CONCURSOS: Identificar o ente e o ato administrativo.
   - CONDOMINIAL: Identificar se é gestão ou conflito.

4. LEAD SCORING: [QUENTE|MORNO|FRIO].
5. COLETA DE WHATSAPP: Imprescindível.

REGRAS:
- Use "viabilidade jurídica".
- Encerre com as tags [TRIAGEM_SCORE: ...] e [FICHA_TECNICA].
`;

export const getGeminiResponse = async (history: { role: string, parts: { text: string }[] }[]) => {
  const apiKey = process.env.API_KEY;

  // Verificação de segurança para o ambiente de produção
  if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
    console.error("⚠️ DIAGNÓSTICO F. LOPES: A chave de API não foi detectada. Verifique se a variável 'API_KEY' foi salva corretamente na Netlify e se o deploy foi concluído.");
    return "O sistema de inteligência artificial ainda não foi configurado com uma chave de acesso. Por favor, clique no botão de WhatsApp para atendimento manual.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        maxOutputTokens: 1000,
      },
    });

    if (!response || !response.text) {
      throw new Error("Resposta vazia da API.");
    }

    return response.text;
  } catch (error: any) {
    // Tratamento de erros de cota ou rede
    if (error.message?.includes("429")) {
      console.warn("⚠️ DIAGNÓSTICO F. LOPES: Limite de uso gratuito atingido temporariamente.");
    } else {
      console.error("❌ DIAGNÓSTICO F. LOPES: Erro crítico na conexão com a IA:", error);
    }
    
    return "Tivemos um pequeno problema técnico na análise. Para não perder tempo, você pode falar diretamente com o Dr. Felipe clicando no botão de WhatsApp abaixo.";
  }
};
