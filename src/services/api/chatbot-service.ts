import axios, { AxiosResponse, AxiosError } from 'axios';
import { ChatbotApiRequest, ChatbotApiResponse, ChatbotServiceError } from '@/types/chatbot';

class ChatbotService {
  private readonly apiUrl = 'https://7hn0iksiy0.execute-api.ap-south-1.amazonaws.com/prod/chat';
  private readonly timeout = 30000; // 30 seconds timeout
  private readonly maxRetries = 3;

  /**
   * Send a message to the AWS PFM chatbot API
   */
  async sendMessage(message: string): Promise<string> {
    if (!message.trim()) {
      throw new Error('Message cannot be empty');
    }

    const requestPayload: ChatbotApiRequest = {
      message: message.trim()
    };

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
          // Handle different response formats from the API
          if (typeof response.data === 'string') {
            return response.data;
          }
          
          if (response.data.response) {
            return response.data.response;
          }
          
          // Fallback for unexpected response format
          return JSON.stringify(response.data);
        }

        throw new Error(`Unexpected response status: ${response.status}`);
        
      } catch (error) {
        lastError = this.handleError(error, attempt);
        
        // If it's the last attempt, throw the error
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        
        // Wait before retry (exponential backoff)
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw lastError!;
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
}

// Export a singleton instance
export const chatbotService = new ChatbotService();
export default ChatbotService;