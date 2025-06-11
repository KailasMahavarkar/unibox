"use client"

import { useState } from "react"
import { ChevronLeft, MoreVertical, Eye, EyeOff, Search, Filter, ChevronRight, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MobilePreviewProps {
  config: any
  viewportSize: string
}

export default function MobilePreview({ config, viewportSize }: MobilePreviewProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [currentScreen, setCurrentScreen] = useState("main") // "main" or "transactions"
  const [localHideNumbers, setLocalHideNumbers] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("ALL")
  const [selectedMonth, setSelectedMonth] = useState("Jun 2023")
  const [selectedTransactionType, setSelectedTransactionType] = useState("Payees")
  const [showCrossSellBanner, setShowCrossSellBanner] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState("All accounts")
  const [selectedDateRange, setSelectedDateRange] = useState("Last 30 days")

  const { primaryColor, secondaryColor, appName, bankName, logo } = config.branding
  const hideNumbers = config.privacy?.hideNumbers || localHideNumbers
  const isDarkMode = config.ui?.darkMode || false
  const usePrebuiltUI = config.ui?.usePrebuiltUI !== false

  const maskAmount = (amount: string) => {
    if (!hideNumbers) return amount
    // Replace all numbers, commas, dots, and currency symbols with asterisks
    return amount.replace(/[₹\d,.LKM]/g, "*")
  }

  const handleEyeClick = () => {
    setLocalHideNumbers(!localHideNumbers)
  }

  const handleViewTransactions = () => {
    if (config.insights.showTransactionsList) {
      setCurrentScreen("transactions")
    }
  }

  const handleBackToMain = () => {
    setCurrentScreen("main")
  }

  // Get responsive dimensions based on viewport and screen size
  const getViewportStyles = () => {
    switch (viewportSize) {
      case "mobile":
        return {
          width: "min(360px, 90vw)",
          height: "min(640px, 80vh)",
          maxHeight: "80vh",
          transform: "scale(1)",
        }
      case "tablet":
        return {
          width: "min(768px, 85vw)",
          height: "min(1024px, 85vh)",
          maxHeight: "85vh",
          transform: "scale(0.8)",
          transformOrigin: "center center",
        }
      case "desktop":
        return {
          width: "min(1024px, 80vw)",
          height: "min(768px, 80vh)",
          maxHeight: "80vh",
          transform: "scale(0.7)",
          transformOrigin: "center center",
        }
      default:
        return {
          width: "min(360px, 90vw)",
          height: "min(640px, 80vh)",
          maxHeight: "80vh",
          transform: "scale(1)",
        }
    }
  }

  const viewportStyles = getViewportStyles()

  // If API-only mode is selected, show API responses instead of UI
  if (!usePrebuiltUI) {
    return (
      <div
        className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} rounded-lg overflow-hidden`}
        style={viewportStyles}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className={`${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
            <h3 className="text-lg font-semibold mb-2">API Response Mode</h3>
            <p className="text-sm opacity-75">Raw API responses for custom UI implementation</p>
          </div>

          <div className="space-y-4">
            {/* Account Summary API Response */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 border`}>
              <h4 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                GET /api/v1/overview
              </h4>
              <pre className={`text-xs ${isDarkMode ? "text-green-400" : "text-green-600"} overflow-x-auto`}>
                {JSON.stringify(
                  {
                    total_assets: hideNumbers ? "******" : "740000",
                    total_bank_balance: hideNumbers ? "******" : "210000",
                    total_investment_current_balance: hideNumbers ? "******" : "530000",
                    accounts: {
                      bank_accounts: [
                        {
                          fip_id: "KOTAK_BANK",
                          fip_name: "Kotak Mahindra Bank",
                          masked_account_number: "xx1611",
                          balance: hideNumbers ? "******" : "48000.00",
                          account_id: "acc_001",
                          fetch_status: "SUCCESS",
                        },
                      ],
                      investment_accounts: {
                        mutual_funds: [
                          {
                            amc: "Axis Mutual Fund",
                            current_value: hideNumbers ? "******" : "190000.00",
                            fund_name: "Axis Bluechip Fund",
                          },
                        ],
                      },
                    },
                    last_fetched: "2024-01-15T10:30:00Z",
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            {/* Banking Overview API Response */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 border`}>
              <h4 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                POST /api/v1/banking/overview
              </h4>
              <pre className={`text-xs ${isDarkMode ? "text-blue-400" : "text-blue-600"} overflow-x-auto`}>
                {JSON.stringify(
                  {
                    current_balance: hideNumbers ? "******" : "298855.00",
                    monthly_categorical_summary: [
                      {
                        month_year: "Jun 2023",
                        monthly_data: [
                          { category: "Utility", amount: hideNumbers ? "****" : 60000 },
                          { category: "Food", amount: hideNumbers ? "****" : 2000 },
                          { category: "Travel", amount: hideNumbers ? "****" : 50000 },
                        ],
                      },
                    ],
                    accounts: [
                      {
                        fip_name: "Kotak Mahindra Bank",
                        masked_account_number: "xx1611",
                        balance: hideNumbers ? "******" : "298855.00",
                        fetch_status: "SUCCESS",
                      },
                    ],
                  },
                  null,
                  2,
                )}
              </pre>
            </div>

            {/* Investment Overview API Response */}
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-4 border`}>
              <h4 className={`font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                GET /api/v1/investment/overview
              </h4>
              <pre className={`text-xs ${isDarkMode ? "text-purple-400" : "text-purple-600"} overflow-x-auto`}>
                {JSON.stringify(
                  {
                    total_current_amount: hideNumbers ? "******" : "234000",
                    total_invested_amount: hideNumbers ? "******" : "132000",
                    total_absolute_return_rate: hideNumbers ? "****" : "23.45",
                    mutual_funds: {
                      current_amount: hideNumbers ? "******" : "205655.23",
                      invested_amount: hideNumbers ? "******" : "180000",
                      absolute_return_rate: hideNumbers ? "****" : "14.25",
                    },
                    show_invested_value: true,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const themeClasses = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden border-8 border-gray-800 shadow-2xl ${themeClasses}`}
      style={viewportStyles}
    >
      {/* Status Bar */}
      <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center flex-shrink-0">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
          <span className="ml-2">100%</span>
          <div className="w-6 h-3 border border-white rounded-sm ml-1">
            <div className="w-full h-full bg-white rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* App Header */}
      <div className="flex items-center justify-between p-4 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-3">
          <ChevronLeft
            className="text-white"
            size={20}
            onClick={currentScreen === "transactions" ? handleBackToMain : undefined}
          />
          <h2 className="text-white font-medium text-lg">{appName}</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleEyeClick} className="p-1">
            {hideNumbers ? <EyeOff className="text-white" size={20} /> : <Eye className="text-white" size={20} />}
          </button>
          <MoreVertical className="text-white" size={20} />
        </div>
      </div>

      {/* Content based on current screen */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto">
          {currentScreen === "transactions" ? (
            <TransactionsScreen
              config={config}
              hideNumbers={hideNumbers}
              maskAmount={maskAmount}
              isDarkMode={isDarkMode}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              onBack={handleBackToMain}
            />
          ) : (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  config={config}
                  hideNumbers={hideNumbers}
                  maskAmount={maskAmount}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  isDarkMode={isDarkMode}
                  showCrossSellBanner={showCrossSellBanner}
                  setShowCrossSellBanner={setShowCrossSellBanner}
                />
              )}
              {activeTab === "banking" && (
                <BankingTab
                  config={config}
                  hideNumbers={hideNumbers}
                  maskAmount={maskAmount}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  selectedTransactionType={selectedTransactionType}
                  setSelectedTransactionType={setSelectedTransactionType}
                  isDarkMode={isDarkMode}
                  onViewTransactions={handleViewTransactions}
                />
              )}
              {activeTab === "investments" && (
                <InvestmentsTab
                  config={config}
                  hideNumbers={hideNumbers}
                  maskAmount={maskAmount}
                  isDarkMode={isDarkMode}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Only show on main screen */}
      {currentScreen === "main" && (
        <div
          className={`border-t flex justify-around p-3 flex-shrink-0 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <TabButton
            icon={<ClockIcon className={activeTab === "overview" ? "" : "text-gray-400"} />}
            label="Overview"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            color={primaryColor}
          />
          {config.modules.banking && (
            <TabButton
              icon={<BankIcon className={activeTab === "banking" ? "" : "text-gray-400"} />}
              label="Banking"
              active={activeTab === "banking"}
              onClick={() => setActiveTab("banking")}
              color={primaryColor}
            />
          )}
          {config.modules.investments && (
            <TabButton
              icon={<InvestmentIcon className={activeTab === "investments" ? "" : "text-gray-400"} />}
              label="Investments"
              active={activeTab === "investments"}
              onClick={() => setActiveTab("investments")}
              color={primaryColor}
            />
          )}
          <TabButton
            icon={<ProfileIcon className="text-gray-400" />}
            label="Profile"
            active={false}
            onClick={() => {}}
            color={primaryColor}
          />
        </div>
      )}
    </div>
  )
}

function TransactionsScreen({
  config,
  hideNumbers,
  maskAmount,
  isDarkMode,
  selectedAccount,
  setSelectedAccount,
  selectedDateRange,
  setSelectedDateRange,
  onBack,
}: any) {
  const { primaryColor } = config.branding
  const cardClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  const transactions = [
    {
      id: 1,
      merchant: "Blinkit",
      amount: "₹905.33",
      category: "Groceries",
      categoryIcon: "ShoppingCart",
      categoryColor: "orange",
      time: "1:11 PM",
    },
    {
      id: 2,
      merchant: "Groww technologies private limited",
      amount: "₹1,254.26",
      category: "Investments",
      categoryIcon: "TrendingUp",
      categoryColor: "orange",
      time: "1:11 PM",
    },
    {
      id: 3,
      merchant: "Setu technologies private limited",
      amount: "₹1,254.26",
      category: "Salary",
      categoryIcon: "Banknote",
      categoryColor: "green",
      time: "1:11 PM",
    },
    {
      id: 4,
      merchant: "Uber India Systems Private Ltd",
      amount: "₹324.50",
      category: "Transport",
      categoryIcon: "Car",
      categoryColor: "blue",
      time: "12:45 PM",
    },
    {
      id: 5,
      merchant: "Swiggy",
      amount: "₹450.75",
      category: "Food & Dining",
      categoryIcon: "UtensilsCrossed",
      categoryColor: "red",
      time: "1:30 PM",
    },
    {
      id: 6,
      merchant: "Amazon india private limited",
      amount: "₹1,254.26",
      category: "Shopping",
      categoryIcon: "Package",
      categoryColor: "purple",
      time: "11:20 AM",
    },
    {
      id: 7,
      merchant: "Netflix India",
      amount: "₹649.00",
      category: "Entertainment",
      categoryIcon: "Play",
      categoryColor: "pink",
      time: "10:15 AM",
    },
  ]

  const getCategoryColor = (categoryColor: string, primaryColor: string) => {
    switch (categoryColor) {
      case "orange":
        return `${primaryColor}20`
      case "green":
        return "#DCFCE7"
      case "blue":
        return "#DBEAFE"
      case "red":
        return "#FEE2E2"
      case "purple":
        return "#F3E8FF"
      case "pink":
        return "#FCE7F3"
      default:
        return `${primaryColor}20`
    }
  }

  const getCategoryTextColor = (categoryColor: string) => {
    switch (categoryColor) {
      case "orange":
        return "#EA580C"
      case "green":
        return "#16A34A"
      case "blue":
        return "#2563EB"
      case "red":
        return "#DC2626"
      case "purple":
        return "#9333EA"
      case "pink":
        return "#DB2777"
      default:
        return "#EA580C"
    }
  }

  const getCategoryIconColor = (categoryColor: string) => {
    switch (categoryColor) {
      case "orange":
        return "#EA580C"
      case "green":
        return "#16A34A"
      case "blue":
        return "#2563EB"
      case "red":
        return "#DC2626"
      case "purple":
        return "#9333EA"
      case "pink":
        return "#DB2777"
      default:
        return "#EA580C"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Transactions Header */}
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ChevronLeft className="cursor-pointer" onClick={onBack} />
          <h1 className="text-2xl font-bold flex-1 ml-2" style={{ color: primaryColor }}>
            Transactions
          </h1>
        </div>
      </div>

      {/* Account Selector */}
      <div className="mx-4 mb-4">
        <div className="relative">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className={`w-full p-3 border rounded-lg appearance-none bg-white ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "border-gray-300"}`}
            style={{ color: primaryColor }}
          >
            <option value="All accounts">All accounts</option>
            <option value="Kotak Bank">Kotak Bank</option>
            <option value="HDFC Bank">HDFC Bank</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Filter Icons */}
        <div className="flex justify-end gap-2 mt-2">
          <div className="flex items-center gap-1">
            <div
              className="rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              3
            </div>
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1 h-1" style={{ backgroundColor: primaryColor }}></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: primaryColor }}
            >
              3
            </div>
            <Filter size={20} style={{ color: primaryColor }} />
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="mx-4 mb-4 flex gap-2 overflow-x-auto">
        <Button
          variant={selectedDateRange === "Today" ? "default" : "outline"}
          className={`rounded-full px-6 whitespace-nowrap ${
            selectedDateRange === "Today"
              ? "text-white"
              : isDarkMode
                ? "bg-gray-800 text-gray-300"
                : "bg-white text-gray-700"
          }`}
          style={{
            backgroundColor: selectedDateRange === "Today" ? primaryColor : `${primaryColor}20`,
            borderColor: selectedDateRange === "Today" ? primaryColor : `${primaryColor}40`,
            color: selectedDateRange === "Today" ? "white" : primaryColor,
          }}
          onClick={() => setSelectedDateRange("Today")}
        >
          Today
        </Button>
        <Button
          variant={selectedDateRange === "This week" ? "default" : "outline"}
          className={`rounded-full px-6 whitespace-nowrap ${
            selectedDateRange === "This week"
              ? "text-white"
              : isDarkMode
                ? "bg-gray-800 text-gray-300"
                : "text-gray-700"
          }`}
          style={{
            backgroundColor: selectedDateRange === "This week" ? `${primaryColor}80` : `${primaryColor}20`,
            borderColor: selectedDateRange === "This week" ? `${primaryColor}80` : `${primaryColor}40`,
            color: selectedDateRange === "This week" ? "white" : primaryColor,
          }}
          onClick={() => setSelectedDateRange("This week")}
        >
          This week
        </Button>
        <Button
          variant={selectedDateRange === "This month" ? "default" : "outline"}
          className={`rounded-full px-6 whitespace-nowrap ${
            selectedDateRange === "This month"
              ? "text-white"
              : isDarkMode
                ? "bg-gray-800 text-gray-300"
                : "text-gray-700"
          }`}
          style={{
            backgroundColor: selectedDateRange === "This month" ? primaryColor : `${primaryColor}20`,
            borderColor: selectedDateRange === "This month" ? primaryColor : `${primaryColor}40`,
            color: selectedDateRange === "This month" ? "white" : primaryColor,
          }}
          onClick={() => setSelectedDateRange("This month")}
        >
          This month
        </Button>
      </div>

      {/* Date Header */}
      <div className="mx-4 mb-4">
        <h3 className="text-lg font-bold text-blue-900">29th Mar 2022</h3>
      </div>

      {/* Transactions List */}
      <div className="mx-4 space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className={`rounded-2xl p-4 shadow-sm border ${cardClasses}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-3">
                <div className="text-base font-semibold text-gray-900 leading-tight">{transaction.merchant}</div>
              </div>
              <div className="font-bold text-lg text-gray-900">{maskAmount(transaction.amount)}</div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  style={{
                    backgroundColor: getCategoryColor(transaction.categoryColor, primaryColor),
                    color: getCategoryTextColor(transaction.categoryColor),
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div
                      className="w-1 h-4 rounded-sm"
                      style={{
                        backgroundColor: getCategoryIconColor(transaction.categoryColor),
                      }}
                    ></div>
                  </div>
                  <span>{transaction.category}</span>
                </div>
              </div>
              <div className="text-sm text-gray-400">{transaction.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  )
}

function TabButton({ icon, label, active, onClick, color }: any) {
  return (
    <button className="flex flex-col items-center gap-1" onClick={onClick}>
      <div style={{ color: active ? color : "" }}>{icon}</div>
      <span className={`text-xs ${active ? "font-medium" : "text-gray-400"}`} style={{ color: active ? color : "" }}>
        {label}
      </span>
    </button>
  )
}

function OverviewTab({
  config,
  hideNumbers,
  maskAmount,
  selectedFilter,
  setSelectedFilter,
  isDarkMode,
  showCrossSellBanner,
  setShowCrossSellBanner,
}: any) {
  const { primaryColor } = config.branding
  const cardClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>
          Overview
        </h1>
      </div>

      {/* Cross Sell Banner - ICICI Style */}
      {config.insights.showCrossSellBanner && showCrossSellBanner && (
        <div className="mx-4 mb-4">
          <div
            className="p-4 rounded-2xl relative overflow-hidden"
            style={{ background: `linear-gradient(to right, ${primaryColor}10, ${primaryColor}20)` }}
          >
            <button
              onClick={() => setShowCrossSellBanner(false)}
              className="absolute top-3 right-3"
              style={{ color: `${primaryColor}80` }}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Decorative elements */}
            <div className="absolute top-2 right-8">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `${primaryColor}50` }}></div>
            </div>
            <div className="absolute bottom-4 right-12">
              <div className="w-2 h-2 rotate-45" style={{ backgroundColor: `${primaryColor}50` }}></div>
            </div>
            <div className="absolute bottom-8 right-6">
              <div className="w-3 h-3 rotate-45" style={{ backgroundColor: `${primaryColor}80` }}></div>
            </div>

            {/* Bank building illustration */}
            <div className="absolute right-4 top-4 opacity-20">
              <div className="flex items-end gap-1">
                <div className="w-3 h-8 rounded-t" style={{ backgroundColor: primaryColor }}></div>
                <div className="w-3 h-6 rounded-t" style={{ backgroundColor: primaryColor }}></div>
                <div className="w-3 h-10 rounded-t" style={{ backgroundColor: primaryColor }}></div>
                <div className="w-3 h-4 rounded-t" style={{ backgroundColor: primaryColor }}></div>
                <div className="w-3 h-7 rounded-t" style={{ backgroundColor: primaryColor }}></div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="font-bold" style={{ color: `${primaryColor}80` }}>
                ICICI Savings Account
              </h3>
              <p className="text-sm" style={{ color: `${primaryColor}80` }}>
                Enjoy seamless payments
              </p>
              <Button
                className="text-white rounded-xl px-6 py-2 text-sm font-medium"
                style={{ backgroundColor: primaryColor, color: "white" }}
              >
                Open your account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Total Assets Card */}
      {config.insights.showSummaryCard && (
        <div className={`mx-4 p-4 rounded-lg border mb-4 ${cardClasses}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: `${primaryColor}20` }}>
              <RupeesIcon style={{ color: primaryColor }} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total assets</div>
              <div className="text-2xl font-bold">{maskAmount("₹7.40L")}</div>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-4 border-t pt-4"
            style={{ borderColor: isDarkMode ? "#374151" : "#e5e7eb" }}
          >
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Bank balance</div>
              <div className="font-bold">{maskAmount("₹2.10L")}</div>
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Investments</div>
              <div className="font-bold">{maskAmount("₹5.30L")}</div>
            </div>
          </div>

          <Button variant="ghost" className="w-full mt-4 justify-center" style={{ color: primaryColor }}>
            + Link more accounts
          </Button>
        </div>
      )}

      {/* Linked Accounts */}
      {config.insights.showLinkedAccounts && (
        <div className="mx-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Linked accounts</h2>

          <div className="flex gap-2 overflow-x-auto mb-4">
            {["ALL", "BANK", "STOCKS", "ETF", "MUTUAL FUNDS"].map((filter) => (
              <Badge
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                className={`rounded-full px-4 cursor-pointer ${
                  selectedFilter === filter
                    ? "text-white border-0"
                    : isDarkMode
                      ? "bg-gray-800 border-gray-600 text-gray-300"
                      : "bg-white border-gray-300"
                }`}
                style={{
                  backgroundColor: selectedFilter === filter ? primaryColor : undefined,
                  borderColor: selectedFilter === filter ? primaryColor : undefined,
                  color:
                    selectedFilter === filter
                      ? "white"
                      : selectedFilter !== filter && !isDarkMode
                        ? primaryColor
                        : undefined,
                }}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search accounts"
              className={`pl-10 ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : ""}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter size={18} />
              </Button>
              <div
                className="rounded-full h-5 w-5 flex items-center justify-center text-white text-xs"
                style={{ backgroundColor: primaryColor }}
              >
                3
              </div>
            </div>
          </div>

          {/* Account Sections */}
          {(selectedFilter === "ALL" || selectedFilter === "BANK") && config.insights.showBankAccounts && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">BANK ACCOUNTS</h3>
              <AccountItem
                icon={<KotakIcon />}
                name="Kotak Mahindra Bank"
                accountNumber="xx1611"
                amount={maskAmount("₹48,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
              <AccountItem
                icon={<ICICIIcon />}
                name="ICICI Bank"
                accountNumber="xx1324"
                amount={maskAmount("₹4,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
              <AccountItem
                icon={<HDFCIcon />}
                name="HDFC Bank"
                accountNumber="xx1347"
                amount={maskAmount("₹7,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {(selectedFilter === "ALL" || selectedFilter === "STOCKS") && config.insights.showStocks && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">STOCKS</h3>
              <AccountItem
                icon={<GrowwIcon />}
                name="Groww"
                accountNumber="xx1334"
                amount={maskAmount("₹50,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
              <AccountItem
                icon={<HDFCIcon />}
                name="HDFC securities"
                accountNumber="xx1231"
                amount={maskAmount("₹50,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {(selectedFilter === "ALL" || selectedFilter === "ETF") && config.insights.showETF && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">ETF</h3>
              <AccountItem
                icon={<GrowwIcon />}
                name="Groww"
                accountNumber="xx1334"
                amount={maskAmount("₹2,00,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
              <AccountItem
                icon={<KotakIcon />}
                name="Kotak securities"
                accountNumber="xx1422"
                amount={maskAmount("₹50,000.00")}
                time="2 mins ago"
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {(selectedFilter === "ALL" || selectedFilter === "MUTUAL FUNDS") && config.insights.showMutualFunds && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">MUTUAL FUNDS</h3>
              <AccountItem
                icon={<AxisIcon />}
                name="Axis Mutual Fund"
                accountNumber="xx1614"
                amount={maskAmount("₹1,90,000.00")}
                time="15 mins ago"
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          <Button variant="ghost" className="w-full justify-center mb-4" style={{ color: primaryColor }}>
            Show more <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}

function BankingTab({
  config,
  hideNumbers,
  maskAmount,
  selectedMonth,
  setSelectedMonth,
  selectedTransactionType,
  setSelectedTransactionType,
  isDarkMode,
  onViewTransactions,
}: any) {
  const { primaryColor } = config.branding
  const cardClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ChevronLeft />
          <h1 className="text-2xl font-bold flex-1 ml-2">Banking</h1>
        </div>
      </div>

      {/* Total Balance Card */}
      {config.insights.showBankingSummary && (
        <div className={`mx-4 p-4 rounded-lg border mb-4 ${cardClasses}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded" style={{ backgroundColor: `${primaryColor}20` }}>
              <RupeesIcon style={{ color: primaryColor }} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total balance</div>
              <div className="text-xl font-bold">{maskAmount("₹2,98,855.00")}</div>
            </div>
          </div>

          {/* Only show the CTA if transactions list is enabled */}
          {config.insights.showTransactionsList && (
            <Button
              variant="ghost"
              className="w-full justify-center"
              style={{ color: primaryColor }}
              onClick={onViewTransactions}
            >
              View all transactions <ChevronRight size={16} />
            </Button>
          )}
        </div>
      )}

      {/* Bank Accounts */}
      {config.insights.showBankAccountsList && (
        <div className="mx-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Bank accounts</h2>
            <Button variant="ghost" size="sm" className="h-8" style={{ color: primaryColor }}>
              + Link more
            </Button>
          </div>

          <div className={`border rounded-lg p-4 mb-4 ${cardClasses}`}>
            <AccountItem
              icon={<KotakIcon />}
              name="Kotak Mahindra Bank"
              accountNumber="xx1611"
              amount={maskAmount("₹2,98,855.00")}
              time="15 mins ago"
              showBorder={false}
              isDarkMode={isDarkMode}
            />
            <AccountItem
              icon={<HDFCIcon />}
              name="HDFC Bank"
              accountNumber="xx1611"
              amount="Fetching"
              time=""
              showBorder={false}
              isDarkMode={isDarkMode}
            />
            <AccountItem
              icon={<IDFCIcon />}
              name="IDFC First Bank"
              accountNumber="xx1613"
              amount="Fetching"
              time=""
              showBorder={false}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* Spending Categories */}
      {config.insights.spendingCategories && (
        <div className="mx-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Spending categories</h2>
            <div className="flex items-center gap-2">
              <ClockIcon className="text-gray-400" size={16} />
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <div className="grid grid-cols-3 gap-0.5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-gray-300"></div>
                  ))}
                </div>
              </Button>
            </div>
          </div>

          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>Generated 2 min ago</div>

          <div className={`border rounded-lg p-4 mb-4 ${cardClasses}`}>
            <div className="flex justify-between items-center mb-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`text-sm font-medium bg-transparent border-none outline-none ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <option value="Jun 2023">Jun 2023</option>
                <option value="May 2023">May 2023</option>
                <option value="Apr 2023">Apr 2023</option>
              </select>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            <div className="relative h-48 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8" style={{ borderColor: primaryColor }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Total</div>
                  <div className="font-bold">{maskAmount("₹2,25,500")}</div>
                </div>
              </div>

              <div
                className={`absolute bottom-4 right-4 px-2 py-1 rounded text-xs border ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}
              >
                Travel: {maskAmount("₹50,000")}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: `${primaryColor}50` }}></div>
                <span>Utility: {maskAmount("₹60,000")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: `${primaryColor}50` }}></div>
                <span>Food: {maskAmount("₹2,000")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: `${primaryColor}80` }}></div>
                <span>Travel: {maskAmount("₹50,000")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: `${primaryColor}80` }}></div>
                <span>Sports: {maskAmount("₹500")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: `${primaryColor}50` }}></div>
                <span>Health: {maskAmount("₹10,000")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3" style={{ backgroundColor: `${primaryColor}20` }}></div>
                <span>Others: {maskAmount("₹85")}</span>
              </div>
            </div>

            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"} mt-2 text-center`}>
              Switch to table view to see smaller categories
            </div>
          </div>
        </div>
      )}

      {/* Income and Expenses */}
      {config.insights.incomeExpenses && (
        <div className="mx-4 mb-4">
          <h2 className="font-bold mb-2">Income and expenses</h2>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>Generated 2 min ago</div>

          <div className={`border rounded-lg p-4 mb-4 ${cardClasses}`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500"></div>
                <span className="text-xs">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500"></div>
                <span className="text-xs">Expense</span>
              </div>
            </div>

            <div className="h-40 relative mb-2">
              <div className="absolute left-0 bottom-0 w-full flex justify-between items-end h-full">
                <div className="flex flex-col items-center w-1/3">
                  <div className="h-20 w-6 bg-green-500 mb-1"></div>
                  <div className="h-10 w-6 bg-red-500 mb-1"></div>
                  <div className="text-xs">Jan 2023</div>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="h-32 w-6 bg-green-500 mb-1"></div>
                  <div className="h-16 w-6 bg-red-500 mb-1"></div>
                  <div className="text-xs">Feb 2023</div>
                </div>
                <div className="flex flex-col items-center w-1/3">
                  <div className="h-24 w-6 bg-green-500 mb-1"></div>
                  <div className="h-28 w-6 bg-red-500 mb-1"></div>
                  <div className="text-xs">Mar 2023</div>
                </div>
              </div>

              <div
                className={`absolute left-0 top-0 h-full flex flex-col justify-between text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <div>{maskAmount("₹75,000")}</div>
                <div>{maskAmount("₹50,000")}</div>
                <div>{maskAmount("₹25,000")}</div>
                <div>₹0</div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" size="sm" className="p-1">
                <ChevronLeft size={16} />
              </Button>
              <Button variant="ghost" size="sm" className="p-1">
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Top 5 Transactions */}
      {config.insights.topTransactions && (
        <div className="mx-4 mb-4">
          <h2 className="font-bold mb-2">Top 5 transactions</h2>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-2`}>Generated 2 min ago</div>

          <div className={`border rounded-lg p-4 mb-4 ${cardClasses}`}>
            <div className="flex justify-between items-center mb-4">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className={`text-sm font-medium bg-transparent border-none outline-none ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                <option value="Jun 2023">Jun 2023</option>
                <option value="May 2023">May 2023</option>
                <option value="Apr 2023">Apr 2023</option>
              </select>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            <div className="flex gap-2 mb-4">
              {["Credit", "Debit", "Payees"].map((type) => (
                <Badge
                  key={type}
                  className={`cursor-pointer ${
                    selectedTransactionType === type
                      ? "text-white"
                      : isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-orange-100 text-orange-800"
                  }`}
                  style={{
                    backgroundColor: selectedTransactionType === type ? primaryColor : undefined,
                  }}
                  onClick={() => setSelectedTransactionType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>

            <div className="space-y-4">
              <TransactionItem
                initial="J"
                name="JW Marriott Mumbai"
                details="2 spends"
                amount={maskAmount("₹40,000")}
                primaryColor={primaryColor}
              />
              <TransactionItem
                initial="V"
                name="Vivanta by Taj Cuffe Parade"
                details="1 spend"
                amount={maskAmount("₹15,000")}
                primaryColor={primaryColor}
              />
              <TransactionItem
                initial="T"
                name="Taj Mahal Palace Hotel"
                details="1 spend"
                amount={maskAmount("₹10,000")}
                primaryColor={primaryColor}
              />
              <TransactionItem
                initial="R"
                name="Radisson Blu"
                details="1 spend"
                amount={maskAmount("₹2,000")}
                primaryColor={primaryColor}
              />
              <TransactionItem
                initial="T"
                name="The Bombay Canteen"
                details="1 spend"
                amount={maskAmount("₹13,000")}
                primaryColor={primaryColor}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InvestmentsTab({ config, hideNumbers, maskAmount, isDarkMode }: any) {
  const { primaryColor } = config.branding
  const cardClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ChevronLeft />
          <h1 className="text-2xl font-bold flex-1 ml-2">Investments</h1>
        </div>
      </div>

      {/* Current Investment Card */}
      {config.insights.showInvestmentSummary && (
        <div className={`mx-4 p-4 rounded-lg border mb-4 ${cardClasses}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: `${primaryColor}20` }}>
              <InvestmentLeafIcon style={{ color: primaryColor }} />
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Current</div>
              <div className="text-2xl font-bold">{maskAmount("₹2.34L")}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Returns</div>
              <div className="font-bold flex items-center">
                {maskAmount("₹1.2L")} <span className="text-green-500 text-sm ml-1">{maskAmount("+23.45%")}</span>
              </div>
            </div>
            <div>
              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Invested</div>
              <div className="font-bold">{maskAmount("₹1.32L")}</div>
            </div>
          </div>

          <Button variant="ghost" className="w-full mt-4 justify-center" style={{ color: primaryColor }}>
            View all transactions <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* All Investments */}
      {config.insights.showInvestmentBifurcation && (
        <div className="mx-4 mb-4">
          <h2 className="text-xl font-bold mb-4">All your investments</h2>

          <div className="space-y-2">
            <div
              className="p-4 rounded-lg flex justify-between items-center cursor-pointer hover:opacity-80"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <div className="flex items-center gap-3">
                <BarChartIcon style={{ color: primaryColor }} />
                <div>
                  <div className="font-medium">Mutual funds</div>
                  <div className="font-bold">{maskAmount("₹2,05,655.23")}</div>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>

            <div
              className="p-4 rounded-lg flex justify-between items-center cursor-pointer hover:opacity-80"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <div className="flex items-center gap-3">
                <StocksIcon style={{ color: primaryColor }} />
                <div>
                  <div className="font-medium">Stocks</div>
                  <div className="font-bold">{maskAmount("₹44,321.67")}</div>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>

            <div
              className="p-4 rounded-lg flex justify-between items-center cursor-pointer hover:opacity-80"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <div className="flex items-center gap-3">
                <ETFIcon style={{ color: primaryColor }} />
                <div>
                  <div className="font-medium">ETFs</div>
                  <div className="font-bold">{maskAmount("₹23,456.34")}</div>
                </div>
              </div>
              <ChevronRight className="text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Asset Allocation */}
      {config.insights.assetAllocation && (
        <div className="mx-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Split by asset</h2>
            <ClockIcon style={{ color: primaryColor }} />
          </div>

          <div className="relative h-64 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-16" style={{ borderColor: primaryColor }}></div>
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center rounded-full p-3"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <div className="text-xs">Total</div>
                <div className="font-bold">{maskAmount("₹2,25,500")}</div>
              </div>
            </div>

            <div
              className={`absolute bottom-16 right-8 px-2 py-1 rounded text-xs border ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}
            >
              Stocks: {maskAmount("30%")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4" style={{ backgroundColor: primaryColor }}></div>
              <span>Mutual funds: {maskAmount("40%")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400"></div>
              <span>Stocks: {maskAmount("30%")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500"></div>
              <span>ETFs: {maskAmount("10%")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountItem({ icon, name, accountNumber, amount, time, showBorder = true, isDarkMode = false }: any) {
  const borderClass = showBorder ? (isDarkMode ? "border-b border-gray-700" : "border-b border-gray-200") : ""

  return (
    <div className={`flex items-center justify-between py-3 ${borderClass}`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
        >
          {icon}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{accountNumber}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{amount}</div>
        {time && <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{time}</div>}
        {!time && <div className={`text-xs italic ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Fetching</div>}
      </div>
    </div>
  )
}

function TransactionItem({ initial, name, details, amount, primaryColor }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: `${primaryColor}80` }}
        >
          {initial}
        </div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{details}</div>
        </div>
      </div>
      <div className="font-medium">{amount}</div>
    </div>
  )
}

// Icon components (keeping all the existing icon components)
function ClockIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function BankIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M8 9V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4" />
    </svg>
  )
}

function InvestmentIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function ProfileIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  )
}

function RupeesIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  )
}

function KotakIcon() {
  return (
    <div className="bg-blue-900 w-full h-full flex items-center justify-center text-white text-xs font-bold">K</div>
  )
}

function ICICIIcon() {
  return (
    <div className="bg-orange-500 w-full h-full flex items-center justify-center text-white text-xs font-bold">I</div>
  )
}

function HDFCIcon() {
  return <div className="bg-red-600 w-full h-full flex items-center justify-center text-white text-xs font-bold">H</div>
}

function IDFCIcon() {
  return (
    <div className="bg-teal-600 w-full h-full flex items-center justify-center text-white text-xs font-bold">I</div>
  )
}

function GrowwIcon() {
  return (
    <div className="bg-cyan-500 w-full h-full flex items-center justify-center text-white text-xs font-bold">G</div>
  )
}

function AxisIcon() {
  return <div className="bg-red-800 w-full h-full flex items-center justify-center text-white text-xs font-bold">A</div>
}

function BarChartIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

function StocksIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 16 6-6 4 4 6-6" />
      <path d="M22 12h-4v4" />
    </svg>
  )
}

function ETFIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  )
}

function InvestmentLeafIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 22c1.25-1.25 2.5-2.5 3.5-4 1.34-2 2-4.5 2-7 0-6-4-9-4-9s-4 3-4 9c0 2.5.66 5 2 7 1 1.5 2.25 2.75 3.5 4Z" />
      <path d="M18 22c1.25-1.25 2.5-2.5 3.5-4 1.34-2 2-4.5 2-7 0-6-4-9-4-9s-4 3-4 9c0 2.5.66 5 2 7 1 1.5 2.25 2.75 3.5 4Z" />
      <path d="M10 22c1.25-1.25 2.5-2.5 3.5-4 1.34-2 2-4.5 2-7 0-6-4-9-4-9s-4 3-4 9c0 2.5.66 5 2 7 1 1.5 2.25 2.75 3.5 4Z" />
    </svg>
  )
}
