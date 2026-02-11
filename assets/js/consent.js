document.addEventListener("DOMContentLoaded", function () {
    const CONSENT_KEY = "cookie_consent_v1"; // null | "accepted" | "rejected"
    const ATTR_KEY = "attribution_v1";

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-marketing");
    const rejectBtn = document.getElementById("reject-marketing");

    // If banner isn't on this page, do nothing
    if (!banner || !acceptBtn || !rejectBtn) return;

    // Helper functions to get/set consent and clear attribution on reject
    function getConsent() {
        return localStorage.getItem(CONSENT_KEY);
    }

    function setConsent(v) {
        localStorage.setItem(CONSENT_KEY, v);
    }

    function clearAttribution() {
        localStorage.removeItem(ATTR_KEY);
    }

    // Function to load the attribution script, which captures UTMs and
    // stores in localStorage
    function loadAttributionScript() {
        if (window.__attributionLoaded) return;
        window.__attributionLoaded = true;

        const s = document.createElement("script");
        // Use absolute-from-root path so it works on / and /landing/
        s.src = "/assets/js/landing-attribution.js";
        s.defer = true;

        // After attribution script runs and stores UTMs, inject into form (if present)
        s.onload = function () {
            if (typeof window.injectAttributionIntoForm === "function") {
                window.injectAttributionIntoForm();
            }
        };
        // Append to body to execute
        document.body.appendChild(s);
    }

    const consent = getConsent();

    if (!consent) {
        banner.style.display = "block";
    } else if (consent === "accepted") {
        loadAttributionScript();
    }

    acceptBtn.addEventListener("click", function () {
        setConsent("accepted");
        banner.style.display = "none";
        loadAttributionScript();
    });
    // On reject, we clear any stored attribution data and do not load the script
    rejectBtn.addEventListener("click", function () {
        setConsent("rejected");
        banner.style.display = "none";
        clearAttribution();

        // Optional: also clear hidden fields if the form is there
        if (typeof window.clearAttributionFields === "function") {
            window.clearAttributionFields();
        }
    });
});
