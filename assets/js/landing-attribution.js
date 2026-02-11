(function () {
    const STORAGE_KEY = "attribution_v1";

    // Read params from the URL (everything after ?)
    const params = new URLSearchParams(window.location.search);

    const WHITELIST = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content"
        // "utm_term",
        //"li_fat_id"
    ];

    // Capture whitelisted params + context and store in localStorage
    const captured = {};
    for (const key of WHITELIST) {
        const v = params.get(key);
        if (v) captured[key] = v;
    }

    // Add some context about the visit, which can be useful for attribution and debugging.
    // This is not personally identifiable information.
    captured.landing_path = window.location.pathname;
    captured.referrer = document.referrer || ""; // could be empty if user came directly or if the referrer is blocked by the browser
    captured.first_seen_at = new Date().toISOString();
    captured.saved_at = Date.now(); // used for expiration

    // If nothing was provided, do not overwrite existing stored data
    const hasAny = Object.keys(captured).some(
        (k) => captured[k] && !["landing_path", "referrer", "first_seen_at"].includes(k)
    );
    if (!hasAny) return;
    // Store as JSON string in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    window.__attribution = captured; // for easy debugging in DevTools
})();
