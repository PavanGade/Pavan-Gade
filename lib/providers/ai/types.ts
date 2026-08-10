export type AIGenerationPurpose =
  | 'summarize_prospect'
  | 'summarize_company'
  | 'opening_message'
  | 'follow_up'
  | 'qualification_questions'
  | 'summarize_notes'
  | 'next_action'
  | 'explain_lead_score';

export type AIGenerationRequest = {
  organizationId: string;
  purpose: AIGenerationPurpose;
  /** Already-minimized payload — never send full CRM dumps. */
  context: Record<string, unknown>;
};

export type AIGenerationResult = {
  provider: string;
  purpose: AIGenerationPurpose;
  text: string;
  model?: string;
};

/**
 * AI vendors must be called from Edge Functions only.
 * Client code talks to this interface (via a secure API wrapper in Phase 2).
 */
export interface AIProvider {
  readonly name: string;
  generate(request: AIGenerationRequest): Promise<AIGenerationResult>;
}
