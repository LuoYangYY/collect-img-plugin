console.log('页面插入content-script成功')

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type === 'REQUEST_PREVIEW_ALL_IMG'){
        console.log('接收预览所有图片消息');
        PreviewAllImg();
    }else if(message.type === 'REQUEST_SHOW_COLLECTION_BTN'){
        console.log('接收浏览页面展示收藏按钮消息')
        ShowCollectBtn();
    }
});


function PreviewAllImg(){
    GetAllAttrList('img', ['src', 'data-src']).then((res) => {
        ShowImgPanel(res);
    })
}


function ShowCollectBtn(){
    $('img').each((index, item) => {
        let src = $(item).attr('src') || $(item).attr('data-src');
        $($(item).parent()).css('position', 'relative');
        $($(item).parent()).find('.collect_img_btn').remove();
        $($(item).parent()).append('<div class="collect_img_btn" data-src="'+src+'">收藏</div>');

    });
    $('.collect_img_btn').click((e) => {
        e.stopPropagation();
        e.preventDefault();
        let src = $(e.target).data('src');
        chrome.runtime.sendMessage({type: 'SEND_IMG', src: src},function(){
            console.log('图片采集完成');
        })
    });
}
function ShowImgPanel(list){
    var panelDOM = $('<div id="collect_img_panel">' +
            '<div class="collect_img_panel_close">x</div>' +
            '<div class="collect_img_panel_content">x</div>' +
            '</div>');
        $('body').append(panelDOM);
        let $item = '';
        $.each(list, function(index, item) {
            $item = $item + '<div class="collect_img_panel_item">' +
                '<div class="collect_img_panel_item_img" style="background-image: url(' + item + ')"></div>' +
                '<div class="collect_img_panel_item_mask"></div>' +
                '<div class="collect_img_panel_item_btn" data-src="'+ item+'">收藏图片</div>' +
                '</div>';
        });
        $('.collect_img_panel_content').html($item);
        $('.collect_img_panel_item_btn').click((e)=>{
            let src = $(e.target).data('src');
            chrome.runtime.sendMessage({type: 'SEND_IMG', src: src},function(){
                console.log('图片采集完成');
            })
        });
        $(".collect_img_panel_close").click(function() {
            $('#collect_img_panel').remove();
        });
}


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
