export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          job_title: string | null;
          phone: string | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          job_title?: string | null;
          phone?: string | null;
          onboarding_completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          industry: string | null;
          team_size: string | null;
          primary_sales_goal: string | null;
          logo_url: string | null;
          retention_days: number | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          industry?: string | null;
          team_size?: string | null;
          primary_sales_goal?: string | null;
          logo_url?: string | null;
          retention_days?: number | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['organizations']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER';
          invited_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: 'OWNER' | 'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER';
          invited_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['organization_members']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      companies: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
          industry: string | null;
          headquarters: string | null;
          employee_count: number | null;
          revenue_range: string | null;
          description: string | null;
          technologies: string[];
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          logo_url?: string | null;
          website?: string | null;
          industry?: string | null;
          headquarters?: string | null;
          employee_count?: number | null;
          revenue_range?: string | null;
          description?: string | null;
          technologies?: string[];
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['companies']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      prospects: {
        Row: {
          id: string;
          organization_id: string;
          company_id: string | null;
          owner_id: string | null;
          first_name: string | null;
          last_name: string | null;
          full_name: string;
          job_title: string | null;
          seniority: string | null;
          department: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          industry: string | null;
          linkedin_url: string | null;
          avatar_url: string | null;
          source: string | null;
          lead_status:
            | 'NEW'
            | 'CONTACTED'
            | 'ENGAGED'
            | 'QUALIFIED'
            | 'UNQUALIFIED'
            | 'NURTURING';
          lead_score: number;
          last_contacted_at: string | null;
          next_follow_up_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          company_id?: string | null;
          owner_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          full_name: string;
          job_title?: string | null;
          seniority?: string | null;
          department?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          city?: string | null;
          state?: string | null;
          country?: string | null;
          industry?: string | null;
          linkedin_url?: string | null;
          avatar_url?: string | null;
          source?: string | null;
          lead_status?:
            | 'NEW'
            | 'CONTACTED'
            | 'ENGAGED'
            | 'QUALIFIED'
            | 'UNQUALIFIED'
            | 'NURTURING';
          lead_score?: number;
          last_contacted_at?: string | null;
          next_follow_up_at?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['prospects']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      prospect_lists: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          color: string | null;
          is_archived: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          color?: string | null;
          is_archived?: boolean;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['prospect_lists']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string | null;
          company_id: string | null;
          deal_id: string | null;
          assignee_id: string | null;
          created_by: string | null;
          task_type: 'CALL' | 'EMAIL' | 'WHATSAPP' | 'MEETING' | 'FOLLOW_UP' | 'CUSTOM';
          title: string;
          notes: string | null;
          due_at: string | null;
          priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          prospect_id?: string | null;
          company_id?: string | null;
          deal_id?: string | null;
          assignee_id?: string | null;
          created_by?: string | null;
          task_type?: 'CALL' | 'EMAIL' | 'WHATSAPP' | 'MEETING' | 'FOLLOW_UP' | 'CUSTOM';
          title: string;
          notes?: string | null;
          due_at?: string | null;
          priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
          status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
          completed_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['tasks']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      deals: {
        Row: {
          id: string;
          organization_id: string;
          pipeline_id: string;
          stage_id: string;
          prospect_id: string | null;
          company_id: string | null;
          owner_id: string | null;
          title: string;
          value_cents: number;
          currency: string;
          probability: number | null;
          expected_close_date: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          pipeline_id: string;
          stage_id: string;
          prospect_id?: string | null;
          company_id?: string | null;
          owner_id?: string | null;
          title: string;
          value_cents?: number;
          currency?: string;
          probability?: number | null;
          expected_close_date?: string | null;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['deals']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      notes: {
        Row: {
          id: string;
          organization_id: string;
          entity_type: 'PROSPECT' | 'COMPANY' | 'DEAL';
          prospect_id: string | null;
          company_id: string | null;
          deal_id: string | null;
          body: string;
          author_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          organization_id: string;
          entity_type: 'PROSPECT' | 'COMPANY' | 'DEAL';
          prospect_id?: string | null;
          company_id?: string | null;
          deal_id?: string | null;
          body: string;
          author_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['notes']['Insert']> & {
          deleted_at?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          organization_id: string;
          prospect_id: string | null;
          company_id: string | null;
          deal_id: string | null;
          task_id: string | null;
          actor_id: string | null;
          activity_type: string;
          title: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          prospect_id?: string | null;
          company_id?: string | null;
          deal_id?: string | null;
          task_id?: string | null;
          actor_id?: string | null;
          activity_type: string;
          title: string;
          metadata?: Json;
        };
        Update: Partial<Database['public']['Tables']['activities']['Insert']>;
      };
      pipeline_stages: {
        Row: {
          id: string;
          organization_id: string;
          pipeline_id: string;
          name: string;
          position: number;
          probability: number;
          is_won: boolean;
          is_lost: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          pipeline_id: string;
          name: string;
          position: number;
          probability?: number;
          is_won?: boolean;
          is_lost?: boolean;
        };
        Update: Partial<Database['public']['Tables']['pipeline_stages']['Insert']>;
      };
      pipelines: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name?: string;
          is_default?: boolean;
        };
        Update: Partial<Database['public']['Tables']['pipelines']['Insert']>;
      };
      icp_profiles: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          target_industries: string[];
          target_geographies: string[];
          company_sizes: string[];
          revenue_ranges: string[];
          job_titles: string[];
          seniorities: string[];
          keywords: string[];
          is_default: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name?: string;
          target_industries?: string[];
          target_geographies?: string[];
          company_sizes?: string[];
          revenue_ranges?: string[];
          job_titles?: string[];
          seniorities?: string[];
          keywords?: string[];
          is_default?: boolean;
          created_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['icp_profiles']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      bootstrap_organization: {
        Args: { p_org_id: string };
        Returns: undefined;
      };
      is_org_member: {
        Args: { p_org_id: string };
        Returns: boolean;
      };
      has_org_role: {
        Args: {
          p_org_id: string;
          p_roles: Database['public']['Tables']['organization_members']['Row']['role'][];
        };
        Returns: boolean;
      };
    };
    Enums: {
      org_role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'SALES_REP' | 'VIEWER';
      lead_status: 'NEW' | 'CONTACTED' | 'ENGAGED' | 'QUALIFIED' | 'UNQUALIFIED' | 'NURTURING';
    };
  };
};

export type Prospect = Database['public']['Tables']['prospects']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Deal = Database['public']['Tables']['deals']['Row'];
export type Note = Database['public']['Tables']['notes']['Row'];
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type PipelineStage = Database['public']['Tables']['pipeline_stages']['Row'];
