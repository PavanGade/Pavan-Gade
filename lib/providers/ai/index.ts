import { NoopAIProvider } from '@/lib/providers/ai/noop-provider';
import type { AIProvider } from '@/lib/providers/ai/types';

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    provider = new NoopAIProvider();
  }
  return provider;
}

export type {
  AIGenerationPurpose,
  AIGenerationRequest,
  AIGenerationResult,
  AIProvider,
} from '@/lib/providers/ai/types';
