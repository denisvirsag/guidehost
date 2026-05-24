<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was already partially integrated — the packages (`posthog-js`, `posthog-node`), the `instrumentation-client.ts` initializer, the `PostHogProvider`, and the server-side `lib/posthog-server.ts` helper were all in place. This pass supplemented the existing coverage with 7 new events across 4 files, ensuring all major business actions are now tracked.

## Events summary

| Event | Description | File |
|-------|-------------|------|
| `user_signed_up` | *(existing)* User completes the signup form | `app/(auth)/signup/page.tsx` |
| `user_logged_in` | *(existing)* User submits the login form | `app/(auth)/login/page.tsx` |
| `property_created` | *(existing)* Host creates a new property | `app/actions/properties.ts` |
| `property_updated` | Host saves changes to an existing property | `app/actions/properties.ts` |
| `property_deleted` | Host permanently deletes a property | `app/actions/properties.ts` |
| `guide_published` | *(existing)* Host publishes or unpublishes a guide | `app/dashboard/guides/[id]/GuideEditorClient.tsx` |
| `guide_section_added` | *(existing)* Host adds a new section to a guide | `app/dashboard/guides/[id]/GuideEditorClient.tsx` |
| `guide_section_deleted` | Host deletes a section from a guide | `app/dashboard/guides/[id]/GuideEditorClient.tsx` |
| `guide_section_saved` | Host saves section content edits | `app/dashboard/guides/[id]/GuideEditorClient.tsx` |
| `guide_section_visibility_toggled` | Host shows or hides a guide section | `app/dashboard/guides/[id]/GuideEditorClient.tsx` |
| `guide_theme_saved` | *(existing)* Host saves guide theme/accent color | `app/dashboard/guides/[id]/GuideEditorClient.tsx` |
| `checkout_initiated` | *(existing)* User starts a Stripe checkout session | `app/api/stripe/checkout/route.ts` |
| `subscription_created` | *(existing)* Stripe webhook confirms subscription created/updated | `app/api/stripe/webhook/route.ts` |
| `subscription_canceled` | *(existing)* Stripe webhook confirms subscription canceled | `app/api/stripe/webhook/route.ts` |
| `billing_portal_accessed` | User is redirected to the Stripe billing portal | `app/api/stripe/portal/route.ts` |
| `pricing_plan_clicked` | *(existing)* Visitor clicks a plan CTA on the landing page | `components/landing/Pricing.tsx` |
| `qr_code_downloaded` | *(existing)* Host downloads a QR code (PNG or SVG) | `components/dashboard/QrCodesClient.tsx` |
| `guide_viewed` | *(existing)* Guest opens a published guide | `components/guest/GuestGuideClient.tsx` |
| `guest_wifi_copied` | *(existing)* Guest copies WiFi network name or password | `components/guest/GuestGuideClient.tsx` |
| `guest_section_expanded` | *(existing)* Guest expands a guide section | `components/guest/GuestGuideClient.tsx` |
| `guest_map_opened` | Guest taps Google Maps or Apple Maps from a guide | `components/guest/GuestGuideClient.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/project/185383/dashboard/700112)
- [User Signups & Logins](/project/185383/insights/2c1jMxJD) — Daily trend of new signups and logins
- [Subscription Conversion Funnel](/project/185383/insights/fERUlMt5) — Full funnel from signup to paid subscription
- [Guest Engagement](/project/185383/insights/gtCkMLCO) — Guide views, WiFi copies, section expansions, and map opens
- [Subscription Health](/project/185383/insights/mYWmMz5j) — Monthly new subscriptions vs. cancellations
- [QR Code Downloads & Guide Editor Activity](/project/185383/insights/SXlKvYTv) — Host activity: QR downloads, publishes, and section additions

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
