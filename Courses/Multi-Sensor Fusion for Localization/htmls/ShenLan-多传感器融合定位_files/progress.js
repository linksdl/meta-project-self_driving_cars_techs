//进度条
$.fn.extend({
    initData: function(initObj) { 
        var nplan;
        if (initObj.percent == 0) {
            nplan="奋斗ing";
        } else {
            nplan=initObj.percent+"%";
        }
        var innerEl = '<div class="m-percent-include" style="height: ' + initObj.height + 'px;">' +
            '<div class = "m-no-percent" style="height: ' + initObj.height + 'px;">' +
            '<div class = "m-bg-percent" style="height: ' + initObj.height + 'px;"></div>' +
            '</div> </div> '
        $(this).append(innerEl)
        var _this = $(this)
        if(initObj.isAuto) {
            setTimeout(function() {
                _this.find('.m-percent-include').css({
                    height: initObj.height + 'px',
                    borderRadius: initObj.height / 2 + 'px'
                })
                _this.find('.m-no-percent').css({
                    height: initObj.height + 'px',
                    borderRadius: initObj.height / 2 + 'px',
                    left: (initObj.percent - 100) + '%',
                    transition: 'left 2s ease-in-out'
                })
                _this.find('.m-bg-percent').css({
                    height: initObj.height + 'px',
                    borderRadius: initObj.height / 2 + 'px',
                    background: 'linear-gradient(to right,' + (initObj.bgStartColor ? initObj.bgStartColor : '#feea4d') + ',' + (initObj.bgEndColor ? initObj.bgEndColor : '#ff3d00') + ')',
                    left: (100 - initObj.percent) + '%',
                    transition: 'left 2s ease-in-out'
                })
            }, 200)
        } else {
            _this.find('.m-percent-include').css({
                height: initObj.height + 'px',
                borderRadius: initObj.height / 2 + 'px'
            })
            _this.find('.m-no-percent').css({
                height: initObj.height + 'px',
                borderRadius: initObj.height / 2 + 'px',
                left: (initObj.percent - 100) + '%'
            })
            _this.find('.m-bg-percent').css({
                height: initObj.height + 'px',
                borderRadius: initObj.height / 2 + 'px',
                background: 'linear-gradient(to right,' + (initObj.bgStartColor ? initObj.bgStartColor : '#feea4d') + ',' + (initObj.bgEndColor ? initObj.bgEndColor : '#ff3d00') + ')',
                left: (100 - initObj.percent) + '%'
            })
        }
    } 
    
})