!
function(e, t) {
    var n = ("function" == typeof define, "undefined" != typeof module && module.exports),
    r = "undefined" != typeof window;
    if (n) module.exports = t();
    else if (r) {
        var i = function() {},
        o = new i;
        t.call(o, e)
    }
} ("qla",
function(e) {
    function t(e, t) {
        if (f(e)) return e[t]
    }
    function n(e) {
        return t(ve, at + e)
    }
    function r(e, t) {
        return e === t
    }
    function i(e, t) {
        return ! s(e) && !s(t) && (be.call(e, t) || f(e[t]))
    }
    function o(e) {
        var t = 0;
        return s(e) || null === e ? t = 0 : e.length === +e.length ? t = e.length: v(e) ? t = Ee(e).length: (d(e) || p(e)) && (t = String(e).length),
        t
    }
    function a(e, t, n) {
        if (!s(e) && h(t)) if (xe && e.forEach === xe) e.forEach(t, n);
        else if (Oe(e)) {
            for (var r = 0,
            a = o(e); r < a; r++) if (t.call(n, e[r], r, e) === de) return
        } else if (v(e)) for (var c in e) if (i(e, c) && t.call(n, e[c], c, e) === de) return
    }
    function c(e) {
        return a(ke.call(arguments, 1),
        function(t) {
            a(t,
            function(t, n) {
                e !== t && (e[n] = t)
            },
            this)
        },
        this),
        e
    }
    function u(e, t) {
        return t < 1 ? "": new Array(t + 1).join(e)
    }
    function f() {
        var e = arguments,
        t = e.length;
        if (t < 2) return "undefined" != typeof e[0];
        var n = !0;
        return a(e,
        function(e) {
            if ("undefined" == typeof e) return n = !1,
            {}
        }),
        n
    }
    function s() {
        var e = arguments,
        t = e.length;
        if (t < 2) return "undefined" == typeof e[0];
        var n = !0;
        return a(e,
        function(e) {
            if ("undefined" != typeof e) return n = !1,
            {}
        }),
        n
    }
    function l(e) {
        var t = !0;
        return f(e) && null !== e && "null" !== e && "" !== e && (t = !1),
        t || !Oe(e) && !v(e) || (t = !0, a(e,
        function(e) {
            if (f(e)) return t = !1,
            de
        })),
        t
    }
    function p(e) {
        return e === !0 || e === !1
    }
    function h(e) {
        return "[object Function]" === we.call(e)
    }
    function g(e) {
        return "[object String]" === we.call(e)
    }
    function d(e) {
        return "[object Number]" === we.call(e)
    }
    function v(e) {
        return e === Object(e) && !Oe(e) && !h(e)
    }
    function m() {
        var e = Math.random(),
        t = arguments,
        n = o(t);
        return 1 === n ? e *= t[0] : 2 === n && (e = Se(e * (t[1] - t[0])) + t[0]),
        e
    }
    function y(e, t) {
        if (e < 1) return 0;
        for (var n, r = "",
        i = "num" === t; o(r) < e;) n = qe(We.usec() * m() * 999),
        i || (n = n.toString(16)),
        r += n;
        return r.substr(0, e)
    }
    function b(e) {
        var t = function(e, t) {
            for (var n = e.toString(16), r = o(n) - 1, i = ""; o(i) < t;) i += n.substr(Se(m(0, r)), 1);
            return i
        },
        n = Date.now(),
        r = w(n.toString(16), 12),
        i = r.substr(0, 8),
        a = r.substr(8, 4),
        c = t(n, 4),
        u = t(y(n % 97), 2),
        f = t(y(n % 89), 2),
        s = t(y(4), 1) + t(y(8), 1) + t(y(16), 2) + t(y(32), 2) + t(y(64), 3) + t(y(128), 3),
        l = "";
        return e && (c = (e + c).substr(0, 4)),
        l = i + "-" + a + "-" + c + "-" + u + f + "-" + s,
        l.toUpperCase()
    }
    function w(e, t) {
        if (!e) return "0";
        var n = String(e),
        r = t - o(n);
        return u("0", r) + n
    }
    function k(e, t) {
        var n = ke.call(arguments, 2);
        return setTimeout(function() {
            return e.apply(null, n)
        },
        t)
    }
    function x(e) {
        return k.apply(this, [e, 1].concat(ke.call(arguments, 1)))
    }
    function S() {
        var e;
        return (e = se.match(/ucbrowser\/([\d.]+)/)) ? (Re.uc = !0, Re.name = "UCBrowser") : (e = se.match(/qqbrowser\/([\d.]+)/)) ? (Re.qq = !0, Re.name = "QQBrowser") : (e = se.match(/liebaofast\/([\d.]+)/)) ? (Re.liebao = !0, Re.name = "LieBao") : (e = se.match(/msie ([\d.]+)/)) ? (Re.ie = !0, Re.name = "MSIE", 10 === Y.documentMode ? Re.ie10 = !0 : 9 === Y.documentMode ? Re.ie9 = !0 : ve.postMessage ? Re.ie8 = !0 : ve.XMLHttpRequest ? Re.ie7 = !0 : Y.compatMode ? Re.ie6 = !0 : ve.createPopup ? Re.ie5_5 = !0 : ve.attachEvent ? Re.ie5 = !0 : Y.all && (Re.ie4 = !0)) : (e = se.match(/firefox\/([\d.]+)/)) ? (Re.firefox = !0, Re.name = "Firefox") : (e = se.match(/chrome\/([\d.]+)/)) ? (Re.chrome = !0, Re.name = "Chrome") : ve.opera ? (Re.opera = !0, Re.name = "Opera") : (e = se.match(/version\/([\d.]+).*safari/)) ? (Re.safari = !0, Re.name = "Safari") : Re.unknown = !0,
        e && e.length > 1 && (Re.version = e[1]),
        (e = se.match(/u3\/([\d.]+)/)) ? (Re.u3 = !0, Re.core = "U3") : ((e = se.match(/applewebkit\/([\d.]+)/)) || (e = se.match(/safari\/([\d.]+)/))) && (Re.webkit = !0, Re.core = "Webkit"),
        e && e.length > 1 && (Re.coreVersion = e[1]),
        Re
    }
    function _() {
        var e = new Date,
        t = e.getTimezoneOffset(),
        n = t / 60;
        he = "",
        n < -10 || n > 10 ? he = 100 * n: n < -10 ? he = "-0" + 100 * Math.abs(n) : n < 10 && (he = "0" + 100 * Math.abs(n))
    }
    function I() {
        return ve.top && ve.top.document && (le = ve.top.document.referrer),
        l(le) && ve.parent && ve.parent.document && (le = ve.parent.document.referrer),
        l(le) && (le = Y.referrer),
        q(ve.location.href, ve.document.referrer),
        le
    }
    function q(e, t) {
        if (!sessionStorage) return "";
        var n = sessionStorage.getItem("absUrl"),
        r = sessionStorage.getItem("refUrl");
        return null === n && null === r ? (n = e, sessionStorage.setItem("absUrl", e), r = t, sessionStorage.setItem("refUrl", t)) : e !== n && (sessionStorage.setItem("refUrl", n), r = n, sessionStorage.setItem("absUrl", e), n = e),
        r
    }
    function M() {
        if (ce.cookieEnabled === !0) pe = !0;
        else {
            var e = "_qla_cookie_",
            t = "test";
            Te.set(e, t),
            pe = Te.get(e) === t
        }
        return pe
    }
    function A() {
        var e = $ && $.clientHeight || 0,
        t = J && J.clientHeight || 0,
        n = $ && $.clientWidth || 0,
        r = J && J.clientWidth || 0;
        re = e < t ? e: t,
        ne = n < r ? n: r,
        oe = J && J.scrollHeight || $ && $.scrollHeight || 0,
        ie = J && J.scrollWidth || $ && $.scrollWidth || 0
    }
    function E() {
        Y = ve.document,
        G = Y.domain,
        $ = Y.body,
        J = Y.documentElement,
        K = ve.screen,
        Z = K.colorDepth,
        ee = K.width,
        te = K.height,
        ae = ee + "x" + te,
        ce = ve.navigator,
        ue = ce.platform,
        fe = ce.userAgent,
        se = fe.toLowerCase(),
        _(),
        I(),
        S(),
        A(),
        M()
    }
    function O(e) {
        e ? (He.push(e), C()) : (Ve = !0, a(He,
        function(e) {
            e && e.apply()
        },
        this), He = [])
    }
    function C() {
        return r(Y.readyState, "complete") ? x(O) : (Ne.on(Y, "DOMContentLoaded", L), void Ne.on(ve, "load", L))
    }
    function L() {
        Ne.off(Y, "DOMContentLoaded", L),
        Ne.off(Y, "readystatechange", L),
        Ne.off(ve, "load", L),
        x(O)
    }
    function j(e) {
        var t, n, r, i, o = We.usec(),
        a = qe(o / 1e3);
        if (e && e.length > 0 && (t = e.split("="), t.length > 0 && (n = Ae(t[0]), r = Number(t[1]), i = Number(t[2]), 0 === i || i > a))) return [n, r, i]
    }
    function U(e) {
        return g(e) ? e: e.join("=")
    }
    function W() {
        return We.between(We.now(), Je)
    }
    function D() {
        nt.trigger("load")
    }
    function z() {
        nt.trigger("leave")
    }
    function N() {
        Ge || (A(), Ge = De.once(function() {
            A(),
            Ge = null,
            nt.trigger("resize")
        },
        150))
    }
    function R() {
        it.pageWidth > 0 && "zoom" === it.pageLayout && (ct = ne / it.pageWidth)
    }
    function T(e, t, n, r, i) {
        return st({
            message: e,
            url: t,
            lineno: n,
            colno: r
        }),
        !!ft && ft(e, t, n, r, i)
    }
    function V(e) {
        e || (e = location.search.substring(1));
        var t = e.split("&"),
        n = {};
        return a(t,
        function(e) {
            var t = e.split("="),
            r = t[0],
            i = t[1];
            f(r) && f(i) && (n[r] = i)
        }),
        n
    }
    function H(e) {
        var t = new Fe,
        n = new Image(1, 1);
        return n.onload = function() {
            Fe.resolve(t)
        },
        n.onabort = n.onerror = function() {
            Fe.reject(t)
        },
        n.src = e,
        t
    }
    function B() {
        for (var e, t = {},
        n = arguments,
        r = n.length,
        i = Ae(window.location.href), o = Ae(window.location.pathname), a = 0; a < r; a++) v(n[a]) && c(t, n[a]);
        return e = new je(Be),
        e.set(t),
        e.set({
            url: i,
            path: o,
            platform: ue,
            caller: "h5"
        }),
        e.set({
            appcaller: Te.get("caller"),
            appos: Te.get("os"),
            appver: Te.get("ver"),
            userId: Te.get("userId")
        }),
        e
    }
    function F(e) {
        if (e) return e.className && e.className.indexOf("on-log") > -1 ? e: F(e.parentNode)
    }
    function P(e) {
        var t = (e.target && e.target.className, F(e.target));
        if (t) {
            var n = c({
                x: e.pageX,
                y: e.pageY
            },
            Q(t));
            ut(n)
        }
    }
    function Q(e) {
        if (e) {
            for (var t = e.attributes,
            n = {},
            r = 0,
            i = t.length; r < i; r++) {
                var o, a = t[r];
                0 !== a.name.indexOf("log-") && 0 !== a.name.indexOf("data-log-") || (o = a.name.substring(4), 0 === a.name.indexOf("data-log-") && (o = a.name.substring(9)), o && (n[o] = Me(a.value)))
            }
            return n
        }
    }
    function X(e) {
        if (e) {
            var t, n, r, i = ke.call(arguments, 1),
            o = e.split(",");
            o.forEach(function(e) {
                t = ye[e],
                t && (h(t) ? t.apply(me, i) : Oe(t) && (n = t[0], r = t[1], n.apply(r, i)))
            })
        }
        return this
    }
    var Y, G, $, J, K, Z, ee, te, ne, re, ie, oe, ae, ce, ue, fe, se, le, pe, he, ge = "1.0.0",
    de = {},
    ve = window,
    me = this,
    ye = {},
    be = Object.prototype.hasOwnProperty,
    we = Object.prototype.toString,
    ke = (String.prototype.substring, Array.prototype.slice),
    xe = (Array.prototype.splice, Array.prototype.forEach),
    Se = Math.round,
    _e = Math.abs,
    Ie = Math.ceil,
    qe = Math.floor,
    Me = encodeURIComponent,
    Ae = decodeURIComponent,
    Ee = Object.keys,
    Oe = Array.isArray,
    Ce = {
        on: function(e, t, n) {
            if (e && t) {
                var r = this._callbacks || (this._callbacks = {}),
                i = r[e] || (r[e] = []);
                i.push({
                    fn: t,
                    context: n
                })
            }
        },
        off: function(e, t, n) {
            if (e) {
                var r = this._callbacks && this._callbacks[e];
                r && a(r,
                function(e, i) { ! e || t && e.fn !== t || n && e.context !== n || (r[i] = null)
                })
            } else delete this._callbacks
        },
        trigger: function(e) {
            if (e) {
                var t, n = this._callbacks && this._callbacks[e],
                r = ke.call(arguments, 1);
                n && a(n,
                function(e, n) {
                    e && e.fn && (t = e.context || me, e.fn.apply(t, r))
                })
            }
        }
    },
    Le = function() {
        this.init.apply(this, arguments)
    };
    c(Le.prototype, Ce, {
        init: function(e, t) {
            this.map = {},
            this.add(e, t)
        },
        add: function(e, t, n) {
            if (!s(e)) {
                var r, i, o = !1;
                v(e) ? (r = e, n = t) : (r = {},
                r[e] = t),
                n && (n.force === !0 && (o = !0), n.check && (i = n.check)),
                a(r,
                function(e, t) { ! f(t) || !o && this.has(t) || i && !i.call(this, t, e) || (this.map[t] = e)
                },
                this)
            }
        },
        set: function(e, t, n) {
            if (!s(e)) {
                var r;
                v(e) ? (r = e, n = t) : (r = {},
                r[e] = t),
                n || (n = {}),
                n.force = !0,
                this.add(r, n)
            }
        },
        get: function(e) {
            return f(e) ? this.map[e] : void 0
        },
        has: function(e) {
            return f(e) && f(this.map[e])
        },
        remove: function(e) {
            f(e) && delete this.map[e]
        },
        clear: function() {
            this.map = {}
        },
        each: function(e) {
            a(this.map, e, this)
        }
    });
    var je = function() {
        this.init.apply(this, arguments)
    };
    c(je.prototype, Le.prototype, {
        stringify: function() {
            var e = "";
            return this.each(function(t, n) {
                f(t) && (e += "&" + n + "=" + Me(t))
            }),
            e.substring(1)
        }
    });
    var Ue = function() {
        this.init.apply(this, arguments)
    };
    c(Ue.prototype, Ce, {
        init: function(e) {
            var t = this;
            if (t.list = [], e) {
                var n = e.onAdd,
                r = e.onRemove,
                i = e.onClear;
                n && t.onAdd(n),
                r && t.onRemove(r),
                i && t.onClear(i)
            }
        },
        all: function() {
            return this.list
        },
        add: function(e, t) {
            this.list.push(e),
            t || this.trigger("a", e)
        },
        onAdd: function(e) {
            this.on("a", e, this)
        },
        remove: function(e, t) {
            for (var n = this,
            r = n.size(), i = r - 1; i >= 0; i--) n.list[i] === e && (n.list.splice(i, 1), t || n.trigger("r", e))
        },
        onRemove: function(e) {
            this.on("r", e, this)
        },
        clear: function(e) {
            var t = this;
            t.list = [],
            e || t.trigger("c", t.list)
        },
        onClear: function(e) {
            this.on("c", e, this)
        },
        size: function() {
            return o(this.list)
        },
        each: function(e) {
            a(this.list, e, this)
        }
    });
    var We = {
        now: function() {
            return new Date
        },
        nowString: function() {
            var e = this.now();
            return this.format(e)
        },
        at: function(e) {
            var t = this.usec() + (e || 0);
            return new Date(t)
        },
        usec: function(e) {
            return e || (e = this.now()),
            e.getTime()
        },
        between: function(e, t) {
            return e ? (t || (t = this.now()), _e(t - e)) : 0
        },
        rand: function() {
            return this.make(m(0, (new Date).getFullYear()), m(0, 11), m(0, 31), m(0, 23), m(0, 59), m(0, 59), m(0, 999))
        }
    },
    De = {
        on: function(e, t, n) {
            if (e) {
                t || (t = 1),
                n || (n = 0);
                var r = ke.call(arguments, 3),
                i = null,
                o = -1;
                return i = function() {
                    e.apply(null, r)
                },
                o = 1 === n ? setTimeout(i, t) : setInterval(i, t)
            }
        },
        off: function(e) {
            clearTimeout(e),
            clearInterval(e)
        },
        once: function(e, t) {
            for (var n, r = [e, t, 1], i = o(arguments), a = 2; a < i; a++) r.push(arguments[a]);
            return n = De.on.apply(this, r)
        }
    },
    ze = {},
    Ne = {
        on: function(e, t, n) {
            if (e && t && n) {
                var r = ze[t] || (ze[t] = []);
                r.push({
                    el: e,
                    fn: n
                }),
                Ne.add(e, t, n)
            }
        },
        off: function(e, t, n) {
            if (e && t) {
                var r = ze[t];
                a(r,
                function(e, n) {
                    if (e) {
                        var i = e.el,
                        o = e.fn;
                        r[n] = null,
                        Ne.remove(i, t, o)
                    }
                })
            }
        },
        add: function(e, t, n) {
            e.addEventListener(t, n, !1)
        },
        remove: function(e, t, n) {
            e.removeEventListener(t, n, !1)
        }
    },
    Re = {
        uc: !1,
        qq: !1,
        liebao: !1,
        ie: !1,
        ie4: !1,
        ie5: !1,
        ie5_5: !1,
        ie6: !1,
        ie7: !1,
        ie8: !1,
        ie9: !1,
        ie10: !1,
        chrome: !1,
        safari: !1,
        firefox: !1,
        opera: !1,
        u3: !1,
        webkit: !1,
        unknown: !1
    },
    Te = {
        set: function(e, t, n) {
            n || (n = {});
            try {
                var r = {},
                i = "";
                r[e] = t,
                n.expires && (r.expires = n.expires.toGMTString()),
                r.domain = n.domain || G,
                r.path = n.path || "/",
                r = new Le(r),
                r.each(function(e, t) {
                    i += t + "=" + e + ";"
                }),
                Y.cookie = i
            } catch(e) {}
        },
        get: function(e) {
            try {
                var t = "(^|)" + e + "=([^;]*)(;|$)",
                n = Y.cookie.match(new RegExp(t));
                if (n) return n[2]
            } catch(e) {
                console.log("cookie get val failed:", e)
            }
        },
        remove: function(e) {
            try {
                this.set(e, "", {
                    expires: We.at( - 1)
                })
            } catch(e) {}
        }
    },
    Ve = !1,
    He = [],
    Be = {
        site: "ql-site",
        sitever: ge
    },
    Fe = function() {
        this.init.apply(this, arguments)
    };
    Fe.prototype.init = function() {},
    Fe.prototype.then = function(e, t) {},
    Fe.resolve = function() {},
    Fe.reject = function() {};
    var Pe = {
        set: function(e, t, n) {
            try {
                n || (n = {}),
                t = U(t),
                n.expires = We.at(316224e6),
                Te.set(e, t, n)
            } catch(e) {}
        },
        get: function(e) {
            try {
                return j(Te.get(e))
            } catch(e) {}
        },
        remove: function(e) {
            try {
                Te.remove(e)
            } catch(e) {}
        }
    },
    Qe = {
        set: function(e, t, n) {
            try {
                ve.localStorage && (ve.localStorage.removeItem(e), ve.localStorage.setItem(e, U(t)))
            } catch(e) {}
        },
        get: function(e) {
            try {
                return ve.localStorage ? j(ve.localStorage.getItem(e)) : {}
            } catch(e) {}
        },
        remove: function(e) {
            try {
                ve.localStorage && ve.localStorage.removeItem(e)
            } catch(e) {}
        }
    },
    Xe = null,
    Ye = {
        set: function(e, t, n) {
            var r, i = We.usec(),
            o = Ie(i / 1e3),
            a = i + 316224e5;
            if (l(n) && (n = {}), d(n.expires) && (a = n.expires), a > 0) a < i && (a += i),
            a = Ie(a / 1e3);
            else if (a < 0) return this;
            return r = [t, o, a],
            n.local !== !1 && Qe && Qe.set(e, r, n),
            n.cookie !== !1 && Pe && Pe.set(e, r, n),
            n.userData !== !1 && Xe && Xe.set(e, r, n),
            this
        },
        get: function(e, t) {
            var n;
            return l(t) && (t = {}),
            t.local !== !1 && Qe && (n = Qe.get(e)),
            !n && t.cookie !== !1 && Pe && (n = Pe.get(e)),
            !n && t.userData !== !1 && Xe && (n = Xe.get(ns)),
            n && n[0]
        },
        has: function(e, t) {
            var n = this.get(e, t);
            return ! l(n)
        },
        remove: function(e) {
            return Qe && Qe.remove(e),
            Pe && Pe.remove(e),
            Xe && Xe.remove(e),
            this
        }
    };
    c(Ye, {
        forward: function(e) {
            return e && Ye.set("pf", e.getTime(), {
                expires: 18e4
            }),
            Ye.get("pf")
        }
    });
    var Ge, $e, Je, Ke = 3e4,
    Ze = 864e5,
    et = !1,
    tt = function() {};
    c(tt.prototype, Ce);
    var nt = new tt;
    ye.on = [nt.on, nt],
    ye.off = [nt.off, nt];
    var rt = [];
    ye.set = function e(t, n) {
        if (g(t)) {
            var r = !1;
            a(rt,
            function(e) {
                if (!r && (r = e(t, n))) return de
            }),
            r || (Be[t] = n)
        } else v(t) && a(t,
        function(n, r) {
            e(r, t[r])
        })
    };
    var it = {
        server: "http://collect.qlchat.com",
        scrollBoxClass: ""
    },
    ot = {
        collect: "/collect",
        pv: "/pv",
        event: "/event",
        click: "/click",
        error: "/error",
        visible: "/visible"
    },
    at = "_qla_";
    rt.push(function(e, t) {
        return !! f(it[e]) && (it[e] = t, !0)
    });
    var ct = 1;
    c(it, {
        pageLayout: null,
        pageWidth: 0,
        pageAlign: null
    }),
    nt.on("readVar",
    function() {
        it.pageLayout = n("pl") || null,
        it.pageWidth = n("pw") || 0,
        it.pageAlign = n("pa") || null
    }),
    nt.on("processVar", R),
    nt.on("resize", R);
    var ut = ye.click = function(e) {
        e && (f(e.x) && (e.x = qe(e.x / ct)), it.pageLayout && (e.pl = it.pageLayout), it.pageWidth && (e.pw = it.pageWidth), it.pageAlign && (e.pa = it.pageAlign), nt.trigger("send", e, {
            api: ot.click,
            type: "click"
        }))
    },
    ft = (ye.event = function(e, t, n, r) {
        var i;
        i = g(e) ? {
            category: e,
            action: t,
            label: n,
            value: r
        }: e,
        nt.trigger("send", i, {
            api: ot.event,
            type: "event"
        })
    },
    window.onerror);
    window.onerror = T;
    var st = ye.error = function(e, t) {
        var n = {};
        if (v(e)) for (var r in e) n[r] = e[r];
        else n.message = e,
        n.url = t;
        nt.trigger("send", n, {
            api: ot.error,
            type: "error"
        })
    },
    lt = ye.pv = function(e) {
        nt.trigger("send", e, {
            api: ot.pv,
            type: "pv"
        })
    };
    nt.on("readVar",
    function() {
        et = !!(n("singleton") || n("sing") || et);
        var e = Ye.get("cid");
        Be.cid || (Be.cid = n("cid") || e || b("v")),
        e && e === Be.uuid || (Ye.set("cid", Be.uuid), Be.nv = 1),
        n("s") && (it.server = n("s")),
        d(n("rdy_to")) && (Ke = n("rdy_to")),
        d(n("clt_to")) && (Ze = n("clt_to")),
        Re.name && (Be.br = Re.name, Be.brv = Re.version),
        c(Be, {
            ua: fe,
            ck: pe ? 1 : 0,
            tz: he,
            rs: ae
        })
    }),
    rt.push(function(e, t) {
        if (e && t && 0 === t.indexOf("query.")) {
            var n = V(),
            r = n[t.replace("query.", "")];
            return f(r) && X.set(e, r),
            !0
        }
        return ! 1
    });
    nt.on("send",
    function(e, t) {
        if (e && t && !(W() >= Ze)) { ! e.page && Y.title && (e.page = Y.title),
            e.referrer || (I(), le !== $e ? e.referrer = Me(le) : (e.referrer = Me(Ae(location.hash)), e.referrer || (e.referrer = q(window.location.href, window.document.referrer)))),
            $e = le;
            var n = B(e),
            r = n.stringify(),
            i = t.server || it.server,
            o = t.api || ot.collect,
            a = i + o + "?" + r;
            H(a)
        }
    }),
    nt.on("bindEvent",
    function() {
        Ne.on($, "click", P)
    }),
    nt.on("afterInit",
    function() {
        lt({})
    }),
    nt.on("processVar",
    function() {}),
    nt.on("bindEvent",
    function() {
        O(D),
        Ke > -1 && De.once(D, Ke),
        Ne.on(ve, "beforeunload", z),
        Ne.on(ve, "resize", N)
    }),
    ve["_" + e] && et || (ve["_" + e] = X, c(X, ye), nt.trigger("beforeInit"), E(), N(), nt.trigger("init"), nt.trigger("readVar"), ve._uaq && (a(ve._uaq,
    function(e) {
        X.apply(me, e)
    },
    me), ve._uaq = null), nt.trigger("processVar"), nt.trigger("bindEvent"), nt.trigger("afterInit"))
});