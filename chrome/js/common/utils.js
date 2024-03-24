/** Triggers a click event on the given DOM element.*/
export const triggerClick = el => {
    const eventType = 'click';

    if (typeof el.dispatchEvent === 'function') {
        let evt = new Event(eventType, { bubbles: true, cancelable: false });
        el.dispatchEvent(evt);
    } else if (typeof el.fireEvent === 'function') {
        // IE
        el.fireEvent('on' + eventType);
    }
};

export const log = (...args) => {
    console.debug('[chzzk-ad-skipper]', ...args);
};
