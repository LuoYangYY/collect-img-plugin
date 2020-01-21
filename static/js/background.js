console.log('background.js')
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type === 'SEND_IMG'){
        console.log('采集图片链接：' + message.src)
    }
});