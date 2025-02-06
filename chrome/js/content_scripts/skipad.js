import { triggerClick, log } from '../common/utils.js';

const SELECTOR = {
    BTN_SKIP_AD: 'button.btn_skip',
    SELECTED_QUALITY_MENU_ITEM:
        '.pzp-setting-quality-pane__list .pzp-ui-setting-pane-item.pzp-ui-setting-pane-item--checked',
    QUALITY_MENU_ITEM:
        '.pzp-setting-quality-pane__list .pzp-ui-setting-pane-item',
    AD_BLOCK_CONFRIM_MODAL: '.popup_container__Aqx-3.popup_modal__hRwfq',
};

var intervalId;
var observer;

const findSkipBtn = () => {
    return document.querySelector(SELECTOR.BTN_SKIP_AD);
};

/* Check if skip ad button hide */
const hasHidden = skipBtn => {
    return skipBtn.classList.contains('hide');
};

/** Check if the skip button exists then, click the skip button. */
const tryClickSkipBtn = () => {
    const skipBtn = findSkipBtn();
    if (skipBtn) {
        log('found skip button');
        triggerClick(skipBtn);
    }
};

const tryDisableAdBlockConfirmModal = () => {
    const adBlockConfirmModal = document.querySelector(
        SELECTOR.AD_BLOCK_CONFRIM_MODAL,
    );
    if (adBlockConfirmModal) {
        log('found ad block confirm modal');
        adBlockConfirmModal.remove();
    }
};

const trySetVideoQualityHighest = () => {
    const highestQualityMenuItem = document.querySelector(
        SELECTOR.QUALITY_MENU_ITEM,
    );
    if (highestQualityMenuItem) {
        log('found highest quality menu item');
        triggerClick(highestQualityMenuItem);
        return true;
    }
    return false;
};

/** Init the ad skip button observer */
const initObserver = () => {
    if (!('MutationObserver' in window)) return false;

    let htmlEl = document.querySelector('html');

    if (!htmlEl) return false;

    let hasUpdatedVideoQuality = false;

    observer = new MutationObserver(() => {
        tryClickSkipBtn();
        tryDisableAdBlockConfirmModal();

        if (!hasUpdatedVideoQuality) {
            hasUpdatedVideoQuality = trySetVideoQualityHighest();
        }
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
