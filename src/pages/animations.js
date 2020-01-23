import anime from 'animejs/lib/anime.es'

function stepsAnimation() {
  anime({
    targets  : ['.step1 .green-circle', '.step1 .title'],
    opacity  : [0, 1],
    duration : 1500,
    delay    : 5500,
    easing   : 'easeInOutQuad',
    complete() {
      document.querySelector('.step1 .green-wave-circle').style.borderColor = '#00d1c155'
      anime({
        targets  : '.step1 .green-wave-circle',
        opacity  : [0.4, 0],
        duration : 1000,
        loop     : 4,
        scale    : [1, 1.8],
        delay    : 0,
        easing   : 'easeInOutQuad',
      })
      anime({
        targets  : '.step1 .green-bg-circle',
        opacity  : [0, 0.4],
        duration : 1000,
        loop     : 4,
        delay    : 0,
        easing   : 'easeInOutQuad',
      })
    }
  })
  anime({
    targets  : '.step1 .desc',
    opacity  : [0, 1],
    duration : 300,
    delay    : 6700,
    easing   : 'easeInOutQuad',
  })
  anime({
    targets  : '.progressbar .progressbar-bg',
    width    : [0, '100%'],
    duration : 1500,
    delay    : 7000,
    easing   : 'easeInOutQuad',
  })
  anime({
    targets  : '.progressbar .progressbar-fg1',
    width    : [0, '50%'],
    duration : 5500,
    delay    : 7000,
    easing   : 'easeInOutQuad',
  })
  anime({
    targets  : ['.step2 .green-circle', '.step2 .title'],
    opacity  : [0, 1],
    duration : 1500,
    delay    : 10000,
    easing   : 'easeInOutQuad',
    complete() {
      document.querySelector('.step2 .green-wave-circle').style.borderColor = '#00d1c155'
      anime({
        targets  : '.step2 .green-wave-circle',
        opacity  : [0.4, 0],
        duration : 1000,
        loop     : 4,
        scale    : [1, 1.8],
        delay    : 0,
        easing   : 'easeInOutQuad',
      })
      anime({
        targets  : '.step2 .green-bg-circle',
        opacity  : [0, 0.4],
        duration : 1000,
        loop     : 4,
        delay    : 0,
        easing   : 'easeInOutQuad',
      })
    }
  })
  anime({
    targets  : '.step2 .desc',
    opacity  : [0, 1],
    duration : 300,
    delay    : 11000,
    easing   : 'easeInOutQuad',
  })
  anime({
    targets  : '.progressbar .progressbar-fg2',
    width    : [0, '50%'],
    duration : 5500,
    delay    : 11000,
    easing   : 'easeInOutQuad',
  })
  anime({
    targets  : ['.step3 .green-circle', '.step3 .title'],
    opacity  : [0, 1],
    duration : 1500,
    delay    : 15000,
    easing   : 'easeInOutQuad',
    complete() {
      const waveCircle = document.querySelector('.step3 .green-wave-circle')
      const waveCirclestyle = waveCircle ? waveCircle.style : { borderColor: '' }
      waveCirclestyle.borderColor = '#00d1c155'
      anime({
        targets  : '.step3 .green-wave-circle',
        opacity  : [0.4, 0],
        duration : 1000,
        loop     : true,
        scale    : [1, 1.8],
        delay    : 0,
        easing   : 'easeInOutQuad',
      })
      anime({
        targets  : '.step3 .green-bg-circle',
        opacity  : [0, 0.4],
        duration : 1000,
        loop     : true,
        delay    : 0,
        easing   : 'easeInOutQuad',
      })
      anime({
        targets  : '.steps-container .status',
        opacity  : [0, 1],
        duration : 1000,
        delay    : 1000,
        easing   : 'easeInOutQuad',
      })
    }
  })
  anime({
    targets  : '.step3 .desc',
    opacity  : [0, 1],
    duration : 300,
    delay    : 16000,
    easing   : 'easeInOutQuad',
  })
}

export function showSuccessAnime() {
  anime({
    targets  : ['.curtain .top-half', '.curtain .bottom-half'],
    height   : [0, '50%'],
    duration : 2000,
    delay    : 5000,
    easing   : 'easeInOutQuad',
    complete() {
      anime({
        targets    : ['.curtain .top-half', '.curtain .bottom-half'],
        background : '#fff',
        duration   : 2000,
        easing     : 'easeInOutQuad',
      })
      anime({
        targets  : '.success',
        opacity  : [0, 1],
        duration : 2000,
        delay    : 2000,
        easing   : 'easeInOutQuad',
      })
    }
  })
}

export function runSignUpSuccessAnim() {
  anime({
    targets    : '.ui.grid.signup-page',
    translateX : '-100%',
    duration   : 2000,
    easing     : 'easeInOutQuad',
    complete() {
      anime({
        targets     : '.step .grey-circle',
        borderWidth : [20, 0],
        opacity     : [0, 0.9],
        translateX  : ['-25vw', 0],
        delay(el, i) { return i * 1000 },
        duration    : 1000,
        easing      : 'easeInOutQuad',
      })
    }
  })
  stepsAnimation()
}

export function runInvestAnime() {
  document.querySelector('.invest-steps-desc-page').style.zIndex = 1
  anime({
    targets    : '.invest-buy-sell-card',
    translateX : '-200%',
    opacity    : [1, 0],
    duration   : 2000,
    easing     : 'easeInOutQuad',
    complete() {
      anime({
        targets     : '.step .grey-circle',
        borderWidth : [20, 0],
        opacity     : [0, 0.9],
        translateX  : ['-25%', 0],
        delay(el, i) { return i * 1000 + 1000 },
        duration    : 1000,
        easing      : 'easeInOutQuad',
      })
    }
  })
  anime({
    targets  : '.invest-steps-desc-page',
    opacity  : [0, 1],
    delay    : 1000,
    duration : 2000,
    easing   : 'easeInOutQuad',
  })
  stepsAnimation()
}

export function removeInvestAnime() {
  document.querySelector('.invest-steps-desc-page').style.zIndex = -1
  document.querySelector('.invest-buy-sell-card').style.transform = 'none'
  document.querySelector('.invest-steps-desc-page').style.transform = 'none'
  document.querySelectorAll('.step .grey-circle').forEach((item) => { item.style.opacity = 0; item.style.transform = 'none' })
}
