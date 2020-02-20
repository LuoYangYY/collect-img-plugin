$(function () {
    console.log('调试popup.js')
    // 一键收集全部图片
    $('#collectAll').click(e => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'REQUEST_PREVIEW_ALL_IMG' });
        })
    });

    // 页面展示收藏按钮
    $('#showBtn').click(e => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'REQUEST_SHOW_COLLECTION_BTN' });
        });
    });
})



