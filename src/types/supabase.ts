/**
 * Minimal Database typing placeholder.
 * Replace with `supabase gen types typescript` output when a project is linked.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      bootstrap_organization: {
        Args: { p_org_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      org_role: "OWNER" | "ADMIN" | "MANAGER" | "SALES_REP" | "VIEWER";
    };
  };
};
