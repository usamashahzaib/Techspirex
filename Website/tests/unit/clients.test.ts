import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { clients, clientSectors, clientsBySector } from "@/content/clients";
import { draftTestimonials, publishableTestimonials } from "@/content/claims";

describe("client portfolio data", () => {
  it("has unique slugs", () => {
    const slugs = clients.map((client) => client.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("places every client in a declared sector", () => {
    const grouped = clientsBySector().flatMap((sector) => sector.clients);
    expect(grouped).toHaveLength(clients.length);
    expect(clientSectors.every((sector) => clients.some((client) => client.sector === sector.id))).toBe(true);
  });

  it("only references logo files that exist", () => {
    for (const client of clients) {
      if (client.logo) expect(existsSync(join(process.cwd(), "public", client.logo.src))).toBe(true);
    }
  });

  it("gives every product a unique slug", () => {
    const slugs = clients.map((client) => client.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("testimonials", () => {
  it("publishes only approved quotes", () => {
    expect(publishableTestimonials).toEqual(draftTestimonials.filter((item) => item.verified));
  });
});
