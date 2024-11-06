window.addEventListener('load', () => {

    chrome.storage.local.get(['pgn'], function (result) {
        if (result.pgn) {
            const textarea = document.getElementById("pgn");
            const button = document.getElementById("review-button");
            textarea.value = result.pgn;
            // if button click throws an error, rety after 50ms 10 times and then give up
            let retries = 10;
            const clickButton = () => {
                try {
                    button.click();
                } catch (e) {
                    if (retries > 0) {
                        retries--;
                        setTimeout(clickButton, 50);
                    }
                }
            };
            clickButton();
            chrome.storage.local.remove('pgn', () => {
                if (chrome.runtime.lastError) {
                    console.error("Error removing data:", chrome.runtime.lastError);
                }
            });
        }
    });
});