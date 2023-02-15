
var $formfill = $('#fill-userinfo-form');
var validator_info;
validator_info = $formfill.validate({
    debug:true,
    rules: {
        // mobile_info: {
        //     required: !0,
        //     phone: !0
        // },
        nickname: {
            required: true,
            minlength: 4,
            maxlength: 16,
            chinese_alphanumeric:!0,
            es_remote: {
                type: 'get',
              }
        },
        school: {
            required: true,
        }
    },
    messages: {
        // mobile_info: {
        //     required: '请输入手机号'
        // },
        nickname: {
            required: '请输入用户昵称',
            remote: Translator.trans('该用户昵称已经存在')
        },
        school: {
            required: '请输入学校',
        }
    }
});
 

$('.btn_info_login').click(function(){
    if (validator_info.form()) {
      console.log('验证通过');
      var url = $formfill.attr("data-url");  
      $.ajax({
          url : url,
          type : 'post',
          data: $formfill.serialize(),
          success : function(data){ 
              console.log(data); 
              if(data.code == 200){
                layer.msg(data.message);  
                sessionStorage.setItem('tag', '1'); 
                window.location.reload();  
              }else{
                layer.msg(data.message); 
              }
          }
      }); 

    }
    else{
        console.log('验证失败');
    }
});

// 兴趣标签是否弹出 0不弹 1弹出
var tag = sessionStorage.getItem('tag');
if(tag == 1){
    $(".info-interest-tag,.cs-global-question").removeClass("toShow");
}else{
    $(".info-interest-tag,.cs-global-question").addClass("toShow");
}

// 兴趣标签 选好了 设置标记
$(".js_submit_tag").bind("click", function(){
    sessionStorage.setItem('tag', '0'); 
})

// 关闭兴趣标签弹窗
$(".info-interest-tag .info_tag_cancle").bind("click", function(){
    $(".info-interest-tag").addClass("toShow");
    sessionStorage.setItem('tag', '0'); 
})

// validator_info.addItem({
//     element: '#nickname',
//     required: true,
//     rule: 'chinese_alphanumeric byte_minlength{min:4} byte_maxlength{max:16} remote'
// });