const config = {childList: true, subtree: true};


function findButton(button) {
    const oldButton = button;
    const style = window.getComputedStyle(oldButton);
    const newButton = document.createElement('button');
    newButton.className = 'cc-button-component cc-button-primary cc-button-xx-large cc-button-full game-over-review-button-background';

    newButton.onclick = function () {
        const modal = document.getElementById("share-modal");
        const shareButton = document.querySelector('.share.live-game-buttons-button');
        const oldDisplay = modal.style.display;
        modal.style.display = 'none';
        shareButton.click();

        const modalObserver = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const pgn_elem = document.querySelector('.share-menu-tab-pgn-textarea');
                    if (!pgn_elem) {
                        continue;
                    }
                    const modal_close = document.querySelector(".ui_modal-backdrop");
                    const pgn = pgn_elem.value;
                    modal_close.click();
                    modal.style.display = oldDisplay;
                    chrome.storage.local.set({pgn: pgn}, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error setting data:", chrome.runtime.lastError);
                            return;
                        }
                        window.open('https://chess.wintrcat.uk/', '_blank');
                        modalObserver.disconnect();
                    });
                    return;
                }
            }
        });

        modalObserver.observe(modal, config);

    };

    oldButton.parentNode && oldButton.parentNode.replaceChild(newButton, oldButton);
    observer.disconnect();
}


const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const button = mutation.target.querySelector('.game-over-review-button-background');
            button && findButton(button);
        }
    }
});

observer.observe(document.body, config);
