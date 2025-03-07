import log from '@/log';

function main() {
    chrome.runtime.onInstalled.addListener(() => {
        log('INFO', 'Disabling JavaScript...');
        chrome.contentSettings.javascript.set({
            primaryPattern: '*://*.rozbor-dila.cz/*',
            setting: 'block'
        });
    });

    log('INFO', 'Listening for tab updates...');
    chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
        if (changeInfo.status === undefined) {
            return;
        }

        if (!/^https?:\/\/(?:www\.)?rozbor-dila.cz(?:\/.*)?$/.test(tab.url ?? '')) {
            return;
        }

        log('INFO', `Tab ${tabID} status updated: ${changeInfo.status}`);

        switch (changeInfo.status) {
            case 'loading': {
                log('INFO', 'Removing <noscript> elements...');
                chrome.scripting.executeScript({
                    target: { tabId: tabID },
                    func: () => {
                        function removeNoscript() {
                            [...document.getElementsByTagName('noscript')].forEach((element) => element.remove());
                        }

                        removeNoscript();
                        window.addEventListener('DOMContentLoaded', removeNoscript);
                    }
                });
            } break;
            case 'complete': {
                log('INFO', 'Resetting user-select CSS properties...');
                chrome.scripting.executeScript({
                    target: { tabId: tabID },
                    func: () => {
                        document.getElementById('wpccp-css')?.remove();
                        const style = document.createElement('style');
                        style.innerHTML = `
                        .unselectable
                        {
                            -moz-user-select: unset !important;
                            -webkit-user-select: unset !important;
                            cursor: unset !important;
                        }

                        html
                        {
                            -webkit-touch-callout: unset !important;
                            -webkit-user-select: unset !important;
                            -khtml-user-select: unset !important;
                            -moz-user-select: unset !important;
                            -ms-user-select: unset !important;
                            user-select: unset !important;
                            -webkit-tap-highlight-color: unset !important;
                        }
                        `;
                        document.head.append(style);
                    }
                });
            } break;
        }
    });
}

main();
