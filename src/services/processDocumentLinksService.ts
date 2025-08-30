import { supabase } from '@/integrations/supabase/client';

export interface ProcessDocumentLink {
  id?: string;
  rfp_id: string;
  document_link: string;
  is_active?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProcessDocumentLinkFilters {
  rfp_id?: string;
  is_active?: boolean;
}

export class ProcessDocumentLinksService {
  private static getApiUrl() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return `${supabaseUrl}/functions/v1/process-document-links`;
  }

  private static async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get all process document links with optional filtering
   */
  static async getAll(filters?: ProcessDocumentLinkFilters): Promise<ProcessDocumentLink[]> {
    try {
      const headers = await this.getAuthHeaders();
      const url = new URL(this.getApiUrl());
      
      if (filters?.rfp_id) {
        url.searchParams.append('rfp_id', filters.rfp_id);
      }
      if (filters?.is_active !== undefined) {
        url.searchParams.append('is_active', filters.is_active.toString());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch process document links');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching process document links:', error);
      throw error;
    }
  }

  /**
   * Get a single process document link by ID
   */
  static async getById(id: string): Promise<ProcessDocumentLink> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.getApiUrl()}/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch process document link');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching process document link:', error);
      throw error;
    }
  }

  /**
   * Create a new process document link
   */
  static async create(link: Omit<ProcessDocumentLink, 'id' | 'created_at' | 'updated_at'>): Promise<ProcessDocumentLink> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(this.getApiUrl(), {
        method: 'POST',
        headers,
        body: JSON.stringify(link),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create process document link');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating process document link:', error);
      throw error;
    }
  }

  /**
   * Update an existing process document link
   */
  static async update(id: string, updates: Partial<ProcessDocumentLink>): Promise<ProcessDocumentLink> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.getApiUrl()}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update process document link');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating process document link:', error);
      throw error;
    }
  }

  /**
   * Delete a process document link
   */
  static async delete(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${this.getApiUrl()}/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete process document link');
      }
    } catch (error) {
      console.error('Error deleting process document link:', error);
      throw error;
    }
  }

  /**
   * Get process document links for a specific RFP
   */
  static async getByRfpId(rfpId: string): Promise<ProcessDocumentLink[]> {
    return this.getAll({ rfp_id: rfpId });
  }

  /**
   * Get active process document links
   */
  static async getActive(): Promise<ProcessDocumentLink[]> {
    return this.getAll({ is_active: true });
  }

  /**
   * Toggle the active status of a process document link
   */
  static async toggleActive(id: string, currentStatus: boolean): Promise<ProcessDocumentLink> {
    return this.update(id, { is_active: !currentStatus });
  }
}

// Export a default instance for convenience
export default ProcessDocumentLinksService;
