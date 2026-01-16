import Link from "next/link";
import { HeroSection } from "~/components/HeroSection";
import { Header } from "~/components/Header";

export default async function IndexPage() {
  return (
   <main>
     <Header/>
     <HeroSection/>
   </main>
  );
}