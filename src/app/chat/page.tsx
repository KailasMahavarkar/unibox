"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Sparkles, Copy, Download, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { useSharedChat } from "@/hooks/use-shared-chat"
import Markdown from 'marked-react';

export default function ChatPage() {
  const [inputValue, setInputValue] = useState("")
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    messages,
    session,
    isLoading,
    error,
    sendMessage,
    startNewSession,
    exportHistory,
    triggerScroll
  } = useSharedChat()

  // Auto-scroll to bottom when messages change or loading state changes
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Register scroll callback with shared chat hook
  useEffect(() => {
    triggerScroll(scrollToBottom)
  }, [triggerScroll, scrollToBottom])

  // Also trigger scroll on messages/loading changes (backup)
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, scrollToBottom])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    await sendMessage(inputValue)
    setInputValue("")
  }

  const handleNewSession = () => {
    startNewSession()
    toast({
      title: "New Session Started",
      description: `Session ${session?.session_id.split('_')[1]} created successfully`,
    })
  }

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    })
  }

  const handleExportChat = () => {
    exportHistory()
    toast({
      title: "Chat Exported",
      description: "Chat history downloaded successfully",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Setu AI</h1>
                <p className="text-md text-gray-600">Ask me anything!</p>
                <div className="flex items-center gap-2">
                  {session && (
                    <Badge variant="outline" className="text-xs">
                      Session: {session.session_id.split('_')[1]}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              onClick={handleNewSession} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              New Session
            </Button>
            <Button onClick={handleExportChat} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-3xl ${message.isBot ? "mr-12" : "ml-12"}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.isBot ? "bg-white border border-gray-200 text-gray-800" : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <Markdown>{message.text}</Markdown>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 border-opacity-20">
                    <span className={`text-xs ${message.isBot ? "text-gray-500" : "text-blue-100"}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyMessage(message.text)}
                      className={`h-6 w-6 p-0 ${
                        message.isBot ? "hover:bg-gray-100" : "hover:bg-blue-700 text-blue-100"
                      }`}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl mr-12">
                <div className="p-4 rounded-2xl bg-white border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">Analyzing your question...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="max-w-md p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex gap-3">
            <Input
              placeholder="Ask about PFM APIs, authentication, consent management, banking/investment endpoints..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              className="flex-1 border-0 focus-visible:ring-0 text-base"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-6"
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
    </div>
  )
}