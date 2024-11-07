const config = { childList: true, subtree: true };
const buttonTypes = {
    'button.game-over-review-button-background:not(.custom-redirect)': 'cc-button-component cc-button-primary cc-button-xx-large cc-button-full game-over-review-button-background custom-redirect',
    'button.game-review-buttons-button:not(.custom-redirect)': 'cc-button-component cc-button-primary cc-button-large cc-button-full game-review-buttons-button custom-redirect',
};

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function findButton(button, newClass) {
    const oldButton = button;
    const newButton = document.createElement('button');
    newButton.className = newClass;
    newButton.innerText = oldButton.innerText;
    newButton.innerHTML = oldButton.innerHTML;

    newButton.onclick = function () {
        const modal = document.getElementById("share-modal");
        const shareButton = document.querySelector('.share.live-game-buttons-button');
        const oldDisplay = modal.style.display;
        modal.style.display = 'none';
        shareButton.click();

        const modalObserver = new MutationObserver((mutationsList, observer) => {
            const pgn_elem = document.querySelector('.share-menu-tab-pgn-textarea');
            if (!pgn_elem) return;
            const modal_close = document.querySelector(".ui_modal-backdrop");
            const pgn = pgn_elem.value;
            modal_close.click();
            modal.style.display = oldDisplay;
            chrome.storage.local.set({ pgn: pgn }, () => {
                if (chrome.runtime.lastError) {
                    console.error("Error setting data:", chrome.runtime.lastError);
                    return;
                }
                window.open('https://chess.wintrcat.uk/', '_blank');
                modalObserver.disconnect();
            });
        });

        modalObserver.observe(modal, config);
    };

    oldButton.parentNode && oldButton.parentNode.replaceChild(newButton, oldButton);
}

const observer = new MutationObserver(throttle((mutationsList, observer) => {
    for (const buttonType in buttonTypes) {
        const button = document.querySelector(buttonType);
        if (button) {
            findButton(button, buttonTypes[buttonType]);
        }
    }
}, 100));
observer.observe(document.body, config);
