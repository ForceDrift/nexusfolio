"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import {
  TrendingUp,
  Shield,
  BarChart3,
  PieChart,
  AlertTriangle,
  Lock,
  Activity,
  LineChart,
  Sparkles,
} from "lucide-react";

export function WobbleCardDemo() {
  return (
    <div className="bg-black w-full py-20 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Investment Solutions Card */}
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-lg rounded-xl">
        <CardContent className="p-8">
          <div className="mb-8 h-64 flex items-center justify-center relative">
            {/* Main central icon */}
            <div className="relative z-10">
              <div className="w-28 h-28 bg-black rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-pink-500" />
                <TrendingUp className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Surrounding icons with dotted connecting lines */}
            {/* Top left - AI sparkles */}
            <div className="absolute top-8 left-12">
              <div className="w-14 h-14 bg-white rounded-2xl border-2 border-gray-100 flex items-center justify-center shadow-md">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </div>
              <svg
                className="absolute top-10 left-10 w-20 h-20 pointer-events-none"
                style={{ transform: "translate(0, 0)" }}
              >
                <path
                  d="M 14 14 Q 30 30 45 45"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Top right - Pie chart */}
            <div className="absolute top-4 right-8">
              <div className="w-16 h-16 bg-white rounded-2xl border-2 border-gray-100 flex items-center justify-center shadow-md">
                <PieChart className="w-8 h-8 text-indigo-600" />
              </div>
              <svg
                className="absolute top-12 right-12 w-24 h-24 pointer-events-none"
                style={{ transform: "translate(0, 0)" }}
              >
                <path
                  d="M 16 16 Q 0 30 -20 50"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Bottom left - Line chart */}
            <div className="absolute bottom-6 left-8">
              <div className="w-12 h-12 bg-white rounded-xl border-2 border-gray-100 flex items-center justify-center shadow-md">
                <LineChart className="w-6 h-6 text-emerald-600" />
              </div>
              <svg
                className="absolute bottom-8 left-8 w-20 h-20 pointer-events-none"
                style={{ transform: "translate(0, 0)" }}
              >
                <path
                  d="M 12 12 Q 25 5 40 -10"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Bottom right - Colored dots */}
            <div className="absolute bottom-8 right-12 flex gap-1.5">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <div className="w-3 h-3 bg-indigo-500 rounded-full" />
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Investment Solutions</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Advanced portfolio management with AI-driven insights and real-time market analysis.
          </p>
        </CardContent>
      </Card>

      {/* Risk Management Card */}
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-lg rounded-xl">
        <CardContent className="p-8">
          <div className="mb-8 h-64 flex items-center justify-center relative">
            {/* Main shield icon */}
            <div className="relative z-10">
              <div
                className="w-32 h-36 bg-black rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-orange-500 to-pink-500" />
                <Lock className="w-12 h-12 text-white relative z-10" />
              </div>
            </div>

            {/* Top left - Alert triangle */}
            <div className="absolute top-6 left-10">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center shadow-md">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <svg className="absolute top-8 left-8 w-24 h-24 pointer-events-none">
                <path
                  d="M 12 12 Q 30 25 50 40"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Top right - Shield check */}
            <div className="absolute top-10 right-8">
              <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center shadow-md">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <svg className="absolute top-10 right-10 w-24 h-24 pointer-events-none">
                <path
                  d="M 14 14 Q 0 30 -25 50"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Bottom - Password dots */}
            <div className="absolute bottom-4 flex gap-2">
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
              <div className="w-2.5 h-2.5 bg-black rounded-full" />
            </div>

            {/* Bottom right - Key icon */}
            <div className="absolute bottom-6 right-6">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Risk Management</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Comprehensive risk assessment tools to protect and optimize your financial assets.
          </p>
        </CardContent>
      </Card>

      {/* Market Analytics Card */}
      <Card className="border border-slate-200 bg-white overflow-hidden shadow-lg rounded-xl">
        <CardContent className="p-8">
          <div className="mb-8 h-64 flex items-center justify-center relative">
            {/* Main bar chart icon */}
            <div className="relative z-10">
              <div className="w-28 h-28 bg-black rounded-3xl flex items-center justify-center shadow-xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 to-pink-500" />
                <BarChart3 className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Top - Notification badge */}
            <div className="absolute top-4 right-1/2 translate-x-1/2">
              <div className="w-16 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-lg" />
            </div>

            {/* Top left - Activity monitor */}
            <div className="absolute top-12 left-8">
              <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center shadow-md">
                <Activity className="w-7 h-7 text-violet-600" />
              </div>
              <svg className="absolute top-10 left-10 w-20 h-20 pointer-events-none">
                <path
                  d="M 14 14 Q 28 28 42 42"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Top right - Refresh/sync icon */}
            <div className="absolute top-8 right-6">
              <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <svg className="absolute top-8 right-8 w-24 h-24 pointer-events-none">
                <path
                  d="M 12 12 Q 0 25 -20 45"
                  stroke="#d1d5db"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  fill="none"
                />
              </svg>
            </div>

            {/* Bottom - Color indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full" />
              <div className="w-4 h-4 bg-lime-400 rounded-full" />
              <div className="w-4 h-4 bg-yellow-400 rounded-full" />
            </div>

            {/* Bottom left - Trend arrow */}
            <div className="absolute bottom-6 left-10">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-3">Market Analytics</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Real-time market data and predictive analytics to inform your investment decisions.
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
