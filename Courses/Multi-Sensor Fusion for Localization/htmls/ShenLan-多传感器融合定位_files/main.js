webpackJsonp(["app/js/main"], {
    dfa8b8b7fc44e9c4818f: function(e, t) {},
    0: function(e, t, n) {
        "use strict";

        function a(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var o = n("5e43b380909c2bc24f2c"),
            r = a(o);
        n("1b51916018948caf0622"), n("227ff5f887a3789f9963"), n("987ec39011f7fda20ea1");
        var i = n("9181c6995ae8c5c94b7a"),
            s = n("d684b1eba6c0b776a43a"),
            c = a(s);
        if (n("dfa8b8b7fc44e9c4818f"), $('[data-toggle="popover"]').popover({
                html: !0
            }), $('[data-toggle="tooltip"]').tooltip({
                html: !0
            }), $(document).ajaxError(function(e, t, n, a) {
                "LoginLimit" === t.responseText && (location.href = "/login");
                var o = jQuery.parseJSON(t.responseText),
                    r = o.error;
                if (r && "Unlogin" === r.name) {
                    var i = navigator.userAgent.toLowerCase();
                    if ("micromessenger" == i.match(/micromessenger/i) && 0 != $("meta[name=is-open]").attr("content")) window.location.href = "/login/bind/weixinmob?_target_path=" + location.href;
                    else {
                        var s = $("#login-modal");
                        $(".modal").modal("hide"), s.modal("show"), $.get(s.data("url"), function(e) {
                            s.html(e)
                        })
                    }
                }
            }), $(document).ajaxSend(function(e, t, n) {
                "POST" === n.type && t.setRequestHeader("X-CSRF-Token", $("meta[name=csrf-token]").attr("content"))
            }), app.scheduleCrontab && $.post(app.scheduleCrontab), $("i.hover-spin").mouseenter(function() {
                $(this).addClass("md-spin")
            }).mouseleave(function() {
                $(this).removeClass("md-spin")
            }), $(".set-email-alert").length > 0 && $(".set-email-alert .close").click(function() {
                c.default.set("close_set_email_alert", "true")
            }), $(".announcements-alert").length > 0) {
            if ($(".announcements-alert .swiper-container .swiper-wrapper").children().length > 1) {
                new r.default(".alert-notice .swiper-container", {
                    speed: 300,
                    loop: !0,
                    mode: "vertical",
                    autoplay: 5e3,
                    calculateHeight: !0
                })
            }
            $(".announcements-alert .close").click(function() {
                c.default.set("close_announcements_alert", "true", {
                    path: "/"
                })
            })
        }(0, i.isMobileDevice)() ? $("li.nav-hover >a").attr("data-toggle", "dropdown"): $("body").on("mouseenter", "li.nav-hover", function(e) {
            $(this).addClass("open")
        }).on("mouseleave", "li.nav-hover", function(e) {
            $(this).removeClass("open")
        }), $(".js-search").focus(function() {
            $(this).prop("placeholder", "").addClass("active")
        }).blur(function() {
            $(this).prop("placeholder", Translator.trans("搜索")).removeClass("active")
        }), $(".nav.nav-tabs").length > 0 && !(0, i.isMobileDevice)() && $(".nav.nav-tabs").lavaLamp(), $("select[name='language']").change(function() {
            c.default.set("locale", $("select[name=language]").val(), {
                path: "/"
            }), $("select[name='language']").parents("form").trigger("submit")
        })
    },
    "227ff5f887a3789f9963": function(e, t, n) {
        "use strict";

        function a(e) {
            $("body").on("click", ".js-card-content .follow-btn", function() {
                var e = $(this),
                    t = e.data("loggedin");
                "1" == t && i(e), $.post(e.data("url"))
            }).on("click", ".js-card-content .unfollow-btn", function() {
                var e = $(this);
                r(e), $.post(e.data("url"))
            })
        }

        function o(e, t) {
            e.on("click", ".direct-message-btn", function() {
                $(t).popover("hide")
            })
        }

        function r(e) {
            e.hide(), e.siblings(".follow-btn").show();
            var t = $("#user-card-" + e.closest(".js-card-content").data("userId"));
            t.find(".unfollow-btn").hide(), t.find(".follow-btn").show()
        }

        function i(e) {
            e.hide(), e.siblings(".unfollow-btn").show();
            var t = $("#user-card-" + e.closest(".js-card-content").data("userId"));
            t.find(".follow-btn").hide(), t.find(".unfollow-btn").show()
        }
        n("9181c6995ae8c5c94b7a");
        navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i) || (a(".js-card-content"), $(".js-user-card").on("mouseenter", function() {
            
            var e = $(this),
                t = e.data("userId"),
                n = '<div class="card-body"><div class="card-loader"><span class="loader-inner"><span></span><span></span><span></span></span>' + Translator.trans("名片加载中") + "</div>",
                a = setTimeout(function() {
                    function a(n) {
                        e.popover("destroy"), setTimeout(function() {
                            0 == $("#user-card-" + t).length && ($("body").find("#user-card-store").length > 0 ? $("#user-card-store").append(n) : ($("body").append('<div id="user-card-store" class="hidden"></div>'), $("#user-card-store").append(n))), e.popover({
                                trigger: "manual",
                                placement: "auto top",
                                html: "true",
                                content: function() {
                                    return n
                                },
                                template: '<div class="popover es-card"><div class="arrow"></div><div class="popover-content"></div></div>',
                                container: "body",
                                animation: !0
                            }), e.popover("show"), e.data("popover", !0), $(".popover").on("mouseleave", function() {
                                e.popover("hide")
                            })
                        }, 200)
                    }
                    if (0 != $("#user-card-" + t).length && e.data("popover")) {
                        var r = $("#user-card-" + t).clone();
                        a(r)
                    } else {
                        var i = function() {
                            e.popover({
                                trigger: "manual",
                                placement: "auto top",
                                html: "true",
                                content: function() {
                                    return n
                                },
                                template: '<div class="popover es-card"><div class="arrow"></div><div class="popover-content"></div></div>',
                                container: "body",
                                animation: !0
                            })
                        };
                        $.ajax({
                            type: "GET",
                            url: e.data("cardUrl"),
                            dataType: "html",
                            beforeSend: i,
                            success: a
                        })
                    }
                    o($(".es-card"), e)
                }, 100);
            e.data("timerId", a)
        }).on("mouseleave", function() {
            var e = $(this);
            setTimeout(function() {
                $(".popover:hover").length || e.popover("hide")
            }, 100), clearTimeout(e.data("timerId"))
        }))
    },
    "987ec39011f7fda20ea1": function(e, t) {
        "use strict";
        ! function() {
            if (Event.prototype.preventDefault || (Event.prototype.preventDefault = function() {
                    this.returnValue = !1
                }), Event.prototype.stopPropagation || (Event.prototype.stopPropagation = function() {
                    this.cancelBubble = !0
                }), !Element.prototype.addEventListener) {
                var e = [],
                    t = function(t, n) {
                        var a = this,
                            o = function(e) {
                                e.target = e.srcElement, e.currentTarget = a, "undefined" != typeof n.handleEvent ? n.handleEvent(e) : n.call(a, e)
                            };
                        if ("DOMContentLoaded" == t) {
                            var r = function(e) {
                                "complete" == document.readyState && o(e)
                            };
                            if (document.attachEvent("onreadystatechange", r), e.push({
                                    object: this,
                                    type: t,
                                    listener: n,
                                    wrapper: r
                                }), "complete" == document.readyState) {
                                var i = new Event;
                                i.srcElement = window, r(i)
                            }
                        } else this.attachEvent("on" + t, o), e.push({
                            object: this,
                            type: t,
                            listener: n,
                            wrapper: o
                        })
                    },
                    n = function(t, n) {
                        for (var a = 0; a < e.length;) {
                            var o = e[a];
                            if (o.object == this && o.type == t && o.listener == n) {
                                "DOMContentLoaded" == t ? this.detachEvent("onreadystatechange", o.wrapper) : this.detachEvent("on" + t, o.wrapper), e.splice(a, 1);
                                break
                            }++a
                        }
                    };
                Element.prototype.addEventListener = t, Element.prototype.removeEventListener = n, HTMLDocument && (HTMLDocument.prototype.addEventListener = t, HTMLDocument.prototype.removeEventListener = n), Window && (Window.prototype.addEventListener = t, Window.prototype.removeEventListener = n)
            }
        }()
    },
    "8acbb4dfc93ab6b21c25": function(e, t) {
        "use strict";
        jQuery.extend(jQuery.easing, {
            easein: function(e, t, n, a, o) {
                return a * (t /= o) * t + n
            },
            easeinout: function(e, t, n, a, o) {
                if (t < o / 2) return 2 * a * t * t / (o * o) + n;
                var r = t - o / 2;
                return -2 * a * r * r / (o * o) + 2 * a * r / o + a / 2 + n
            },
            easeout: function(e, t, n, a, o) {
                return -a * t * t / (o * o) + 2 * a * t / o + n
            },
            expoin: function(e, t, n, a, o) {
                var r = 1;
                return a < 0 && (r *= -1, a *= -1), r * Math.exp(Math.log(a) / o * t) + n
            },
            expoout: function(e, t, n, a, o) {
                var r = 1;
                return a < 0 && (r *= -1, a *= -1), r * (-Math.exp(-Math.log(a) / o * (t - o)) + a + 1) + n
            },
            expoinout: function(e, t, n, a, o) {
                var r = 1;
                return a < 0 && (r *= -1, a *= -1), t < o / 2 ? r * Math.exp(Math.log(a / 2) / (o / 2) * t) + n : r * (-Math.exp(-2 * Math.log(a / 2) / o * (t - o)) + a + 1) + n
            },
            bouncein: function(e, t, n, a, o) {
                return a - jQuery.easing.bounceout(e, o - t, 0, a, o) + n
            },
            bounceout: function(e, t, n, a, o) {
                return (t /= o) < 1 / 2.75 ? a * (7.5625 * t * t) + n : t < 2 / 2.75 ? a * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : t < 2.5 / 2.75 ? a * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : a * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n
            },
            bounceinout: function(e, t, n, a, o) {
                return t < o / 2 ? .5 * jQuery.easing.bouncein(e, 2 * t, 0, a, o) + n : .5 * jQuery.easing.bounceout(e, 2 * t - o, 0, a, o) + .5 * a + n
            },
            elasin: function(e, t, n, a, o) {
                var r = 1.70158,
                    i = 0,
                    s = a;
                if (0 == t) return n;
                if (1 == (t /= o)) return n + a;
                if (i || (i = .3 * o), s < Math.abs(a)) {
                    s = a;
                    var r = i / 4
                } else var r = i / (2 * Math.PI) * Math.asin(a / s);
                return -(s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * o - r) * (2 * Math.PI) / i)) + n
            },
            elasout: function(e, t, n, a, o) {
                var r = 1.70158,
                    i = 0,
                    s = a;
                if (0 == t) return n;
                if (1 == (t /= o)) return n + a;
                if (i || (i = .3 * o), s < Math.abs(a)) {
                    s = a;
                    var r = i / 4
                } else var r = i / (2 * Math.PI) * Math.asin(a / s);
                return s * Math.pow(2, -10 * t) * Math.sin((t * o - r) * (2 * Math.PI) / i) + a + n
            },
            elasinout: function(e, t, n, a, o) {
                var r = 1.70158,
                    i = 0,
                    s = a;
                if (0 == t) return n;
                if (2 == (t /= o / 2)) return n + a;
                if (i || (i = o * (.3 * 1.5)), s < Math.abs(a)) {
                    s = a;
                    var r = i / 4
                } else var r = i / (2 * Math.PI) * Math.asin(a / s);
                return t < 1 ? -.5 * (s * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * o - r) * (2 * Math.PI) / i)) + n : s * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * o - r) * (2 * Math.PI) / i) * .5 + a + n
            },
            backin: function(e, t, n, a, o) {
                var r = 1.70158;
                return a * (t /= o) * t * ((r + 1) * t - r) + n
            },
            backout: function(e, t, n, a, o) {
                var r = 1.70158;
                return a * ((t = t / o - 1) * t * ((r + 1) * t + r) + 1) + n
            },
            backinout: function(e, t, n, a, o) {
                var r = 1.70158;
                return (t /= o / 2) < 1 ? a / 2 * (t * t * (((r *= 1.525) + 1) * t - r)) + n : a / 2 * ((t -= 2) * t * (((r *= 1.525) + 1) * t + r) + 2) + n
            },
            linear: function(e, t, n, a, o) {
                return a * t / o + n
            }
        })
    },
    "1b51916018948caf0622": function(e, t, n) {
        "use strict";
        n("8acbb4dfc93ab6b21c25"),
            function(e) {
                e.fn.lavaLamp = function(t) {
                    return t = e.extend({
                        fx: "easein",
                        speed: 200,
                        click: function() {}
                    }, t || {}), this.each(function() {
                        function n(e) {
                            i.css({
                                left: e.offsetLeft + "px",
                                width: e.offsetWidth + "px"
                            }), c = e
                        }

                        function a(n) {
                            i.each(function() {
                                e(this).dequeue()
                            }).animate({
                                width: n.offsetWidth,
                                left: n.offsetLeft
                            }, t.speed, t.fx)
                        }
                        var o = e(this),
                            r = function() {},
                            i = e('<li class="highlight"></li>').appendTo(o),
                            s = e("li", this),
                            c = e("li.active", this)[0] || e(s[0]).addClass("active")[0];
                        s.not(".highlight").hover(function() {
                            a(this)
                        }, r), e(this).hover(r, function() {
                            a(c)
                        }), s.click(function(e) {
                            return n(this), t.click.apply(this, [e, this])
                        }), n(c)
                    })
                }
            }(jQuery)
    }
});