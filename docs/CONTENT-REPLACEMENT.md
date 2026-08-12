# Pre-launch content replacement

Do not publish unverified people, quotes, clients, outcomes, awards, or metrics.

## Testimonials

1. Edit `content/claims.ts`.
2. Replace the quote, full name, role, and company with approved source text.
3. Store written approval outside the repository.
4. Set `verified: true` only after approval.
5. Run `npm run build`; unverified entries remain hidden in production.

## Team

1. Edit `content/team.ts`.
2. Add only current, consenting members.
3. Use a real photo or omit `photoUrl`.
4. Confirm title and expertise with the person before release.

## Work and outcomes

Keep concept builds labelled as concepts. Add client names, logos, or outcome metrics only when disclosure and attribution are approved.
