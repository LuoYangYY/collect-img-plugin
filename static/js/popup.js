$(function () {
    console.log('调试popup.js');

    function sendMsgToContentScript(message, callback){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, message, function(response){
                if(callback) callback(response);
            })
        })
    }

    // 一键收集全部图片
    $('#preViewAllImg').click(e => {
        sendMsgToContentScript({type: 'REQUEST_PREVIEW_ALL_IMG', title: '我是popup, 请采集所有已加载图片并进行预览'}, function(response){
            console.log('我是popup, 收到来自content-script的回复：' + response);
        });
    });

    // 是否显示采集按钮
    $('#showCollectBtn').click(() => {
        var src = $('.collect_check_img').attr('src');
        var status = src === ''; // status: true 显示
        $('.collect_check_img')[0].src = src === '' ? 'https://s10.mogucdn.com/mlcdn/c45406/190219_0728g95i8bkl3i08jic6lhjhh7gae_24x18.png' : '';

        // 向content-script发送消息显示or隐藏单个商品的收藏按钮
        sendMsgToContentScript({type: 'REQUEST_SWITCH_COLLECT_BTN', title: `我是popup, 请${status?'显示':'隐藏'}采集按钮`, status}, function(response){
                console.log('我是popup, 收到来自content-script的回复：' + response);
        });
    });
})



