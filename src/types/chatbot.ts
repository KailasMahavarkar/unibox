export interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface ChatbotApiRequest {
  message: string;
  session_id?: string;
}

export interface ChatbotApiResponse {
  response: string;
  status: 'success' | 'error';
  session_id?: string;
  timestamp?: string;
}

export interface ChatbotServiceError {
  message: string;
  status?: number;
  code?: string;
}

export interface ChatSession {
  session_id: string;
  created_at: Date;
  last_activity: Date;
  is_active: boolean;
}