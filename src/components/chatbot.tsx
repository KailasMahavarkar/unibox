"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Send, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSharedChat } from "@/hooks/use-shared-chat"
import Markdown from 'marked-react';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const {
        messages,
        isLoading,
        error,
        sendMessage,
        triggerScroll
    } = useSharedChat()

    // Auto-scroll to bottom when messages change
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

        const messageToSend = inputValue.trim()
        setInputValue("") // Clear input immediately for better UX

        try {
            await sendMessage(messageToSend)
        } catch (error) {
            // If sending fails, restore the input value
            setInputValue(messageToSend)
            console.error('Failed to send message:', error)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
            e.preventDefault()
            handleSendMessage()
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
                <div className="fixed bottom-24 right-6 w-[31.5rem] h-[36rem] bg-white rounded-xl shadow-xl border z-40 flex flex-col">
                    <div className="p-4 border-b bg-blue-600 text-white rounded-t-xl">
                        <h3 className="font-semibold">Setu AI</h3>
                        <p className="text-sm opacity-90">Ask me anything!</p>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                                <div
                                    className={`max-w-xs p-3 rounded-lg text-sm ${message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap ">
                                        <Markdown>{message.text}</Markdown>
                                    </div>
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

                        {/* Scroll target */}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask about PFM APIs..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
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