export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  score: number;
}

export interface PredictionResponse {
  success: boolean;
  tumor_type: string | null;
  confidence: number;
  boxes: BoundingBox[];
  inference_time?: number;
  image_shape?: [number, number];
  error?: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  device: string;
}

export interface ModelInfoResponse {
  loaded: boolean;
  device?: string;
  total_parameters?: number;
  trainable_parameters?: number;
  model_path?: string;
  classes?: Record<number, string>;
}
