export type ServiceFaq = { question: string; answer: string };

export type ServiceContent = {
  slug: string;
  name: string;
  flagship: boolean;
  tagline: string;
  heroSummary: string;
  problems: string[];
  deliverables: { title: string; detail: string }[];
  audience: string;
  credibility: string;
  scope: { model: string; detail: string }[];
  process: { title: string; detail: string }[];
  tools?: string[];
  faqs: ServiceFaq[];
};
