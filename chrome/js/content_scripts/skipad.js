import { triggerClick, log } from '../common/utils.js';

const SELECTOR = {
    BTN_SKIP_AD: 'button.btn_skip',
};

var intervalId;
var observer;

const findSkipBtn = () => {
    return document.querySelector(SELECTOR.BTN_SKIP_AD);
};

/* Check if skip ad button hide */
// const hasHidden = skipBtn => {
//     return skipBtn.classList.contains('hide');
// };

// const findActiveSkipBtn = () => {
//     const skipBtn = findSkipBtn();
//     if (skipBtn && !hasHidden(skipBtn)) {
//         return skipBtn;
//     }
// };

/** Check if the skip button exists then, click the skip button. */
const tryClickSkipBtn = () => {
    const skipBtn = findSkipBtn();
    if (skipBtn) {
        log('found skip button');
        triggerClick(skipBtn);
    }
};

/** Init the ad skip button observer */
const initObserver = () => {
    if (!('MutationObserver' in window)) return false;

    let htmlEl = document.querySelector('html');

    if (!htmlEl) return false;

    observer = new MutationObserver(() => {
        tryClickSkipBtn();
    });

    observer.observe(htmlEl, { childList: true, subtree: true });

    // Free observer when document unload
    window.addEventListener('beforeunload', () => {
        if (observer) clearInterval(observer);
    });

    return true;
};

/** Loop until the observer is successfully created. */
const initInterval = () => {
    intervalId = setInterval(() => {
        if (initObserver()) {
            // Stop the polling as the observer is set up.
            clearInterval(intervalId);
        }
    }, 500);

    // Free interval when document unload
    window.addEventListener('beforeunload', () => {
        if (intervalId) clearInterval(intervalId);
    });
};

export const main = () => {
    /** Check if this tab window url is https://chzzk.naver.com */
    if (/.*:\/\/.*chzzk.naver.com\/.*/.test(document.URL)) initInterval();
};
