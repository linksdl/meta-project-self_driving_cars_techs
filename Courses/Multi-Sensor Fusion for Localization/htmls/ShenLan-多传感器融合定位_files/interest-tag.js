function interestTagPage() {
    var activeTag, $tagNum = $('.js_submit_tag .num'), param,
        $tagActive, postData, $parent, isChecked = false;
    // 点击切换兴趣标签
    $tagActive = $('.interest-taglist .active');
    activeTag = $tagActive.length;
    $tagNum.text(activeTag);
    $(document).off('change', '.interest-taglist input[type=checkbox]').on('change', '.interest-taglist input[type=checkbox]', function () {
        var $textTag = $(this);
        $parent = $textTag.closest('.item-tag-box');
        activeTag = $('.interest-taglist .active').length;
        if (activeTag >= 3 && !$parent.hasClass('active')) {
            layer.msg('最多只能选择3个哦～', { time: 1000 });
            $textTag.attr('checked', false);
            return false;
        }
        else {
            if ($parent.hasClass('active')) {
                $tagNum.text(activeTag - 1);
            } else {
                $tagNum.text(activeTag + 1);
            }
            $parent.toggleClass('active');
        }

    });
    // 点击选好了 
    $(document).off('click', '.js_submit_tag').on('click', '.js_submit_tag', function () {
        var $submitTag = $(this);
        if ($submitTag.find('.num').text() == 0) {
            layer.msg('请选择感兴趣的领域~', { time: 1000 });
            return false;
        }
        // 接口请求
        $.post($submitTag.data('action'), $('.item-tag-box.active input').serialize(), function () {
            layer.msg('您的兴趣领域已更新~');
            setTimeout(function() {
                if ($submitTag.data('url')) {
                    window.location.href = $submitTag.data('url'); //注册页面执行操作
                } else {
                    //修改页面执行操作
                    window.location.reload(true);
                }
            }, 1000)
           
        }).error(function () {
            layer.msg('网络错误了～');
            setTimeout(function(){
                window.location.reload();
            },1000)
        });

    });
    // 点击修改  
    $(document).off('click','.js-edit-tag').on('click','.js-edit-tag',function(){
        var $editTag=$(this);
        $('.interest-tag').removeClass('toShow');
    });
    // 点击关闭
    $(document).off('click','.js_jump_tag').on('click','.js_jump_tag',function(){
        window.location.reload();
    });
};
$(document).ready(function () {
    interestTagPage();
});
