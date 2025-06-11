"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, ChevronDown, TrendingUp, PieChart, Target, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const handleScheduleCall = () => {
    window.open("https://calendly.com/finance-api-team", "_blank")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Height */}
      <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-[90vh] flex items-center relative">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              Build Personal Finance Management with <span className="text-blue-600">Data-Driven Features</span>
            </h1>
            <div className="text-lg md:text-xl lg:text-2xl text-gray-900 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              <p>Transform customer financial data into actionable insights</p>
              <p>Drive revenue growth through intelligent cross-selling</p>
              <p>and enhanced customer engagement opportunities</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-14 min-w-[200px] rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Try it Out
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleScheduleCall}
                className="text-gray-700 hover:text-blue-600 px-8 py-6 text-lg h-14 min-w-[200px] rounded-xl transition-all"
              >
                <Calendar className="mr-3 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <ChevronDown className="h-8 w-8 text-gray-500" />
        </div>
      </div>

      {/* USP Cards in Bento Grid */}
      <div className="container mx-auto px-6 py-20 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto">
          {/* Real-Time Balance & Portfolio Tracking - Large Card (spans 3 columns) */}
          <div className="md:col-span-3 bg-gray-50 rounded-2xl p-10 border border-gray-100 h-80 relative overflow-hidden">
            <div className="mb-4">
              <div className="inline-block p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-blue-600 font-medium mb-2">REAL-TIME TRACKING</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Balance & Portfolio Tracking</h3>
            <p className="text-gray-600 max-w-md">
              Seamlessly monitor bank balances and investment portfolios across multiple accounts in real-time,
              providing comprehensive financial visibility.
            </p>
          </div>

          {/* Intelligent Spend Analysis - Medium Card (spans 3 columns) */}
          <div className="md:col-span-3 bg-gray-50 rounded-2xl p-10 border border-gray-100 h-80 relative overflow-hidden">
            <div className="mb-4">
              <div className="inline-block p-3 bg-purple-100 rounded-xl">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-purple-600 font-medium mb-2">SPEND ANALYSIS</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Intelligent Spend Analysis</h3>
            <p className="text-gray-600 max-w-md">
              Advanced transaction categorization with self-transfer detection, recurring payment identification, and
              counterparty analysis for actionable insights.
            </p>
          </div>

          {/* Smart Cross-Sell Nudges - Small Card (spans 2 columns) */}
          <div className="md:col-span-2 bg-gray-50 rounded-2xl p-10 border border-gray-100 h-80 relative overflow-hidden">
            <div className="mb-4">
              <div className="inline-block p-3 bg-orange-100 rounded-xl">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-orange-600 font-medium mb-2">CROSS-SELL</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Cross-Sell Nudges</h3>
            <p className="text-gray-600">
              Leverage financial behavior data to create targeted engagement campaigns based on customer analysis and
              spending patterns.
            </p>
          </div>

          {/* Comprehensive Cashflow Analytics - Large Card (spans 4 columns) */}
          <div className="md:col-span-4 bg-gray-50 rounded-2xl p-10 border border-gray-100 h-80 relative overflow-hidden">
            <div className="mb-4">
              <div className="inline-block p-3 bg-green-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-green-600 font-medium mb-2">CASHFLOW ANALYTICS</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Comprehensive Cashflow Analytics</h3>
            <p className="text-gray-600 max-w-lg">
              Track month-over-month trends in balances, income streams, spending patterns, and investment flows to
              provide complete financial health insights and predictive analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Logos */}
      <div className="container mx-auto px-6 py-16 border-t border-gray-200">
        <div className="text-center mb-10">
          <h3 className="text-xl font-semibold text-gray-700">Trusted by leading banks and brokers</h3>
        </div>
        <div className="flex justify-center items-center gap-16 md:gap-24">
          <div className="h-12 flex items-center">
            <svg
              width="120"
              height="48"
              viewBox="0 0 120 48"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <rect x="10" y="15" width="100" height="18" rx="2" fill="#FF6B35" />
              <text x="60" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                ICICI BANK
              </text>
            </svg>
          </div>
          <div className="h-12 flex items-center">
            <svg
              width="120"
              height="48"
              viewBox="0 0 120 48"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <rect x="10" y="15" width="100" height="18" rx="2" fill="#004C8F" />
              <text x="60" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                HDFC BANK
              </text>
            </svg>
          </div>
          <div className="h-12 flex items-center">
            <svg
              width="120"
              height="48"
              viewBox="0 0 120 48"
              className="opacity-80 hover:opacity-100 transition-opacity"
            >
              <rect x="10" y="15" width="100" height="18" rx="2" fill="#800080" />
              <text x="60" y="28" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                AXIS BANK
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
