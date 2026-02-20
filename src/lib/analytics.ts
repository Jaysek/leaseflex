type EventName =
  | 'page_view'
  | 'offer_form_submit'
  | 'offer_form_upload_lease'
  | 'quote_viewed'
  | 'checkout_started'
  | 'checkout_completed'
  | 'email_offer_sent'
  | 'waitlist_joined';

type EventProperties = Record<string, string | number | boolean | null | undefined>;

export function track(event: EventName, properties?: EventProperties) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[analytics] ${event}`, properties || '');
  }

  // Wire to your analytics provider here:
  // posthog?.capture(event, properties);
  // mixpanel?.track(event, properties);
  // gtag('event', event, properties);
}
