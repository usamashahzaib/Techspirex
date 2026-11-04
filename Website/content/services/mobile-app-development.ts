import type { ServiceContent } from "./types";

export const mobileAppDevelopment: ServiceContent = {
  slug: "mobile-app-development",
  name: "Mobile app development",
  flagship: false,
  tagline: "iOS and Android apps, along with the backend they depend on.",
  heroSummary:
    "Mobile app development for iOS and Android, including the backend, admin tools, and integrations. Experience across marketplaces, healthcare, and fintech.",
  problems: [
    "The product needs two connected apps, such as rider and driver or patient and doctor, and the flows between them are not yet clear.",
    "An existing app is hard to change, and each release breaks something that used to work.",
    "The app works in a demo, but payments, messaging, or notifications are not ready for real users.",
  ],
  deliverables: [
    { title: "Consumer and business apps", detail: "Scoped around the core flow a user must complete, with accounts, payments, and notifications where the product needs them." },
    { title: "Multi-sided products", detail: "Connected apps for each side of a marketplace or service, with the shared backend and admin tools that run them." },
    { title: "Real-time and AI features", detail: "Chat, audio and video calling, location tracking, and AI-assisted features, built with the failure cases handled." },
    { title: "Release and handoff", detail: "App Store and Google Play submission, release builds, source access, and notes your team can operate from." },
  ],
  audience:
    "Founders and product teams building a mobile product, and businesses that need an existing app rebuilt or taken over.",
  credibility:
    "Our team has worked on mobile products including DADSS, Blushee, Nosghy, KaizenTeams, and Chorus Sleep. The work page lists them by sector.",
  scope: [
    { model: "Fixed scope first release", detail: "A defined first version with written acceptance criteria and a release plan." },
    { model: "Ongoing product team", detail: "Continued releases and feature work after launch, with the same people." },
    { model: "App takeover", detail: "A review of the existing code and release process, followed by stabilization and new work." },
  ],
  process: [
    { title: "Product and platform review", detail: "Map the core flows and decide between native and cross-platform before any build starts." },
    { title: "Build", detail: "Two-week sprints with test builds you can install and review on your own device." },
    { title: "Store release", detail: "Device testing, store submission, and support through review and first release." },
  ],
  faqs: [
    {
      question: "Native or cross-platform - how do you decide?",
      answer: "Based on the device features the product depends on, performance needs, budget, and who will maintain the app. We recommend one in the written scope and explain the trade-off.",
    },
    {
      question: "Do you handle App Store and Google Play submission?",
      answer: "Yes. We prepare release builds and handle submission and review responses. The store accounts should be in your company's name so you keep ownership of the listing.",
    },
    {
      question: "Can you take over an app another team built?",
      answer: "Yes, after reviewing the code and release process. You get a written view of what is safe to keep, what needs fixing, and in what order, before committing to new work.",
    },
    {
      question: "Do you also build the backend and admin tools?",
      answer: "Yes. Most mobile products need an API, an admin panel, and integrations such as payments, and we can scope them together with the app or connect to systems you already run.",
    },
  ],
};
