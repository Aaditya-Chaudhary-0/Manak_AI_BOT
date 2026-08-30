/**
 * ManakAI API Client Service
 * Centralized, typed API fetch wrapper using environment variables.
 * Base URL defaults to VITE_API_BASE_URL or http://localhost:8000/api.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface SearchRequest {
  query: string;
  language?: string;
  top_k?: number;
}

export interface SearchResultItem {
  result_id: string;
  standard_code?: string | null;
  title: string;
  snippet: string;
  source_url: string;
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  last_indexed?: string | null;
}

export interface SearchResponse {
  query: string;
  abstained: boolean;
  message?: string | null;
  results: SearchResultItem[];
}

export interface HealthResponse {
  status: string;
  database: string;
  qdrant: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Executes POST /api/search against the FastAPI hybrid retrieval engine.
 */
export async function searchApi(req: SearchRequest): Promise<SearchResponse> {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: req.query,
      language: req.language || 'en',
      top_k: req.top_k || 5,
    }),
  });

  if (!response.ok) {
    let errorMessage = `Search request failed with status ${response.status}`;
    try {
      const errJson: ApiErrorResponse = await response.json();
      if (errJson?.error?.message) {
        errorMessage = errJson.error.message;
      }
    } catch {
      // Ignore JSON parse errors for fallback
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Executes GET /api/health to check backend, database, and vector store status.
 */
export async function checkHealthApi(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return response.json();
}
