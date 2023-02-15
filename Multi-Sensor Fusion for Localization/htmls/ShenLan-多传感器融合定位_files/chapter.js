$(function(){
    
    // 悬浮显示 
    if($(".js_chapter_btn").length > 0){
        chapterTip();
    }
    
 
    // 解锁弹窗
    $(".js_chapter_btn").bind("click", function(){
        //console.log("111");
        var url = $(this).data("url");
        $.ajax({
            url: url, 
            type: 'GET', 
            beforeSend:function(){ 
                $(".js_chapter_btn").addClass("chapter_disabled");
            },
            success: function (data) {
                console.log(data); 
                $(".js_chapter_btn").removeClass("chapter_disabled");
                if(data.code == 200){
                    $('#chapterModal').modal('show');
                    $(".modal-backdrop").css("display", "none");
                    $(".chapterModal").css("background", "rgba(0,0,0,.8)");
                    $(".lock_buy").attr("href", data.data.buyUrl);

                    //这里判断是不是开启了邀请，未开启邀请
                    if (data.data.isInvited == "1") {
                        var currentInviteCount = data.data.currentInviteCount;//当前已邀请成功的人数
                        console.log(currentInviteCount);
                        var currentMaxCount = data.data.currentMaxCount; //当前邀请阶段能达到的最大人数
                        var buyType = data.data.buyType;
                        var percent = ((currentInviteCount/currentMaxCount)*100).toFixed(0)+'%'; //滚动条长度
                        $(".progress_bar").attr("data-progress", percent);

                        if(percent >= 100){
                            percent = 100;
                        }

                        $(".current_invite_count").text(currentInviteCount);//当前已邀请成功的人数
                        // $(".chapter_lock_price").text(data.data.chapterLockPrice);//课程解锁的价格
                        var detail_html = "", detail_html_start = "", join_dec_html = "", join_dec_html_a = "", join_dec_html_b = "";

                        var start = 0;
                        var people = 0;
                        for(var i in data.data.detail){
                            var invite_count = data.data.detail[i].invite_count;
                            var chapter_title = data.data.detail[i].chapterTitle;
                            var chapterPrice = data.data.detail[i].chapterPrice;
                            people = Number(people)+Number(invite_count);
                            var left_num = ((people/currentMaxCount)*100)+'%';
                            console.log(left_num);
                            detail_html += '<div class="point_item point_item_blue" style="left:'+left_num+';">'+
                                '<span class="item_peo" >'+ people +'人</span>'+
                                '<span class="item_chapter">'+ chapter_title +'</span>'+
                                '</div>';

                            // if(start == 1){
                            //     break;
                            // }

                            if(i == buyType){
                                $(".chapter_lock_price").text(chapterPrice);//课程解锁的价格
                                start = 1;
                                break;
                            }

                            // join_dec_html += '<p>成功邀请'+invite_count+'名好友，解锁'+chapter_title+'</p>';

                        }
                        // if(buyType == "chapter1"){
                        detail_html_start = '<div class="point_item point_item_blue" style="left:0;"><span class="item_peo">0人</span><span  class="item_chapter">开始</span></div>';
                        // }

                        // join_dec_html_a = '<div class="tooltip-wrap">';
                        // join_dec_html_b =  '</div><p>邀请新用户报名该课程</p>';
                        $(".progress_point").empty();
                        $(".progress_point").append(detail_html_start+detail_html);
                        $(".progress_point .point_item:last-child").removeClass("point_item_blue").css("left", "100%");
                        // $(".join_dec_span").attr("data-original-title", join_dec_html_a+join_dec_html_b+join_dec_html);

                        setTimeout(function(){
                            console.log($(".progress_bar").attr("data-progress"));
                            $(".progress_bar").initData({
                                height: 10,
                                percent: percent,
                                isAuto: true,
                                bgStartColor: '#0091FF',
                                bgEndColor: '#0091FF'
                            })
                            $(".progress_bar .m-percent-include").css("width", percent);
                        },200);
                    }

 
                }else if(data.code == 101){
                    layer.msg(data.message);
                }
            }
        }); 
        
    })

    // 进度条清空
    $(".chapter_cancle").bind("click", function(){ 
        $(".progress_bar .m-percent-include").remove();
    })
 
    // 课程有效期提示
    $(".js_chapter_deadline").bind("click", function(){ 
        layer.msg("您的任务已过有效期，若有疑问请联系客服~");
    })
    

    
})

function chapterTip(){

    var url = $(".js_chapter_btn").data("url");
    $.ajax({
        url: url, 
        type: 'GET', 
        success: function (data) {
            console.log(data);  
            var join_dec_html = "", join_dec_html_a = "", join_dec_html_b = "";

            for(var i in data.data.detail){
                // console.log(i);
                var invite_count = data.data.detail[i].invite_count;
                var chapter_title = data.data.detail[i].chapterTitle;
                
                join_dec_html += '<p>成功邀请'+invite_count+'名好友，解锁'+chapter_title+'</p>'
                
            }
            var unLockCondition1 = data.data.unLockCondition1;
            if(unLockCondition1 == "new"){
                join_dec_html_a = '<div class="tooltip-wrap">'+
                                '<p>邀请新用户支付1元报名该课程</p>';
            }else{
                join_dec_html_a = '<div class="tooltip-wrap">'+
                                '<p>邀请好友支付1元报名该课程</p>';
            }

            
            join_dec_html_b =  '</div>'
            $(".join_dec_span").attr("data-original-title", join_dec_html_a+join_dec_html+join_dec_html_b)
        }
    }); 
}
   
