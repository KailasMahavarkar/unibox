export interface ChatMessage {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface ChatbotApiRequest {
  message: string;
}

export interface ChatbotApiResponse {
  response: string;
  status: 'success' | 'error';
  timestamp?: string;
}

export interface ChatbotServiceError {
  message: string;
  status?: number;
  code?: string;
}