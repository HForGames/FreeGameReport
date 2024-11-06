const config = {childList: true, subtree: true};


function findButton(button) {
    button.addEventListener('transitionend', function handleTransitionEnd(event) {
        const oldButton = button;
        const style = window.getComputedStyle(oldButton);
        const newButton = document.createElement('button');

        for (var i = 0; i < style.length; i++) {
            newButton.style[style[i]] = style.getPropertyValue(style[i]);
        }

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
                        chrome.storage.local.set({pgn: pgn});

                        window.open('https://chess.wintrcat.uk/', '_blank');

                        modalObserver.disconnect();
                        return;
                    }
                }
            });

            modalObserver.observe(modal, config);

        };

        oldButton.parentNode && oldButton.parentNode.replaceChild(newButton, oldButton);
        observer.disconnect();
        button.removeEventListener('transitionend', handleTransitionEnd);
    });
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
