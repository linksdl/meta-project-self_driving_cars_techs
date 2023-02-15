webpackJsonp(["app/js/share/index"], [function(e, i) {
    "use strict";
        function a(e, i) {
            if (0 == $(".weixin-share-modal").length) {
                $("body").append(s(i));
                var a = $(".weixin-share-modal");
                a.on("show.bs.modal", function() {
                    a.find(".weixin-share-qrcode").empty(),
                        a.find(".weixin-share-loading").show(),
                        a.find(".weixin-share-qrcode").html('<img src="' + e.data("qrcodeUrl") + '">'),
                        a.find(".weixin-share-qrcode img").load(function() {
                            a.find(".weixin-share-loading").hide()
                        })
                })
            }
            if($(".weixin_tc").data("mobile") == "weixin_tc"){
                $(".mobile_mask").addClass("hide");
            }
            $(".weixin-share-modal").modal("show")
        };


            
        // 复制链接
        $(document).off('click','.js_saleschange').on('click','.js_saleschange',function(){
            if(document.execCommand){
                var copyVal = document.getElementById('saleschangeValue'); 
                copyVal.select();
                document.execCommand('copy');
                $(copyVal).blur();
                layer.msg('复制成功～');
                
            }else{
                layer.msg('该浏览器不支持，请手动复制～');//操作提示信息('该浏览器不支持，请手动复制～');
            }
        });


        // 手机浏览器-分享
        $(document).off('click','.mobile_body').on('click','.mobile_body',function(){
            $(".mobile_mask").removeClass("hide");

       }); 

       // 手机浏览器-分享-关闭
       $(document).off('click','.mobile_close').on('click','.mobile_close',function(){
            $(".mobile_share").remove();
        }); 

         // 手机浏览器-取消分享
        $(document).off('click','.mobile_cancle').on('click','.mobile_cancle',function(){
            $(".mobile_mask").addClass("hide");
        }); 
 
        // 微信-分享
        $(document).off('click','.wechat_body').on('click','.wechat_body',function(){
             $(".wechat_mask").removeClass("hide");
        }); 

        // 微信遮罩层关闭
        $(document).off('click','.wechat_mask').on('click','.wechat_mask',function(){
            $(".wechat_mask").addClass("hide");
       }); 

        // 微信-分享-关闭
        $(document).off('click','.wechat_close').on('click','.wechat_close',function(){
            $(".wechat_share").remove();
        }); 

        // pc公开课分享功能
        $(".invite_button").click(function(){
            $(".share_cont").animate({height: 'toggle', opacity: 'toggle'});
        },function(){
            $(".share_cont").animate({height: 'toggle', opacity: 'toggle'});
        }); 


        // pc复制弹窗-弹出
        function copyFunc(e, i){
            if(0 == $(".copy-share-modal").length) {
                $("body").append(copyLink(i)); 
            }
            if($(".copylink_tc").data("mobile") == "copylink_tc"){
                $(".mobile_mask").addClass("hide");
            }
            $(".copy-share-modal").modal("show")
        };

        // pc复制链接功能-弹窗
        $(document).off('click','.copylink_btn').on('click','.copylink_btn',function(){
            if(document.execCommand){
                //分享来源
                var type = 'share_'+$(this).data("cmd"),
                    url = $(".copylink_tc").data("shareurl");
                if($.cookie(type) != "true"){ 
                    $.ajax({
                        url: url, 
                        type: 'GET', 
                        success: function (data) {
                        //   console.log(data);
                            $.cookie(type, "true", { expires: 1 ,path: '/',domain:'shenlanxueyuan.com'}); 
                        }
                    });
                }
                var copyVal = document.getElementById('copylink_val'); 
                copyVal.select();
                document.execCommand('copy');
                $(copyVal).blur();
                layer.msg('复制成功～');
                
            }else{
                layer.msg('该浏览器不支持，请手动复制～');//操作提示信息('该浏览器不支持，请手动复制～');
            }
        });

        // pc复制链接弹窗
        function copyLink(e){
            var copylinkUrl = $(".copy_link").attr("data-copylink-url");
            var i = "";
            return i += '<div class="modal fade copy-share-modal" tabindex="-1" role="dialog" aria-hidden="true">',
                i += '  <div class="share-modal-cont modal-sm">',
                i += '      <div class="modal-content">', 
                i += '          <p class="share_title">复制链接', 
                i += '              <i class="share_close close abs" data-dismiss="modal" aria-label="关闭"></i>',
            i += '              </p>',
                i += '          <input type="text" value="'+copylinkUrl+'"  id="copylink_val"  class="copylink_val"/>', 
                i += '          <a class="copylink_btn" data-cmd="copylink" href="javascript:void(0);">复制</a>',  
                i += "      </div>",
                i += "  </div>",
                i += "</div>"
        }

        // pc微信扫码分享弹窗
        function s(e) {
            var i = "";
            return i += '<div class="modal fade weixin-share-modal" tabindex="-1" role="dialog" aria-hidden="true">', 
                i += '  <div class="share-modal-cont modal-sm">',
                i += '      <div class="modal-content">', 
                i += '          <p class="share_title">打开「微信」扫一扫</br>发送给朋友或分享到朋友圈', 
                i += '              <i class="share_close close abs" data-dismiss="modal" aria-label="关闭"></i>',
            i += '              </p>',
                i += '          <p class="weixin-share-qrcode text-center weixin_share_code"></p>', 
                i += "      </div>",
                i += "  </div>",
                i += "</div>"
        }
    
        function n(e) {
            var i = {};
            return i.url = e.url,
                i.title = e.message,
            "" != e.picture && (e.picture.indexOf("://") != -1 ? i.pic = e.picture : i.pic = document.domain + e.picture),
            "http://service.weibo.com/share/share.php?" + o(i)
        }
        function t(e) {
            var i = {};
            return i.url = e.url,
                i.title = e.title,
                i.summary = e.summary,
                i.desc = e.message,
            "" != e.picture && (i.pics = e.picture),
            "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + o(i)
        }
        function r(e) {
            var i = {};
            return i.url = e.url,
                i.title = e.title,
                i.summary = e.summary,
                i.desc = e.message,
            "" != e.picture && (i.pics = e.picture),
            "http://connect.qq.com/widget/shareqq/index.html?" + o(i)
        }
        function o(e) {
            var i = [];
            for (var a in e)
                i.push(a + "=" + encodeURIComponent(e[a] || ""));
            return i.join("&")
        }
        $("body").on("click", ".js-social-share", function() {
            var e = $(this)
                , i = e.data("share")
                , s = e.parents(".js-social-share-params").data()
                , o = "",
                //分享来源
                type = 'share_'+ $(this).data("cmd"),
                url = $(this).data("shareurl");

                console.log('分享来源', type, $.cookie(type))
                if($.cookie(type) != "true"){ 
                    $.ajax({
                        url: url, 
                        type: 'GET', 
                        success: function (data) {
                          console.log(data);
                            $.cookie(type, "true", { expires: 1 ,path: '/',domain:'shenlanxueyuan.com'}); 
                        }
                    });
                }
            switch ($(".point-share-url").length > 0 && $.post($(".point-share-url").val(), function() {}),
                i) {
                case "weibo":
                    o = n(s),
                        window.open(o);
                    break;
                case "qzone":
                    o = t(s),
                        window.open(o);
                    break;
                case "qq":
                    o = r(s),
                        window.open(o);
                    break;
                case "weixin":
                    a(e, s) ;
                    break;
                case "copylink":
                    copyFunc(e, s);

            }
        })


        // 邀请好友一起学
        $(document).off('click','.invite_friend').on('click','.invite_friend',function(){
            if($.cookie("invite_share") != "true"){ 
                var url = $(this).data("inviteurl");
                $.ajax({
                    url: url, 
                    type: 'GET', 
                    success: function (data) {
                    //   console.log(data);
                    $.cookie("invite_share", "true", { expires: 1 ,path: '/',domain:'shenlanxueyuan.com'}); 
                    }
                });
            }
        })


        // 倒计时5分钟-观看视频页面
        if($(document).find(".open_share_wrap").length > 0){
            var time=setInterval (showTime, 1000);
        }
        var second = 300;
        function showTime(){
            if(second == 0){ 
                $(".open_share_wrap").removeClass("hide");
                clearInterval(time);
            } 
            second--;
        }
  
        // 手机浏览器-分享-关闭
        $(document).off('click','.mobile_close').on('click','.mobile_close',function(){
            $(".mobile_share").remove();
            $.cookie("share_mobile_close", "true", { expires: 1 ,path: '/',domain:'shenlanxueyuan.com'});  
        }); 

        if($.cookie("share_mobile_close") == "true"){
            $(".open_share_wrap").addClass("hide");
        }

        // pc-分享-关闭
        $(document).off('click','.pc_close').on('click','.pc_close',function(){
            $(".share_pc_box").remove();
            $.cookie("share_pc_close", "true", { expires: 1 ,path: '/',domain:'shenlanxueyuan.com'});  
        }); 

        if($.cookie("share_pc_close") == "true"){
            $(".share_pc_box").addClass("hide");
        }
  
    }
]);
