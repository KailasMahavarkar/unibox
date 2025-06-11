export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  sessionId?: string;
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
export interface ChatHistory {
  messages: ChatMessage[];
  lastUpdated: Date;
  sessionId: string;
}

export interface SharedChatState {
  currentSession: ChatSession | null;
  messageHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  lastSyncTimestamp: number;
}

export interface ChatSyncEvent {
  type: 'MESSAGE_ADDED' | 'MESSAGES_CLEARED' | 'SESSION_CHANGED' | 'STATE_UPDATED' | 'LOADING_STARTED' | 'LOADING_STOPPED' | 'ERROR_OCCURRED';
  payload?: any;
  timestamp: number;
  source: string;
}