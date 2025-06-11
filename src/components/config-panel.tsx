"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  Settings,
  BarChart3,
  Eye,
  CreditCard,
  TrendingUp,
  PieChart,
  Wallet,
  Building,
  Target,
  Activity,
  DollarSign,
  Users,
  LineChart,
  ExternalLink,
  Megaphone,
  Component,
  ChevronRight,
  Code,
  Rocket,
  Share2,
  Receipt,
  Edit,
} from "lucide-react"

interface ConfigPanelProps {
  config: any
  onChange: (config: any) => void
  onGenerateUI?: () => void
  showUI?: boolean
  onShareConfig?: () => void
}

export default function ConfigPanel({
  config,
  onChange,
  onGenerateUI,
  showUI = false,
  onShareConfig,
}: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState("modules")

  const handleBrandingChange = (field: string, value: string) => {
    onChange({
      branding: {
        ...config.branding,
        [field]: value,
      },
    })
  }

  const handleModuleChange = (module: string, enabled: boolean) => {
    onChange({
      modules: {
        ...config.modules,
        [module]: enabled,
      },
    })
  }

  const handleInsightChange = (insight: string, enabled: boolean) => {
    onChange({
      insights: {
        ...config.insights,
        [insight]: enabled,
      },
    })
  }

  const handlePrivacyChange = (field: string, value: boolean) => {
    onChange({
      privacy: {
        ...config.privacy,
        [field]: value,
      },
    })
  }

  const handleUIChange = (field: string, value: boolean) => {
    onChange({
      ui: {
        ...config.ui,
        [field]: value,
      },
    })
  }

  const handleScheduleCall = () => {
    window.open("https://calendly.com/setu-team", "_blank")
  }

  const handleContinueOnBridge = () => {
    window.open("https://bridge.setu.co", "_blank")
  }

  const handleShareConfig = () => {
    if (onShareConfig) {
      onShareConfig()
    }
  }

  const handleNextTab = () => {
    if (activeTab === "modules") {
      setActiveTab("components")
    } else if (activeTab === "components") {
      setActiveTab("ui")
    }
  }

  const handleGenerateUI = () => {
    if (onGenerateUI) {
      onGenerateUI()
      setActiveTab("next-steps")
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="px-4 pt-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="modules" className="flex flex-col gap-1 py-2 px-2 text-xs">
              <Smartphone className="h-4 w-4" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="components" className="flex flex-col gap-1 py-2 px-2 text-xs">
              <Component className="h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex flex-col gap-1 py-2 px-2 text-xs">
              <Settings className="h-4 w-4" />
              UI
            </TabsTrigger>
            <TabsTrigger value="next-steps" className="flex flex-col gap-1 py-2 px-2 text-xs">
              <Rocket className="h-4 w-4" />
              Next Steps
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="modules" className="p-4 space-y-6 mt-0">
            <div>
              <h3 className="text-lg font-semibold mb-4">Feature Modules</h3>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-base">Banking</CardTitle>
                        <CardDescription className="text-sm">
                          Account balances, transactions, and spending insights
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Switch
                      checked={config.modules.banking}
                      onCheckedChange={(checked) => handleModuleChange("banking", checked)}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <CardTitle className="text-base">Investments</CardTitle>
                        <CardDescription className="text-sm">
                          Portfolio tracking, mutual funds, stocks, and ETFs
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Switch
                      checked={config.modules.investments}
                      onCheckedChange={(checked) => handleModuleChange("investments", checked)}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <Button onClick={handleNextTab} className="w-full bg-blue-600 hover:bg-blue-700">
                  Next: Configure Components
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="p-4 space-y-6 mt-0">
            <div>
              <h3 className="text-lg font-semibold mb-4">Components Configuration</h3>

              <Accordion type="multiple" className="space-y-4">
                {/* Overview Section */}
                <AccordionItem value="overview" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Overview</div>
                        <div className="text-sm text-gray-500">Main dashboard components</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid gap-4">
                      {/* Summary Card Preview */}
                      <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <DollarSign className="h-4 w-4 text-green-600 mt-1" />
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-2">Summary Card</div>
                            <div className="text-xs text-gray-500 mb-3">
                              Total assets overview with bank balance and investments
                            </div>
                            {/* Mini UI Preview */}
                            <div className="bg-white border rounded p-2 text-xs">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-blue-100 rounded flex items-center justify-center">
                                  <DollarSign className="h-2 w-2 text-blue-600" />
                                </div>
                                <div>
                                  <div className="text-gray-500">Total assets</div>
                                  <div className="font-bold">₹7.40L</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs border-t pt-2">
                                <div>
                                  <div className="text-gray-500">Bank balance</div>
                                  <div className="font-medium">₹2.10L</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Investments</div>
                                  <div className="font-medium">₹5.30L</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={config.insights.showSummaryCard}
                          onCheckedChange={(checked) => handleInsightChange("showSummaryCard", checked)}
                        />
                      </div>

                      {/* Cross Sell Banner */}
                      <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Megaphone className="h-4 w-4 text-orange-600 mt-1" />
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-2">Cross Sell Banner</div>
                            <div className="text-xs text-gray-500 mb-3">
                              Promotional banner for cross-selling products
                            </div>
                            {/* Mini UI Preview */}
                            <div className="bg-white border rounded p-2 text-xs">
                              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-2 rounded border-l-4 border-orange-500">
                                <div className="flex items-center gap-2">
                                  <Megaphone className="h-3 w-3 text-orange-600" />
                                  <div>
                                    <div className="font-bold text-orange-800">Get Personal Loan</div>
                                    <div className="text-orange-700">Up to ₹10L at 10.5% interest</div>
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs inline-block">
                                    Apply Now
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={config.insights.showCrossSellBanner}
                          onCheckedChange={(checked) => handleInsightChange("showCrossSellBanner", checked)}
                        />
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Banking Section - Only show if banking module is enabled */}
                {config.modules.banking && (
                  <AccordionItem value="banking" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-blue-600" />
                        <div className="text-left">
                          <div className="font-medium">Banking</div>
                          <div className="text-sm text-gray-500">Banking insights and analytics</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        {/* Banking Summary */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Wallet className="h-4 w-4 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Banking Summary</div>
                              <div className="text-xs text-gray-500 mb-3">Total balance card with quick actions</div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-blue-100 rounded flex items-center justify-center">
                                    <DollarSign className="h-2 w-2 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Total balance</div>
                                    <div className="font-bold">₹2,98,855.00</div>
                                  </div>
                                </div>
                                <div className="text-blue-600 text-center border-t pt-1">View all transactions →</div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.showBankingSummary}
                            onCheckedChange={(checked) => handleInsightChange("showBankingSummary", checked)}
                          />
                        </div>

                        {/* Transactions List */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Receipt className="h-4 w-4 text-purple-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Transactions List</div>
                              <div className="text-xs text-gray-500 mb-3">
                                Detailed transaction history with categories and filters
                              </div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="font-medium">UPI / DR / 2543634563 / Rzpy / Axis</div>
                                    <div className="text-gray-500">/ bescom@okaxis</div>
                                  </div>
                                  <div className="font-bold">₹55.00</div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-1">
                                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                      Select category
                                    </div>
                                    <Edit className="h-2 w-2 text-orange-600" />
                                  </div>
                                  <div className="text-gray-400 text-xs">1:11 PM</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.showTransactionsList}
                            onCheckedChange={(checked) => handleInsightChange("showTransactionsList", checked)}
                          />
                        </div>

                        {/* Bank Accounts List */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Building className="h-4 w-4 text-gray-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Bank Accounts List</div>
                              <div className="text-xs text-gray-500 mb-3">
                                Detailed list of all linked bank accounts
                              </div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="flex justify-between items-center mb-2">
                                  <div className="font-bold">Bank accounts</div>
                                  <div className="text-blue-600">+ Link more</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-900 rounded text-white text-xs flex items-center justify-center">
                                      K
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">Kotak Bank</div>
                                      <div className="text-gray-500">xx1611</div>
                                    </div>
                                    <div className="font-medium">₹2.98L</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                                      H
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">HDFC Bank</div>
                                      <div className="text-gray-500">Fetching</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.showBankAccountsList}
                            onCheckedChange={(checked) => handleInsightChange("showBankAccountsList", checked)}
                          />
                        </div>

                        {/* Spending Categories */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <PieChart className="h-4 w-4 text-orange-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Spending Categories</div>
                              <div className="text-xs text-gray-500 mb-3">Categorical spending breakdown pie chart</div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="font-bold mb-2">Spending categories</div>
                                <div className="flex items-center justify-center mb-2">
                                  <div className="w-12 h-12 border-4 border-blue-600 rounded-full flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="text-xs">Total</div>
                                      <div className="font-bold">₹2.25L</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-400"></div>
                                    <span>Utility: ₹60K</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-yellow-400"></div>
                                    <span>Food: ₹2K</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.spendingCategories}
                            onCheckedChange={(checked) => handleInsightChange("spendingCategories", checked)}
                          />
                        </div>

                        {/* Income & Expenses */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Activity className="h-4 w-4 text-green-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Income & Expenses</div>
                              <div className="text-xs text-gray-500 mb-3">Monthly income vs expenses bar chart</div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="font-bold mb-2">Income and expenses</div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500"></div>
                                    <span>Income</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500"></div>
                                    <span>Expense</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-end h-8">
                                  <div className="flex flex-col items-center">
                                    <div className="w-2 h-4 bg-green-500 mb-1"></div>
                                    <div className="w-2 h-2 bg-red-500 mb-1"></div>
                                    <div className="text-xs">Jan</div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-2 h-6 bg-green-500 mb-1"></div>
                                    <div className="w-2 h-3 bg-red-500 mb-1"></div>
                                    <div className="text-xs">Feb</div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-2 h-5 bg-green-500 mb-1"></div>
                                    <div className="w-2 h-4 bg-red-500 mb-1"></div>
                                    <div className="text-xs">Mar</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.incomeExpenses}
                            onCheckedChange={(checked) => handleInsightChange("incomeExpenses", checked)}
                          />
                        </div>

                        {/* Top 5 Transactions */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-4 w-4 text-purple-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Top 5 Transactions</div>
                              <div className="text-xs text-gray-500 mb-3">Highest spending transactions list</div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="font-bold mb-2">Top 5 transactions</div>
                                <div className="flex gap-1 mb-2">
                                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Payees</div>
                                  <div className="border px-2 py-1 rounded text-xs">Credit</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                                      J
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">JW Marriott Mumbai</div>
                                      <div className="text-gray-500">2 spends</div>
                                    </div>
                                    <div className="font-medium">₹40K</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                                      V
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">Vivanta by Taj</div>
                                      <div className="text-gray-500">1 spend</div>
                                    </div>
                                    <div className="font-medium">₹15K</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.topTransactions}
                            onCheckedChange={(checked) => handleInsightChange("topTransactions", checked)}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {/* Investment Section - Only show if investment module is enabled */}
                {config.modules.investments && (
                  <AccordionItem value="investment" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div className="text-left">
                          <div className="font-medium">Investment</div>
                          <div className="text-sm text-gray-500">Investment portfolio insights</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        {/* Investment Summary */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <DollarSign className="h-4 w-4 text-green-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Investment Summary</div>
                              <div className="text-xs text-gray-500 mb-3">Current portfolio value with returns</div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-green-100 rounded flex items-center justify-center">
                                    <TrendingUp className="h-2 w-2 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Current</div>
                                    <div className="font-bold">₹2.34L</div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <div className="text-gray-500">Returns</div>
                                    <div className="font-medium">
                                      ₹1.2L <span className="text-green-500">+23.45%</span>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-500">Invested</div>
                                    <div className="font-medium">₹1.32L</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.showInvestmentSummary}
                            onCheckedChange={(checked) => handleInsightChange("showInvestmentSummary", checked)}
                          />
                        </div>

                        {/* Investment Bifurcation */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <BarChart3 className="h-4 w-4 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Investment Bifurcation</div>
                              <div className="text-xs text-gray-500 mb-3">
                                Breakdown by mutual funds, stocks, and ETFs
                              </div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="font-bold mb-2">All your investments</div>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                    <div className="flex items-center gap-2">
                                      <BarChart3 className="h-3 w-3 text-blue-600" />
                                      <div>
                                        <div className="font-medium">Mutual funds</div>
                                        <div className="font-bold">₹2,05,655.23</div>
                                      </div>
                                    </div>
                                    <div>→</div>
                                  </div>
                                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                    <div className="flex items-center gap-2">
                                      <LineChart className="h-3 w-3 text-blue-600" />
                                      <div>
                                        <div className="font-medium">Stocks</div>
                                        <div className="font-bold">₹44,321.67</div>
                                      </div>
                                    </div>
                                    <div>→</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.showInvestmentBifurcation}
                            onCheckedChange={(checked) => handleInsightChange("showInvestmentBifurcation", checked)}
                          />
                        </div>

                        {/* Asset Split */}
                        <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <PieChart className="h-4 w-4 text-purple-600 mt-1" />
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-2">Asset Split</div>
                              <div className="text-xs text-gray-500 mb-3">Portfolio allocation pie chart</div>
                              {/* Mini UI Preview */}
                              <div className="bg-white border rounded p-2 text-xs">
                                <div className="font-bold mb-2">Split by asset</div>
                                <div className="flex items-center justify-center mb-2">
                                  <div className="w-12 h-12 border-4 border-blue-600 rounded-full flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="text-xs">Total</div>
                                      <div className="font-bold">₹2.25L</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-600"></div>
                                    <span>MF: 40%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-400"></div>
                                    <span>Stocks: 30%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-purple-500"></div>
                                    <span>ETFs: 10%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Switch
                            checked={config.insights.assetAllocation}
                            onCheckedChange={(checked) => handleInsightChange("assetAllocation", checked)}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>

              <div className="mt-8">
                <Button onClick={handleNextTab} className="w-full bg-blue-600 hover:bg-blue-700">
                  Next: Configure UI
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ui" className="p-4 space-y-6 mt-0">
            <div>
              <h3 className="text-lg font-semibold mb-4">UI Configuration</h3>

              <div className="space-y-6">
                {/* Branding Section */}
                <div>
                  <h4 className="text-base font-medium mb-4">Branding & Colors</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appName">App Name</Label>
                      <Input
                        id="appName"
                        value={config.branding.appName}
                        onChange={(e) => handleBrandingChange("appName", e.target.value)}
                        placeholder="Enter app name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={config.branding.primaryColor}
                          onChange={(e) => handleBrandingChange("primaryColor", e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={config.branding.primaryColor}
                          onChange={(e) => handleBrandingChange("primaryColor", e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={config.branding.secondaryColor}
                          onChange={(e) => handleBrandingChange("secondaryColor", e.target.value)}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={config.branding.secondaryColor}
                          onChange={(e) => handleBrandingChange("secondaryColor", e.target.value)}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* UI Settings */}
                <div>
                  <h4 className="text-base font-medium mb-4">UI Settings</h4>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-gray-600" />
                          <div>
                            <CardTitle className="text-base">Hide Numbers</CardTitle>
                            <CardDescription className="text-sm">
                              Mask all financial amounts for privacy
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Switch
                          checked={config.privacy?.hideNumbers || false}
                          onCheckedChange={(checked) => handlePrivacyChange("hideNumbers", checked)}
                        />
                      </CardContent>
                    </Card>

                  </div>
                </div>

                <div className="mt-8">
                  <Button onClick={handleGenerateUI} className="w-full bg-green-600 hover:bg-green-700">
                    Generate UI
                    <Smartphone className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="next-steps" className="p-4 space-y-6 mt-0">
            <div>
              <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
              <p className="text-gray-600 mb-6">Ready to integrate PFM APIs? Choose your preferred next step.</p>

              <div className="space-y-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleShareConfig}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Share2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-base">Share Demo</CardTitle>
                        <CardDescription className="text-sm">
                          Share this configured demo with your team or stakeholders
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Configuration
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleContinueOnBridge}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Code className="h-5 w-5 text-green-600" />
                      <div>
                        <CardTitle className="text-base">Start Integration on Bridge</CardTitle>
                        <CardDescription className="text-sm">
                          Access our developer platform for API keys, documentation, and testing
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="outline" className="w-full border-2">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to Bridge Platform
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
