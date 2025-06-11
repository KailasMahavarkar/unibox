import axios, { AxiosResponse, AxiosError } from 'axios';
import { 
  ChatbotApiRequest, 
  ChatbotApiResponse, 
  ChatbotServiceError, 
  ChatSession, 
  ChatMessage, 
  ChatHistory, 
  SharedChatState, 
  ChatSyncEvent 
} from '@/types/chatbot';

class ChatbotService {
    private readonly apiUrl = 'https://7hn0iksiy0.execute-api.ap-south-1.amazonaws.com/prod/chat';
    private readonly timeout = 30000; // 30 seconds timeout
    private readonly maxRetries = 3;
    private currentSession: ChatSession | null = null;
    private hasPreviousSessionId: boolean = false;
    // Session management constants
    private readonly SESSION_STORAGE_KEY = 'setu_chatbot_session';
    private readonly MESSAGES_STORAGE_KEY = 'setu_chatbot_messages';
    private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    private readonly MAX_MESSAGE_HISTORY = 100;
    
    // Instance properties
    private messageHistory: ChatMessage[] = [];
    private syncEventListeners: Set<(event: ChatSyncEvent) => void> = new Set();
    private lastSyncTimestamp: number = Date.now();
    private isCurrentlyLoading: boolean = false;

    constructor() {
        // Initialize fresh state - no persistence across page refreshes
        this.initializeFreshState();
        this.hasPreviousSessionId = false;
    }

    /**
     * Initialize fresh state without any persistence
     */
    private initializeFreshState(): void {
        this.currentSession = null;
        this.messageHistory = [];
        this.lastSyncTimestamp = Date.now();
        this.isCurrentlyLoading = false;
        
        // Clear any existing session storage data
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
            sessionStorage.removeItem(this.MESSAGES_STORAGE_KEY);
        }
    }

    /**
     * Generate a new session ID
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generate a unique message ID
     */
    private generateMessageId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Save message history to sessionStorage (temporary storage)
     */
    private saveMessageHistory(): void {
        if (typeof window !== 'undefined') {
            try {
                const historyData: ChatHistory = {
                    messages: this.messageHistory.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
                    })),
                    lastUpdated: new Date(),
                    sessionId: this.currentSession?.session_id || ''
                };
                
                sessionStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify({
                    ...historyData,
                    lastUpdated: historyData.lastUpdated.toISOString(),
                    messages: historyData.messages.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp.toISOString()
                    }))
                }));
                
                this.lastSyncTimestamp = Date.now();
                this.emitSyncEvent('STATE_UPDATED', { messageCount: this.messageHistory.length });
            } catch (error) {
                console.warn('Failed to save message history to sessionStorage:', error);
            }
        }
    }

    /**
     * Restore message history from sessionStorage (if available in current session)
     */
    private restoreMessageHistory(): void {
        if (typeof window !== 'undefined') {
            try {
                const savedHistory = sessionStorage.getItem(this.MESSAGES_STORAGE_KEY);
                if (savedHistory) {
                    const parsed = JSON.parse(savedHistory);
                    const history: ChatHistory = {
                        ...parsed,
                        lastUpdated: new Date(parsed.lastUpdated),
                        messages: parsed.messages.map((msg: any) => ({
                            ...msg,
                            timestamp: new Date(msg.timestamp)
                        }))
                    };

                    // Only restore if from the same session or no current session
                    if (!this.currentSession || history.sessionId === this.currentSession.session_id) {
                        this.messageHistory = history.messages;
                        this.lastSyncTimestamp = Date.now();
                    }
                }
            } catch (error) {
                console.warn('Failed to restore message history from sessionStorage:', error);
                this.messageHistory = [];
            }
        }
    }

    /**
     * Emit sync events to listeners
     */
    public emitSyncEvent(type: ChatSyncEvent['type'], payload?: any): void {
        // Update internal loading state based on event type
        if (type === 'LOADING_STARTED') {
            this.isCurrentlyLoading = true;
        } else if (type === 'LOADING_STOPPED' || type === 'ERROR_OCCURRED') {
            this.isCurrentlyLoading = false;
        }

        const event: ChatSyncEvent = {
            type,
            payload,
            timestamp: Date.now(),
            source: 'chatbot-service'
        };

        this.syncEventListeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.warn('Error in sync event listener:', error);
            }
        });
    }

    /**
     * Add message to history
     */
    private addMessageToHistory(message: Omit<ChatMessage, 'id'>): ChatMessage {
        const newMessage: ChatMessage = {
            ...message,
            id: this.generateMessageId(),
            timestamp: message.timestamp || new Date(),
            sessionId: this.currentSession?.session_id
        };

        this.messageHistory.push(newMessage);

        // Limit message history size
        if (this.messageHistory.length > this.MAX_MESSAGE_HISTORY) {
            this.messageHistory = this.messageHistory.slice(-this.MAX_MESSAGE_HISTORY);
        }

        this.saveMessageHistory();
        this.emitSyncEvent('MESSAGE_ADDED', newMessage);
        
        return newMessage;
    }

    /**
     * Create a new session
     */
    private createNewSession(): ChatSession {
        const session: ChatSession = {
            session_id: this.generateSessionId(),
            created_at: new Date(),
            last_activity: new Date(),
            is_active: true
        };

        this.currentSession = session;
        this.saveSession();
        return session;
    }

    /**
     * Save session to sessionStorage
     */
    private saveSession(): void {
        if (this.currentSession && typeof window !== 'undefined') {
            try {
                sessionStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify({
                    ...this.currentSession,
                    created_at: this.currentSession.created_at.toISOString(),
                    last_activity: this.currentSession.last_activity.toISOString()
                }));
            } catch (error) {
                console.warn('Failed to save session to sessionStorage:', error);
            }
        }
    }

    /**
     * Restore session from sessionStorage
     */
    private restoreSession(): void {
        if (typeof window !== 'undefined') {
            try {
                const savedSession = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
                if (savedSession) {
                    const parsed = JSON.parse(savedSession);
                    const session: ChatSession = {
                        ...parsed,
                        created_at: new Date(parsed.created_at),
                        last_activity: new Date(parsed.last_activity)
                    };

                    // Check if session is still valid
                    if (this.isSessionValid(session)) {
                        this.currentSession = session;
                    } else {
                        this.clearSession();
                    }
                }
            } catch (error) {
                console.warn('Failed to restore session from sessionStorage:', error);
                this.clearSession();
            }
        }
    }

    /**
     * Check if session is still valid
     */
    private isSessionValid(session: ChatSession): boolean {
        const now = new Date();
        const timeDiff = now.getTime() - session.last_activity.getTime();
        return session.is_active && timeDiff < this.SESSION_TIMEOUT;
    }

    /**
     * Update session activity
     */
    private updateSessionActivity(): void {
        if (this.currentSession) {
            this.currentSession.last_activity = new Date();
            this.saveSession();
        }
    }

    /**
     * Clear current session and message history
     */
    private clearSession(): void {
        this.currentSession = null;
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
            sessionStorage.removeItem(this.MESSAGES_STORAGE_KEY);
        }
        this.messageHistory = [];
        this.emitSyncEvent('MESSAGES_CLEARED');
    }

    /**
     * Get current session, create new one if needed
     */
    public getCurrentSession(): ChatSession {
        if (!this.currentSession || !this.isSessionValid(this.currentSession)) {
            this.createNewSession();
        }
        return this.currentSession!;
    }

    /**
     * Start a new session explicitly
     */
    public startNewSession(): ChatSession {
        this.clearSession();
        const newSession = this.createNewSession();
        this.emitSyncEvent('SESSION_CHANGED', newSession);
        return newSession;
    }

    /**
     * Get session ID for current session
     */
    public getSessionId(): string {
        return this.getCurrentSession().session_id;
    }

    /**
     * Send a message to the AWS PFM chatbot API with session management and message history
     */
    async sendMessage(message: string, forceNewSession = false): Promise<{ userMessage: ChatMessage; botMessage: ChatMessage }> {
        if (!message.trim()) {
            throw new Error('Message cannot be empty');
        }

        // Emit loading started event for cross-component sync
        this.emitSyncEvent('LOADING_STARTED');

        try {
            // Create new session if forced or if first message
            if (forceNewSession) {
                this.startNewSession();
            }

            const session = this.getCurrentSession();
            
            // Add user message to history
            const userMessage = this.addMessageToHistory({
                text: message.trim(),
                isBot: false,
                timestamp: new Date()
            });

            const requestPayload: ChatbotApiRequest = {
                message: message.trim(),
                ...(this.hasPreviousSessionId && { session_id: session.session_id })
            };

            this.hasPreviousSessionId = true;
            let lastError: Error;

            // Retry mechanism
            for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
                try {
                    const response: AxiosResponse<ChatbotApiResponse> = await axios.post(
                        this.apiUrl,
                        requestPayload,
                        {
                            timeout: this.timeout,
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            // Disable axios default request transformation to ensure clean JSON
                            transformRequest: [(data) => JSON.stringify(data)],
                        }
                    );

                    // Handle successful response
                    if (response.status === 200 && response.data) {
                        // Update session activity on successful response
                        this.updateSessionActivity();

                        // Update session_id if provided in response
                        if (response.data.session_id && response.data.session_id !== session.session_id) {
                            this.currentSession!.session_id = response.data.session_id;
                            this.saveSession();
                            this.emitSyncEvent('SESSION_CHANGED', this.currentSession);
                        }

                        // Determine bot response text
                        let botResponseText: string;
                        if (typeof response.data === 'string') {
                            botResponseText = response.data;
                        } else if (response.data.response) {
                            botResponseText = response.data.response;
                        } else {
                            botResponseText = JSON.stringify(response.data);
                        }

                        // Add bot message to history
                        const botMessage = this.addMessageToHistory({
                            text: botResponseText,
                            isBot: true,
                            timestamp: new Date()
                        });

                        // Emit loading stopped event
                        this.emitSyncEvent('LOADING_STOPPED');

                        return { userMessage, botMessage };
                    }

                    throw new Error(`Unexpected response status: ${response.status}`);

                } catch (error) {
                    lastError = this.handleError(error, attempt);

                    // If it's the last attempt, throw the error
                    if (attempt === this.maxRetries) {
                        // Emit error event for cross-component sync
                        this.emitSyncEvent('ERROR_OCCURRED', { error: lastError.message });
                        throw lastError;
                    }

                    // Wait before retry (exponential backoff)
                    await this.delay(Math.pow(2, attempt) * 1000);
                }
            }

            throw lastError!;
        } catch (error) {
            // Emit loading stopped and error events
            this.emitSyncEvent('LOADING_STOPPED');
            this.emitSyncEvent('ERROR_OCCURRED', { 
                error: error instanceof Error ? error.message : 'Unknown error occurred' 
            });
            throw error;
        }
    }

    /**
     * Handle and format errors from the API
     */
    private handleError(error: unknown, attempt: number): Error {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;

            // Network errors
            if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
                return new Error(`Request timeout (attempt ${attempt}/${this.maxRetries}). Please try again.`);
            }

            if (axiosError.code === 'ERR_NETWORK') {
                return new Error(`Network error (attempt ${attempt}/${this.maxRetries}). Please check your connection.`);
            }

            // HTTP errors
            if (axiosError.response) {
                const status = axiosError.response.status;
                const statusText = axiosError.response.statusText;

                switch (status) {
                    case 400:
                        return new Error('Invalid request format. Please try rephrasing your message.');
                    case 401:
                        return new Error('Authentication failed. Please refresh the page and try again.');
                    case 403:
                        return new Error('Access denied. You may not have permission to use this service.');
                    case 404:
                        return new Error('Service not found. The chatbot API may be temporarily unavailable.');
                    case 429:
                        return new Error('Too many requests. Please wait a moment before trying again.');
                    case 500:
                        return new Error('Server error. The chatbot service is temporarily unavailable.');
                    case 502:
                    case 503:
                    case 504:
                        return new Error('Service temporarily unavailable. Please try again in a moment.');
                    default:
                        return new Error(`API error ${status}: ${statusText} (attempt ${attempt}/${this.maxRetries})`);
                }
            }
        }

        // Generic error handling
        if (error instanceof Error) {
            return new Error(`${error.message} (attempt ${attempt}/${this.maxRetries})`);
        }

        return new Error(`Unknown error occurred (attempt ${attempt}/${this.maxRetries})`);
    }

    /**
     * Delay utility for retry mechanism
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Health check for the API
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.apiUrl.replace('/chat', '/health')}`, {
                timeout: 5000
            });
            return response.status === 200;
        } catch {
            return false;
        }
    }

    /**
     * Get session information
     */
    public getSessionInfo(): ChatSession | null {
        if (this.currentSession && this.isSessionValid(this.currentSession)) {
            return { ...this.currentSession };
        }
        return null;
    }

    /**
     * Check if there's an active session
     */
    public hasActiveSession(): boolean {
        return this.currentSession !== null && this.isSessionValid(this.currentSession);
    }

    /**
     * End current session
     */
    public endSession(): void {
        this.clearSession();
    }

    // Message History and Sync Management Methods

    /**
     * Get current message history
     */
    public getMessageHistory(): ChatMessage[] {
        return [...this.messageHistory];
    }

    /**
     * Get shared chat state
     */
    public getSharedChatState(): SharedChatState {
        return {
            currentSession: this.currentSession ? { ...this.currentSession } : null,
            messageHistory: [...this.messageHistory],
            isLoading: this.isCurrentlyLoading,
            error: null,
            lastSyncTimestamp: this.lastSyncTimestamp
        };
    }

    /**
     * Clear message history
     */
    public clearMessageHistory(): void {
        this.messageHistory = [];
        this.saveMessageHistory();
        this.emitSyncEvent('MESSAGES_CLEARED');
    }

    /**
     * Add sync event listener
     */
    public addSyncListener(listener: (event: ChatSyncEvent) => void): () => void {
        this.syncEventListeners.add(listener);
        
        // Return unsubscribe function
        return () => {
            this.syncEventListeners.delete(listener);
        };
    }

    /**
     * Remove sync event listener
     */
    public removeSyncListener(listener: (event: ChatSyncEvent) => void): void {
        this.syncEventListeners.delete(listener);
    }

    /**
     * Force sync from sessionStorage (useful for manual refresh)
     */
    public forceSyncFromStorage(): void {
        // Since we're using sessionStorage, just emit a state update event
        // No complex restoration needed as data is cleared on page refresh
        this.emitSyncEvent('STATE_UPDATED', { 
            messageCount: this.messageHistory.length,
            sessionId: this.currentSession?.session_id 
        });
    }

    /**
     * Add a message manually (useful for migration or testing)
     */
    public addMessage(message: Omit<ChatMessage, 'id'>): ChatMessage {
        return this.addMessageToHistory(message);
    }

    /**
     * Get message count for current session
     */
    public getMessageCount(): number {
        return this.messageHistory.length;
    }

    /**
     * Check if there are any messages
     */
    public hasMessages(): boolean {
        return this.messageHistory.length > 0;
    }

    /**
     * Export message history (useful for debugging or user export)
     */
    public exportMessageHistory(): ChatHistory {
        return {
            messages: [...this.messageHistory],
            lastUpdated: new Date(),
            sessionId: this.currentSession?.session_id || 'unknown'
        };
    }
}

// Export a singleton instance
export const chatbotService = new ChatbotService();
export default ChatbotService;