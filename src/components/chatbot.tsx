"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { chatbotService } from "@/services/api/chatbot-service"

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant for Setu's PFM API Suite. I can help you with API questions, configuration settings, and product information. What would you like to know?",
      isBot: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize session when component opens for the first time
  useEffect(() => {
    if (isOpen) {
      // Ensure we have an active session when opening
      const session = chatbotService.getCurrentSession();
      console.log('ChatBot session initialized:', session?.session_id);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      // Call the real AWS PFM API with session management
      const botResponse = await chatbotService.sendMessage(inputValue)
      
      const response = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
      }
      
      setMessages(prev => [...prev, response])
    } catch (error) {
      console.error('Chatbot API error:', error)
      setError(error instanceof Error ? error.message : 'Failed to get response')
      
      // Add error message to chat
      const errorResponse = {
        id: messages.length + 2,
        text: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        isBot: true,
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-40"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-xl border z-40 flex flex-col">
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-xl">
            <h3 className="font-semibold">PFM API Assistant</h3>
            <p className="text-sm opacity-90">Ask about APIs & configurations</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.text}</div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs p-3 rounded-lg text-sm bg-gray-100 text-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-xs text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error indicator */}
            {error && (
              <div className="flex justify-center">
                <div className="max-w-xs p-2 rounded-lg text-xs bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  <span>Connection issue. Retrying...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about PFM APIs..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                className="flex-1 text-sm"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                disabled={!inputValue.trim() || isLoading}
                className="min-w-[40px]"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
