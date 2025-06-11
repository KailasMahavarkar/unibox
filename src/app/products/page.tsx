"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Send,
  Sparkles,
  Shield,
  Zap,
  CreditCard,
  Receipt,
  FileText,
  Database,
  BarChart3,
  Building,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import ChatBot from "@/components/chatbot"
import { chatbotService } from "@/services/api/chatbot-service"

const dataProducts = [
  {
    id: "insights",
    name: "Personal Finance Management",
    icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
    comingSoon: false,
  },
  {
    id: "pan-verification",
    name: "PAN verification",
    icon: <Shield className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "penny-drop",
    name: "Penny Drop",
    icon: <Building className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "gst-verification",
    name: "GST verification",
    icon: <Receipt className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "account-aggregator",
    name: "Account Aggregator",
    icon: <Database className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "aadhaar-esign",
    name: "Aadhaar eSign",
    icon: <FileText className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "digilocker",
    name: "Digilocker",
    icon: <Database className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
]

const paymentProducts = [
  {
    id: "upi-deeplinks",
    name: "UPI Deeplinks",
    icon: <Zap className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "bbps-billpay-prebuilt",
    name: "BBPS BillPay Pre-built",
    icon: <CreditCard className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "bbps-billpay-api",
    name: "BBPS BillPay API",
    icon: <CreditCard className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
  {
    id: "bbps-billcollect",
    name: "BBPS BillCollect",
    icon: <Receipt className="h-6 w-6 text-gray-400" />,
    comingSoon: true,
  },
]

function ProductCard({ product }: { product: any }) {
  const isDisabled = product.comingSoon

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 h-32 w-full ${
        isDisabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
          : "border-gray-200 hover:shadow-md cursor-pointer hover:border-blue-300"
      }`}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDisabled ? "bg-gray-100" : "bg-blue-50"
            }`}
          >
            {product.icon}
          </div>
          {!product.comingSoon && (
            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors" />
          )}
        </div>

        <div className="flex-1 flex items-end">
          <div className="w-full">
            <h4 className={`font-medium text-sm leading-tight mb-1 ${isDisabled ? "text-gray-500" : "text-gray-900"}`}>
              {product.name}
            </h4>
            {product.comingSoon && <p className="text-xs text-gray-400">Coming Soon</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProductsPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your PFM API assistant. How can I help you today?",
      isBot: true,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Main Content - 70% */}
        <div className="flex-1 w-[70%] overflow-y-auto">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Setu Products</h1>
                <p className="text-gray-600">Explore our comprehensive suite of financial APIs</p>
              </div>
            </div>
          </header>

          {/* Products Content */}
          <main className="p-6">
            {/* Data Section - First */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data</h2>
              <div className="grid grid-cols-4 gap-4">
                {dataProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={product.comingSoon ? "#" : `/demo/${product.id}`}
                    className={product.comingSoon ? "cursor-not-allowed" : ""}
                    onClick={(e) => product.comingSoon && e.preventDefault()}
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Payments Section - Second */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payments</h2>
              <div className="grid grid-cols-4 gap-4">
                {paymentProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => (product.comingSoon ? null : (window.location.href = `/demo/${product.id}`))}
                    className={product.comingSoon ? "cursor-not-allowed" : "cursor-pointer"}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* AI Chat Panel - 30% */}
        <div className="w-[30%] bg-white border-l flex flex-col h-screen flex-shrink-0">
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">PFM API Assistant</h3>
                  <p className="text-sm text-gray-600">Expert on 29 PFM APIs</p>
                </div>
              </div>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="p-2">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get detailed answers about our PFM API Suite, integration guides, and technical specifications.
            </p>
            <Link href="/chat">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Full Chat Interface
              </Button>
            </Link>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.slice(-5).map((message) => (
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

          <div className="p-4 border-t flex-shrink-0">
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
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!inputValue.trim() || isLoading}
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

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  )
}
