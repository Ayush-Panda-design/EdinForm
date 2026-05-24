"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Star,
  Users,
  Sparkles,
  Moon,
  Sun,
  ShieldCheck,
  MousePointerClick,
  Layers3,
  LayoutTemplate,
  Activity,
  ChevronRight,
  Play,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Persist theme globally
  useEffect(() => {
    const savedTheme = localStorage.getItem("formcraft-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("formcraft-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("formcraft-theme", "light");
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Dynamic Form Builder",
      desc: "Create advanced forms with validations, logic, required fields, and flexible layouts.",
    },
    {
      icon: Globe,
      title: "Public & Unlisted Forms",
      desc: "Publish forms publicly or keep them hidden with secure direct-link sharing.",
    },
    {
      icon: BarChart3,
      title: "Live Analytics",
      desc: "Track views, submissions, conversion rates, and completion performance in real time.",
    },
    {
      icon: ShieldCheck,
      title: "Spam Protection",
      desc: "Built-in rate limiting and validation protect your forms from abuse and spam.",
    },
    {
      icon: LayoutTemplate,
      title: "Premium Themes",
      desc: "Use beautiful themes inspired by gaming, anime, startups, and modern SaaS products.",
    },
    {
      icon: Users,
      title: "No Login Required",
      desc: "Respondents can instantly fill forms without creating accounts or signing in.",
    },
  ];

  const stats = [
    {
      label: "Forms Created",
      value: "12K+",
    },
    {
      label: "Responses Collected",
      value: "780K+",
    },
    {
      label: "Average Conversion",
      value: "71.9%",
    },
    {
      label: "Global Creators",
      value: "3.5K+",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create",
      desc: "Design stunning forms using flexible field types, validations, and themes.",
    },
    {
      number: "02",
      title: "Publish",
      desc: "Share forms publicly or keep them private with secure unlisted links.",
    },
    {
      number: "03",
      title: "Analyze",
      desc: "Track engagement, responses, and conversion metrics with live analytics.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-white text-gray-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/15" />

        <div className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/15" />

        <div className="absolute bottom-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/70 backdrop-blur-xl transition-colors dark:bg-black/40">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <span className="text-lg font-black text-white">F</span>
            </div>

            <div>
              <div className="text-lg font-bold">FormCraft</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Smart Form Platform
              </div>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/explore"
              className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              Explore
            </Link>

            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              Pricing
            </Link>

            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:scale-105 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <Link
              href="/auth/login"
              className="hidden rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900 sm:block"
            >
              Sign In
            </Link>

            <Link
              href="/auth/register"
              className="rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              Production-style Form Builder SaaS
            </div>

            <h1 className="mb-8 text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Build forms
              <br />

              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
                people actually
              </span>

              <br />
              enjoy filling.
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
              FormCraft helps creators build stunning forms, collect responses,
              analyze data, and scale workflows with a modern Typeform-style
              experience.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-violet-500/30 transition hover:scale-[1.02]"
              >
                Start Building
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-800 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                <Play className="h-5 w-5" />
                Explore Templates
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              {[
                "No credit card required",
                "Unlimited public forms",
                "Real-time analytics",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-indigo-500/20 blur-3xl" />

            <div className="relative rounded-[32px] border border-white/10 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:bg-zinc-950/80">
              {/* TOP BAR */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <div>
                  <div className="text-lg font-bold">
                    Product Feedback Survey
                  </div>

                  <div className="mt-1 text-sm text-gray-500">
                    Published • Public Form
                  </div>
                </div>

                <div className="rounded-xl bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400">
                  Live
                </div>
              </div>

              {/* QUESTIONS */}
              <div className="space-y-5">
                {[
                  "How would you rate your onboarding experience?",
                  "Which features do you use most frequently?",
                  "Would you recommend FormCraft to others?",
                ].map((question, index) => (
                  <div
                    key={question}
                    className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-black/40"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div className="font-semibold">{question}</div>
                    </div>

                    <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 ${
                          index === 0
                            ? "w-[90%]"
                            : index === 1
                            ? "w-[65%]"
                            : "w-[80%]"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* STATS */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  {
                    icon: Users,
                    label: "Responses",
                    value: "12,840",
                  },
                  {
                    icon: Activity,
                    label: "Conversion",
                    value: "71.9%",
                  },
                  {
                    icon: Clock3,
                    label: "Avg Time",
                    value: "2m 14s",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-black/40"
                  >
                    <item.icon className="mb-3 h-5 w-5 text-violet-500" />

                    <div className="text-xl font-bold">{item.value}</div>

                    <div className="text-sm text-gray-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-gray-200 bg-gray-50 py-16 dark:border-gray-900 dark:bg-zinc-950/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-black">{stat.value}</div>

              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/20 dark:text-violet-300">
              <Layers3 className="h-4 w-4" />
              Powerful Features
            </div>

            <h2 className="text-4xl font-black sm:text-5xl">
              Everything needed for
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                modern forms
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              From startups to communities, FormCraft helps teams create
              polished forms with enterprise-level UX.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10 dark:border-gray-800 dark:bg-zinc-950"
              >
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/5 blur-3xl transition group-hover:bg-violet-500/10" />

                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-4 text-2xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mb-6 leading-7 text-gray-600 dark:text-gray-300">
                    {feature.desc}
                  </p>

                  <div className="inline-flex items-center gap-2 font-semibold text-violet-600 dark:text-violet-400">
                    Learn more
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative border-y border-gray-200 bg-gray-50 py-28 dark:border-gray-900 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black sm:text-5xl">
              Launch forms in minutes
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              FormCraft keeps the workflow simple while giving you full power
              over your forms.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-[32px] border border-gray-200 bg-white p-10 dark:border-gray-800 dark:bg-black/40"
              >
                <div className="mb-8 text-7xl font-black text-violet-100 dark:text-violet-950">
                  {step.number}
                </div>

                <h3 className="mb-4 text-3xl font-bold">{step.title}</h3>

                <p className="leading-8 text-gray-600 dark:text-gray-300">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[40px] border border-violet-500/20 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-8 py-20 text-center shadow-2xl shadow-violet-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_40%)]" />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <TrendingUp className="h-4 w-4" />
                Trusted by creators worldwide
              </div>

              <h2 className="mx-auto max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
                Ready to create your next high-converting form?
              </h2>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-violet-100">
                Build forms, collect insights, and scale your workflow with
                FormCraft today.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-violet-700 transition hover:scale-[1.02]"
                >
                  Start Free
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-10 dark:border-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600">
              <span className="font-black text-white">F</span>
            </div>

            <div>
              <div className="font-bold">FormCraft</div>

              <div className="text-sm text-gray-500">
                Production Form Builder SaaS
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link href="/explore" className="hover:text-violet-500">
              Explore
            </Link>

            <Link href="/pricing" className="hover:text-violet-500">
              Pricing
            </Link>

            <Link href="/dashboard" className="hover:text-violet-500">
              Dashboard
            </Link>

            <Link href="/auth/login" className="hover:text-violet-500">
              Sign In
            </Link>
          </div>

          <div className="text-sm text-gray-500">
            © 2026 FormCraft. Built for modern creators.
          </div>
        </div>
      </footer>
    </div>
  );
}