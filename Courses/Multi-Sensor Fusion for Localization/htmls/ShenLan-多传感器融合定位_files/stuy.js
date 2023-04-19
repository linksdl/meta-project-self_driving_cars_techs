var studyTime = document.querySelectorAll(".course-study-time li");
var clearfix = document.querySelector(".course-study-time ul");
var courseStudyTime = document.querySelector('.course-study-time');
var jsReceiveCollection = document.querySelector('.js-receive-collection') || '';
var w = document.documentElement.offsetWidth || document.body.offsetWidth;
var clearfixPublic = document.querySelector('.clearfix-public');
var openDetailAlert = document.querySelector('.alert-over-pdf-box');
var dialogImgCode = openDetailAlert.getAttribute('data-img-code');
if (w <= '768') {
    if (clearfixPublic) {
        clearfixPublic.style.display = 'none';
    }
    if(studyTime.length >= 4) {
        clearfix.style.display = 'unset';
        console.log(clearfix.style.display)
        for (let i = 0; i < studyTime.length; i++) {
            studyTime[i].style.width = '50%';
            studyTime[i].style.margin = '10px 0';
        }
    }
}


var textOpenlist = document.querySelector('.open-info-navlink')|| '';
var textlistItem = document.querySelectorAll('.open-info-navlink-title li')|| '';

var openInfoTabItem = document.querySelectorAll('.open-info-tabitem')|| '';


let openItem = 1;
for (let i = 0; i < textlistItem.length; i++) {
    textlistItem[i].onclick = function() {    
        openItem = this.getAttribute('open-item');
        for (let i = 0; i < textlistItem.length; i++) {
            textlistItem[i].className = '';
        }
        this.className = 'active';
        if (this.className == 'active') {
            tab();
        }
    }
}

function tab() {
    for (let i = 0; i < openInfoTabItem.length; i++) {
        openInfoTabItem[i].style.display = 'none';
        if (openItem == openInfoTabItem[i].getAttribute('ident-open')) {
            openInfoTabItem[i].style.display = 'block';
        }
    }
}
tab();



var textlist = document.querySelector('.chapter_price—increase')||'';
if (textlist) {
    var kkk = textlist.innerText.replace(/[^0-9]/ig,"");
    textlist.innerHTML = textlist.innerHTML.replace(kkk,`<font color="#000">${kkk}</font>`);
} 

var openOffsetTop = textOpenlist.offsetTop;

window.onscroll = function() {
    //获取页面的滚动距离
     var oheight = document.documentElement.scrollTop || document.body.scrollTop;
     //滚动到一定位置 div固定到顶部 js实现吸顶
     if ( document.body.offsetWidth <= 767 ) {

     } else {
         
     }
     
     if (openOffsetTop < oheight) {
        if ( document.body.offsetWidth <= 767 ) {
            textOpenlist.style.top = "0";
            textOpenlist.style.width = "100% !important";
        } else {
            // textOpenlist.style.top = "60px";
            textOpenlist.style.top = "0";
            textOpenlist.style.zIndex = 1033;
        }
        textOpenlist.style.position = "fixed";
        textOpenlist.style.left = "50%";
        textOpenlist.style.transform = "translate(-50%)";
     } else {
        textOpenlist.style.position = "relative";
        textOpenlist.style.top = "unset";
        textOpenlist.style.left = "unset";
        textOpenlist.style.transform = "unset";
        textOpenlist.style.zIndex = 188;
     }
 }

 jsReceiveCollection.onclick = function() {
    console.log('go to see')
    if (dialogImgCode) {
        openDetailAlert.classList.remove('hidden');
    } else {
        openDetailAlert.classList.add('hidden');
    }
}