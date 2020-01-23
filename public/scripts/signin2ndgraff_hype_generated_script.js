/* eslint-disable */

function runAnimation(width, height) {
  var kw = width / 1440;
  var kh = height / 900;
  (function m() {
    function k(a, b, c, d) {
      var e = !1
      window[a] == null && (window[b] == null ? (window[b] = [], window[b].push(m), a = document.getElementsByTagName('head')[0], b = document.createElement('script'), e = l, !0 == false && (e = ''), b.type = 'text/javascript', d != '' && (b.integrity = d, b.setAttribute('crossorigin', 'anonymous')), b.src = e + '/' + c, a.appendChild(b)) : window[b].push(m), e = !0)
      return e
    }
    var l = 'SIGN%20IN%20-%202nd%20-%20graff.hyperesources'
    var f = 'SIGN IN - 2nd - graff'
    var g = 'signin2ndgraff_hype_container'
    if (!1
      == false) {
      try {
        for (var c = document.getElementsByTagName('script'), a = 0; a < c.length; a++) {
          var d = c[a].src
          var b = d != null ? d.indexOf('/signin2ndgraff_hype_generated_script.js') : -1
          if (b != -1) {
            l = d.substr(0, b)
            break
          }
        }
      } catch (p) {}
    }
    c = navigator.userAgent.match(/MSIE (\d+\.\d+)/)
    c = parseFloat(c && c[1]) || null
    d = !0 == (window.HYPE_654F != null || window.HYPE_dtl_654F != null) || !0 == true || c != null && c < 10
    a = !0 == d ? 'HYPE-654.full.min.js' : 'HYPE-654.thin.min.js'
    c = !0 == d ? 'F' : 'T'
    d = d ? ''
      : ''
    if (!1 == false && (a = k('HYPE_654' + c, 'HYPE_dtl_654' + c, a, d), !0 == false && (a = a || k('HYPE_w_654', 'HYPE_wdtl_654', 'HYPE-654.waypoints.min.js', '')), !0 == false && (a = a || k('Matter', 'HYPE_pdtl_654', 'HYPE-654.physics.min.js', '')), a)) return
    d = window.HYPE.documents
    if (d[f] != null) {
      b = 1
      a = f
      do f = '' + a + '-' + b++; while (d[f] != null)
      for (var e = document.getElementsByTagName('div'),
        b = !1, a = 0; a < e.length; a++) {
        if (e[a].id == g && e[a].getAttribute('HYP_dn') == null) {
          var b = 1
            var h = g
          do g = '' + h + '-' + b++; while (document.getElementById(g) != null)
          e[a].id = g
          b = !0
          break
        }
      } if (!1 == b) return
    }
    b = []
    b = []
    e = {}
    h = {}
    for (a = 0; a < b.length; a++) {
      try {
        h[b[a].identifier] = b[a].name, e[b[a].name] = eval('(function(){return ' + b[a].source + '})();')
      } catch (n) {
        window.console && window.console.log(n), e[b[a].name] = function () {}
      }
    }
    c = new window['HYPE_654' + c](f, g, {
      '-1': {
        n: 'PIE.htc'
      },
      '-2': {
        n: 'blank.gif'
      }
    }, l, [], e, [{
      n : 'Unbenannte Szene',
      o : '1',
      X : [0]
    }],
    [{
      o  : '3',
      p  : '600px',
      cA : false,
      Y  : 1440 * kw,
      Z  : 900 * kh,
      L  : [],
      c  : '#00D1C1',
      bY : 1,
      d  : 1440 * kw,
      U  : {},
      T  : {
        kTimelineDefaultIdentifier: {
          q : false,
          z : 6.08,
          i : 'kTimelineDefaultIdentifier',
          n : 'Main Timeline',
          a : [{
            f : 'c',
            y : 1,
            z : 1.23,
            i : 'e',
            e : 0.61288568,
            s : 0,
            o : '218'
          }, {
            f : 'c',
            y : 1,
            z : 1.23,
            i : 'dN',
            e : 1,
            s : 0,
            o : '217'
          }, {
            f : 'c',
            y : 2.23,
            z : 1.3,
            i : 'e',
            e : 0.6,
            s : 0.61288568,
            o : '218'
          }, {
            y : 2.23,
            i : 'dN',
            s : 1,
            z : 0,
            o : '217',
            f : 'c'
          }, {
            f : 'c',
            y : 4.23,
            z : 1.15,
            i : 'e',
            e : 0.1664739,
            s : 1.1664739,
            o : '217'
          }, {
            f : 'c',
            y : 4.23,
            z : 1.15,
            i : 'e',
            e : 0.1664739,
            s : 0.6,
            o : '218'
          }, {
            y : 6.08,
            i : 'e',
            s : 0.1664739,
            z : 0,
            o : '218',
            f : 'c'
          }, {
            y : 6.08,
            i : 'e',
            s : 0.1664739,
            z : 0,
            o : '217',
            f : 'c'
          }],
          f : 30,
          b : []
        }
      },
      bZ : 180,
      O  : ['217', '218'],
      n  : 'Unbenanntes Layout',
      _  : 0,
      v  : {
        217: {
          x  : 'visible',
          a  : -53 * kw,
          b  : -31 * kh,
          j  : 'absolute',
          z  : 14,
          dC : {
            path: [
              [7 * kw, 895 * kh, 7 * kw, 895 * kh, 390 * kw, 799 * kh, 390 * kw, 799 * kh],
              [390 * kw, 799 * kh, 390 * kw, 799 * kh, 741 * kw, 565 * kh, 741 * kw, 565 * kh],
              [741 * kw, 565 * kh, 741 * kw, 565 * kh, 1133 * kw, 468 * kh, 1133 * kw, 468 * kh],
              [1133 * kw, 468 * kh, 1133 * kw, 468 * kh, 1348 * kw, 235 * kh, 1348 * kw, 235 * kh],
              [1348 * kw, 235 * kh, 1348 * kw, 235 * kh, 1470 * kw, 7 * kh, 1470 * kw, 7 * kh],
            ],
            closed: false
          },
          dL : 'evenodd',
          d  : 902 * kh,
          k  : 'div',
          c  : 1477 * kw,
          dD : 4,
          e  : 1.1664739,
          dN : 0,
          dE : 'rgba(202, 249, 252, 0.500)'
        },
        218: {
          Y  : 0,
          x  : 'visible',
          a  : -17 * kw,
          b  : 22 * kh,
          j  : 'absolute',
          r  : 'inline',
          z  : 13,
          dC : {
            path: [
              [3 * kw, 879.0281 * kh, 3 * kw, 879.0281 * kh, 386 * kw, 782 * kh, 386 * kw, 782 * kh],
              [386 * kw, 782 * kh, 386 * kw, 782 * kh, 737 * kw, 548 * kh, 737 * kw, 548 * kh],
              [737 * kw, 548 * kh, 737 * kw, 548 * kh, 1129 * kw, 451 * kh, 1129 * kw, 451 * kh],
              [1129 * kw, 451 * kh, 1129 * kw, 451 * kh, 1344 * kw, 223 * kh, 1344 * kw, 223 * kh],
              [1344 * kw, 223 * kh, 1344 * kw, 223 * kh, 1457 * kw, 3 * kh, 1457 * kw, 3 * kh],
              [1457 * kw, 3 * kh, 1457 * kw, 3 * kh, 1458 * kw, 645.0846 * kh, 1458 * kw, 746.9711 * kh],
              [1458 * kw, 746.9711 * kh, 1458 * kh, 816.0467, 1458 * kw, 879 * kh, 1458 * kw, 879 * kh],
              [1458 * kw, 879 * kh, 1458 * kw, 879 * kh, 3 * kw, 879.0281 * kh, 3 * kw, 879.0281 * kh],
            ],
            closed: true
          },
          k  : 'div',
          d  : 883 * kh,
          l  : 533 * kh,
          c  : 1461 * kw,
          e  : 0,
          m  : '#D6F5FF',
          dD : 0,
          dN : 1,
          dE : 'rgba(0, 255, 240, 0.976)',
          n  : 'rgba(255, 255, 255, 0.000)'
        }
      }
    }], {}, h, {}, null, false, true, -1, true, true, false, true, true)
    d[f] = c.API
    document.getElementById(g).setAttribute('HYP_dn', f)
    c.z_o(this.body)
  }())
}
