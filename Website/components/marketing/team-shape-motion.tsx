"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { trackEvent } from "@/lib/analytics/events";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function TeamShapeMotion({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackEvent("field_guide_view", { guide: "team_shape" });
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    const links = section.querySelectorAll<HTMLElement>("[data-guide-event]");
    const onClick = (event: Event) => {
      const name = (event.currentTarget as HTMLElement).dataset.guideEvent;
      if (name) trackEvent(name, { guide: "team_shape" });
    };

    observer.observe(section);
    links.forEach((link) => link.addEventListener("click", onClick));

    return () => {
      observer.disconnect();
      links.forEach((link) => link.removeEventListener("click", onClick));
    };
  }, []);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const copy = sectionRef.current?.querySelector<HTMLElement>(".team-shape-copy");
        const visual = sectionRef.current?.querySelector<HTMLElement>(".team-shape-visual");
        if (!copy || !visual) return;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top+=112",
          end: "bottom bottom-=96",
          pin: copy,
          pinSpacing: false,
        });

        gsap.fromTo(
          visual,
          { transform: "scale(0.88)", opacity: 0.28 },
          {
            transform: "scale(1)",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: visual,
              start: "top 88%",
              end: "top 44%",
              scrub: 0.6,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".team-shape-card").forEach((card) => {
          gsap.fromTo(
            card,
            { transform: "translateY(28px) scale(0.96)", opacity: 0.45 },
            {
              transform: "translateY(0) scale(1)",
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                end: "top 62%",
                scrub: 0.45,
              },
            },
          );
        });
      });

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-brand-paper text-brand-ink">
      {children}
    </section>
  );
}
