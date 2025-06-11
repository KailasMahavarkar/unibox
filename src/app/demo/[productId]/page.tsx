"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import ConfigPanel from "@/components/config-panel"
import MobilePreview from "@/components/mobile-preview"
import { ShareDialog } from "@/components/share-dialog"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Settings,
  Smartphone,
  Tablet,
  Monitor,
  PanelLeftClose,
  Code,
  Eye,
  Calendar,
  ChevronLeft,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ChatBot from "@/components/chatbot"

export default function DemoPage() {
  const params = useParams()
  const productId = params.productId as string
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showUI, setShowUI] = useState(false)
  const [showAPIStructure, setShowAPIStructure] = useState(false)
  const [selectedAPISequence, setSelectedAPISequence] = useState<number | null>(null)
  const [config, setConfig] = useState({
    branding: {
      primaryColor: "#f26522",
      secondaryColor: "#ffffff",
      appName: "iFinance",
      bankName: "ICICI Bank",
      logo: "/icici-logo.png",
    },
    modules: {
      banking: true,
      investments: true,
    },
    insights: {
      // Overview
      showSummaryCard: true,
      showCrossSellBanner: true,
      showLinkedAccounts: true,
      showBankAccounts: true,
      showStocks: true,
      showETF: true,
      showMutualFunds: true,
      // Banking
      showBankingSummary: true,
      showBankAccountsList: true,
      showTransactionsList: true, // New configuration option
      spendingCategories: true,
      incomeExpenses: true,
      topTransactions: true,
      // Investment
      showInvestmentSummary: true,
      showInvestmentBifurcation: true,
      assetAllocation: true,
    },
    privacy: {
      hideNumbers: false,
    },
    ui: {
      darkMode: false,
      usePrebuiltUI: true,
    },
  })
  const { toast } = useToast()
  const [viewportSize, setViewportSize] = useState<"mobile" | "tablet" | "desktop">("mobile")

  // Check if URL has collapsed parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("collapsed") === "true") {
      setIsPanelCollapsed(true)
    }

    // Load config from URL if present
    const configParam = urlParams.get("config")
    if (configParam) {
      try {
        const decodedConfig = JSON.parse(decodeURIComponent(configParam))
        setConfig(decodedConfig)
      } catch (error) {
        console.error("Failed to parse config from URL:", error)
      }
    }
  }, [])

  const handleConfigChange = (newConfig: any) => {
    setConfig({ ...config, ...newConfig })
  }

  const handleShareConfig = () => {
    setShowShareDialog(true)
  }

  const handleScheduleCall = () => {
    window.open("https://calendly.com/setu-team", "_blank")
  }

  const handleGenerateUI = () => {
    setShowUI(true)
    toast({
      title: "UI Generated!",
      description: "Your personalized PFM interface is now ready.",
    })
  }

  const handleToggleAPIStructure = () => {
    setShowAPIStructure(!showAPIStructure)
    setSelectedAPISequence(null)
  }

  const handleSequenceClick = (sequenceNumber: number) => {
    setSelectedAPISequence(sequenceNumber)
  }

  const handleBackToSequence = () => {
    setSelectedAPISequence(null)
  }

  // API sequence data
  const apiSequences = [
    {
      id: 1,
      title: "Session Management",
      description: "Create and manage user sessions",
      apis: [
        {
          method: "POST",
          endpoint: "/api/session",
          title: "Create Session",
          description: "API to create a session on PFM with AES-256 encryption",
          requestFormat: {
            mobileNumber: "string",
            panNumber: "string (optional)",
            customerId: "string (optional)",
            source: "string (optional)",
            landingPage: "string (optional)",
            expiry: "string (ISO8601 format) (optional)",
            shouldRefreshData: "boolean (optional)",
          },
          responseFormat: {
            data: "string (encrypted + URL encoded)",
          },
        },
        {
          method: "POST",
          endpoint: "/api/session/login",
          title: "Login",
          description: "API to login to the already created session",
          requestFormat: {
            data: "string (from Create Session response)",
          },
          responseFormat: {
            user_id: "int",
            session_id: "string",
            expiry: "string (ISO8601 format)",
            landing_page: "string",
            mobile_number: "string",
            consent_approved: "boolean",
            source: "string",
            id: "int",
            is_expired: "boolean",
            created_at: "string (ISO8601 format)",
            user: {
              id: "string",
              verified_pan: "boolean",
              customer_id: "string",
            },
            is_consent_approved: "boolean",
            version: "string",
          },
        },
        {
          method: "POST",
          endpoint: "/api/session/logout",
          title: "Logout",
          description: "API to logout from the current session",
          requestFormat: "None",
          responseFormat: {
            message: "string",
          },
        },
        {
          method: "POST",
          endpoint: "/api/session/refresh",
          title: "Refresh Session",
          description: "API to refresh and extend the validity of current session",
          requestFormat: "None",
          responseFormat: "Same as Login API",
        },
      ],
    },
    {
      id: 2,
      title: "User Management",
      description: "Get user profile and status information",
      apis: [
        {
          method: "GET",
          endpoint: "/api/user",
          title: "Get User",
          description: "API to get the overview of current status of the user about their consents and accounts",
          requestFormat: "None",
          responseFormat: {
            user: {
              banking_status: "FI_TYPE_SUMMARY_ENUM",
              investment_status: "FI_TYPE_SUMMARY_ENUM",
              id: "string",
              last_refresh: "string (ISO8601 format)",
              updated_at: "string (ISO8601 format)",
              created_at: "string (ISO8601 format)",
            },
            consents: "array of consent objects",
            accounts: "object with bank_accounts and investment_accounts",
          },
        },
        {
          method: "GET",
          endpoint: "/api/v1/profile",
          title: "Get Profile",
          description: "API to get details of the user profile",
          requestFormat: "None",
          responseFormat: {
            user: {
              name: "string",
              pan: "string (masked)",
              dob: "string (YYYY-MM-DD format)",
              mobile: "string (masked)",
              email: "string (email)",
            },
            accounts: "same as get user API",
            last_fetched: "string (ISO8601 format)",
          },
        },
      ],
    },
    {
      id: 3,
      title: "Consent Management",
      description: "Create and manage Account Aggregator consents",
      apis: [
        {
          method: "POST",
          endpoint: "/api/v1/banking/consent",
          title: "Create Banking Consent",
          description: "API to create a banking consent on Account Aggregator (DEPOSIT fi type)",
          requestFormat: {
            redirect_url: "string",
          },
          responseFormat: {
            url: "string (AA Gateway consent approval URL)",
            status: "string",
          },
        },
        {
          method: "POST",
          endpoint: "/api/v1/investment/consent",
          title: "Create Investment Consent",
          description: "API to create an investment consent (MUTUAL_FUNDS, EQUITIES and ETF fi types)",
          requestFormat: {
            redirect_url: "string",
          },
          responseFormat: {
            url: "string (AA Gateway consent approval URL)",
            status: "string",
          },
        },
        {
          method: "GET",
          endpoint: "/api/consent/{consent_handle}",
          title: "Get Consent",
          description: "API to get details of an existing consent on PFM",
          requestFormat: "None",
          responseFormat: {
            url: "string (redirect_url)",
            status: "string",
          },
        },
        {
          method: "POST",
          endpoint: "/api/consent/{consent_handle}/revoke",
          title: "Revoke Consent",
          description: "API to revoke an ACTIVE consent",
          requestFormat: "None",
          responseFormat: {
            message: "string",
            handle: "string",
          },
        },
        {
          method: "GET",
          endpoint: "/api/consent/manualrefresh",
          title: "Refresh Data",
          description: "API to trigger data refresh for all ACTIVE consents",
          requestFormat: "None",
          responseFormat: "None (asynchronous operation)",
        },
      ],
    },
    {
      id: 4,
      title: "Banking APIs",
      description: "Get banking data and generate reports",
      apis: [
        {
          method: "POST",
          endpoint: "/api/v1/banking/overview",
          title: "Get Banking Overview",
          description: "API to get overview of banking data of the user",
          requestFormat: {
            account_ids: "string[] (optional - empty for all accounts)",
          },
          responseFormat: {
            current_balance: "string",
            monthly_categorical_summary: "array",
            income_expense_trend: "array",
            top_five_transactions: "array",
            accounts: "array",
            last_fetched: "string (ISO8601 format)",
          },
        },
        {
          method: "POST",
          endpoint: "/api/v1/banking/transactions",
          title: "Get Banking Transactions",
          description: "API to get banking transactions of the user",
          requestFormat: {
            categories: "string[] (optional)",
            accountIds: "string[] (optional)",
            fromDate: "string (ISO8601 format) (optional)",
            toDate: "string (ISO8601 format) (optional)",
            orderBy: "asc | desc (optional)",
          },
          responseFormat: {
            accounts: "array",
            last_fetched: "string (ISO8601 format)",
            transactions: "array",
          },
        },
      ],
    },
    {
      id: 5,
      title: "Investment APIs",
      description: "Get investment portfolio and holdings data",
      apis: [
        {
          method: "GET",
          endpoint: "/api/v1/investment/overview",
          title: "Get Investment Overview",
          description: "API to get overview of investment data of all 3 FI types",
          requestFormat: "None",
          responseFormat: {
            total_current_amount: "string",
            total_invested_amount: "string",
            total_absolute_return_rate: "string",
            last_fetched: "string (ISO8601 format)",
            mutual_funds: "object with amounts and return rate",
            brokerages: "object with amounts and return rate",
            etfs: "object with amounts and return rate",
            show_invested_value: "boolean",
          },
        },
        {
          method: "GET",
          endpoint: "/api/v1/investment/mutualfund",
          title: "Get Mutual Fund Holdings",
          description: "API to get mutual fund holdings of the user",
          requestFormat: "None",
          responseFormat: {
            total_current_amount: "string",
            total_invested_amount: "string",
            total_absolute_return_rate: "string",
            last_fetched: "string (ISO8601 format)",
            holdings: "array of holding objects",
            show_invested_value: "boolean",
          },
        },
      ],
    },
    {
      id: 6,
      title: "Aggregate Data",
      description: "Get combined overview of all financial data",
      apis: [
        {
          method: "GET",
          endpoint: "/api/v1/overview",
          title: "Get Overview",
          description: "API to get overview of all FI data of the user",
          requestFormat: "None",
          responseFormat: {
            total_assets: "string",
            total_bank_balance: "string",
            total_investment_current_balance: "string",
            accounts: {
              bank_accounts: "array",
              investment_accounts: {
                mutual_funds: "array",
                brokerages: "array",
                etfs: "array",
              },
            },
            last_fetched: "string (ISO8601 format)",
          },
        },
      ],
    },
  ]

  // Only show Insights demo for now (renamed from PFM)
  if (productId !== "insights") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo Coming Soon</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            This product demo is currently under development. We're working hard to bring you an amazing experience.
          </p>
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
        <ChatBot />
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
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
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Personal Finance Management Demo</h1>
              <p className="text-sm text-gray-500">Interactive API demonstration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPanelCollapsed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPanelCollapsed(false)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleToggleAPIStructure} className="flex items-center gap-2">
              {showAPIStructure ? <Eye className="h-4 w-4" /> : <Code className="h-4 w-4" />}
              {showAPIStructure ? "View UI" : "API Structure"}
            </Button>
            <Button onClick={handleScheduleCall} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4" />
              Schedule Call
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Configuration Panel - Left Side - 30% */}
        {!isPanelCollapsed && (
          <div className="w-[30%] bg-white border-r flex flex-col shadow-sm">
            <div className="p-4 border-b flex justify-between items-center flex-shrink-0 bg-gray-50">
              <h2 className="font-semibold text-gray-900">Configuration</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPanelCollapsed(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConfigPanel
                config={config}
                onChange={handleConfigChange}
                onGenerateUI={handleGenerateUI}
                showUI={showUI}
                onShareConfig={handleShareConfig}
              />
            </div>
          </div>
        )}

        {/* Preview Panel - Right Side - 70% */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {showAPIStructure ? (
            // API Structure View
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  {selectedAPISequence === null ? (
                    // Sequence Overview
                    <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">PFM API Integration Sequence</h2>
                        <p className="text-gray-600">
                          Click on each step to view the detailed APIs and their request/response formats.
                        </p>
                      </div>

                      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-900 mb-2">Integration Flow</h3>
                        <p className="text-sm text-blue-800 mb-3">Follow this sequence for proper integration:</p>
                        <ol className="text-sm text-blue-800 space-y-1">
                          <li>1. Session Management → User Management</li>
                          <li>2. Consent Management → Data Refresh</li>
                          <li>3. Banking APIs → Investment APIs → Aggregate Data</li>
                        </ol>
                      </div>

                      <div className="grid gap-4">
                        {apiSequences.map((sequence) => (
                          <div
                            key={sequence.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                            onClick={() => handleSequenceClick(sequence.id)}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                {sequence.id}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{sequence.title}</h3>
                                <p className="text-sm text-gray-600">{sequence.description}</p>
                              </div>
                            </div>
                            <div className="text-sm text-blue-600 font-medium">
                              {sequence.apis.length} API{sequence.apis.length > 1 ? "s" : ""} →
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Detailed API View
                    <>
                      <div className="mb-6">
                        <Button
                          variant="ghost"
                          onClick={handleBackToSequence}
                          className="mb-4 text-blue-600 hover:text-blue-800"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Back to Sequence Overview
                        </Button>
                        {(() => {
                          const sequence = apiSequences.find((s) => s.id === selectedAPISequence)
                          return sequence ? (
                            <>
                              <h2 className="text-2xl font-bold text-gray-900 mb-2">{sequence.title}</h2>
                              <p className="text-gray-600 mb-6">{sequence.description}</p>
                              <div className="space-y-6">
                                {sequence.apis.map((api, index) => (
                                  <APICard
                                    key={index}
                                    method={api.method}
                                    endpoint={api.endpoint}
                                    title={api.title}
                                    description={api.description}
                                    requestFormat={api.requestFormat}
                                    responseFormat={api.responseFormat}
                                  />
                                ))}
                              </div>
                            </>
                          ) : null
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : showUI ? (
            // Mobile UI Preview
            <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-hidden">
              {/* Viewport Controls */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-sm border mb-4 sm:mb-6 flex-shrink-0">
                <Button
                  variant={viewportSize === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewportSize("mobile")}
                  className="flex items-center gap-2 px-3 sm:px-4"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Mobile</span>
                </Button>
                <Button
                  variant={viewportSize === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewportSize("tablet")}
                  className="flex items-center gap-2 px-3 sm:px-4"
                >
                  <Tablet className="h-4 w-4" />
                  <span className="hidden sm:inline">Tablet</span>
                </Button>
                <Button
                  variant={viewportSize === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewportSize("desktop")}
                  className="flex items-center gap-2 px-3 sm:px-4"
                >
                  <Monitor className="h-4 w-4" />
                  <span className="hidden sm:inline">Desktop</span>
                </Button>
              </div>

              {/* Mobile Preview Container */}
              <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
                <div className="h-full w-full flex items-center justify-center">
                  <MobilePreview config={config} viewportSize={viewportSize} />
                </div>
              </div>
            </div>
          ) : (
            // Configuration Instructions
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Configuring</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Use the configuration panel on the left to customize your Personal Finance Management interface.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        config={config}
        productId={productId}
      />

      {/* ChatBot */}
      <ChatBot />
    </div>
  )
}

function APICard({
  method,
  endpoint,
  title,
  description,
  requestFormat,
  responseFormat,
}: {
  method: string
  endpoint: string
  title: string
  description: string
  requestFormat?: any
  responseFormat?: any
}) {
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800"
      case "POST":
        return "bg-blue-100 text-blue-800"
      case "PATCH":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(method)}`}>{method}</span>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900">{title}</h4>
          </div>
          <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded mb-2 block">{endpoint}</code>
          <p className="text-sm text-gray-600 mb-3">{description}</p>

          {requestFormat && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-700 mb-1">Request Format:</h5>
              <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                {typeof requestFormat === "string" ? requestFormat : JSON.stringify(requestFormat, null, 2)}
              </pre>
            </div>
          )}

          {responseFormat && (
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-1">Response Format:</h5>
              <pre className="text-xs bg-gray-50 p-2 rounded border overflow-x-auto">
                {typeof responseFormat === "string" ? responseFormat : JSON.stringify(responseFormat, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
