// Context Pipeline - Deep Research System
// Collects, consolidates and delivers rich context to AI before generation
// TODO: Move to Edge Function when Supabase active

import { runAI } from './aiAdapters';
import { storage, KEYS } from './storage';

export interface ContextResult {
  provider: string;
  data: string;
  success: boolean;
  error?: string;
}

export interface PipelineConfig {
  enableDeepSeek: boolean;
  enableTavily: boolean;
  enableJina: boolean;
  tavilyApiKey?: string;
}

// Get pipeline configuration from storage
const getPipelineConfig = (): PipelineConfig => {
  const config = storage.get<PipelineConfig>('offer-copilot-context-pipeline');
  return config || {
    enableDeepSeek: true,
    enableTavily: false,
    enableJina: false,
  };
};

// Log context pipeline steps
const logStep = (provider: string, success: boolean, error?: string) => {
  const emoji = success ? '✓' : '✗';
  console.info(
    `%c[ContextPipeline] ${provider} ${emoji}`,
    `color: ${success ? '#10b981' : '#ef4444'}; font-weight: bold;`,
    error || ''
  );
};

/**
 * Main context builder function
 * Orchestrates multiple search providers to build rich context
 */
export async function buildContext(query: string): Promise<string> {
  const config = getPipelineConfig();
  const results: ContextResult[] = [];
  
  console.info(
    '%c[ContextPipeline] 🚀 Starting deep research...',
    'background: #4F46E5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
  );

  // 1️⃣ DeepSeek - Broad search with AI reasoning
  if (config.enableDeepSeek) {
    try {
      const apiKeys = storage.get<Record<string, string>>(KEYS.API_KEYS) || {};
      const deepseekKey = apiKeys['deepseek'];
      
      if (deepseekKey) {
        const response = await runAI('deepseek', deepseekKey, 'deepseek-chat', [
          {
            role: 'system',
            content: 'Você é um pesquisador especializado. Pesquise fontes variadas (notícias, fóruns, vídeos, artigos, estudos) e forneça informações detalhadas e contextualizadas.'
          },
          {
            role: 'user',
            content: `Faça uma pesquisa aprofundada sobre: ${query}\n\nRetorne informações relevantes, dados demográficos, comportamentos, dores, desejos e fontes de informação do público.`
          }
        ]);
        
        results.push({
          provider: 'DeepSeek AI',
          data: response.text,
          success: true
        });
        
        logStep('DeepSeek', true);
      } else {
        logStep('DeepSeek', false, 'API Key not configured');
      }
    } catch (error) {
      logStep('DeepSeek', false, error instanceof Error ? error.message : 'Unknown error');
      results.push({
        provider: 'DeepSeek AI',
        data: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 2️⃣ Tavily - Semantic search with real-time data
  if (config.enableTavily && config.tavilyApiKey) {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: config.tavilyApiKey,
          query,
          include_answer: true,
          include_domains: [],
          exclude_domains: []
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status}`);
      }

      const data = await response.json();
      
      results.push({
        provider: 'Tavily Search',
        data: data.answer || JSON.stringify(data.results?.slice(0, 5) || []),
        success: true
      });
      
      logStep('Tavily', true);

      // 3️⃣ Jina - Deep reading of top result
      if (config.enableJina && data.results?.length > 0) {
        try {
          const topLink = data.results[0].url;
          const jinaResponse = await fetch(`https://r.jina.ai/${topLink}`, {
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (jinaResponse.ok) {
            const jinaText = await jinaResponse.text();
            results.push({
              provider: 'Jina Reader',
              data: jinaText.slice(0, 5000), // Limit to 5000 chars
              success: true
            });
            logStep('Jina', true);
          } else {
            throw new Error(`Jina Reader error: ${jinaResponse.status}`);
          }
        } catch (error) {
          logStep('Jina', false, error instanceof Error ? error.message : 'Unknown error');
        }
      }
    } catch (error) {
      logStep('Tavily', false, error instanceof Error ? error.message : 'Unknown error');
      results.push({
        provider: 'Tavily Search',
        data: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 4️⃣ Combine all results into unified context
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    console.warn('[ContextPipeline] ⚠️ No successful results. Returning empty context.');
    return '';
  }

  const combinedContext = successfulResults
    .map(r => `=== ${r.provider} ===\n${r.data}`)
    .join('\n\n---\n\n');

  console.info(
    `%c[ContextPipeline] ✅ Context built: ${successfulResults.length} sources, ${combinedContext.length} chars`,
    'color: #10b981; font-weight: bold;'
  );

  return combinedContext;
}

/**
 * Save pipeline configuration
 */
export function savePipelineConfig(config: PipelineConfig): void {
  storage.set('offer-copilot-context-pipeline', config);
}

/**
 * Get current pipeline configuration
 */
export function loadPipelineConfig(): PipelineConfig {
  return getPipelineConfig();
}

/**
 * Test pipeline with a sample query
 */
export async function testPipeline(): Promise<boolean> {
  try {
    const context = await buildContext('Empreendedores digitais no Brasil');
    return context.length > 0;
  } catch {
    return false;
  }
}
