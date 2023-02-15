'use strict';
(function () {
    var aboutCourseContentElement = $('#about-course-content'),
        contentElement = $('#about-course-content .content'),
        scrollbarElement = $('.about-course-body .scrollbar'),
        barElement = $('.about-course-body .scrollbar .bar'),
        aboutCourseContentHeight = aboutCourseContentElement.height(),
        contentHeight = contentElement.height(),
        scrollbarHeight = scrollbarElement.height(),
        barHeight = barElement.height(),
        aboutCourseDisHeight = contentHeight - aboutCourseContentHeight,
        barDisHeight = scrollbarHeight - barHeight;

    aboutCourseContentElement.on("mousewheel DOMMouseScroll", function (e) {
        var scale = $(this).scrollTop() / aboutCourseDisHeight;

        barElement
            .stop()
            .animate (
                {"top": barDisHeight * scale}
            );

    });

})();