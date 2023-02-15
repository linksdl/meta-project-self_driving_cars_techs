"use strict";

//公开课无二维码，立即报名跳转直播课链接；
var locaurl = "";
var locationPlayback = "";
var dialogImgCode = $(".alert-over-hours-box").attr("data-img-code");
var isPhone = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
// 课程中心列表页面
$(".stage-nav input,.field-nav a").on("click", function () {
  $("#courseListForm").submit();
});

//判断执行一次动画
$(function () {
  $(document).ready(function () {
    var a, b, c, c1, c2;
    a = $(window).height();
    if (document.body.offsetWidth <= 767) $(".fixed-bottom-zero").show();
    $(window).scroll(function () {
      var b = $(this).scrollTop();
      if (document.body.offsetWidth <= 767) {
        // $('.immed-signup-ripe').each(function () {
        //     c1 = $(this).offset().top;
        //     if ( b > c1 + 61) {
        //         $('.fixed-bottom-zero').show();
        //     }
        //     else {
        //         $('.fixed-bottom-zero').hide();
        //     }
        // })
      } else {
        $(".courseshow-img-top").each(function () {
          c1 = $(this).offset().top;
          if (a + b > c1 + 812) {
            $(".fixed-bottom-zero").show();
          } else {
            $(".fixed-bottom-zero").hide();
          }
        });
      }
    });
  });
  if (
    $(".student-barrage").length > 0 &&
    $(".student-barrage .msgitem").length > 0
  ) {
    $(".student-barrage").jCarouselLite({
      vertical: true,
      hoverPause: false,
      visible: 3,
      auto: 1000,
      speed: 1500,
    });
  }
});

// 课程特色
(function () {
  $(".course-study-time li p").each(function () {
    $(this).html($(this).html().replace("/", "<br >"));
  });
  $(".course-studytime-new22 li p").each(function () {
    $(this).html($(this).html().replace("/", "<br >"));
  });
  if ($(".time_contener").height() < 100) {
    $(".mt43").css("margin-top", "0");
  }
  // 视频大纲
  $(".course-task-wrap  .es-icon-keyboardarrowdown")
    .parents(".js-task-chapter")
    .nextUntil("li.js-task-chapter")
    .css("display", "none");

  // 预览-点击按钮统计次数
  $(document)
    .off("click", ".preview_statistics")
    .on("click", ".preview_statistics", function () {
      if ($.cookie("preview_click") != "true") {
        var previewUrl = $(this).attr("preview-url");
        $.ajax({
          url: previewUrl,
          type: "get",
          success: function (data) {
            // console.log(data);
            $.cookie("preview_click", "true", {
              expires: 1,
              path: "/",
              domain: "shenlanxueyuan.com",
            });
          },
          error: function () {
            layer.msg("Oops~，网络发生错误了，请刷新重试～");
          },
          complete: function () {},
        });
      }
    });
})();
function tap(ev) {
  //需要判断符合需求的点击区域
  if (
    $(".js-pintuan-qrcode").length > 0 &&
    !$(ev.target).parent().hasClass("js-pintuan-qrcode")
  ) {
    $(".js-pintuan-qrcode").removeClass("open");
  }
}
$(document).click(tap); //点击执行tap方法--拼团信息prover关闭
$(document)
  .off("click", ".js-pintuan-qrcode")
  .on("click", ".js-pintuan-qrcode", function () {
    var $self = $(this);
    if ($self.hasClass("open")) {
      return false;
    }
    if ($self.attr("data_lock")) {
      return false;
    }
    $self.attr("data_lock", 1).addClass("disable");
    $.ajax({
      url: $self.data("url"),
      type: "post",
      dataType: "json",
      success: function (data) {
        $self.find(".qrcode-popover img").attr("src", data.img);
        $self.addClass("open");
      },
      error: function () {
        layer.msg("Oops~，网络发生错误了，请刷新重试～");
      },
      complete: function () {
        $self.removeAttr("data_lock").removeClass("disable");
      },
    });
  });
// 移动设备点击开团js-mpintuan-qrcode，提示文案:请使用手机微信浏览器打开
$(document)
  .off("click", ".js-mpintuan-qrcode")
  .on("click", ".js-mpintuan-qrcode", function () {
    layer.msg("请使用手机微信浏览器打开");
  });
// 帮我选课
$(document)
  .off("click", ".helpChoiceCourse")
  .on("click", ".helpChoiceCourse", function () {
    $(".orientation-wrap").removeClass("hidden");
  });

// 课程详情页，已过期后，任务弹窗效果
$(document)
  .off("click", ".course-task-wrap .js_taskexpired")
  .on("click", ".course-task-wrap .js_taskexpired", function () {
    layer.msg("课程已过期，如有疑问请联系客服哦～", {
      time: 1500,
    });
  });
// 关闭
$(document)
  .off("click", ".orientation-wrap .closeover")
  .on("click", ".orientation-wrap .closeover", function () {
    // $('#chapterModal').hide();
    $(".orientation-wrap").addClass("hidden");
  });
$(document)
  .off("click", ".openCourse-box .closeover")
  .on("click", ".openCourse-box .closeover", function () {
    $(".alert-over-box").addClass("hidden");
    if (dialogImgCode) {
      $(".alert-over-hours-box").removeClass("hide");
    } else {
      $(".alert-over-hours-box").addClass("hidden");
      window.location.reload();
    }

    if (locaurl !== "") {
      window.location.href = locaurl;
    }
    if (locationPlayback) {
      window.location.href = locationPlayback;
    }
  });
$(document)
  .off("click", ".alert-over-hours-box .closeover")
  .on("click", ".alert-over-hours-box .closeover", function () {
    // $('#chapterModal').hide();
    $(".alert-over-hours-box").addClass("hidden");
    window.location.reload();
  });

$(document)
  .off("click", ".alert-over-pdf-box .pdfcloseover")
  .on("click", ".alert-over-pdf-box .pdfcloseover", function () {
    $(".alert-over-pdf-box").addClass("hidden");
    localStorage.removeItem("pdfjs.history");
  });

// 公开课取消预约和课程取消预约
$(document)
  .off("click", ".js_cancel_remind")
  .on("click", ".js_cancel_remind", function () {
    var $t = $(this),
      $coursetype = "",
      coursetext = "";
    console.log($t.attr("data_lock"));
    if ($t.attr("data_lock")) {
      return false;
    }
    var url = $t.attr("data-url");
    if ($t.attr("data-type") == "course-type") {
      $coursetype = "课程";
      coursetext = "取消后无法在课程可以报名时，及时提醒到您！";
    } else {
      $coursetype = "公开课";
      coursetext = "取消后无法在公开课开播前及时提醒到您！";
    }
    var cancelHtml =
      "<div class='pl20 pt20' style='padding-right:100px;'>" +
      coursetext +
      "</div>";
    var cancelRemindIndex = layer.open({
      type: 1,
      area: ["auto", "200px"],
      maxWidth: "400px",
      title: "是否取消" + $coursetype + "预约？",
      shade: 0.6,
      content: cancelHtml,
      btn: ["我再想想", "取消预约"], //按钮
      btn2: function () {
        var $self = $(this);
        if ($self.attr("data_lock")) {
          return false;
        }
        $self.attr("data_lock", 1).addClass("disable");
        $.ajax({
          url: url,
          type: "get",
          success: function (r) {
            console.log("success");
            $t.attr("data_lock", 1).addClass("disable");
            layer.msg($coursetype + "取消预约成功");
            setTimeout(function () {
              window.location.reload();
            }, 2000);
          },
          error: function () {
            layer.msg("Oops~,网络发生错误了，请刷新重试！");
          },
          complete: function () {
            $self.removeAttr("data_lock").removeClass("disable");
          },
        });
      },
      btn1: function () {
        layer.close(cancelRemindIndex);
      },
    });
  });
// 公开课预约提醒弹窗
// 进入直播间提示
$(document)
  .off("click", ".js_cancel_remind_tips")
  .on("click", ".js_cancel_remind_tips", function () {
    layer.msg("直播开始前1小时可进入哦~");
  });
// 公开课预约请求校验
function openwechatCheck_login(iWechatNum) {
  $.get(
    "/common/wechat/check",
    {
      scene_id: $('.openCourse-box input[name="scene_id"]').val(),
    },
    function (data) {
      if (data.code == 200) {
        layer.msg("恭喜您，服务号绑定成功！");
        $(".openCourse-box").addClass("hidden");
        setTimeout(function () {
          if (dialogImgCode) {
            $(".alert-over-hours-box").removeClass("hide");
          } else {
            $(".alert-over-hours-box").addClass("hidden");
            window.location.reload();
          }
          if (locationPlayback) {
            window.location.href = locationPlayback;
          }
          if (locaurl !== "") {
            $(".alert-over-hours-box").addClass("hidden");
            window.location.href = locaurl;
          } else {
            $(".alert-over-hours-box").removeClass("hide");
          }
          // window.location.reload();
        }, 500);
      } else if (data.code == 201) {
        layer.msg("微信已绑定其他深蓝账号，请重新关注");
        // openwechatCheck_login(iWechatNum);
        setTimeout(function () {
          openwechatCheck_login(iWechatNum);
        }, 2000);
      } else {
        setTimeout(function () {
          if (
            $('.openCourse-box input[name="scene_id"]').length > 0 &&
            $(".openCourse-box:not(.hide)").length > 0
          ) {
            if (++iWechatNum > 30) {
              layer.msg("由于您长时间未操作，已为您关闭弹窗啦～");
              setTimeout(function () {
                window.location.reload();
              }, 2000);
            } else {
              openwechatCheck_login(1);
            }
          }
        }, 2000);
      }
    }
  );
}

// 国外手机号未绑定+预约公开课
$(document)
  .off("click", ".not_bind_tel")
  .on("click", ".not_bind_tel", function () {
    // $('.openCourse-box').removeClass('hide');
    var $self = $(this),
      url = $self.attr("data-url");
    $self.attr("data_lock", 1).addClass("disable");

    $.ajax({
      url: url,
      type: "post",
      data: {},
      success: function (r) {
        console.log(r);
        if (r.code == "wechat_not_bind") {
          $(".openCourse-box").removeClass("hide");
        } else {
          window.location.reload();
        }
      },
      error: function () {
        // layer.msg('Oops,网络发生错误了，请刷新重试！')
      },
      complete: function () {
        $self.removeAttr("data_lock").removeClass("disable");
      },
    });
  });

// 国内绑定手机的号的用户，预约公开课+预约普通课程
$(document)
  .off("click", ".js_verifiedMobil_sms")
  .on("click", ".js_verifiedMobil_sms", function () {
    var $self = $(this),
      url = $self.attr("data-url"),
      verifiedMobile = $self.attr("data-verifiedMobile"),
      bindwebtext = "开课前我们将以手机短信、服务号的形式提醒您！",
      coursetext = "公开课开始";
    if ($self.attr("data-type") == "course-type") {
      coursetext = "课程开放报名";
      bindwebtext = "课程开放报名后我们将以手机短信、服务号的形式提醒您！";
    }
    if ($self.attr("data_lock")) {
      return false;
    }
    $self.attr("data_lock", 1).addClass("disable");
    $.ajax({
      url: url,
      type: "post",
      data: {
        ext: "86",
        mobile: verifiedMobile,
      },
      success: function (r) {
        if (
          r.code == "wechat_bind" &&
          $(".openCourse-box").length > 0 &&
          r.code != "wechat_not_bind"
        ) {
          if (r.data.courseType == "open_course") {
            //isChoose 表示弹的内容，1表示关注服务号  0 则是销售弹窗
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              //   layer.msg('报名成功');
              setTimeout(function () {
                //   window.location.reload();
              }, 2000);
            }
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              if (dialogImgCode) {
                $(".alert-over-hours-box").removeClass("hide");
              } else {
                $(".alert-over-hours-box").addClass("hidden");
                window.location.reload();
              }
            }, 4000);
          } else if (r.data.courseType == "course") {
            //   6月27，预约弹窗优化需求
            if (r.data.isShowQrcode == 1) {
              var sHtml =
                '<img class="weixinOpen" src="' +
                r.data.assistantQrcode +
                '"><p class="tips pb20">' +
                r.data.customRemark +
                "</p>";
              $(".openCourse-box .stepOpenunbind").append(sHtml);
              $(".openCourse-box").removeClass("hide");
            } else {
              $(".openCourse-box .sub-text").text(bindwebtext);
              $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
                "hide"
              );
              HandlecountDown(3);
              setTimeout(function () {
                window.location.reload();
              }, 4000);
            }
          } else {
            console.log("第三种课程");
          }
        } else if (
          r.code == "wechat_not_bind" &&
          $(".openCourse-box").length > 0
        ) {
          if (r.data.courseType == "open_course") {
            // if (r.data.isChoose) {
            //     var noBindHtml='<input type="hidden" value="'+r.data.scene_id +'" name="scene_id"><img class="weixinOpen" src="'+r.data.wechat_img +'"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，'+coursetext+'后第一时间提醒您！以及接收更多课程优惠信息</p>';
            //     $('.openCourse-box .stepOpenunbind').append(noBindHtml);
            //     $('.openCourse-box').removeClass('hide');
            //     openwechatCheck_login(1);
            // }else {
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              // layer.msg('报名成功');
              // setTimeout(function(){
              //     window.location.reload();
              // },2000);
              $(".alert-over-hours-box").addClass("hidden");
            }
            // }
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else if (r.data.courseType == "course") {
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else {
            console.log("第三种课程");
          }
        } else {
          window.location.reload();
        }
      },
      error: function () {
        // layer.msg('Oops,网络发生错误了，请刷新重试！')
      },
      complete: function () {
        $self.removeAttr("data_lock").removeClass("disable");
      },
    });
  });
// end
// 详细信息
var $turnoff = $("#courseset-detail-form .turn-off");
if ($("input[name='isCertain']:checked").val() == 0) {
  $turnoff.hide();
}
$("input[name='isCertain']").on("click", function () {
  var $this = $(this);
  var $value = $this.val();
  if ($value == 0) {
    $turnoff.hide();
  } else {
    $turnoff.show();
  }
});
// 是否开启续费
$("input[name='isCourseRenew']").on("click", function () {
  var $this = $(this);
  var $value = $this.val();
  if ($value == 0) {
    $(".js_isCourseRenew").addClass("hidden");
  } else {
    $(".js_isCourseRenew").removeClass("hidden");
  }
});
// 续费学习
$(document)
  .off("click", ".js_course_renew")
  .on("click", ".js_course_renew", function () {
    $("html").css({ overflow: "hidden" });

    var $self = $(this),
      url = $self.attr("data-url");
    if ($self.attr("data_lock")) {
      return false;
    }
    $self.attr("data_lock", 1).addClass("disable");
    $.ajax({
      url: url,
      type: "get",
      success: function (r) {
        $("#courseRenew")[0].innerHTML = r;
        getRenewAjax($(".js-example-disabled-results").val());
        // var pic = $('.course-modal-content .pic').find('img');
        // var text = $('.course-modal-content .info').find('.name');
        // var myCourseItem = $self.parents('.course-item-common');
        // var picSrc = myCourseItem.find('.img-common').attr('src')
        // text.text(myCourseItem.find('.text-common').text())
        // pic.attr('src', picSrc)
        if ($self.attr("data-seren")) {
          $("#" + $self.attr("data-seren")).remove();
        }
        if (isPhone) {
          $(".limit-data-wrap .course-modal-content")
            .find(".btn-renew")
            .text("立即支付");
          $(".limit-data-wrap .course-modal-content")
            .find(".title")
            .text("课程续费");
        }
      },
      error: function () {
        alert("未知网络错误！请刷新重试～");
      },
      complete: function () {
        $self.removeAttr("data_lock").removeClass("disable");
      },
    });
  });
function renewValidate(curVal) {
  var tips = (tipsText) => {
    $(".renew-error-text").show();
    $(".renew-error-text").text(tipsText);
    $(".renew-set__tips span").text("XXXX年XX月XX日到期");
    $(".renew-footer-price").find(".price-text").text("0.00");
    $(".js_btn_renew").addClass("disabled");
  };
  if (curVal == "") {
    tips("请输入续费天数");
    return true;
  }
  if (curVal.includes(".")) {
    tips("请输入整数");
    return true;
  }
  if (curVal > 365 || curVal < 1) {
    tips("自定义最大天数为365天，最小天数为1天");
    return true;
  }
  if (!Number(curVal)) {
    tips("请输入数字");
    return true;
  }
}
var debounce = function (callback, delay) {
  // 使用闭包的外部变量来定义定时器
  let timer;
  return function () {
    // 判断是否已经存在定时任务
    if (timer) {
      /*
             如果已有定时任务就将已有任务清楚，
             再重新生成新的定时任务
            */
      clearTimeout(timer);
    }
    // 生成定时任务并赋值给timer
    timer = setTimeout(() => {
      callback.call(this);
    }, delay);
  };
};
$(document)
  .off("change", ".js-example-disabled-results")
  .on("change", ".js-example-disabled-results", function () {
    var curVal = Number($(this).val());
    if (curVal) {
      $(".renew-set-expiration-time").css({ display: "none" });
      $(".js_btn_renew").removeClass("disabled");
    } else {
      $(".renew-set-expiration-time").css({ display: "inline-block" });
    }
    $(".m-renew-set .js-custom-renew-day").val("");
    $(".pc-renew-set .js-custom-renew-day").val("");
    if (curVal) {
      getRenewAjax(curVal);
    } else {
      $(".renew-set__tips span").text("XXXX年XX月XX日到期");
      $(".renew-footer-price").find(".price-text").text("0.00");
      $(".js_btn_renew").addClass("disabled");
    }
    $(".renew-error-text").hide();
  });
$(document).on("input", ".js-custom-renew-day", function () {
  $(".renew-error-text").hide();
  var curVal = $(this).val();
  console.log(curVal);
  if (renewValidate(curVal)) return;
  $(".js_btn_renew").removeClass("disabled");
  getRenewAjax(curVal == "any" ? $(".js-custom-renew-day").val() : curVal);
});
$(document)
  .off("blur", ".renew-set-expiration-time input")
  .on("blur", ".renew-set-expiration-time input", function () {
    var curVal = $(this).val();
    if (renewValidate(curVal)) return;
    getRenewAjax(curVal == "any" ? $(".js-custom-renew-day").val() : curVal);
    $(".js_btn_renew").removeClass("disabled");
    $(".renew-error-text").hide();
  });
function getRenewAjax(day) {
  $.ajax({
    url: "/common/get_course_renew_price",
    data: {
      targetId: $(".course-modal-content").attr("courseId"),
      day,
    },
    type: "get",
    success: function (res) {
      var data = res.data;
      if (res.code == 200) {
        var renewPrice = $(".renew-footer-price").find(".price-text");
        renewPrice.text(Number(data.price).toFixed(2));
        $(".renew-set__tips").find("span").text(data.expiryDate);
      }
    },
    error: function () {
      alert("未知网络错误！请刷新重试～");
    },
  });
}
$(document)
  .off("click", ".js_btn_renew")
  .on("click", ".js_btn_renew", function () {
    var renewDay, customRenewDay, mCustomRenewDay;
    var layoutType = $(this).attr("layout-type");
    var isAny = $(".js-example-disabled-results").val() === "any";
    var curVal = $(".js-custom-renew-day").val();

    if (isAny && renewValidate(curVal)) return;

    if ($(this).hasClass("disabled")) {
      return;
    }

    if (isPhone) {
      renewDay = $(".m-renew-set .js-example-disabled-results").val();
    } else {
      renewDay = $(".pc-renew-set .js-example-disabled-results").val();
    }
    if (layoutType === "new") {
      if (isPhone) {
        mCustomRenewDay = $(".m-renew-set .js-custom-renew-day").val();
      } else {
        mCustomRenewDay = $(".pc-renew-set .js-custom-renew-day").val();
      }
      customRenewDay = renewDay == "any" ? mCustomRenewDay : renewDay;
    } else {
      if ($(this).attr("renew-day")) {
        customRenewDay = $(this).attr("renew-day");
      } else {
        customRenewDay = $(
          ".courserenew-modal-page .course-modal-content2 .item"
        )
          .eq(0)
          .attr("renew-day");
      }
    }
    var targetUrl = $(this).attr("href") + "&buyDay=" + customRenewDay;
    window.open(targetUrl);
  });
// 选择续费套餐切换效果
$(document)
  .off("click", ".courserenew-modal-page .course-modal-content2 .item")
  .on(
    "click",
    ".courserenew-modal-page .course-modal-content2 .item",
    function () {
      var $self = $(this);
      $self
        .parents(".courserenew-modal-page")
        .find(".js_btn_renew")
        .attr("renew-day", $self.attr("renew-day"));
      $self
        .parents(".courserenew-modal-page")
        .find(".js_btn_renew")
        .attr("href", $self.attr("data-url"));
      $self.addClass("active").siblings().removeClass("active");
    }
  );
// 关闭按钮 续费及课程到期7天
$(document)
  .off("click", ".js_content_close")
  .on("click", ".js_content_close", function () {
    var $self = $(this);
    $("html").css({ overflow: "auto" });
    if ($self.attr("data-source") == "course-show") {
      $self.parents(".limit-data-wrap").remove();
    } else {
      $self.parents(".courserenew-modal-page").remove();
    }
  });

// 公开课查看回放微信浏览器授权登录
$(".open_wechat_btn").bind("click", function () {
  console.log("公开课授权");
  wechat_auth($(".open_wechat_link"));
});

function wechat_auth(item) {
  //微信授登录
  if (item.length > 0) {
    console.log("公开课微信授权登录");
    var wechat_auth = item;
    if (
      wechat_auth.attr("data-isauth") == true ||
      wechat_auth.attr("data-isauth") == 1
    ) {
      //已授权
      if (
        wechat_auth.attr("data-isbind") == true ||
        wechat_auth.attr("data-isbind") == 1
      ) {
        //已绑定
        var playcircleoutlineUrl = $(".playcircleoutline").attr("href");
        // alert("已授权已绑定-要跳转到该看的视频内容页："+playcircleoutlineUrl);
        window.location.href = playcircleoutlineUrl;
      } else {
        //未绑定
        // alert("已授权未绑定-要跳转登录页面 login");
        window.location.href = "/login";
      }
    } else {
      //未授权
      var url = wechat_auth.val();
      // alert("未授权-要跳转到："+url);
      window.location.href = url;
    }
  }
}

// 判断是否绑定账号
var is_wechat = $(".open_wechat_link");
if (
  (is_wechat.attr("data-isauth") == true ||
    is_wechat.attr("data-isauth") == 1) &&
  is_wechat.attr("data-isbind") == ""
) {
  // alert("已授权未绑定-要跳转登录页面 login");
  window.location.href = "/login?origin=open_course";
}
// 9.1 公开课点击事件弹窗
$(document)
  .off("click", ".js_open_subscrible")
  .on("click", ".js_open_subscrible", function () {
    var $self = $(this),
      url = $self.attr("data-url"),
      bindwebtext = "开课前我们将以手机短信、服务号的形式提醒您！",
      coursetext = "公开课开始";
    if ($self.attr("data-type") == "course-type") {
      coursetext = "课程开放报名";
      bindwebtext = "课程开放报名后我们将以手机短信、服务号的形式提醒您！";
    }
    $.ajax({
      url: url,
      type: "post",
      success: function (r) {
        if (
          r.code == "wechat_bind" &&
          $(".openCourse-box").length > 0 &&
          r.code != "wechat_not_bind"
        ) {
          if (r.data.courseType == "open_course") {
            //isChoose 表示弹的内容，1表示关注服务号  0 则是销售弹窗
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              setTimeout(function () {
                // window.location.reload();
              }, 2000);
            }
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              if (dialogImgCode) {
                $(".alert-over-hours-box").removeClass("hide");
              } else {
                $(".alert-over-hours-box").addClass("hidden");
                window.location.reload();
              }
            }, 4000);
            // $('.openCourse-box').removeClass('hide');
          } else if (r.data.courseType == "course") {
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              window.location.reload();
            }, 4000);
          } else {
            console.log("第三种课程");
          }
        } else if (
          r.code == "wechat_not_bind" &&
          $(".openCourse-box").length > 0
        ) {
          if (r.data.courseType == "open_course") {
            // if (r.data.isChoose) {
            //     var noBindHtml='<input type="hidden" value="'+r.data.scene_id +'" name="scene_id"><img class="weixinOpen" src="'+r.data.wechat_img +'"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，'+coursetext+'后第一时间提醒您！以及接收更多课程优惠信息</p>';
            //     $('.openCourse-box .stepOpenunbind').append(noBindHtml);
            //     $('.openCourse-box').removeClass('hide');
            //     openwechatCheck_login(1);
            // }else {
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              //   layer.msg('报名成功');
              //   setTimeout(function(){
              //       window.location.reload();
              //   },2000);
              // $('.alert-over-hours-box').addClass('hidden');
            }
            // }
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else if (r.data.courseType == "course") {
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else {
            console.log("第三种课程");
          }
        } else {
          console.log("1");
          //   window.location.reload();
        }
        $("#openPreviewModal").removeClass("hide");
      },
    });
  });

$(document)
  .off("click", ".js_open_playback")
  .on("click", ".js_open_playback", function () {
    var $self = $(this),
      url = $self.attr("data-url"),
      bindwebtext = "开课前我们将以手机短信、服务号的形式提醒您！",
      coursetext = "公开课开始";
    locationPlayback = $self.attr("location-playback");
    if ($self.attr("data-type") == "course-type") {
      coursetext = "课程开放报名";
      bindwebtext = "课程开放报名后我们将以手机短信、服务号的形式提醒您！";
    }
    $.ajax({
      url: url,
      type: "post",
      success: function (r) {
        if (
          r.code == "wechat_bind" &&
          $(".openCourse-box").length > 0 &&
          r.code != "wechat_not_bind"
        ) {
          if (r.data.courseType == "open_course") {
            //isChoose 表示弹的内容，1表示关注服务号  0 则是销售弹窗
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              // layer.msg('报名成功');
              // setTimeout(function(){
              // window.location.reload();
              // },2000);
            }
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              window.location.href = locationPlayback;
            }, 4000);
          } else if (r.data.courseType == "course") {
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              window.location.href = locationPlayback;
            }, 4000);
          } else {
            console.log("第三种课程");
          }
        } else if (
          r.code == "wechat_not_bind" &&
          $(".openCourse-box").length > 0
        ) {
          if (r.data.courseType == "open_course") {
            // if (r.data.isChoose) {
            //     var noBindHtml='<input type="hidden" value="'+r.data.scene_id +'" name="scene_id"><img class="weixinOpen" src="'+r.data.wechat_img +'"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，'+coursetext+'后第一时间提醒您！以及接收更多课程优惠信息</p>';
            //     $('.openCourse-box .stepOpenunbind').append(noBindHtml);
            //     $('.openCourse-box').removeClass('hide');
            //     openwechatCheck_login(1);
            // }else {
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              //   layer.msg('报名成功');
              //   setTimeout(function(){
              // window.location.href = locaurl;
              //   },2000);
            }
            // }
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else if (r.data.courseType == "course") {
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else {
            console.log("第三种课程");
          }
        } else {
          console.log("1");
          //   window.location.reload();
        }
        $("#openPreviewModal").removeClass("hide");
      },
    });
  });

$(document)
  .off("click", ".js_noqrcode_sms")
  .on("click", ".js_noqrcode_sms", function () {
    var $self = $(this),
      url = $self.attr("data-url"),
      bindwebtext = "开课前我们将以手机短信、服务号的形式提醒您！",
      coursetext = "公开课开始";
    locaurl = $self.attr("location-url");
    if ($self.attr("data-type") == "course-type") {
      coursetext = "课程开放报名";
      bindwebtext = "课程开放报名后我们将以手机短信、服务号的形式提醒您！";
    }
    $.ajax({
      url: url,
      type: "post",
      success: function (r) {
        if (
          r.code == "wechat_bind" &&
          $(".openCourse-box").length > 0 &&
          r.code != "wechat_not_bind"
        ) {
          if (r.data.courseType == "open_course") {
            //isChoose 表示弹的内容，1表示关注服务号  0 则是销售弹窗
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              // layer.msg('报名成功');
              // setTimeout(function(){
              // window.location.reload();
              // },2000);
            }
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              window.location.href = locaurl;
            }, 4000);
          } else if (r.data.courseType == "course") {
            $(".openCourse-box .sub-text").text(bindwebtext);
            $(".openCourse-box,.openCourse-box .stepOpenbind").removeClass(
              "hide"
            );
            HandlecountDown(3);
            setTimeout(function () {
              window.location.href = locaurl;
            }, 4000);
          } else {
            console.log("第三种课程");
          }
        } else if (
          r.code == "wechat_not_bind" &&
          $(".openCourse-box").length > 0
        ) {
          if (r.data.courseType == "open_course") {
            // if (r.data.isChoose) {
            //     var noBindHtml='<input type="hidden" value="'+r.data.scene_id +'" name="scene_id"><img class="weixinOpen" src="'+r.data.wechat_img +'"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，'+coursetext+'后第一时间提醒您！以及接收更多课程优惠信息</p>';
            //     $('.openCourse-box .stepOpenunbind').append(noBindHtml);
            //     $('.openCourse-box').removeClass('hide');
            //     openwechatCheck_login(1);
            // }else {
            if (r.data.isOpen) {
              $(".openCourse-box").removeClass("hide");
            } else {
              //   layer.msg('报名成功');
              //   setTimeout(function(){
              // window.location.href = locaurl;
              //   },2000);
            }
            // }
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else if (r.data.courseType == "course") {
            var noBindHtml =
              '<input type="hidden" value="' +
              r.data.scene_id +
              '" name="scene_id"><img class="weixinOpen" src="' +
              r.data.wechat_img +
              '"><p class="tips"><i class="es-icon es-icon-weixin" style="color:#1BA000;padding-right: 3px;"></i>打开微信扫一扫关注</p><p class="tip-text">扫码绑定深蓝教育服务号，' +
              coursetext +
              "后第一时间提醒您！以及接收更多课程优惠信息</p>";
            $(".openCourse-box .stepOpenunbind").append(noBindHtml);
            $(".openCourse-box").removeClass("hide");
            openwechatCheck_login(1);
          } else {
            console.log("第三种课程");
          }
        } else {
          console.log("1");
          //   window.location.reload();
        }
        $("#openPreviewModal").removeClass("hide");
      },
    });
  });
// 9.1 公开课点击事件弹窗end

// “我的课程”课程状态显示添加解释话术-移动端阻止跳转
$(document)
  .off("click", ".popover-toggle")
  .on("click", ".popover-toggle", function (e) {
    var ev = e || event;
    ev.preventDefault();
  });
