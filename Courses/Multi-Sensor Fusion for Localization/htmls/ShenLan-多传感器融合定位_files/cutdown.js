function TimeTo(dd) {
    var t = new Date(dd), //取得指定时间的总毫秒数  
        n = new Date().getTime(), //取得当前毫秒数  
        c = t - n; //得到时间差
       
        $.cookie(chapter_time_cha, c, { 
            path: '/',domain:'shenlanxueyuan.com'
        });
        // console.log($.cookie("chapter_time_cha")); 
    //w = (t - n)*1000;//得到时间差
    if (c <= 100) { //如果差小于等于0  也就是过期或者正好过期，则推出程序  
        console.log("倒计时停止了");
        
        $(".js_chapter_timer").text("00:00:00:0") 
        clearInterval(window['ttt']); //清除计时器  
        // return; //结束执行  
 
        var min_num = $.cookie(chapter_time); 
        var tim = new Date().getTime() + min_num*60*1000;
        var timnum = timestampToTime(tim); 
        window['ttt'] = setInterval(function() {
            // TimeTo('2021/07/15 00:00:00:00'); //定义倒计时的结束时间，注意格式  
            TimeTo(timnum);
        }, 50);
    }

    d = parseInt(c / 1000 / 60 / 60 / 24), //总毫秒除以一天的毫秒 得到相差的天数  
        h = parseInt(c / 1000 / 60 / 60 - (24 * d)), //然后取完天数之后的余下的毫秒数再除以每小时的毫秒数得到小时 
        m = parseInt(c / 1000 / 60 - (24 * 60 * d) - (60 * h)), //减去天数和小时数的毫秒数剩下的毫秒，再除以每分钟的毫秒数，得到分钟数 
        s = parseInt(c / 1000 - (24 * 60 * 60 * d) - (60 * 60 * h) - (60 * m)); //得到最后剩下的毫秒数除以1000 就是秒数，再剩下的毫秒自动忽略即可
    hm = Math.floor((c - (24 * 60 * 60 * 1000 * d) - (60 * 60 * 1000 * h) - (60 * 1000 * m) - (s * 1000)) / 100);
    if (hm < 10) {
        // hm = "0" + hm;
        hm = hm;
    }
    if (s < 10) {
        s = "0" + s;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (h < 10) {
        h = "0" + h;
    }

    $(".js_chapter_timer").text('' + h + ':' + m + ':' + s + ':' + hm + '')
    // document.getElementById('js_chapter_timer').innerHTML = '' + h + ':' + m + ':' + s + ':' + hm + ''; 

    // document.getElementById('chapter_timer').innerHTML = '距离2118年10月1日还有：' + d + '天' + h + '小时' + m + '分钟' + s + '秒' + hm + '毫秒'; //最后这句讲定义好的显示 更新到 ID为 chapter_timer的 div中

}


function timestampToTime(timestamp) {
    // var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
}

var min_num, chapter_time_cha, chapter_time, time_show, chapter_reload_time;

(function() {
   if ($('.chapter_countdown').length > 0) {
       
   
    var course_id = $(".js_chapter_timer").data("id");
    $.cookie('course_id', course_id, { 
        path: '/',domain:'shenlanxueyuan.com'
    }); 

    // min_num = 1; 
    min_num = $(".js_chapter_timer").data("time"); 

    chapter_time = "chapter_time"+$.cookie("course_id");
    chapter_time_cha = "chapter_time_cha"+$.cookie("course_id");
    time_show = "time_show"+$.cookie("course_id");
    chapter_reload_time = "chapter_reload_time"+$.cookie("course_id");

    $.cookie(chapter_time, min_num, { 
        path: '/',domain:'shenlanxueyuan.com'
    }); 
   
    if($.cookie(time_show) != "yes"){
        min_num = $.cookie(chapter_time); 
        $.cookie(time_show, "no", { 
            path: '/',domain:'shenlanxueyuan.com'
        }); 
    }else{
        min_num = $.cookie(chapter_reload_time);
    }

    console.log(min_num);
    var tim = new Date().getTime() + min_num*60*1000;
    var timnum = timestampToTime(tim); 
    window['ttt'] = setInterval(function() {
        // TimeTo('2021/07/15 00:00:00:00'); //定义倒计时的结束时间，注意格式  
        TimeTo(timnum);
    }, 50); //定义计时器，每隔1000毫秒 也就是1秒 计算并更新 div的显示  
    
    window.addEventListener("beforeunload", function (e) {
        //不是所有浏览器都支持提示信息的修改
        // var confirmationMessage = "请先保存您编辑的内容,否则您修改的信息会丢失。";
        // console.log(confirmationMessage);
        chapter_time_cha_num = $.cookie(chapter_time_cha); 
        chapter_time_cha_num = (chapter_time_cha_num/(60*1000)).toFixed(4);
        $.cookie(chapter_reload_time, chapter_time_cha_num, { 
            path: '/',domain:'shenlanxueyuan.com'
        }); 
        $.cookie(time_show, "yes", { 
            path: '/',domain:'shenlanxueyuan.com'
        }); 
        console.log(chapter_reload_time);
        // e.returnValue = confirmationMessage;
        // return confirmationMessage;
    })
}
})(); 