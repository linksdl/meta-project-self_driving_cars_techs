 var $form = $('#login-form-pwd');

var pwd_validator = $form.validate({
	rules: {
		mobile: {
			required: !0
		},
		_username: {
			required: !0,
			remote:{ 
　　　　　　　　　　url:'/login/check/email_or_mobile', 
　　　　　　　　　　type:'get', 
　　　　　　　　　　data:{

　　　　　　　　　　} 
　　　　　　　　} 
		},
		sms_code: {
			required: true,
		},
		_password: {
			required: !0
		},
	},
	messages:{
		mobile: {
			// required: '请输入11位手机号',
			required: Translator.trans("请输入手机号")
		},
		_username: {
			required: '手机号码不能为空',
			remote: '仅支持邮箱/手机号登录'
		},
		sms_code: {
			required: '请输入验证码',
		},
		_password: {
			// required: '请输入密码',
			required: Translator.trans("请输入密码")
		},
	}
});
// $('#login-form').keypress(function (e) {
// 	if (e.which == 13) {
// 		$('.js-btn-login').trigger('click');
// 		e.preventDefault(); // Stops enter from creating a new line
// 	}
// });
 

    $('.js-btn-login-pwd').click(function(event){ 
		var $self = $(this),param="";
		//中秋活动的登录注册
		if ($self.attr('data-actMid') == 'mid') {
            param=$("#login-form-pwd").serialize()+"&inviteUserId="+$self.attr('data-source');
         }
         else {
            param=$("#login-form-pwd").serialize();
         }
        if (pwd_validator.form()) {
            $(event.currentTarget).button('loadding');
            // 密码登录/注册提交  
            var url = $("#login-form-pwd").attr("data-url");  
            $("#login_username").attr("name", "nickname");
            $("#login_password").attr("name", "password") 
            $.ajax({
                url : url,
                type : 'post',
                data: param,
                success : function(data){ 
                    console.log(data);
                    if(data.code == 0){
						layer.msg(data.message);
						$("#login_username").attr("name", "_username");
            			$("#login_password").attr("name", "_password") 
						window.location.reload();
						
                    }else{
						layer.msg(data.message);
						$("#login_username").attr("name", "_username");
            			$("#login_password").attr("name", "_password") 
                    }
                    
                }
            });  
        }
    });
// $('js')

$('.receive-modal').click();

















 
