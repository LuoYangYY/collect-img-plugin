console.log('页面插入content-script成功')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.type === 'REQUEST_PREVIEW_ALL_IMG'){

        console.log('我是content-script,收到来自popup的消息：' + request.title);

        sendResponse('我是content-script, 已收到你的预览全部图片的消息');

        PreviewAllImg();

    }else if(request.type === 'REQUEST_SWITCH_COLLECT_BTN'){

        console.log('我是content-script,收到来自popup的消息：' + request.title);

        sendResponse(`我是content-script, 已收到你${request.status ? '显示':'隐藏'}采集按钮的消息`);

        if(request.status){
            ShowCollectBtn();
        }else{
            ClearCollectBtn();
        }
    }else if(request.type === 'COLLECT_RESULT'){
        console.log('我是content-script,收到来自background的消息：' + request.title);
        sendResponse(`我是content-script, 已收到你的${request.title}的消息`);
    }
});


// 预览所有已加载图片
function PreviewAllImg(){
    GetAllAttrList('img', ['src', 'data-src']).then((res) => {
        ShowImgPanel(res);
    })
}

// 展示采集按钮
function ShowCollectBtn(){
    $('img').each((index, item) => {
        let src = $(item).attr('src') || $(item).attr('data-src');
        $($(item).parent()).css('position', 'relative');
        $($(item).parent()).find('.collect_img_btn').remove();
        $($(item).parent()).append('<div class="collect_img_btn" data-src="'+src+'">采集</div>');

    });
    $('.collect_img_btn').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        let src = $(e.target).data('src');
        chrome.runtime.sendMessage({type: 'SEND_IMG', src: src},function(response){
            console.log('我是content-script,收到来自background的回复：' + response);
        })
    });
}

// 清除采集按钮
function ClearCollectBtn(){
    $('.collect_img_btn').remove();
}

// 展示预览图片对话框
function ShowImgPanel(list){
    var panelDOM = $('<div id="collect_img_panel">' +
            '<div class="collect_img_panel_close">x</div>' +
            '<div class="collect_img_panel_content">x</div>' +
            '</div>');
        $('body').append(panelDOM);
        $('body').append('<div id="collect_img_panel_mask"></div>');
        let $item = '';
        $.each(list, function(index, item) {
            $item = $item + '<div class="collect_img_panel_item">' +
                '<div class="collect_img_panel_item_img" style="background-image: url(' + item + ')"></div>' +
                '<div class="collect_img_panel_item_mask"></div>' +
                '<div class="collect_img_panel_item_btn" data-src="'+ item+'">采集图片</div>' +
                '</div>';
        });
        $('.collect_img_panel_content').html($item);
        $('.collect_img_panel_item_btn').click((e)=>{
            let src = $(e.target).data('src');
            chrome.runtime.sendMessage({type: 'SEND_IMG', src: src},function(response){
                console.log('我是content-script,,收到来自background的回复：' + response);
            })
        });
        $(".collect_img_panel_close").click(function() {
            $('#collect_img_panel').remove();
            $('#collect_img_panel_mask').remove();
        });
}

// 根据标签和属性采集所有符合条件的对象
function GetAllAttrList(obj, attrArr){
    return new Promise((resolve) => {
        let list = [];
        $(obj).each((index, item) => {
            GetAttrContent(item, attrArr).then(res => {
                list.push(res);
                if(index === $(obj).length - 1){
                    resolve(list);
                }
            });
        });
    });
}

// 获取对象的属性内容
function GetAttrContent(obj, attrArr){
    return new Promise((resolve) => {
        $.each(attrArr, (attrIndex, attrItem) => {
            let attrContent = $(obj).attr(attrItem);
            if(attrContent){
                resolve(attrContent);
            }
        })
    });
}
