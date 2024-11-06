chrome.storage.local.get(['pgn'], function (result) {
    if (result.pgn) {
        const textarea = document.getElementById("pgn");
        const button = document.getElementById("review-button");
        textarea.value = result.pgn;
        button.click();
        chrome.storage.local.remove('pgn');
    }
});