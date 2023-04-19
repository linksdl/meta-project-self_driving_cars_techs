function handleAmountAct(){
    var $parent,isChecked,
    cartListNum=0, //选中的商品数量
    idsVal,
    subTotal=0, // 单个商品的总额，默认等于0
    $needPay = $("#needPay"),needPay = Number($needPay.text()),
    $checkCount = $("#checkCount"),
    checkCount = Number($checkCount.text());
    var $handleAmountForm = $('#handleAmountForm');
    // 全选
    $('#checkAllList').off('change').on('change', function () {
        var $t = $(this);
        $parent = $t.parents('.checkAllList-box');
        subTotal=0;
        isChecked = $t.prop('checked');
        if (isChecked) {
            $parent.addClass("active");
            $('.js_item .js-input-checkbox').prop('checked', true);
            $('.js_item .js_cbox').addClass("active");// 选中
            cartListNum = $('.js_cbox.active').length;
                $(".js_item.js-canCheck").each(function () {
                    $t = $(this);
                    subTotal += Number($t.find('.js_cbox').attr('data-price'));
                });
            $checkCount.text(cartListNum);
            needPay = (0 + subTotal).toFixed(2);
            $needPay.text(needPay);
        }
        else {
            $parent.removeClass("active");
            $('.js_item .js-input-checkbox').prop('checked', false);
            $('.js_item .js_cbox').removeClass("active");
            $needPay.text('0.00');//结算金额
            $checkCount.text('0');//购课数量
        }
    });
    // 购物车课程里面的单个选中
    $handleAmountForm.off('change', '.js-input-checkbox').on('change', '.js-input-checkbox', function () {
        var $t = $(this);
        $parent = $t.parents('.js_item').find('.js_cbox');
        isChecked = $t.prop('checked');
        subTotal=Number($parent.attr('data-price'));//该门课程的金额
        if (isChecked) {
            $parent.addClass("active");
            // 计算➕钱
            // 结算的金额变化
            checkCount = Number($checkCount.text()); //总数量
            needPay = Number($needPay.text()); //结算金额
            needPay = (needPay + subTotal).toFixed(2);
            $needPay.text(needPay);
            needPay = Number($needPay.text()); //结算金额
            // 购买的数量变化
            checkCount = checkCount + 1;
            $checkCount.text(checkCount);
        }
        else {
            $parent.removeClass("active");
            //减钱
             // 结算的金额变化
             checkCount = Number($checkCount.text()); //总数量
             needPay = Number($needPay.text()); //结算金额
             needPay = (needPay - subTotal).toFixed(2);
             $needPay.text(needPay);
             needPay = Number($needPay.text()); //结算金额
             // 购买的数量变化
             checkCount = checkCount - 1;
             $checkCount.text(checkCount);
        }
    });
    
    // 删除js_del-course
    $('.js_del-course').off('click').on('click', function () {
        var $t = $(this);
        $parent = $t.parents('.js_item');
        
        isChecked = $parent.find('.js-input-checkbox').prop('checked');
        idsVal=$parent.attr('data-cartId');
        cartListNum=$t.parents('.js-mycart-lists').find('.js_item').length;
        $.ajax({
            url: '/shopping/cart_delete',
            type: 'post',
            data: {
                "ids":idsVal
            },
            // traditional: true,
            success: function(r) {
                debugger
                if(r.code==0){                
                    cartListNum--;
                    if (cartListNum>0) {  
                        if (isChecked) {
                            layer.msg(r.message); //toast删除成功 
                            $t.parents(".js_item").remove();
                             // 判断是否选中，选中的话，需要计算金额\勾选数据                             console.log('购物车还有数据，需要计算金额，数量等');
                             // 结算的金额变化
                            checkCount = Number($checkCount.text()); //总数量
                            needPay = Number($needPay.text()); //结算金额
                            needPay = (needPay - subTotal).toFixed(2);
                            $needPay.text(needPay);
                            needPay = Number($needPay.text()); //结算金额
                            // 购买的数量变化
                            checkCount = checkCount - 1;
                            $checkCount.text(checkCount);
                        }
                        else{
                            layer.msg(r.message); //toast删除成功 
                            setTimeout(function () {
                                $t.parents(".js_item").remove();
                            }, 500);
                        }                                          
                        // 头部导航购物车数量需要变动 大于99，显示99+
                        $('.js-shopCount').text(cartListNum);
                    } else {     
                        layer.msg(r.message); //toast删除成功                        
                        setTimeout(function () {
                            window.location.reload();
                        }, 500);
                    }
                    
                }
                else{
                    layer.msg(r.message);
                }
            },
            error: function() {
                layer.msg("Oops，网络发生错误了，请刷新重试～");
            }
        });
    });

    // 课程详情页加入购物车js-join-shop，后续优化考量快点的操作
    $('.js-join-shop').off('click').on('click', function () {
        var $t = $(this);
        var shopCount=Number($('#shopCount').text()),mShopCount=Number($('#mShopCount').text());
        $.ajax({
            url: '/shopping/cart_add',
            type: 'post',
            data: {
                "targetId":$t.attr('data-targetId')
            },
            // traditional: true,
            success: function(r) {
                if(r.code==0){      
                    $('#shopCount').text(shopCount+1);   
                    $('#mShopCount').text(mShopCount+1);        
                    layer.msg(r.message);
                }
                else{
                    layer.msg(r.message);
                }
            },
            error: function() {
                layer.msg("Oops，网络发生错误了，请刷新重试～");
            }
        });
    });

    // 去结算order-cart
    $('.js_order-cart').off('click').on('click', function () {
        if ($('.js-mycart-lists').find('.js_cbox.active').length>0) {
            $handleAmountForm.submit();
        } else {
            layer.msg('请至少选择一门课去结算～');
            return;
        }    
    });
};

$(function () {
    // 操作购物车
    handleAmountAct();
    //  点击返回时强制页面刷新解决办法（pageshow）
    window.addEventListener('pageshow', function(e) {
        if (e.persisted || window.performance && window.performance.navigation.type == 2) {
        location.reload();
     }
    }, false);
});
