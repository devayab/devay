// This script reads attribution data from localStorage and
// injects it into form fields on the page.
(function () {
    const ATTR_KEY = "attribution_v1";
    const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content" /*, "utm_term", "li_fat_id"*/];

    function injectAttributionIntoForm() {
        // Only inject if user has given consent
        // (i.e. data is in localStorage and not expired)
        const raw = localStorage.getItem(ATTR_KEY);
        if (!raw) return;

        // If data is malformed, do not attempt to inject or clear
        // (to avoid accidentally clearing valid data on a minor parsing error)
        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            return;
        }

        // Check expiration
        if (!data.saved_at || (Date.now() - data.saved_at > MAX_AGE)) {
            localStorage.removeItem(ATTR_KEY);
            return;
        }

        // Inject values into corresponding hidden fields, if they exist in the form
        keys.forEach(function (k) {
            const el = document.querySelector('input[name="' + k + '"]');
            if (el) el.value = data[k] || "";
        });
    }
    // A function to clear the fields, in case the user revokes consent after previously accepting
    function clearAttributionFields() {
        keys.forEach(function (k) {
            const el = document.querySelector('input[name="' + k + '"]');
            if (el) el.value = "";
        });
    }

    // Run once on load (for returning visitors who already accepted)
    document.addEventListener("DOMContentLoaded", injectAttributionIntoForm);

    // Expose so consent.js can call it right after Accept + attribution saved
    window.injectAttributionIntoForm = injectAttributionIntoForm;
    window.clearAttributionFields = clearAttributionFields;
})();
