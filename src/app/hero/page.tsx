import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/components/Header";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="relative min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white selection:bg-purple-500 selection:text-white transition-colors duration-300">

        {/* Header (ThemeToggle should be inside Header component) */}
        <Header />

        {/* Decorative Background Gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-400/20 dark:bg-purple-600/20 blur-[100px]" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px]" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 py-20 text-center md:py-32">
          <div className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-300 backdrop-blur-sm">
            🚀 Innovating the Future
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
            Transforming Ideas into <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Digital Reality
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-400 md:text-xl">
            Devolve builds scalable software, stunning websites, and robust
            infrastructures. We turn complex problems into elegant solutions.
          </p>
        </div>

        {/* Services */}
        <div id="services" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Our Expertise</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Web Dev */}
            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 p-8 transition-all hover:border-purple-500/50">
              <h3 className="text-2xl font-bold">Web Development</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                High-performance websites using Next.js and React.
              </p>
            </div>

            {/* AI & ML */}
            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 p-8 transition-all hover:border-blue-500/50">
              <h3 className="text-2xl font-bold">AI & ML</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Intelligent solutions using Python, TensorFlow, and neural networks.
              </p>
            </div>

            {/* UI/UX */}
            <div className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/50 p-8 transition-all hover:border-pink-500/50">
              <h3 className="text-2xl font-bold">UI/UX Design</h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Beautiful, intuitive interfaces that engage users.
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 text-center text-slate-600 dark:text-slate-500">
          © {new Date().getFullYear()} Devolve. All rights reserved.
        </footer>
      </main>
    </HydrateClient>
  );
}
