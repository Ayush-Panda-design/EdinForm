"use client";

import { use } from "react";
import Link from "next/link";
import { trpc } from "~/trpc/client";
import { ArrowLeft, Eye, FileText, TrendingUp, Clock, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function FormAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: form } = trpc.forms.getById.useQuery({ id });
  const { data: analytics, isLoading } = trpc.analytics.getFormAnalytics.useQuery({
    formId: id,
    groupBy: "day",
  });

  const stats = [
    { label: "Total Views", value: analytics?.totalViews ?? 0, icon: Eye },
    { label: "Submissions", value: analytics?.totalSubmissions ?? 0, icon: FileText },
    { label: "Conversion Rate", value: analytics ? analytics.conversionRate.toFixed(1) + "%" : "0%", icon: TrendingUp },
    { label: "Avg Completion", value: analytics?.avgCompletionSeconds ? Math.round(analytics.avgCompletionSeconds) + "s" : "—", icon: Clock },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href={"/dashboard/forms/" + id + "/edit"} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Analytics — {form?.title}</h1>
          <p className="text-gray-500 text-sm mt-0.5">Last 30 days</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-violet-600" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <s.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {analytics?.dailyData && analytics.dailyData.length > 0 ? (
            <>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Views & Submissions</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.dailyData}>
                    <defs>
                      <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="subs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#8b5cf6" fill="url(#views)" name="Views" />
                    <Area type="monotone" dataKey="submissions" stroke="#10b981" fill="url(#subs)" name="Submissions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-6">Daily Conversion Rate (%)</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v: number) => [v.toFixed(1) + "%", "Conversion"]} />
                    <Bar dataKey="conversionRate" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Conversion %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No analytics data yet. Share your form to start collecting!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
