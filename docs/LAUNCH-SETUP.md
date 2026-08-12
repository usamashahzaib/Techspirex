# Techspirex free launch setup

This is the beginner checklist for connecting the free services to the site. Do it in this order:

1. Deploy the site to Vercel.
2. Add the custom domain and wait until `https://techspirex.com` opens.
3. Create the accounts below.
4. Add the resulting values in Vercel project settings.
5. Redeploy.
6. Test the live forms and search tools.

Never put a secret in a GitHub file, a screenshot, or a `NEXT_PUBLIC_` variable. `NEXT_PUBLIC_` values are visible in the browser. Only the Turnstile site key, GA4 measurement ID, and search verification values are public by design.

## 1. Vercel

1. Open [vercel.com](https://vercel.com), sign in with GitHub, and import this repository.
2. Keep the detected framework as Next.js.
3. Deploy once.
4. Open `Project Settings > Domains`, add `techspirex.com` and `www.techspirex.com`, then follow Vercel's DNS instructions at your domain registrar.
5. Open `Project Settings > Environment Variables`. Add each value listed below for **Production**. Add them for **Preview** only if you want real integrations on preview URLs.
6. Redeploy after saving variables. Environment variable changes do not change an already running deployment.

## 2. Resend email

Resend sends contact notifications and the newsletter confirmation email.

1. Create an account at [resend.com](https://resend.com).
2. Open `Domains`, add `techspirex.com`, and copy the DNS records Resend gives you into your domain DNS. Wait until Resend shows the domain as verified.
3. Open `API Keys`, create a key with sending permission, and copy it once.
4. Open `Audiences`, create an audience named `Techspirex newsletter`, and copy its Audience ID.
5. Add these Vercel variables:

```text
RESEND_API_KEY=the_secret_key
CONTACT_NOTIFICATION_EMAIL=the_inbox_that_should_receive_briefs
RESEND_AUDIENCE_ID=the_audience_id
NEWSLETTER_FROM_EMAIL=Techspirex <hello@techspirex.com>
NEWSLETTER_CONFIRM_SECRET=generate_a_long_random_secret
```

`NEWSLETTER_CONFIRM_SECRET` must be at least 16 characters. Generate one with `openssl rand -base64 32`, or use a password manager's random generator. Do not reuse the Resend API key.

Test: submit `/contact` with a real email you control. Then submit the footer newsletter form and click the confirmation link in the email. The subscriber should only become active after confirmation.

## 3. Cloudflare Turnstile

Turnstile protects both forms from automated spam. It is free.

1. Open [Cloudflare dashboard](https://dash.cloudflare.com), select the account that owns the domain, and open `Turnstile`.
2. Create a widget named `Techspirex forms`.
3. Add `techspirex.com` and `www.techspirex.com` as hostnames.
4. Choose the managed widget mode.
5. Copy the **site key** and **secret key**.
6. Add them in Vercel:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY=the_public_site_key
TURNSTILE_SECRET_KEY=the_private_secret_key
```

Do not swap these two values. The site key is public. The secret key stays server side.

Test: open `/contact` in a private browser window and submit a valid brief. A successful submission must reach the Resend inbox. If Turnstile fails, the site keeps the lead safe and shows a direct email fallback.

## 4. Google Analytics 4

1. Open [analytics.google.com](https://analytics.google.com).
2. Create an account or choose the Techspirex account.
3. Create a property named `Techspirex`.
4. Choose `Web` as the data stream.
5. Enter `https://techspirex.com` and copy the Measurement ID, which starts with `G-`.
6. Add:

```text
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```

The site does not load GA4 until the visitor accepts analytics cookies. Test with the browser developer tools Network tab: before consent there should be no Google Analytics request; after consent, GA4 should appear.

## 5. Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console).
2. Click `Add property` and choose `Domain` if you control DNS. This verifies all protocol and subdomain variants.
3. Add `techspirex.com`.
4. Copy the TXT record Google provides into your domain DNS and click `Verify`.
5. Open `Sitemaps`, enter `sitemap.xml`, and click `Submit`.
6. Use `URL inspection` for `https://techspirex.com/`, `/services`, and `/services/staff-augmentation`, then request indexing if Google has not crawled them yet.

If you choose HTML tag verification instead, copy Google's content value into:

```text
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=the_content_value_only
```

Then redeploy. DNS verification is preferred because it does not depend on application code.

## 6. Bing Webmaster Tools

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) and sign in with the Google account used for Search Console.
2. Import the verified Search Console property when offered.
3. Open `Sitemaps` and submit `https://techspirex.com/sitemap.xml`.
4. Check `URL inspection` for the homepage and services pages.
5. After the first production deploy, run this from the repository root:

```text
npm run seo:indexnow
```

The repository already contains the public IndexNow key file and the script submits every URL in the live sitemap. Google does not use IndexNow, so Google sitemap submission remains a separate step.

## 7. Final live test

Check all of these after the final redeploy:

- `https://techspirex.com/robots.txt` opens and points to the sitemap.
- `https://techspirex.com/sitemap.xml` contains `/services/staff-augmentation`.
- Contact form email arrives in the Resend inbox.
- Newsletter confirmation email arrives and the confirmation link works once.
- Turnstile rejects obvious automated or invalid submissions.
- GA4 is absent before consent and present after consent.
- Search Console and Bing show no ownership, sitemap, or crawl errors.
- No API key appears in browser source, GitHub, or Vercel logs.

If an integration is not configured, the site keeps a direct email fallback instead of pretending that the action succeeded.
