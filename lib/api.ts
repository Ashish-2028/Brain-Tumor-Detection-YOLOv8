import { PredictionResponse, HealthResponse, ModelInfoResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new APIError('Request timeout - please try again', 408);
    }
    throw error;
  }
}

export async function predictTumor(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetchWithTimeout(
      `${API_URL}/predict`,
      {
        method: 'POST',
        body: formData,
      },
      API_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error || errorData.detail || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(
        'Cannot connect to server. Please ensure the backend is running.',
        0
      );
    }
    throw new APIError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500
    );
  }
}

export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/health`,
      { method: 'GET' },
      5000
    );

    if (!response.ok) {
      throw new APIError(`HTTP ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to check server health', 0);
  }
}

export async function getModelInfo(): Promise<ModelInfoResponse> {
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/model-info`,
      { method: 'GET' },
      5000
    );

    if (!response.ok) {
      throw new APIError(`HTTP ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to get model information', 0);
  }
}

export { APIError };
