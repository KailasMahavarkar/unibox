"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { chatbotService } from '@/services/api/chatbot-service';
import { ChatMessage, ChatSession, SharedChatState, ChatSyncEvent } from '@/types/chatbot';

export interface UseSharedChatReturn {
  // State
  messages: ChatMessage[];
  session: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  lastSyncTimestamp: number;

  // Actions
  sendMessage: (message: string, forceNewSession?: boolean) => Promise<{ userMessage: ChatMessage; botMessage: ChatMessage; } | undefined>;
  startNewSession: () => void;
  clearMessages: () => void;
  endSession: () => void;

  // Utilities
  getMessageCount: () => number;
  hasMessages: () => boolean;
  exportHistory: () => void;
  triggerScroll: (scrollCallback?: () => void) => void;
}

/**
 * Custom hook for shared chat state management across all chat interfaces
 * Provides synchronized state and actions for all chat components
 */
export function useSharedChat(): UseSharedChatReturn {
  const [state, setState] = useState<SharedChatState>(() => {
    if (typeof window === 'undefined') {
      // Return a safe default state for SSR
      return {
        currentSession: null,
        messageHistory: [],
        isLoading: false,
        error: null,
        lastSyncTimestamp: Date.now()
      };
    }
    return chatbotService.getSharedChatState();
  });
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);
  const sendingRef = useRef(false); // Prevent race conditions
  const scrollCallbackRef = useRef<(() => void) | null>(null);

  // Sync state with chatbot service
  const syncState = useCallback(() => {
    if (!mountedRef.current) return;
    
    const newState = chatbotService.getSharedChatState();
    setState(newState);
  }, []);

  // Handle sync events from the service
  const handleSyncEvent = useCallback((event: ChatSyncEvent) => {
    if (!mountedRef.current) return;

    console.log('[useSharedChat] Sync event received:', event.type, event.payload);
    
    // Update state based on event type
    switch (event.type) {
      case 'MESSAGE_ADDED':
        syncState();
        // Trigger scroll when new message is added
        setTimeout(() => {
          if (scrollCallbackRef.current) {
            scrollCallbackRef.current();
          }
        }, 100); // Small delay to ensure DOM update
        break;
      case 'STATE_UPDATED':
      case 'SESSION_CHANGED':
      case 'MESSAGES_CLEARED':
        syncState();
        break;
      case 'LOADING_STARTED':
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        // Scroll when loading starts (for loading indicator)
        setTimeout(() => {
          if (scrollCallbackRef.current) {
            scrollCallbackRef.current();
          }
        }, 100);
        break;
      case 'LOADING_STOPPED':
        setState(prev => ({ ...prev, isLoading: false }));
        // Scroll when loading stops (response received)
        setTimeout(() => {
          if (scrollCallbackRef.current) {
            scrollCallbackRef.current();
          }
        }, 100);
        break;
      case 'ERROR_OCCURRED':
        setState(prev => ({ ...prev, isLoading: false, error: event.payload?.error || 'An error occurred' }));
        break;
    }
  }, [syncState]);

  // Send a message with proper race condition handling
  const sendMessage = useCallback(async (message: string, forceNewSession = false) => {
    if (!message.trim()) {
      setState(prev => ({ ...prev, error: 'Message cannot be empty' }));
      return;
    }

    // Prevent race conditions - only allow one message to be sent at a time
    if (sendingRef.current) {
      console.warn('Message already being sent, ignoring duplicate request');
      return;
    }

    sendingRef.current = true;

    try {
      const result = await chatbotService.sendMessage(message, forceNewSession);
      
      // Force a state sync after successful message sending
      syncState();
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      
      // Add error message to chat history only if it's not a network timeout
      if (!errorMessage.includes('timeout') && !errorMessage.includes('network')) {
        chatbotService.addMessage({
          text: `I'm sorry, I encountered an error: ${errorMessage}. Please try again.`,
          isBot: true,
          timestamp: new Date()
        });
      }
      
      // Clear error after 5 seconds to avoid permanent error states
      setTimeout(() => {
        if (mountedRef.current) {
          setState(prev => ({ ...prev, error: null }));
        }
      }, 5000);
      
      throw error;
    } finally {
      sendingRef.current = false;
    }
  }, [syncState]);

  // Start a new session with proper error handling
  const startNewSession = useCallback(() => {
    try {
      chatbotService.startNewSession();
      setState(prev => ({ ...prev, error: null }));
      // Emit event for cross-component sync
      chatbotService.emitSyncEvent('SESSION_CHANGED', { 
        sessionId: chatbotService.getSessionId() 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start new session';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // Clear messages with proper sync
  const clearMessages = useCallback(() => {
    try {
      chatbotService.clearMessageHistory();
      setState(prev => ({ ...prev, error: null }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear messages';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // End session with proper cleanup
  const endSession = useCallback(() => {
    try {
      chatbotService.endSession();
      setState(prev => ({ ...prev, error: null, currentSession: null }));
      // Emit event for cross-component sync
      chatbotService.emitSyncEvent('SESSION_CHANGED', { sessionId: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to end session';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // Get message count
  const getMessageCount = useCallback(() => {
    return chatbotService.getMessageCount();
  }, []);

  // Check if has messages
  const hasMessages = useCallback(() => {
    return chatbotService.hasMessages();
  }, []);

  // Export chat history with error handling
  const exportHistory = useCallback(() => {
    try {
      const history = chatbotService.exportMessageHistory();
      const chatText = history.messages
        .map((msg) => `${msg.isBot ? "AI" : "You"} (${msg.timestamp.toLocaleTimeString()}): ${msg.text}`)
        .join("\n\n");

      const blob = new Blob([chatText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `setu-pfm-api-chat-${history.sessionId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export history';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // Setup sync listener on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    mountedRef.current = true;
    
    // Subscribe to sync events
    unsubscribeRef.current = chatbotService.addSyncListener(handleSyncEvent);

    // Initial sync - get fresh state (no restoration from storage needed)
    syncState();

    return () => {
      mountedRef.current = false;
      sendingRef.current = false; // Reset sending flag on unmount
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [handleSyncEvent, syncState]);

  // Add initial welcome message if no messages exist (fresh state every page load)
  useEffect(() => {
    // Only run on client side and only if no messages exist
    if (typeof window === 'undefined' || state.messageHistory.length > 0) return;
    
    // Add default welcome message for fresh session
    chatbotService.addMessage({
      text: "Hi! I'm your AI assistant for Setu's PFM API Suite. I can help you with API questions, configuration settings, and product information. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    });
  }, [state.messageHistory.length]);

  // New utility for manual scroll triggering
  const triggerScroll = useCallback((scrollCallback?: () => void) => {
    if (scrollCallback) {
      // Register the scroll callback for future use
      scrollCallbackRef.current = scrollCallback;
    } else if (scrollCallbackRef.current) {
      // Trigger the registered scroll callback
      scrollCallbackRef.current();
    }
  }, []);

  return {
    // State
    messages: state.messageHistory,
    session: state.currentSession,
    isLoading: state.isLoading,
    error: state.error,
    lastSyncTimestamp: state.lastSyncTimestamp,

    // Actions
    sendMessage,
    startNewSession,
    clearMessages,
    endSession,

    // Utilities
    getMessageCount,
    hasMessages,
    exportHistory,
    triggerScroll,
  };
}

export default useSharedChat;