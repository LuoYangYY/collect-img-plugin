console.log('调试background.js')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.type === 'SEND_IMG'){
        console.log('我是background，采集到图片链接：' + request.src);

        sendResponse('正在采集图片');
        requestStoreImg(request.src);
    }
});


// 外站图片转为mogu图片
function requestStoreImg(src) {

		$.ajax({
        type: 'get',
        url: 'https:/www.mogu.com/*/store',
        data: {
            url: src
        },
        success: function(res) {
            if (res.status && res.status.code && res.status.code === 1001) {
            		sendMsgToContentScript({type: 'COLLECT_RESULT', title: '图片采集成功'}, function(response){
				            console.log('来自content的回复：' + response);
				        });
            } else {
                sendMsgToContentScript({type: 'COLLECT_RESULT', title: '图片采集失败'}, function(response){
				            console.log('来自content的回复：' + response);
				        });
            }
        },
        error: function(res){
        			sendMsgToContentScript({type: 'COLLECT_RESULT', title: '接口异常采集失败'}, function(response){
				            console.log('来自content的回复：' + response);
			        });
        }
    })
}

function sendMsgToContentScript(message, callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
            if(callback) callback(response);
        })
    })
}
