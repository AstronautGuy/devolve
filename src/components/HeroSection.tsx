"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";


export function HeroSection() {

  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate words
    const words = document.querySelectorAll<HTMLElement>(".word");
    words.forEach((word) => {
      const delay = parseInt(word.getAttribute("data-delay") || "0", 10);
      setTimeout(() => {
        word.style.animation = "word-appear 0.8s ease-out forwards";
      }, delay);
    });

    // Mouse gradient
    const gradient = gradientRef.current;
    function onMouseMove(e: MouseEvent) {
      if (gradient) {
        gradient.style.left = e.clientX - 192 + "px";
        gradient.style.top = e.clientY - 192 + "px";
        gradient.style.opacity = "1";
      }
    }
    function onMouseLeave() {
      if (gradient) gradient.style.opacity = "0";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    // Word hover effects
    words.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.style.textShadow = "0 0 20px rgba(200, 180, 160, 0.5)";
      });
      word.addEventListener("mouseleave", () => {
        word.style.textShadow = "none";
      });
    });

    // Click ripple effect
    function onClick(e: MouseEvent) {
      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = e.clientX + "px";
      ripple.style.top = e.clientY + "px";
      ripple.style.width = "4px";
      ripple.style.height = "4px";
      ripple.style.background = "rgba(200, 180, 160, 0.6)";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.pointerEvents = "none";
      ripple.style.animation = "pulse-glow 1s ease-out forwards";
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    }
    document.addEventListener("click", onClick);

    // Floating elements on scroll
    let scrolled = false;
    function onScroll() {
      if (!scrolled) {
        scrolled = true;
        document
          .querySelectorAll<HTMLElement>(".floating-element")
          .forEach((el, index) => {
            setTimeout(() => {
              el.style.animationPlayState = "running";
            }, index * 200);
          });
      }
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen dark:bg-gradient-to-br dark:from-[#1a1d18] dark:via-black dartk:o-[#2a2e26] light:bg-[#ffffff] text-[#e6e1d7] font-primary overflow-hidden relative w-full flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-60 -left-60 filter blur-3xl opacity-60
                   mix-blend-multiply dark:mix-blend-screen"
      >
        <Image
          src="/Infinity.svg"
          height={1000}
          width={1000}
          alt="infinity"
          aria-hidden
          draggable={false}
          className="rotate-[125deg] select-none"
        />
      </motion.div>

      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-60 -right-60 filter blur-3xl opacity-60
                   mix-blend-multiply dark:mix-blend-screen"
      >
        <Image
          src="/Infinity.svg"
          height={1000}
          width={1000}
          alt="infinity"
          aria-hidden
          draggable={false}
          className="rotate-[125deg] select-none"
        />
      </motion.div>

      <div className="relative z-10 p-8 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">Welcome to our site!
        </h1>
        <button
          className=" text-foreground py-2
                rounded-2xl flex items-center justify-between px-10
                backdrop-blur-md dark:bg-white/10 bg-black/10
                border dark:border-white/20 border-white/20
                shadow-lg shadow-black/10 transition-all duration-300"
        >
          <Link href="#">Click Here
          </Link>
        </button>
      </div>

      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="rgba(200,180,160,0.08)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <line
          x1="0"
          y1="20%"
          x2="100%"
          y2="20%"
          className="grid-line"
          style={{ animationDelay: "0.5s" }}
        />
        <line
          x1="0"
          y1="80%"
          x2="100%"
          y2="80%"
          className="grid-line"
          style={{ animationDelay: "1s" }}
        />
        <line
          x1="20%"
          y1="0"
          x2="20%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "1.5s" }}
        />
        <line
          x1="80%"
          y1="0"
          x2="80%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "2s" }}
        />
        <line
          x1="50%"
          y1="0"
          x2="50%"
          y2="100%"
          className="grid-line"
          style={{ animationDelay: "2.5s", opacity: 0.05 }}
        />
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          className="grid-line"
          style={{ animationDelay: "3s", opacity: 0.05 }}
        />
        <circle
          cx="20%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3s" }}
        />
        <circle
          cx="80%"
          cy="20%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.2s" }}
        />
        <circle
          cx="20%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.4s" }}
        />
        <circle
          cx="80%"
          cy="80%"
          r="2"
          className="detail-dot"
          style={{ animationDelay: "3.6s" }}
        />
        <circle
          cx="50%"
          cy="50%"
          r="1.5"
          className="detail-dot"
          style={{ animationDelay: "4s" }}
        />
      </svg>
    </div>
  );
}
