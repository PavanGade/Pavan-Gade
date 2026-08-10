import type { AIGenerationRequest, AIGenerationResult, AIProvider } from '@/lib/providers/ai/types';

/** Phase 1 stub — does not call external models. */
export class NoopAIProvider implements AIProvider {
  readonly name = 'noop';

  async generate(request: AIGenerationRequest): Promise<AIGenerationResult> {
    return {
      provider: this.name,
      purpose: request.purpose,
      text: 'AI assistant is not enabled yet. Connect an AIProvider via Edge Functions in Phase 2.',
    };
  }
}
