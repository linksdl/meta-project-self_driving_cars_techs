function questionPage() {
    let paramGlobal={"question":{},"label":{}},paramItem3=[],paramItem4=[],paramItemChild=[],isFlag = true;
    
   // 7月5号，调查问卷js-choose-single
function removeObjectArr(key,orginArr) {
    for (var i = 0; i < orginArr.length; i++) { 
        if (orginArr[i].key == key)  {
            orginArr.splice(i, 1)
        }
    }
  };
// paramGlobal 提交调查问卷的参数
// 监听 第3道题的其他输入框
$('.global-question-wrap .input').off('change').on('change', function () {
    // $.trim()
    var _this=$('.global-question-wrap .input');
    _this.parent().trigger('click');
});

$(document).off('click','.js-choose-single').on('click','.js-choose-single', function(){
    var $t=$(this);
    paramGlobal.question[$t.parent().attr('data-name')]=[$t.attr('data-key')];
    $t.addClass('active').siblings().removeClass('active');
    console.log(JSON.stringify(paramGlobal)+"参数");
});
// js-choose-multi 多选
$(document).off('click','.js-choose-multi').on('click','.js-choose-multi', function(){
    var _thisinput=$('.global-question-wrap .input');
    if (_thisinput.val()) {
        _thisinput.parent().attr("data-key",_thisinput.val()+"（其他）");
    } else {
        _thisinput.parent().attr("data-key","其他");
    }
    var $t=$(this),$tVal=$t.attr('data-key');
    // 如果是细分领域
    if ($t.parent().attr('data-child') == 'child') {
        paramItemChild=[];//初始化细分领域参数
        if ($t.hasClass('active')) {
            //移除参数
            $t.toggleClass('active');
            paramItem4.splice($.inArray($tVal,paramItem4),1);
            paramGlobal.label[$t.parent().attr('data-name')]=paramItem4;
            $('#question4-childwrap').html('');
            // 移除子细分领域
            delete paramGlobal.label[$t.attr('data-key')]  //删除对象属性
        } else {
          //判断有没有3个 
          if (paramItem4.length >= 3) {
             layer.msg('最多可选3个选项哦~');
             return ;
          } else {
            paramItem4.push($tVal);  //添加参数 
            $t.toggleClass('active');
            paramGlobal.label[$t.parent().attr('data-name')]=paramItem4;
          }
        //细分领域的处理js
        console.log("打印对应的字对象"+$t.attr('data-childVal'));
        var childKeyArr=JSON.parse($t.attr('data-childVal')).childKey;
        var parentKey=$t.attr('data-key');
          // 细分领域显示
          if (childKeyArr.length >0) {
            var childHtml="",childHtmlItem="";
            for (let i = 0; i < childKeyArr.length; i++) {
                childHtmlItem += `<a href="javascript:void(0);" data-key="${childKeyArr[i].id}" class="js-choose-multi item">${childKeyArr[i].name}</a>`;
            }
            var childHtml=`<div class="question-item mt10">
                    <p>选择更细分的领域，让我们更好的帮助您！</p>
                    <div class="item-box limit-height"  data-name="${parentKey}">
                        ${childHtmlItem}
                    </div>
                </div>`;
            $('#question4-childwrap').html(childHtml);
            } else {
                $('#question4-childwrap').html('');
            }
          
        }
    } else {
        $t.toggleClass('active');
        if ($t.hasClass('active')) {
            // 存储参数
            if ($t.parent().attr('data-question') == "question3") {              
                paramItem3.push($tVal);  //添加参数 
                paramGlobal.question[$t.parent().attr('data-name')]=paramItem3;
            } else {
                // 细分领域的多选
                paramItemChild.push($tVal);
                paramGlobal.label[$t.parent().attr('data-name')]=paramItemChild;
            }
            
        } else {
            //移除参数
            if ($t.parent().attr('data-question') == "question3") {
                paramItem3.splice($.inArray($tVal,paramItem3),1);
                paramGlobal.question[$t.parent().attr('data-name')]=paramItem3;
            } else {
                 // 细分领域的移除参数
                paramItemChild.splice($.inArray($tVal,paramItemChild),1);
                paramGlobal.label[$t.parent().attr('data-name')]=paramItemChild;
            }
           
        }
    }
    console.log(JSON.stringify(paramGlobal)+"多选参数");
});
// 下次再说js-next-set,-关闭弹窗
$(document).off('click','.js-next-set').on('click','.js-next-set', function(){
    var $t=$(this);
    if($t.attr('data_lock')){
        return false;
      }
    $t.attr('data_lock',1).addClass('disable');
    $.ajax({
        url: $t.attr('data-url'),
        type: 'get',
        success: function (r) {
            console.log(r + "请求成功");
            if ($("#dcwj-container").hasClass('referrerCs')) {
                sessionStorage.setItem('tag', '0');
            }
        },
        error: function () {
            console.log('未知网络错误！请刷新重试～');
        },
        complete: function () {
            $t.removeAttr('data_lock').removeClass('disable');
        }
    });
    if ($t.attr('data-parent')) {
        $('.'+$t.attr('data-parent')).remove();
    }
    else if($t.attr('data-go')){
        window.location.href = $t.attr('data-go'); //注册页面执行操作
    }
});

// js-next-submit 提交答案
$(document).off('click','.js-next-submit').on('click','.js-next-submit', function(){
    var $t=$(this);
    if($t.attr('data_lock')){
        return false;
      }
       //  单题 判读有米有选中题目
       if ($('#single-question').length > 0) {
        if ($('#single-question').find('.active').length < 1) {
            layer.msg("题目都是必选哦～");
            return false;
        } 
       }
       //  判读有米有选中题目
      if ($('.question-item-bxbox').length > 3) {
        $('.question-item-bxbox').each(function(){
            var _$this=$(this);
            if (_$this.find('.active').length < 1) {
                layer.msg("题目都是必选哦～");
                isFlag = false;
                return false; 
            }
            else{
                isFlag = true;
            }
        });
      }
      if (isFlag == true ) {
        $t.attr('data_lock',1).addClass('disable');
        $.ajax({
            url : $t.attr('data-url'),
            type : 'post',
            data : paramGlobal,
            dataType : 'json',
            success : function(r){
                if ($("#dcwj-container").hasClass('referrerCs')) {
                    sessionStorage.setItem('tag', '0');
                }
                layer.msg(r.message);
                if (r.code == "success") {
                    setTimeout(function () {
                        // $('.'+$t.attr('data-parent')).remove();
                        if ($t.attr('data-parent')) {
                            $('.'+$t.attr('data-parent')).remove();
                        }
                        else if($t.attr('data-go')){
                            window.location.href = $t.attr('data-go'); //注册页面执行操作
                        }
                    }, 2000); 
                } 
            },
            error : function(){
              layer.msg("Oops,网络发生错误了，请刷新重试～");
            },
            complete:function(){
              $t.removeAttr('data_lock').removeClass('disable'); 
            }
          });
      }
    
});

// m 站的调查问卷
if ($('#dcwj-container').length > 0) {
    $.ajax({
        url : '/investigate/register/question/getone',
        type : 'get',
        data :{
            "quesId":""
         },
        success : function(r){
            var oneQuestion="",childHtmlItemM="",isQuestion3="",btnText="下一步";
            var childKeyArrM=r.list.questionInfo.choice;
            if (childKeyArrM.length >0) {
                for (let i = 0; i < childKeyArrM.length; i++) {
                    childHtmlItemM += `<a href="javascript:void(0);" data-key="${childKeyArrM[i].value}" class="js-choose-single item-single "><img src="${childKeyArrM[i].img}">${childKeyArrM[i].value}</a>`;
                }
            }
            oneQuestion=`<div class="global-question-wrap js-global-question-wrap">
            <div class="question-content question-content-m">            
               <a href="javascript:void(0);" data-url="/investigate/register/question/again" data-parent="js-global-question-wrap" class="js-next-set global-question-close">关闭</a>
               <div id="single-question">
                   <div class="question-item question-item-m">
                       <p><span>${r.list.sort}/4</span>${r.list.questionInfo.title}</p>
                       <div class="item-box" data-name="${r.list.questionInfo.id}" data-question=" ${isQuestion3}">
                          ${childHtmlItemM}
                       </div>
                   </div>
                  
                   <div class="set-box set-box-m">
                       <a href="javascript:void(0);" data-quesid='{"quesId":"${r.list.nextId}"}' data-url="/investigate/register/question/getone"  data-parent="js-global-question-wrap" class="js-get-nextSet item-btn item-submit">${btnText}</a>
                   </div>
               </div>
            </div>
           </div>`
           $('#dcwj-container').html(oneQuestion);
        },
        error : function(){
          layer.msg("Oops,网络发生错误了，请刷新重试～");
        },
        complete:function(){
          
        }
    });
}
// m站点击下一题和确认提交按钮执行的操作
$(document).off('click','.js-get-nextSet').on('click','.js-get-nextSet', function(){
    var $t=$(this);
    //  
    if($t.attr('data_lock')){
        return false;
      }
    //  判读有米有选中题目
    if ($('#single-question').length > 0) {
        if ($('#single-question').find('.active').length < 1) {
            layer.msg("题目都是必选哦～");
            return false;
        } 
    }
    // 判断是否是第4题，兴趣标签的题比如增加一个参数getLabel=1
    $t.attr('data_lock',1).addClass('disable');
    $.ajax({
        url : $t.attr('data-url'),
        type : 'get',
        data :JSON.parse($t.attr('data-quesid')),
        success : function(r){
            var oneQuestion="",childHtmlItemM="",isQuestion3="",imgNone="style=''",classText="js-choose-single item-single",dataParam='{"quesId":"'+r.list.nextId+'"}',qita='<input type="text" class="input"  value="" />';
            // r.total == 3 代表是前3题
            if (r.total == 3) {
                if (r.list.sort == 3 ) {
                    isQuestion3="question3";
                    dataParam='{"label":1}';
                }
                // 单选or多选
                if (r.list.questionInfo.type =="single_choice" ) {
                    classText="js-choose-single item-single ";
                }
                else if(r.list.questionInfo.type =="choice" ) {
                    classText="js-choose-multi item ";
                    imgNone="style='display:none;'";
                }
                var childKeyArrM=r.list.questionInfo.choice;
                if (childKeyArrM.length >0) {
                    for (let i = 0; i < childKeyArrM.length; i++) {
                        var dateKey=childKeyArrM[i].value ;
                        if (childKeyArrM[i].value == "其他") {
                            childKeyArrM[i].value = '其他'+ qita;
                        }
                        childHtmlItemM += `<a href="javascript:void(0);" data-key="${dateKey}" class="${classText}"><img ${imgNone} src="${childKeyArrM[i].img}">${childKeyArrM[i].value}</a>`;
                    }
                }
                oneQuestion=`
                    <div class="question-item question-item-m">
                        <p><span>${r.list.sort}/4</span>${r.list.questionInfo.title}</p>
                        <div class="item-box" data-name="${r.list.questionInfo.id}" data-question="${isQuestion3}">
                            ${childHtmlItemM}
                        </div>
                    </div>
                    
                    <div class="set-box set-box-m">
                        <a href="javascript:void(0);" data-quesid='${dataParam}' data-url="/investigate/register/question/getone" class="js-get-nextSet item-btn item-submit">下一步</a>
                    </div>
                `
            } else {
                // 第4题
                var childKeyArrM=r.list;
                if (childKeyArrM.length >0) {
                    for (let i = 0; i < childKeyArrM.length; i++) {
                        childHtmlItemM += `<a href="javascript:void(0);" data-key="${childKeyArrM[i].id}" class="js-choose-multi item " data-childVal='{"childKey":${childKeyArrM[i].child}}' >${childKeyArrM[i].name}</a>`;
                    }
                }
                oneQuestion=`
                    <div class="question-item question-item-m">
                        <p><span>4/4</span>您感兴趣的领域/方向？（多选）</p>
                        <div class="item-box" data-child="child" data-name="label">
                            ${childHtmlItemM}
                        </div>
                    </div>
                    <div id="question4-childwrap"></div>
                    <div class="set-box set-box-m">
                        <a href="javascript:void(0);"  data-parent="js-global-question-wrap" data-url="/investigate/register/question/post" class="js-next-submit item-btn item-submit">确认</a>
                    </div>
                `
            }
            
            $("#single-question").html(oneQuestion);
        },
        error : function(){
          layer.msg("Oops,网络发生错误了，请刷新重试～");
        },
        complete:function(){
          $t.removeAttr('data_lock').removeClass('disable'); 
        }
      });
});
};
$(document).ready(function () {
    questionPage();
});
