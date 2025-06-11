"use client"

import { useState } from "react"
import { ChevronLeft, MoreVertical, Eye, Search, Filter, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface PreviewPanelProps {
  config: any
}

export default function PreviewPanel({ config }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { primaryColor, appName, bankName, logo } = config.branding

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden border shadow-lg bg-white">
      {/* Header */}
      <div className="flex items-center p-4 gap-4" style={{ backgroundColor: primaryColor }}>
        <ChevronLeft className="text-white" />
        <h2 className="text-white font-medium flex-1">{appName}</h2>
        <div className="flex items-center gap-2">
          <Image
            src={logo || "/placeholder.svg?height=24&width=24"}
            alt={bankName}
            width={24}
            height={24}
            className="h-6"
          />
          <MoreVertical className="text-white" />
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "overview" && <OverviewTab config={config} />}
      {activeTab === "banking" && <BankingTab config={config} />}
      {activeTab === "investments" && <InvestmentsTab config={config} />}

      {/* Bottom Navigation */}
      <div className="mt-auto border-t flex justify-around p-3">
        <TabButton
          icon={<ClockIcon className={activeTab === "overview" ? "text-orange-500" : "text-gray-400"} />}
          label="Overview"
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
          color={primaryColor}
        />
        <TabButton
          icon={<BankIcon className={activeTab === "banking" ? "text-orange-500" : "text-gray-400"} />}
          label="Banking"
          active={activeTab === "banking"}
          onClick={() => setActiveTab("banking")}
          color={primaryColor}
        />
        <TabButton
          icon={<InvestmentIcon className={activeTab === "investments" ? "text-orange-500" : "text-gray-400"} />}
          label="Investments"
          active={activeTab === "investments"}
          onClick={() => setActiveTab("investments")}
          color={primaryColor}
        />
        <TabButton
          icon={<ProfileIcon className="text-gray-400" />}
          label="Profile"
          active={false}
          onClick={() => {}}
          color={primaryColor}
        />
      </div>
    </div>
  )
}

function TabButton({ icon, label, active, onClick, color }: any) {
  return (
    <button className="flex flex-col items-center gap-1" onClick={onClick}>
      {icon}
      <span className={`text-xs ${active ? "font-medium" : "text-gray-400"}`} style={{ color: active ? color : "" }}>
        {label}
      </span>
    </button>
  )
}

function OverviewTab({ config }: { config: any }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-between">
          Overview
          <Eye className="text-orange-500" />
        </h1>
      </div>

      {/* Total Assets Card */}
      <div className="mx-4 p-4 bg-white rounded-lg border mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded">
            <RupeesIcon className="text-green-600" />
          </div>
          <div>
            <div className="text-gray-600">Total assets</div>
            <div className="text-2xl font-bold">₹7.40L</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <div className="text-gray-600">Bank balance</div>
            <div className="font-bold">₹2.10L</div>
          </div>
          <div>
            <div className="text-gray-600">Investments</div>
            <div className="font-bold">₹5.30L</div>
          </div>
        </div>

        <Button variant="ghost" className="w-full mt-4 text-orange-500 justify-center">
          + Link more accounts
        </Button>
      </div>

      {/* Linked Accounts */}
      <div className="mx-4 mb-4">
        {/* <h2 className="text-xl font-bold mb-4">Linked accounts</h2> */}

        <div className="flex gap-2 overflow-x-auto mb-4">
          <Badge variant="outline" className="bg-orange-500 text-white border-orange-500 rounded-full px-4">
            ALL
          </Badge>
          <Badge variant="outline" className="bg-white border-orange-500 text-orange-500 rounded-full px-4">
            BANK
          </Badge>
          <Badge variant="outline" className="bg-white border-orange-500 text-orange-500 rounded-full px-4">
            STOCKS
          </Badge>
          <Badge variant="outline" className="bg-white border-orange-500 text-orange-500 rounded-full px-4">
            ETF
          </Badge>
          <Badge variant="outline" className="bg-white border-orange-500 text-orange-500 rounded-full px-4">
            MUTUAL FUNDS
          </Badge>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input placeholder="Search accounts" className="pl-10" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter size={18} />
            </Button>
            <div className="bg-orange-500 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs">
              3
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">BANK ACCOUNTS</h3>
          <AccountItem
            icon={<KotakIcon />}
            name="Kotak Mahindra Bank"
            accountNumber="xx1611"
            amount="₹48,000.00"
            time="2 mins ago"
          />
          <AccountItem
            icon={<ICICIIcon />}
            name="ICICI Bank"
            accountNumber="xx1324"
            amount="₹4,000.00"
            time="2 mins ago"
          />
          <AccountItem
            icon={<HDFCIcon />}
            name="HDFC Bank"
            accountNumber="xx1347"
            amount="₹7,000.00"
            time="2 mins ago"
          />
        </div>

        <Button variant="ghost" className="w-full text-orange-500 justify-center mb-4">
          Show more <ChevronRight size={16} />
        </Button>

        {/* Stocks */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">STOCKS</h3>
          <AccountItem icon={<GrowwIcon />} name="Groww" accountNumber="xx1334" amount="₹50,000.00" time="2 mins ago" />
          <AccountItem
            icon={<HDFCIcon />}
            name="HDFC securities"
            accountNumber="xx1231"
            amount="₹50,000.00"
            time="2 mins ago"
          />
        </div>

        {/* ETF */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">ETF</h3>
          <AccountItem
            icon={<GrowwIcon />}
            name="Groww"
            accountNumber="xx1334"
            amount="₹2,00,000.00"
            time="2 mins ago"
          />
          <AccountItem
            icon={<KotakIcon />}
            name="Kotak securities"
            accountNumber="xx1422"
            amount="₹50,000.00"
            time="2 mins ago"
          />
        </div>

        {/* Mutual Funds */}
        <div className="mb-4">
          <h3 className="font-bold mb-2">MUTUAL FUNDS</h3>
          <AccountItem
            icon={<AxisIcon />}
            name="Axis Mutual Fund"
            accountNumber="xx1614"
            amount="₹1,90,000.00"
            time="15 mins ago"
          />
        </div>
      </div>
    </div>
  )
}

function BankingTab({ config }: { config: any }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ChevronLeft />
          <h1 className="text-2xl font-bold flex-1 ml-2">Banking</h1>
          <Eye className="text-orange-500" />
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="mx-4 p-4 bg-white rounded-lg border mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-green-100 p-2 rounded">
            <RupeesIcon className="text-green-600" />
          </div>
          <div>
            <div className="text-gray-600">Total balance</div>
            <div className="text-xl font-bold">₹2,98,855.00</div>
          </div>
        </div>

        <Button variant="ghost" className="w-full text-orange-500 justify-center">
          View all transactions <ChevronRight size={16} />
        </Button>
      </div>

      {/* Bank Accounts */}
      <div className="mx-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Bank accounts</h2>
          <Button variant="ghost" size="sm" className="text-orange-500 h-8">
            + Link more
          </Button>
        </div>

        <div className="border rounded-lg p-4 mb-4">
          <AccountItem
            icon={<KotakIcon />}
            name="Kotak Mahindra Bank"
            accountNumber="xx1611"
            amount="₹2,98,855.00"
            time="15 mins ago"
            showBorder={false}
          />
          <AccountItem
            icon={<HDFCIcon />}
            name="HDFC Bank"
            accountNumber="xx1611"
            amount="Fetching"
            time=""
            showBorder={false}
          />
          <AccountItem
            icon={<IDFCIcon />}
            name="IDFC First Bank"
            accountNumber="xx1613"
            amount="Fetching"
            time=""
            showBorder={false}
          />
        </div>
      </div>

      {/* Spending Categories */}
      {config.insights.spendingCategories && (
        <div className="mx-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Spending categories</h2>
            <div className="flex items-center gap-2">
              <ClockIcon className="text-gray-400" size={16} />
              <Button variant="ghost" size="sm" className="text-gray-400 h-8 px-2">
                <div className="grid grid-cols-3 gap-0.5">
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                  <div className="w-2 h-2 bg-gray-300"></div>
                </div>
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mb-2">Generated 2 min ago</div>

          <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">Jun 2023</div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            <div className="relative h-48 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-teal-500"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="font-bold">₹2,25,500</div>
                </div>
              </div>

              {/* Pie chart segments would go here */}
              <div className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded text-xs border">Travel: ₹50,000</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-400"></div>
                <span>Utility: ₹60,000</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400"></div>
                <span>Food: ₹2,000</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600"></div>
                <span>Travel: ₹50,000</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-800"></div>
                <span>Sports: ₹500</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500"></div>
                <span>Health: ₹10,000</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400"></div>
                <span>Others: ₹85</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-2 text-center">Switch to table view to see smaller categories</div>
          </div>
        </div>
      )}

      {/* Income and Expenses */}
      {config.insights.incomeExpenses && (
        <div className="mx-4 mb-4">
          <h2 className="font-bold mb-2">Income and expenses</h2>
          <div className="text-xs text-gray-500 mb-2">Generated 2 min ago</div>

          <div className="border rounded-lg p-4 mb-4">
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
              {/* Bar chart would go here */}
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

              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                <div>₹75,000</div>
                <div>₹50,000</div>
                <div>₹25,000</div>
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
          <div className="text-xs text-gray-500 mb-2">Generated 2 min ago</div>

          <div className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">Jun 2023</div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>

            <div className="flex gap-2 mb-4">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Credit</Badge>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Debit</Badge>
              <Badge className="bg-orange-500 text-white hover:bg-orange-600">Payees</Badge>
            </div>

            <div className="space-y-4">
              <TransactionItem initial="J" name="JW Marriott Mumbai" details="2 spends" amount="₹40,000" />
              <TransactionItem initial="V" name="Vivanta by Taj Cuffe Parade" details="1 spend" amount="₹15,000" />
              <TransactionItem initial="T" name="Taj Mahal Palace Hotel" details="1 spend" amount="₹10,000" />
              <TransactionItem initial="R" name="Radisson Blu" details="1 spend" amount="₹2,000" />
              <TransactionItem initial="T" name="The Bombay Canteen" details="1 spend" amount="₹13,000" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InvestmentsTab({ config }: { config: any }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <ChevronLeft />
          <h1 className="text-2xl font-bold flex-1 ml-2">Investments</h1>
          <Eye className="text-orange-500" />
        </div>
      </div>

      {/* Current Investment Card */}
      <div className="mx-4 p-4 bg-white rounded-lg border mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-2 rounded">
            <InvestmentLeafIcon className="text-green-600" />
          </div>
          <div>
            <div className="text-gray-600">Current</div>
            <div className="text-2xl font-bold">₹2.34L</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-600">Returns</div>
            <div className="font-bold flex items-center">
              ₹1.2L <span className="text-green-500 text-sm ml-1">+23.45%</span>
            </div>
          </div>
          <div>
            <div className="text-gray-600">Invested</div>
            <div className="font-bold">₹1.32L</div>
          </div>
        </div>

        <Button variant="ghost" className="w-full mt-4 text-orange-500 justify-center">
          View all transactions <ChevronRight size={16} />
        </Button>
      </div>

      {/* All Investments */}
      <div className="mx-4 mb-4">
        <h2 className="text-xl font-bold mb-4">All your investments</h2>

        <div className="space-y-2">
          <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BarChartIcon className="text-orange-500" />
              <div>
                <div className="font-medium">Mutual funds</div>
                <div className="font-bold">₹2,05,655.23</div>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <StocksIcon className="text-orange-500" />
              <div>
                <div className="font-medium">Stocks</div>
                <div className="font-bold">₹44,321.67</div>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          <div className="bg-orange-50 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ETFIcon className="text-orange-500" />
              <div>
                <div className="font-medium">ETFs</div>
                <div className="font-bold">₹23,456.34</div>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Asset Allocation */}
      {config.insights.assetAllocation && (
        <div className="mx-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Split by asset</h2>
            <ClockIcon className="text-orange-500" />
          </div>

          <div className="relative h-64 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border-16 border-teal-500"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-blue-100 rounded-full p-3">
                <div className="text-xs">Total</div>
                <div className="font-bold">₹2,25,500</div>
              </div>
            </div>

            {/* Pie chart segments would go here */}
            <div className="absolute bottom-16 right-8 bg-white px-2 py-1 rounded text-xs border">Stocks: 30%</div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500"></div>
              <span>Mutual funds: 40%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400"></div>
              <span>Stocks: 30%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500"></div>
              <span>ETFs: 10%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountItem({ icon, name, accountNumber, amount, time, showBorder = true }: any) {
  return (
    <div className={`flex items-center justify-between py-3 ${showBorder ? "border-b" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">{icon}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{accountNumber}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium">{amount}</div>
        {time && <div className="text-xs text-gray-500">{time}</div>}
        {!time && <div className="text-xs text-gray-500 italic">Fetching</div>}
      </div>
    </div>
  )
}

function TransactionItem({ initial, name, details, amount }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center">
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

// Simple icon components
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
