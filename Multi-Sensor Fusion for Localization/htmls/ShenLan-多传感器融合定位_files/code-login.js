webpackJsonp(["app/js/courseset/show/code-login"], [function (e, s) {
    "use strict";
    // var r = $("#login-form"),
    var d = $(".js-sms-send");
    var $form = $('#login-form');
    var validator = $form.validate({
    // r.validate({
        rules: {
            mobile: {
                required: !0,
                phone: !0,
                es_remote: {
                    type: "get",
                    callback: function (e) {
                        e ? d.removeClass("disabled") : d.addClass("disabled")
                    }
                }
            },
            sms_code: {
                required: !0,
                unsigned_integer: !0,
                es_remote: {
                    type: "get",
                    data:{
                        //多参数传递,每个值需要用function返回
                        value:function(){
                            return $("#sms-code").val();
                        },
                        mobile:function(){ 
                            return $("#mobile").val();
                        }
                    } 
                }
            }
        },
        messages: {
            sms_code: { 
                // required: layer.msg("请输入验证码")
                required: Translator.trans("请输入验证码")
            },
            mobile: {
                // required: layer.msg("请输入手机号")
                required: Translator.trans("请输入手机号")
            }
        } 
    });
    
    $("#mobile").keyup(function(){ 
        var $t=$(this);
        $t.val().length > 5 ? d.removeClass("disabled") : d.addClass("disabled");
    });

    
    //发送验证码倒计时
    function settime(val, btn) { 
        var countdown = val.html();
        if (countdown == 0) {
            btn.removeClass("disabled");
            val.html("");
            $("#js-fetch-btn-text").html("获取验证码");
            countdown = 60;
        } else {
            btn.addClass("disabled"); 
            countdown--;
            val.html(countdown);
            setTimeout(function() {
                settime(val, btn)
            },1000)
        } 
    }
  
    // 获取验证码（无数字验证过程）
    $(".js-sms-send").click(function(){  
        var $this = $(this);
        var url = $this.attr("data-sms-url");  
        $.ajax({
            url : url,
            type : 'post',
            data:{
                to: $("#mobile").val() ,
                sms_type: "sms_login",
                exts: $('input[name=telext]').val(),
                captcha_num: "" 
            } , 
            success : function(t){ 
                console.log(t);
                if(("undefined" != typeof t.ACK) && ("ok" == t.ACK) ){
                    $("#js-time-left").html("60");
                    $("#js-fetch-btn-text").html(Translator.trans("秒后获取"));
                    // Translator.trans("发送短信成功");
                    layer.msg("发送短信成功");
                    settime($("#js-time-left"), $this); 
                }else{
                    if("undefined" != typeof t.error){ 
                        layer.msg(t.error);
                        // (0, c.default)("danger", t.error)  
                    }else{
                        layer.msg("发送短信失败，请联系管理员");
                        // (0, c.default)("danger", Translator.trans("发送短信失败，请联系管理员"))
                    }
                }


 
            }
        });

    }) 

    // 验证码登录/注册提交old
    $(".btn_code_loginold").bind("click", function(){
        if(validator.form()){
            var url = $(".state-code").attr("data-url");  
            $.ajax({
                url : url,
                type : 'post',
                data: $('#login-form').serialize(),
                success : function(data){ 
                    console.log(data);
                    if(data.code == 200){//登录成功 
                        layer.msg(data.message); 
                        window.location.reload();
                    }else if(data.code == 100){//注册成功,去完善资料
                        if(data.userdata.mobile != ""){
                            $(".info_bound").removeClass("hide");
                            $(".info_mobile_show").text(data.userdata.mobile);
                            $(".info_mobile_exts").text("+"+$('input[name=telext]').val());
                            $(".info_mobile").val(data.userdata.mobile);
                        } 

                        $(".unregistered_box").removeClass("hide").siblings(".registered_box").addClass("hide");
                        
                    }else{
                        layer.msg(data.message);
                    }  
                    
                }
            });
        }
    })

    //优化注册登录9月16
    $(document).off('click','.btn_code_login').on('click','.btn_code_login',function(){
        var $self = $(this),param="";
        var url = $(".state-code").attr("data-url");  
        if($self.attr('data_lock')){
            return false;
        }
         $self.attr('data_lock',1).addClass('disable');
         debugger
         //中秋活动的登录注册
         if ($self.attr('data-actMid') == 'mid') {
            param=$('#login-form').serialize()+"&inviteUserId="+$self.attr('data-source');
         }
         else {
            param=$('#login-form').serialize();
         }
        if(validator.form()) {           
            $.ajax({
                url : url,
                type : 'post',
                data: param,
                success : function(data){ 
                    console.log(data);
                    if(data.code == 200){//登录成功 
                        layer.msg(data.message); 
                        window.location.reload();
                    }else if(data.code == 100){//注册成功,去完善资料
                        if(data.userdata.mobile != ""){
                            $(".info_bound").removeClass("hide");
                            $(".info_mobile_show").text(data.userdata.mobile);
                            $(".info_mobile_exts").text("+"+$('input[name=telext]').val());
                            $(".info_mobile").val(data.userdata.mobile);
                        } 

                        $(".unregistered_box").removeClass("hide").siblings(".registered_box").addClass("hide");
                        
                    }else{
                        layer.msg(data.message);
                    }  
                    
                },
                complete:function(){
                  $self.removeAttr('data_lock').removeClass('disable'); 
                }
            });
        }
        else{
            $self.removeAttr('data_lock').removeClass('disable'); 
        }
             
    })

    // 关闭弹窗入口
    $(".ordinary_mask .closeover").bind("click", function(){
        $(".ordinary_mask").addClass("hide");
    })

    // 登录切换动效-去登录密码
    $(".ordinary_mask .switch_pwd").bind("click", function(){ 
        $('.alert-box-pwd').removeClass('outerDiv_hide hide').addClass('outerDiv_block');
        $('.alert-box-code').removeClass('outerDiv_block').addClass('outerDiv_hide hide'); 
    })

    // 登录切换动效-去验证登录
    $(".ordinary_mask .switch_code").bind("click", function(){ 
        $('.alert-box-code').removeClass('outerDiv_hide hide').addClass('outerDiv_block');
        $('.alert-box-pwd').removeClass('outerDiv_block').addClass('outerDiv_hide hide'); 

    })

    // 移动端浏览器-普通课程-登录/注册弹出
    $(".course_not_login").bind("click", function(){ 
        $(".ordinary_mask").removeClass("hide");
        $('.alert-box-code').removeClass('outerDiv_hide hide').addClass('outerDiv_block');
    })
     


}]);