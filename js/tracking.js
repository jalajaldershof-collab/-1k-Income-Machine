// Meta Pixel & Zaraz Tracking - Shared across all pages

function getFbc() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === '_fbc') {
            return value;
        }
    }
    return null;
}

function getFbp() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === '_fbp') {
            return value;
        }
    }
    return null;
}

function trackConversion(eventName, eventData = {}) {
    const trackingData = {
        event_name: eventName,
        user_data: {
            client_ip_address: '{{client_ip_address}}',
            client_user_agent: navigator.userAgent,
            fbp: getFbp() || undefined,
            fbc: getFbc() || undefined
        },
        custom_data: {
            ...eventData,
            event_source_url: window.location.href,
            page_title: document.title
        },
        event_id: eventName + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    };

    if (typeof zaraz !== 'undefined' && zaraz.track) {
        zaraz.track(eventName, trackingData);
    }

    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, {
            ...eventData,
            fbp: getFbp() || undefined,
            fbc: getFbc() || undefined
        }, {
            eventID: trackingData.event_id
        });
    }

    return trackingData;
}

function storeFbclid() {
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
        document.cookie = '_fbc=' + fbclid + '; path=/; max-age=7776000';
    }
}

storeFbclid();

// Expose functions globally
window.trackConversion = trackConversion;
window.getFbc = getFbc;
window.getFbp = getFbp;