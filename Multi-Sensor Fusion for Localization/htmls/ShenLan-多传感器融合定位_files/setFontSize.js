'use strict';

(function () {
    function add_font_size() {
        var deviceWidth = document.documentElement.clientWidth;
        if (deviceWidth > 768) {
            deviceWidth = 768
        }
        document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px';
    };
    add_font_size();

    function resize() {
        window.onresize = add_font_size();
    }
    requestAnimationFrame(resize);
    //    论文集领取页面
    function getPaperPage(iNum) {
        $.get("/common/wechat/check", {
            scene_id: $('.getpaper-page input[name="scene_id"]').val()
        }, function (data) {
            if (data.code == 200) {
                layer.msg('恭喜你，扫码绑定成功');
                return;
            } else if (data.code == 201) {
                layer.msg('微信已绑定其他深蓝账号，请重新关注', {
                    time: 3000,
                    shade: 0.6,
                    shadeClose: true
                });
            } else {
                setTimeout(function () {
                    if ($('.getpaper-page').length > 0) {
                        if (++iNum > 30) {
                            $('.getpaper-page .lose-warning').css({
                                'z-index': '1'
                            });
                            return;
                        } else {
                            getPaperPage(++iNum);
                        }
                    }
                }, 2000);
            }
        });
    };
    // 如果是论文集领取页面≥
    if ($('.getpaper-page').length > 0 && $('.getpaper-page input[name="scene_id"]').val()) {
        getPaperPage(1);
    }
    cooper();

    function activeSideBarFixed() { //滚动吸顶
        var $activeSideBar = $('.js-nav-headerwrap');
        var navTop = 0;
        if ($activeSideBar[0]) {
            navTop = $activeSideBar.offset().top;
        }
        $(window).scroll(function () {
            var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
            // 记住当前页面的滚动距离
            $activeSideBar.find('.active').attr('data-scroll', scrolltop);
            if (scrolltop > navTop) {
                // sideTop = scrolltop - navTop;
                $activeSideBar.addClass('fixed');
            } else {
                $activeSideBar.removeClass('fixed');
            }
        });
    };
    // 如果需要滚动吸顶
    if ($('.js-nav-headerwrap').length > 0) {
        activeSideBarFixed();
    }
})();

(function () {
    // 点击“个人中心”显示/隐藏下拉框
    var personalCenterElement = $('.mobile-header .icon-personal-center'),
        dropdownMenuElement = $('.mobile-header .dropdown-menu');
    personalCenterElement.on(
        'touchstart click tap',
        function () {
            dropdownMenuElement.css('display') != 'none' ? dropdownMenuElement.hide() : dropdownMenuElement.show();
            return false;
        }
    );
    $(document).on(
        'click',
        function () {
            dropdownMenuElement.hide();
        }
    );
    dropdownMenuElement.on(
        'click',
        function (event) {
            event.stopPropagation();
        }
    );

    // 导航栏定位当前页面
    var navLiElements = $('#nav li'),
        windowUrl = location.pathname,
        wholeWindowUrl = location.protocol + '//' + location.hostname + location.pathname;

    if (wholeWindowUrl.charAt(wholeWindowUrl.length - 1) == '/') {
        wholeWindowUrl = wholeWindowUrl.substr(0, wholeWindowUrl.length - 1);
    }
    navLiElements.each(function (index, item) {
        var currentLi = $(item),
            linkUrl = currentLi.find('a').attr('href');

        if (index != 6) {
            if (linkUrl.indexOf('http') != -1) {
                if (linkUrl == wholeWindowUrl) {
                    currentLi.addClass('active')
                        .siblings()
                        .removeClass('active');
                }
            } else {
                if (linkUrl == windowUrl) {
                    currentLi.addClass('active')
                        .siblings()
                        .removeClass('active');
                }
            }
        }

    });
    $(".navbar .ld_icon").click(function (event) {
        $(".navbar .ld_cont").toggle();
        event.stopPropagation();
    })
    $(".navbar .ld_cont div a").click(function (event) {
        $(this).addClass("active").siblings().removeClass("active");
    });

    // 分类没有的时候，提示
    $(document).off('click', '.js_nohot-tag').on('click', '.js_nohot-tag', function () {
        layer.msg('课程暂未开放，敬请期待~');
    });
    //未报名学员，toast提示
    $(document).off('click', '.js-notmember-toast').on('click', '.js-notmember-toast', function () {
        layer.msg('报名后即可解锁课程内容哦~');
    });
    //一元解锁详情页邀请海报
    $(document).off('click', '.js_close-poster').on('click', '.js_close-poster', function () {
        var $t = $(this);
        if ($t.attr('data-parent')) {
            $('.' + $t.attr('data-parent')).remove();
        }
    })
})();
// 视频播放
$("video").on("play", function () {
    $("video").not(this).each(function () {
        $(this)[0].pause();
    });
});
$('.merge-tab-nav a').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
});
//s搜索公开课/大课js-tab-search
$('.js-tab-search').off('click').on('click', function () {
    var _this = $(this),
        openCt = _this.attr('switch-content'),
        closeCt = _this.attr('switch-close');
    _this.addClass('active').siblings().removeClass('active');
    $('.' + closeCt).removeClass('active');
    $('.' + openCt).addClass('active');
    $(document).scrollTop(2); //触发滚动事件
});
// 通用倒计时(例如 3，2，1)
function HandlecountDown(num) {
    var item = $(".js-turn");
    item.find(".js-countdown").text(num);
    if (num-- > 0) {
        setTimeout(function () {
            HandlecountDown(num);
        }, 1000);
    } else {
        item.parents('.countdown-box').remove();
    }
};

// 右下角 返回顶部
$('#goTopSl').off('click').on('click', function () {
    var scrollTop = $(window).scrollTop();
    $("body,html").animate({
        scrollTop: 0
    }, 300);
});
$('.gotopA').off('click').on('click', function () {
    var scrollTop = $(window).scrollTop();
    $("body,html").animate({
        scrollTop: 0
    }, 300);
});

// 右下角点击菜单js-caidan
$('.js-caidan').off('click').on('click', function () {
    $('.js-candan-info').toggleClass('show');
});
// 右下角提示文案
$('.js-show-tips').hover(function () {
    $(this).addClass('showtips');
}, function () {
    $(this).removeClass('showtips');
});
// alert($(window).width())
let transformSanJiao = false;
$('.side-icon').click(function() {
    if (transformSanJiao == true) {
        $(this).css({'transform': 'rotate(180deg)'});
        $('.side-auxiliary_wrap').animate({'height': '310px'});
        transformSanJiao = false;
    } else {
        $(this).css({'transform': 'rotate(0deg)'});
        $('.side-auxiliary_wrap').animate({'height': '0px'});
        transformSanJiao = true;
    }
    // $('.side-auxiliary').fadeToggle("slow")
})
$('.m-side-close').off('click').on('click', function() {
    $('.m-side-auxiliary-wrap').animate({'right': '-42px'},'slow', function() {
        $('.m-side-open').fadeIn("slow");
    })
})
$('.m-side-open').off('click').on('click', function() {
    $('.m-side-open').fadeOut("slow");
    $('.m-side-auxiliary-wrap').animate({'right': '0px'})
})
let startTop = 0;
let endTop = 0;
let timer = null; // 定时器
let once = true;
$(window).on("scroll", function(){
    // 滚动时只执行一次
    if (once == true) {
        $('.m-side-im').animate({'right': '-32px'});    
    }
    once = false;
    clearTimeout(timer)
    timer = setTimeout(isScrollEnd, 300)
    startTop =  $(window).scrollTop()
})
function isScrollEnd() {
    endTop = $(window).scrollTop();
    if(endTop == startTop){
        clearTimeout(timer)
        $('.m-side-im').animate({'right': '0px'});
        once = true;
    }
}
// 广告图  
$('.js-gClose').off('click').on('click', function () {
    $('.js-g-banner-box').remove();
});
// 公众号请求是否绑定成功
function wechatCheck_login(iWechatNum) {
    console.log($('.footer-wechat input[name="scene_id"]').val(), 'what this')
    $.get("/common/wechat/check", {
        scene_id: $('.footer-wechat input[name="scene_id"]').val()
    }, function (data) {
        console.log(data, '&&&&')
        if (data.code == 200) {
            $('.wechatSetting-box .wechat-step1').remove();
            $('.wechatSetting-box .wechat-step-success').removeClass('hide');
            HandlecountDown(3);
        } else if (data.code == 201) {
            $('.wechatSetting-box').remove();
            layer.msg('微信已绑定其他深蓝账号，请重新关注', {
                time: 3000,
                shade: 0.6,
                shadeClose: true
            });
        } else {
            setTimeout(function () {
                if ($('.wechatSetting-box .wechatSceneId').length > 0) {
                    if (++iWechatNum > 30) {
                        $('.wechatSetting-box').remove();
                        layer.msg('由于您长时间未操作，已为您关闭弹窗啦～', {
                            time: 5000,
                            shade: 0.6,
                            shadeClose: true
                        });
                    } else {
                        wechatCheck_login(iWechatNum);
                    }

                }
            }, 2000);
        }
    });
};
// $('.js_verifiedMobil_sms').off('click').on('click', function() {
//     console.log('click')
//     wechatCheck_login(1);
// })
// 右下角 公众号
$('.js_service-setting').off('click').on('click', function () {
    var $self = $(this);
    if ($self.attr('data_lock')) {
        return false;
    };
    $self.attr('data_lock', 1).addClass('disable');
    $.ajax({
        url: '/common/wechat/window',
        type: 'get',
        success: function (r) {
            $('#settingContent')[0].innerHTML = r;
            if ($('.wechatSetting-box .wechatSceneId').length > 0) {
                wechatCheck_login(1);
            };
        },
        error: function () {
            alert('未知网络错误！请刷新重试～');
        },
        complete: function () {
            $self.removeAttr('data_lock').removeClass('disable');
        }
    });
});
// 右下角标示de 展开与关闭js_entry-collapse
$('.js_entry-collapse').off('click').on('click', function () {
    $(this).toggleClass('normal collapsed').siblings().toggleClass('visihidden');
});

// 小眼睛的打开与关闭
$('.js_eye').off('click').on('click', function () {
    let $current = $(event.currentTarget).addClass('displayhidden'),
        $type = $current.prev().attr('type');
    $current.siblings('.js_eye.displayhidden').removeClass('displayhidden');
    $('#login_password').attr('type', ($type == 'password') ? 'text' : 'password');
});
// 公众号相关服务号弹窗关闭
$(document).off('click', '.wechatSetting-box,.wechatSetting-box .closeover').on('click', '.wechatSetting-box,.wechatSetting-box .closeover', function () {
    $('.wechatSetting-box').remove();
});
// 公开课预约成功弹窗关闭
$(document).off('click', '.openCourse-box .closeover').on('click', '.openCourse-box .closeover', function () {
    // $('.openCourse-box').addClass('hide');
    window.location.reload();
});

$('.logout-unbind').off('click').on('click', function () {
    $.cookie('is_cookienum', null, {
        path: '/',
        domain: 'shenlanxueyuan.com'
    });


});
// 个人设置-基础信息-复制转化码
var $copy_btn = $('#copy');
$copy_btn.off('click').on('click', function () {
    if (document.execCommand) {
        var inputText = document.getElementById('copy_content_inp');
        var currentFocus = document.activeElement;
        inputText.focus();
        inputText.setSelectionRange(0, inputText.value.length);
        document.execCommand('copy');
        currentFocus.focus();
        alert('复制成功～'); //操作提示信息('复制成功～');
    } else {
        alert('该浏览器不支持，请手动复制～'); //操作提示信息('该浏览器不支持，请手动复制～');
    }
});
// 支付成功，复制班主任二维码
$('.js-copy-code').off('click').on('click', function () {
    var $t = $(this);
    if (document.execCommand) {
        var copyVal = $t.parent().find('.js-setcode')[0];
        copyVal.select();
        document.execCommand('copy');
        $(copyVal).blur();
        layer.msg('复制成功～');
    } else {
        alert('该浏览器不支持，请手动复制～'); //操作提示信息('该浏览器不支持，请手动复制～');
    }
});

// 合作企业合作表单
$(document).off('click', '.js-cooperation').on('click', '.js-cooperation', function () {
    var $t = $(this),
        $parent = $t.parent();
    if ($parent.find('[name="cooperationName"]').val().trim() == "") {
        layer.msg('请填写企业名称');
        return;
    } else if (!$parent.find('[name="enterpriSecale"]').val()) {
        layer.msg('请选择企业规模');
        return;
    } else if (!$parent.find('[name="industry"]').val()) {
        layer.msg('请选择行业');
        return;
    } else if ($parent.find('[name="username"]').val().trim() == "") {
        layer.msg('请填写姓名');
        return;
    } else if ($parent.find('[name="mobile"]').val().trim() == "") {
        layer.msg('请填写手机号');
        return;
    }
    if ($t.attr('data_lock')) {
        return false;
    }
    $t.attr('data_lock', 1).addClass('disable');
    $.ajax({
        url: '/enterprise/cooperation/add',
        type: 'post',
        data: $parent.serialize(),
        dataType: 'json',
        success: function (r) {
            if (r.code == 200) {
                var cooperationHtml = [
                    '<div class="cooperation200">',
                    '<img src="/static-dist/app/img/shenlan21/cooperation/tijiaochenggong02_icon.png">',
                    '<p class="tip">提交成功</p>',
                    '<p class="subtip">您的联系请求已提交，我们将很快联系您。</p>',
                    '</div>'
                ];
                cooperationHtml = cooperationHtml.join('');
                layer.open({
                    type: 1,
                    area: ['300px', '200px'],
                    title: false,
                    shade: 0.6,
                    content: cooperationHtml,
                    closeBtn: 0,
                    time: 5000
                });
                $parent[0].reset();
                $parent.find('[name="enterpriSecale"]').val("").next().text('企业规模');
                $parent.find('[name="industry"]').val("").next().text('行业');

            } else {
                layer.msg(r.message);
            }
        },
        error: function () {
            layer.msg("Oops,网络发生错误了，请刷新重试～");
        },
        complete: function () {
            $t.removeAttr('data_lock').removeClass('disable');
        }
    });
});

function cooper() {
    $('.cooperation-topic .select').on('click', '.placeholder', function (e) {
        var parent = $(this).closest('.select');
        if (!parent.hasClass('is-open')) {
            parent.addClass('is-open');
            $('.cooperation-topic .select.is-open').not(parent).removeClass('is-open');
        } else {
            parent.removeClass('is-open');
        }
        e.stopPropagation();
    }).on('click', 'ul>li', function () {
        var parent = $(this).closest('.select');
        parent.removeClass('is-open').find('.placeholder').text($(this).text());
        parent.find('input[type="hidden"]').val($(this).attr('date-value'));
    });

    $('body').on('click', function () {
        $('.cooperation-topic .select.is-open').removeClass('is-open');
        $('.ailogin .select.is-open').removeClass('is-open');
    });

    // 登录注册
    $('.ailogin .select').on('click', '.placeholder', function (e) {
        var parent = $(this).closest('.select');
        if (!parent.hasClass('is-open')) {
            parent.addClass('is-open');
            $('.ailogin .select.is-open').not(parent).removeClass('is-open');
        } else {
            parent.removeClass('is-open');
        }
        e.stopPropagation();
    }).on('click', 'ul>li', function () {
        var parent = $(this).closest('.select');
        $(this).addClass('active').siblings().removeClass('active');
        parent.removeClass('is-open').find('.placeholder').text('+ ' + $(this).attr('data-value'));
        parent.find('input[type="hidden"]').val($(this).attr('data-value'));
    });
}

// 页面路由为/blue/card 导航则取消置顶定位
if (window.location.pathname == "/blue/card") {
    $(".es-header.headerfixed").css("position", "absolute");
} else {
    $(".es-header.headerfixed").css("position", "fixed");
}


// 小蓝卡弹窗 
if ($(".blue_card_mask").length > 0) {
    $(document).off('click', '.blue_card_mask .closeover').on('click', '.blue_card_mask .closeover', function () {

        if ((".c-intro-banner").length > 0) {
            // var h = ($(".c-intro-banner").offset().top) + "px";
            // var l = ($(".c-intro-banner").offset().left - 27) + "px"; 
            var h = "500px";
            var l = "1000px";
            $('.blue-box').addClass("blue_scale").css("transform", "translate(" + l + "," + h + ")");
            $('.blue_card_mask').animate({
                opacity: 0
            }, 200);
        }

        setTimeout(function () {
            $('.blue_card_mask').addClass("hide");
        }, 1500);

        $.cookie('is_read_blue', "yes", {
            path: '/',
            domain: 'shenlanxueyuan.com'
        });
    });

    $(document).off('click', '.blue_card_mask').on('click', '.blue_card_mask', function () {
        $.cookie('is_read_blue', "yes", {
            path: '/',
            domain: 'shenlanxueyuan.com'
        });
    });

    // 移动到这里/验证码登陆报错cookie了，需要判断元素是否存在可以
    // 小蓝卡弹窗is_read_blue==yes 且 登录过的用户已弹过就不再弹出
    if ($.cookie("is_read_blue") == "yes") {
        $('.blue_card_mask').addClass("hide");
    } else {
        if ($(".login_show").length > 0) {
            $('.blue_card_mask').removeClass("hide");
            $.ajax({
                url: '/common/set_blue/card ',
                type: 'get',
                success: function (data) {
                    console.log(data);
                },
                error: function () {},
                complete: function () {}
            });
        }
    }
}



// 小蓝卡支付结果-登记表弹窗
if ($(".completed_btn").length > 0) {
    $(document).off('click', '.completed_btn').on('click', '.completed_btn', function () {
        $('.grade_table_mask').addClass('hide');
    });
}


// 我的教室轮播图
if ($('.mycourse-banner').length > 0)
    var MyCourseIndex = new Swiper('.mycourse-banner', {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
    });


// 我的教室的悬浮框
var toshengli = 1;
$('.hover-box').on('mouseenter', function () {
    $('.resbox').show();
    if (toshengli == 1) {
        $.ajax({
            url: "/esbar/my/study_header",
            type: "get",
            success: function (res) {
                $('.resbox').html(res)
            }
        })
        toshengli = 0;
    }

})

$('.hover-box').on('mouseleave', function () {
    $('.resbox').hide()
    toshengli = 1;
    return false
})

// m站折叠按钮效果
if ($('#showMenu').length > 0) {
    var sign = true;
    $('#showMenu').click(function () {
        if (sign) {
            $('.service-moblie-box').css({
                "display": 'block'
            })
            sign = false
        } else {
            $('.service-moblie-box').css({
                "display": 'none'
            })
            sign = true
        }
    })
}

// 购物车“去结算”按钮
var cartStr = '';
$('.closing').click(function () {
    var url = $('.closing').attr('data-url');
    // https://dev.shenlanxueyuan.com/cart/order/show?orderType=shopping_cart&targetType=course&targetIds[]=765&targetIds[]=250
    var inps = $('.inp-check:checked')
    var targetIdsArr = []

    if (inps.length > 0) {
        for (let i = 0; i < inps.length; i++) {
            targetIdsArr.push(inps.eq(i).val())
        }

        for (let i = 0; i < targetIdsArr.length; i++) {
            cartStr += '&targetIds[]=' + targetIdsArr[i]
        }
        url = url + cartStr
        window.location.href = url
    } else {
        layer.msg('至少选择一门课程哦~')
    }
    console.log(url)
})
// 跑马灯
if ($('#booksMarquee').length > 0) {
    $('#booksMarquee').kxbdSuperMarquee({
        isMarquee: true,
        isEqual: false,
        scrollDelay: 20,
        direction: 'left'
        //direction: 'left',//滚动方向，'left','right','up','down'
    });
}


// 我的教室之问答/话题的回复内容js-htmlraw-text
if ($('.js-htmlraw-text').length > 0) {
    var regex0 = new RegExp("(i?)(\<img)([^\>]+\>)", "gmi");
    $('.js-htmlraw-text').each(function () {

        $(this).html($(this).html().replace(regex0, "[图片]"));
    })
}
$(document).off('click', '.js-switch-item').on('click', '.js-switch-item', function () {
    var _$this = $(this);
    _$this.addClass('hide').siblings().removeClass('hide');
    _$this.parents('.homework').toggleClass('showall');
});
$(document).ready(function() {
    if (sessionStorage.curCourseTabsName) {
        $('.course-tabs-item').each(function(index, value) {
            if ($(this).attr('name') === sessionStorage.curCourseTabsName) {
                $(this).addClass('active')
            } else {
                $(this).removeClass('active')
            }
        })
        $('.course-tabs-pane').hide();
        $(`.cs-${sessionStorage.curCourseTabsName}`).show();
    } else {
        $('.course-tabs-item').eq(0).addClass('active');
        $('.course-tabs-pane').eq(0).show();
    }
})
var isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
// 516详情页
$('.course-tabs-item').click(function() {
    let _$this = $(this);
    sessionStorage.curCourseTabsName = _$this.attr('name')
    _$this.addClass('active').siblings().removeClass('active');
    $('.course-tabs-pane').hide();
    $(`.cs-${_$this.attr('name')}`).show();
    studyBarAffix();
}) 
var formatStatusTime = function(time) {
    return time.replace('小时', 'h').replace('分钟', 'm')
}
if ($(window).width() <= 750) {
    let csStudyStatusTime = $('.study-status-box').find('.cs-study-status-time');
    let csStudyStatusTime2 = $('.cs-study-status-wrap__hide').find('.cs-study-status-time');
    csStudyStatusTime.text(formatStatusTime(csStudyStatusTime.text()))
    csStudyStatusTime2.text(formatStatusTime(csStudyStatusTime2.text()))
    
}
function throttle(fn, interval) {
  var last = 0;
  var timer = null;

  return function() {
    // this和argument
    var _this = this;
    var _arguments = arguments;

    var now = new Date().getTime();
    if (now - last > interval) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(_this, _arguments);
      last = now;
    } else if (timer === null) { // 只是最后一次
      timer = setTimeout(function() {
        timer = null;
        fn.apply(_this, _arguments);
      }, interval);
    }
  }
}
studyBarAffix()
let courseTabsWrapPosition = $('.course-tabs-wrap').length ? $('.course-tabs-wrap').offset().top : 0
let courseContentPosition = $('.course-tabs-content').length ? $('.course-tabs-content').offset().top : 0
var fixedClass = isPhone ? 'm-course-tabs-wrap-fixed' : 'course-tabs-wrap-fixed'
// if (isPhone) {
//     $('.course-show-footer').hide()
// }
function mounting() {
    let scTop = $("html").scrollTop();
    // let docHeight = document.documentElement.scrollHeight;
    if (scTop > courseTabsWrapPosition - $('.headerfixed').height()) {
        $('.course-tabs-wrap').addClass(fixedClass)
        $('.es-header').css({'box-shadow': 'none'})
    } else {
        $('.course-tabs-wrap').removeClass(fixedClass)
        $('.es-header').css({'box-shadow': '0 4px 8px 0 rgb(7 17 27 / 10%)'})
    }
    studyBarAffix();
    // sideImTelescoping();
}
window.addEventListener('scroll', throttle(mounting, 300));
function studyBarAffix() {
    let scTop = $("html").scrollTop();
    if (scTop >= ($(document).height() - $(window).height() - $('.footer-default').height())) {
        $('.study-status-box').hide();
        $('.cs-study-status-wrap__hide').css({'visibility': 'visible'});
    } else {
        $('.study-status-box').show();
        $('.cs-study-status-wrap__hide').css({'visibility': 'hidden'});
    }
}
$(document).on('click', '.notebook-note-delete', function(){
    var $btn = $(this);
    if (!confirm(Translator.trans('真的要删除该笔记吗？'))) {
        return false;
    }

    $.post($btn.data('url'), function(res){
        console.log(res)
        $btn.parents('.note-item').remove();
    });

});
var wordLength = function(a,b){
    var ininWordArr = [];
    var nowWordArr = [];
    let reg =/<img.*?src=[\"|\']?(.*?)[\"|\']*?>/g
    let curHtml = $('.copy-note-content').html();
    $(a).each(function(){
        $(this).html($(this).parent().find('.copy-note-content').html().replace(reg, '【图片】'));
    })
    $(document).on('click',b,function(){
        var i = $(b).index($(this));
        var childSpan = $(this).find('span'),
            isNoteShow = $(this).parents('.is-note-show'),
            noteArrow = $(this).find('.note-arrow'),
            noteItem = $(this).parents('.note-item');
        if (childSpan.html() == '展开') {
            childSpan.text('收起');
            noteItem.find('.note-content').html(noteItem.find('.copy-note-content').html())
            isNoteShow.removeClass('hide-operation');
            isNoteShow.addClass('show-operation');
            noteItem.find('.name').addClass('is-active');
            noteArrow.css({ transform: 'rotate(0deg)' });
            isNoteShow.prev().removeClass('broken-sentences');
        } else {
            noteItem.find('.note-content').html(noteItem.find('.copy-note-content').html().replace(reg, '【图片】'))
            childSpan.text('展开');
            isNoteShow.removeClass('show-operation');
            isNoteShow.addClass('hide-operation');
            noteItem.find('.name').removeClass('is-active');
            noteArrow.css({ transform: 'rotate(180deg)' });
            isNoteShow.prev().addClass('broken-sentences');
        }
        return false;
    })
}('.note-content','.is-note-show>div')
// 定制详情页之选择栏目
$(document).off('click', '.js-nav-headerwrap>a').on('click', '.js-nav-headerwrap>a', function () {
    var _$this = $(this);
    _$this.addClass('active').siblings().removeClass('active');
    $('.cs-custommade').removeClass('isactive');
    if (_$this.attr('data-set')) {
        $('.' + _$this.attr('data-set')).addClass('isactive');
    }

    // 回到上一次滚动的距离
    if (_$this.attr('data-scroll') > 0) {
        $("body,html").animate({
            scrollTop: _$this.attr('data-scroll')
        }, 300);
    }
    //如果固定
    if ($('.js-nav-headerwrap').hasClass('fixed') && _$this.attr('data-scroll') == '0') {
        var scrollTop = $(window).scrollTop();
        var numTop = $('.apply-main').height() + $('.courser-info-second').height() + $('.course-studytime-new22').height();
        console.log(numTop);
        $("body,html").animate({
            scrollTop: numTop
        }, 300);
    }

});
// js-intro-header
$(document).off('click', '.js-intro-header').on('click', '.js-intro-header', function () {
    var _$this = $(this);
    var interMark = _$this.attr('data-set');
    $('.js-nav-headerwrap>a').each(function () {
        var $item = $(this);
        if ($item.attr('data-set') == interMark) {
            $item.trigger('click');
        }
    });
});

//定制详情页之二级导航-可视区域
if ($('.js-nav-headerwrap').length > 0 && $('.js-nav-headerwrap').hasClass('isweb')) {
   var heightScroll=Number($('.js-nav-headerwrap').offset().top) - Number($(window).height()) / 1.2;
   console.log(heightScroll);
    $("body,html").animate({
        scrollTop: heightScroll
    }, 300);
}

