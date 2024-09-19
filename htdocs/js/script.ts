import { sleep } from './_utilities/function'

import { Common } from './_class/common'
import { Accordion } from './_class/accordion'
import { Modal } from './_class/modal'
import { SmoothScroll } from './_class/smoothScroll'
import { Intersection } from './_class/intersection'
import { Video } from './_class/video'
// import { Slider } from './_class/slider'

(() => {
  const common = new Common()
  common.initialize()

  const accordion = new Accordion()
  accordion.initialize()

  const modal = new Modal()
  modal.initialize()

  const smoothScroll = new SmoothScroll()

  const intersection = new Intersection()
  const IntersectionDelay = 200

  const video = new Video()

  // const slider = new Slider()

  document.addEventListener('DOMContentLoaded', async ()=> {
    common.scroll()
    accordion.setClose()
    smoothScroll.initialize()
    intersection.initialize()
    video.initialize()
    // slider.initialize()

    common.setEventLight('resize', () => {
      common.process()
      intersection.update()
    })

    common.setEventLight('scroll', () => {
      common.scroll()
      intersection.update()
    })

    await sleep(IntersectionDelay)
    intersection.update()
  }, false)

  window.addEventListener('load', ()=> {
    common.process()
  }, false)
})()

