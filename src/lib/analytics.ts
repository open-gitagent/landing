import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '1c207b0bf23ecb3f8cf48d6fef67da6c';

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  mixpanel.init(MIXPANEL_TOKEN, {
    track_pageview: true,
    persistence: 'localStorage',
  });
  initialized = true;

  // Track page view
  track('page_view', {
    url: window.location.href,
    referrer: document.referrer,
  });

  // Track scroll depth
  let maxScroll = 0;
  const sections = [
    'hero', 'patterns', 'why', 'how', 'export', 'cli',
    'adapters', 'skills', 'compliance', 'quickstart',
  ];
  const tracked = new Set<string>();

  window.addEventListener('scroll', () => {
    const scrollPct = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    // Track 25/50/75/100 milestones
    for (const milestone of [25, 50, 75, 100]) {
      if (scrollPct >= milestone && maxScroll < milestone) {
        track('scroll_depth', { percent: milestone });
      }
    }
    maxScroll = Math.max(maxScroll, scrollPct);

    // Track section views
    for (const id of sections) {
      if (tracked.has(id)) continue;
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          tracked.add(id);
          track('section_viewed', { section: id });
        }
      }
    }
  }, { passive: true });

  // Track outbound link clicks
  document.addEventListener('click', (e) => {
    const anchor = (e.target as Element)?.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;

    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      track('outbound_click', { url: href, text: anchor.textContent?.trim().slice(0, 50) });
    } else if (href.startsWith('#')) {
      track('nav_click', { anchor: href, text: anchor.textContent?.trim().slice(0, 50) });
    }
  });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.track(event, properties);
}
