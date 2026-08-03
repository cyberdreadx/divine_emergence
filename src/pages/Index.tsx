import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Offerings from "@/components/Offerings";
import Breathwork from "@/components/Breathwork";
import Retreat from "@/components/Retreat";
import Mission from "@/components/Mission";
import Connect from "@/components/Connect";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const raf = requestAnimationFrame(() => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("section"));
      const targets = sections.slice(1); // skip hero
      targets.forEach((el) => el.classList.add("lux-reveal"));

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );

      targets.forEach((el) => io.observe(el));
      (window as any).__indexLuxIO = io;
    });

    return () => {
      cancelAnimationFrame(raf);
      const io = (window as any).__indexLuxIO as IntersectionObserver | undefined;
      io?.disconnect();
    };
  }, []);

  return (
    <div className="on-dark-bg de-backdrop min-h-screen relative">
      <Navbar />
      <Hero />
      <Story />
      <Offerings />
      <Breathwork />
      <Retreat />
      <Mission />
      <Connect />
      <Footer />
    </div>
  );
};

export default Index;
