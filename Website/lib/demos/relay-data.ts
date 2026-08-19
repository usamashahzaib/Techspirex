/**
 * Relay - deterministic demo data for the AI inbox-automation console at
 * /demos/relay (a Techspirex concept build).
 *
 * Relay simulates an AI layer that triages an incoming support inbox:
 * classifying each message, extracting structured fields, recommending an
 * action, and drafting a reply. There is no real model or backend - the
 * "analysis" is pre-authored per message so the demo is fully self-contained,
 * deterministic, and safe under a strict CSP. The point is to show the product
 * shape and interaction design of an automation console, not to run inference.
 */

export type Sentiment = "positive" | "neutral" | "negative";
export type Urgency = "low" | "medium" | "high";
export type ActionType = "auto-resolve" | "escalate" | "route";
export type MessageStatus = "new" | "triaged" | "resolved" | "escalated";

export type Entity = { label: string; value: string };

export type Analysis = {
  category: string;
  sentiment: Sentiment;
  intent: string;
  urgency: Urgency;
  confidence: number; // 0..1
  entities: Entity[];
  summary: string;
};

export type SuggestedAction = {
  type: ActionType;
  label: string;
  detail: string;
};

export type Message = {
  id: string;
  from: string;
  email: string;
  company: string;
  subject: string;
  receivedAgo: string;
  body: string;
  analysis: Analysis;
  action: SuggestedAction;
  /** Two drafted reply variants so "Regenerate" has something to show. */
  replies: [string, string];
  defaultStatus: MessageStatus;
};

/*
  `satisfies` rather than a `: Message[]` annotation: it still validates every
  entry against Message, but preserves the literal `id` strings so MessageId
  below is the actual union of IDs rather than plain `string`. That is what
  makes getMessage() total and lets the console drop its non-null assertion.
*/
export const MESSAGES = [
  {
    id: "m_8801",
    from: "Priya Raman",
    email: "priya@northloop.io",
    company: "Northloop",
    subject: "Charged twice for the Pro plan this month",
    receivedAgo: "4 min ago",
    body: "Hi - I just noticed two separate charges of $49 on my card for the Pro plan this month (May 3 and May 4). I've only got one account. Can you refund the duplicate? Invoice IDs are in_4471 and in_4478. Thanks.",
    analysis: {
      category: "Billing · Duplicate charge",
      sentiment: "negative",
      intent: "Request refund for a duplicate charge",
      urgency: "high",
      confidence: 0.96,
      summary:
        "Customer was billed twice for the same Pro subscription and is requesting a refund of the duplicate charge.",
      entities: [
        { label: "Plan", value: "Pro ($49/mo)" },
        { label: "Duplicate invoice", value: "in_4478" },
        { label: "Amount to refund", value: "$49.00" },
        { label: "Account", value: "priya@northloop.io" },
      ],
    },
    action: {
      type: "auto-resolve",
      label: "Auto-resolve: refund $49 duplicate",
      detail: "Matches the duplicate-charge policy (same plan, <72h apart). Safe to refund automatically and confirm.",
    },
    replies: [
      "Hi Priya,\n\nThanks for flagging this - you're right, invoice in_4478 was a duplicate of in_4471. I've refunded the extra $49.00 to your card; it should appear within 5-10 business days.\n\nI've also added a safeguard on your account to prevent same-day duplicate charges going forward. Sorry for the hassle, and let me know if the refund doesn't land.\n\nBest,\nThe Northloop team",
      "Hi Priya,\n\nApologies for the double charge. I've confirmed in_4478 was a duplicate and issued a $49.00 refund to your original payment method (5-10 business days to settle). Nothing else is needed on your end.\n\nIf you spot anything else on your statement that looks off, reply here and I'll take a look right away.\n\nThanks for your patience,\nSupport",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8802",
    from: "Marcus Bell",
    email: "marcus@pavewise.com",
    company: "Pavewise",
    subject: "CSV export button does nothing on Safari",
    receivedAgo: "22 min ago",
    body: "The 'Export CSV' button on the reports page doesn't do anything when I click it in Safari 17. Works fine in Chrome. No error shown, just nothing downloads. We rely on this for our weekly board pack.",
    analysis: {
      category: "Bug report · Export",
      sentiment: "neutral",
      intent: "Report a broken CSV export on Safari",
      urgency: "medium",
      confidence: 0.91,
      summary:
        "Reproducible bug: CSV export fails silently on Safari 17 but works in Chrome. Customer depends on it for weekly reporting.",
      entities: [
        { label: "Browser", value: "Safari 17" },
        { label: "Feature", value: "Reports → Export CSV" },
        { label: "Severity", value: "Blocks weekly workflow" },
      ],
    },
    action: {
      type: "route",
      label: "Route to Engineering + acknowledge",
      detail: "Reproducible bug with clear repro steps. Create a ticket for Engineering and send the customer an acknowledgement.",
    },
    replies: [
      "Hi Marcus,\n\nThanks for the clear report - that's a real bug on our side, not something on yours. The Safari download is being blocked before it starts; our engineering team is on it and I've linked your account to the ticket so you'll hear the moment it ships.\n\nIn the meantime, the export works in Chrome and Edge if you need this week's board pack out the door. I'll follow up here with a fix ETA by end of day.\n\nBest,\nSupport",
      "Hi Marcus,\n\nAppreciate the detail - Safari 17 specifically is the clue we needed. I've filed this with Engineering as a confirmed bug and flagged it as blocking your weekly report.\n\nQuick workaround until the fix lands: Chrome or Edge will export the same CSV correctly. I'll update this thread as soon as there's a patched build.\n\nThanks,\nThe team",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8803",
    from: "Elena Costa",
    email: "elena@hearthline.co",
    company: "Hearthline",
    subject: "How do I add teammates to my workspace?",
    receivedAgo: "38 min ago",
    body: "Just getting set up - where do I invite my team? I've got 4 people who need access before our kickoff on Monday.",
    analysis: {
      category: "Onboarding · How-to",
      sentiment: "positive",
      intent: "Learn how to invite teammates",
      urgency: "low",
      confidence: 0.98,
      summary: "New customer asking how to invite 4 teammates before a Monday kickoff. Standard onboarding question.",
      entities: [
        { label: "Topic", value: "Team invitations" },
        { label: "Seats needed", value: "4" },
        { label: "Deadline", value: "Monday kickoff" },
      ],
    },
    action: {
      type: "auto-resolve",
      label: "Auto-resolve: send how-to + docs link",
      detail: "High-confidence FAQ match. Send the step-by-step and link the docs; no human needed.",
    },
    replies: [
      "Hi Elena,\n\nWelcome aboard! You can invite your team in under a minute:\n\n1. Open Settings → Members\n2. Click \"Invite people\"\n3. Paste their emails (all four at once is fine) and pick a role\n4. Hit send - they'll get an email invite instantly\n\nInvites don't count against anything until they accept, so you're safe to send all four now ahead of Monday. Full guide here: docs.hearthline.co/team. Shout if anything's unclear!\n\nBest,\nSupport",
      "Hi Elena,\n\nGreat timing - here's how to get your four teammates in before kickoff:\n\nGo to Settings → Members → Invite people, add all four email addresses, choose their role, and send. They'll each get an invite link right away.\n\nHere's the walkthrough with screenshots: docs.hearthline.co/team. Have a great kickoff on Monday!\n\nCheers,\nThe team",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8804",
    from: "Tomas Novak",
    email: "tomas@quantiv.app",
    company: "Quantiv",
    subject: "Cancelling - too expensive for our stage",
    receivedAgo: "1 hr ago",
    body: "We need to cancel our Business subscription. It's a good product but the price is hard to justify at our current size. Please cancel before the next renewal on the 12th.",
    analysis: {
      category: "Cancellation · Price",
      sentiment: "negative",
      intent: "Cancel Business plan before renewal due to price",
      urgency: "high",
      confidence: 0.89,
      summary:
        "Churn risk: Business customer cancelling for price reasons before the renewal on the 12th. Candidate for a retention offer.",
      entities: [
        { label: "Plan", value: "Business ($99/mo)" },
        { label: "Reason", value: "Price / company stage" },
        { label: "Renewal date", value: "12th" },
      ],
    },
    action: {
      type: "escalate",
      label: "Escalate to Retention (do not auto-cancel)",
      detail: "Price-based churn with a renewal deadline. Route to a human with a suggested startup-tier offer before processing the cancellation.",
    },
    replies: [
      "Hi Tomas,\n\nTotally understand - cost has to match your stage. Before I process the cancellation, one option worth a look: we have a startup tier that keeps the features your team uses most at roughly half the Business price. Happy to move you onto it today if that helps.\n\nIf you'd still rather cancel, just say the word and I'll make sure it's done before the renewal on the 12th with no further charge. Either way, no pressure.\n\nBest,\nSupport",
      "Hi Tomas,\n\nThanks for the kind words, and I get it. I don't want you paying for more than you need - so two quick paths:\n\n1) I can drop you to our startup tier (about 50% less, keeps your core workflows), or\n2) I can cancel cleanly before the 12th so you're not charged again.\n\nLet me know which you'd prefer and I'll take care of it right away.\n\nCheers,\nThe team",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8805",
    from: "Nadia Haddad",
    email: "nadia@corely.com",
    company: "Corely",
    subject: "Can you add Slack notifications?",
    receivedAgo: "2 hr ago",
    body: "Would love to get alerts in Slack when a workflow fails, instead of email only. Is this on the roadmap? It'd save us checking the dashboard constantly.",
    analysis: {
      category: "Feature request · Integrations",
      sentiment: "positive",
      intent: "Request a Slack notification integration",
      urgency: "low",
      confidence: 0.94,
      summary: "Feature request for Slack failure alerts to replace email-only notifications. Common integration ask.",
      entities: [
        { label: "Requested integration", value: "Slack" },
        { label: "Trigger", value: "Workflow failure" },
        { label: "Current behavior", value: "Email only" },
      ],
    },
    action: {
      type: "route",
      label: "Log to product board + reply",
      detail: "Tag against the existing 'Slack integration' request, increment its vote count, and acknowledge the customer.",
    },
    replies: [
      "Hi Nadia,\n\nGreat suggestion - you're not the only one asking, so I've added your vote to our Slack integration request (it's on the roadmap, just not dated yet). I'll make sure you're notified the moment it ships.\n\nIn the meantime, if you use a workflow tool like Zapier or Make, our webhook on the 'workflow failed' event can post to Slack today - happy to send setup steps if that's useful.\n\nBest,\nSupport",
      "Hi Nadia,\n\nLove this - real-time failure alerts in Slack is exactly where we want to go. I've logged your request against our Slack integration item and flagged your use case (failure alerts specifically).\n\nUntil it's native, our failure webhook can push into Slack via Zapier/Make. Want me to send the quick guide?\n\nThanks for the nudge,\nThe team",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8806",
    from: "Kenji Sato",
    email: "kenji@orbitfin.com",
    company: "Orbitfin",
    subject: "API returning 429 since this morning",
    receivedAgo: "3 hr ago",
    body: "We're suddenly hitting rate limits (429s) on the /transactions endpoint since ~9am, but our volume hasn't changed. This is affecting our production sync. Did something change on your side?",
    analysis: {
      category: "Bug report · API / Rate limit",
      sentiment: "negative",
      intent: "Report unexpected 429 rate limiting affecting production",
      urgency: "high",
      confidence: 0.93,
      summary:
        "Production impact: customer hitting 429s on /transactions since 9am with no volume change. Possible platform-side rate-limit change.",
      entities: [
        { label: "Endpoint", value: "/transactions" },
        { label: "Error", value: "HTTP 429" },
        { label: "Onset", value: "~9:00am" },
        { label: "Impact", value: "Production sync" },
      ],
    },
    action: {
      type: "escalate",
      label: "Escalate to On-call (production impact)",
      detail: "Production-affecting, high urgency, likely platform-side. Page on-call immediately and acknowledge within SLA.",
    },
    replies: [
      "Hi Kenji,\n\nThanks for the fast report - production impact means this jumps the queue. I've paged our on-call engineer to check whether a rate-limit change on /transactions went out this morning. You should not be hitting 429s at your usual volume.\n\nI'll update you here within the hour with either a fix or a temporary limit increase on your account. Sorry for the disruption.\n\nBest,\nSupport",
      "Hi Kenji,\n\nUnderstood - a sudden 429 with flat volume points to something on our end. On-call is investigating now, and I'm requesting a temporary limit bump on your key so your production sync can recover while we confirm the root cause.\n\nStanding by; I'll post an update the moment I hear back.\n\nThanks for your patience,\nThe team",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8807",
    from: "Isla Whitfield",
    email: "isla@brightsend.com",
    company: "Brightsend",
    subject: "Loving the new dashboard!",
    receivedAgo: "5 hr ago",
    body: "Just wanted to say the redesigned dashboard is fantastic - so much easier to find what we need. The team noticed immediately. Keep it up!",
    analysis: {
      category: "Feedback · Praise",
      sentiment: "positive",
      intent: "Share positive feedback about the redesign",
      urgency: "low",
      confidence: 0.99,
      summary: "Unprompted positive feedback about the dashboard redesign. Good candidate for a testimonial / review ask.",
      entities: [
        { label: "Topic", value: "Dashboard redesign" },
        { label: "Signal", value: "Testimonial opportunity" },
      ],
    },
    action: {
      type: "auto-resolve",
      label: "Auto-resolve: thank + soft review ask",
      detail: "Positive, no issue to solve. Send a warm thanks and a light-touch request for a public review.",
    },
    replies: [
      "Hi Isla,\n\nThis made our day - thank you! The redesign was a big lift, so hearing it's landing with your team is exactly the feedback we hoped for.\n\nIf you'd ever be open to sharing a line or two publicly (even a short G2 review), it genuinely helps other teams find us - but zero pressure either way. Thanks again for taking the time to write.\n\nWarmly,\nThe team",
      "Hi Isla,\n\nReally appreciate you writing in - comments like this are what keep us shipping. So glad the new dashboard is making your team's day easier.\n\nNo ask attached to this, just gratitude. (Though if you're ever inclined to leave a public review, we'd be honored.) Thanks, Isla!\n\nBest,\nSupport",
    ],
    defaultStatus: "new",
  },
  {
    id: "m_8808",
    from: "Diego Reyes",
    email: "diego@vellum.dev",
    company: "Vellum",
    subject: "Need an invoice with our VAT number for accounting",
    receivedAgo: "6 hr ago",
    body: "Our finance team needs the last invoice reissued with our company VAT number (GB123456789) and registered address on it. Can you send an updated PDF?",
    analysis: {
      category: "Billing · Invoice request",
      sentiment: "neutral",
      intent: "Reissue last invoice with VAT number and address",
      urgency: "medium",
      confidence: 0.95,
      summary: "Routine finance request: reissue the latest invoice with a VAT number and registered address for accounting.",
      entities: [
        { label: "VAT number", value: "GB123456789" },
        { label: "Document", value: "Latest invoice (PDF)" },
        { label: "Requested by", value: "Finance team" },
      ],
    },
    action: {
      type: "auto-resolve",
      label: "Auto-resolve: update billing profile + reissue",
      detail: "Add the VAT number to the billing profile and regenerate the latest invoice PDF automatically.",
    },
    replies: [
      "Hi Diego,\n\nDone - I've added VAT number GB123456789 and your registered address to your billing profile, and reissued the latest invoice as a fresh PDF (attached). All future invoices will include these details automatically, so your finance team won't have to ask again.\n\nLet me know if they need any earlier invoices updated the same way.\n\nBest,\nSupport",
      "Hi Diego,\n\nHappy to help your finance team. Your VAT number (GB123456789) and address are now on file, and I've regenerated the most recent invoice with both included - the updated PDF is attached.\n\nJust say the word if you'd like prior invoices reissued too.\n\nThanks,\nThe team",
    ],
    defaultStatus: "new",
  },
] satisfies Message[];

/** The IDs that actually exist, not `string`. Selection state is typed with
 *  this, so an unknown ID is a compile error instead of a runtime crash. */
export type MessageId = (typeof MESSAGES)[number]["id"];

const BY_ID = new Map(MESSAGES.map((m) => [m.id, m as Message]));

/** Total by construction: MessageId can only name a message that exists. */
export function getMessage(id: MessageId): Message {
  const message = BY_ID.get(id);
  if (!message) {
    // Unreachable while MessageId is derived from MESSAGES. Kept as an honest
    // guard rather than a `!`, which would lie to the compiler instead.
    throw new Error(`Unknown message id: ${id}`);
  }
  return message;
}

/*
  The console's initial status map.

  Building a Record keyed on a union from an array needs one assertion -
  TypeScript cannot prove a `.map()` covered every key. Keeping it here, next to
  the data that makes it true, means it is stated once with its justification
  rather than repeated at each call site: MESSAGES is the sole source of both
  MessageId and these entries, so the keys are exhaustive by construction.
*/
export function defaultStatuses(): Record<MessageId, MessageStatus> {
  return Object.fromEntries(MESSAGES.map((m) => [m.id, m.defaultStatus])) as Record<
    MessageId,
    MessageStatus
  >;
}

/** Aggregate stats for the console header, derived from the message set. */
export function relayStats() {
  const total = MESSAGES.length;
  const autoResolvable = MESSAGES.filter((m) => m.action.type === "auto-resolve").length;
  const escalations = MESSAGES.filter((m) => m.action.type === "escalate").length;
  const avgConfidence =
    MESSAGES.reduce((a, m) => a + m.analysis.confidence, 0) / total;
  // Illustrative: ~6 min of human handling saved per auto-resolved message,
  // scaled to a weekly volume for the demo header.
  const weeklyVolume = 1240;
  const hoursSaved = Math.round(((autoResolvable / total) * weeklyVolume * 6) / 60);
  return {
    total,
    autoResolvePct: Math.round((autoResolvable / total) * 100),
    escalations,
    avgConfidencePct: Math.round(avgConfidence * 100),
    hoursSaved,
    weeklyVolume,
  };
}
