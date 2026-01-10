import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Header } from "~/components/Header";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="relative min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white">
        <Header/>

        {/* Decorative Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 py-20 text-center md:py-32">
          <div className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
            🚀 Innovating the Future
          </div>

          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
            Transforming Ideas into <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Digital Reality
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-slate-400 md:text-xl">
            Devfinity builds scalable software, stunning websites, and robust infrastructures.
            We turn complex problems into elegant solutions.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              className="rounded-lg bg-white px-8 py-3.5 text-lg font-semibold text-slate-900 hover:bg-slate-200 transition-colors"
              href="#contact"
            >
              Start a Project
            </Link>
            <Link
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-8 py-3.5 text-lg font-semibold text-white backdrop-blur-sm hover:bg-slate-800 transition-colors"
              href="#portfolio"
            >
              View Portfolio
            </Link>
          </div>
        </div>

        {/* Services / Features Grid */}
        <div id="services" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Our Expertise</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Service 1 */}
            <div className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-purple-500/50 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-purple-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-2xl text-purple-400">
                💻
              </div>
              <h3 className="text-2xl font-bold text-slate-100">Web Development</h3>
              <p className="text-slate-400">
                High-performance websites using Next.js, React, and modern CSS frameworks tailored to your brand.
              </p>
            </div>

            {/* Service 2 */}
            <div className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-blue-500/50 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-blue-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 text-2xl text-blue-400">
                ☁️
              </div>
              <h3 className="text-2xl font-bold text-slate-100">Cloud Solutions</h3>
              <p className="text-slate-400">
                Scalable backend architecture, database management, and serverless deployment strategies.
              </p>
            </div>

            {/* Service 3 */}
            <div className="group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 transition-all hover:border-pink-500/50 hover:bg-slate-800/50 hover:shadow-xl hover:shadow-pink-900/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/20 text-2xl text-pink-400">
                🎨
              </div>
              <h3 className="text-2xl font-bold text-slate-100">UI/UX Design</h3>
              <p className="text-slate-400">
                Intuitive, accessible, and beautiful interfaces designed to maximize user engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950 py-10 text-center text-slate-500">
          <p>© {new Date().getFullYear()} Devolve. All rights reserved.</p>
        </footer>

      </main>
    </HydrateClient>
  );
}