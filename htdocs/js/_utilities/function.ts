export const sleep = (ms: number) => {
  return new Promise((resolve) => { return setTimeout(resolve, ms) })
}

export const throttle = (func: () => void, interval: number) => {
  let lastTime = Date.now() - interval
  return () => {
    if ((lastTime + interval) < Date.now()) {
      lastTime = Date.now()
      func()
    }
  }
}

export const debounce = (func: () => void, interval: number) => {
  let timer:number
  return () => {
    clearTimeout(timer)
    timer = window.setTimeout(func, interval)
  }
}

export const getOffset = (elem: Element|null) => {
  const pos = {
    x: 0,
    y: 0
  }

  while (elem) {
    pos.y += (elem as HTMLElement).offsetTop || 0
    pos.x += (elem as HTMLElement).offsetLeft || 0
    elem = (elem as HTMLElement).offsetParent
  }
  return pos
}

export const getWindowRect = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const top = window.pageYOffset

  return {
    width,
    height,

    top,
    middle: (top + (height / 2)),
    bottom: (top + height)
  }
}

export const getElemRect = (elem: Element) => {
  const rect = elem.getBoundingClientRect()

  const width = rect.width
  const height = rect.height

  const top = getOffset(elem).y
    || rect.y + getWindowRect().top
    || 0

  return {
    width,
    height,

    top,
    middle: (top + (height / 2)),
    bottom: (top + height)
  }
}

export const parseJSON = (str: string): any => {
  let result = null
  if (!str) { return result }

  try {
    result = JSON.parse(str)
  } catch (e) {
    if (console.warn) {
      console.warn(e)
    } else {
      console.log(e)
    }
  }
  return result
}

export const isTouch = (): boolean => {
  // @ts-ignore:
  if (navigator.msPointerEnabled) {
    return true
  } else {
    if ('ontouchstart' in window) {
      return true
    }
    if ('onmousedown' in window) {
      return false
    }
    return false
  }
}

export const zeroPadding = (num: number, digit: number = 2) => {
  return (Array(digit).join('0') + num).slice(-digit)
}

export const formatDate = (time: string, format: string = 'YYYY/MM/DD') => {
  if (!time) { return time }
  const baseDate = time
    .replace(/-/g, '/')
    .replace(/T(.*)/i, '')
  const date:Date = new Date(baseDate)
  const result = format
    .replace(/YYYY/g, String(date.getFullYear()))
    .replace(/MM/g, zeroPadding(date.getMonth() + 1))
    .replace(/DD/g, zeroPadding(date.getDate()))
  return result
}

export type FetchPayload = {
  url: string
  retryCount?: number
  delay?: number
  minDelay?: number
}
export const initFetchPayload: FetchPayload = {
  url: '',
  retryCount: 5,
  delay: 1000,
  minDelay: 200,
}
export const richFetcher = async (payload = initFetchPayload, options: object = {}) => {
  payload = Object.assign({}, initFetchPayload, payload)
  const { url, retryCount, delay, minDelay } = payload
  const startTime = new Date().getTime()

  const result = await richFetch({
    url,
    retryCount,
    delay
  }, options)

  const endTime = new Date().getTime()
  const procTime = (endTime - startTime)
  const sleepTime = (procTime > minDelay)
    ? 0
    : minDelay - procTime
  await sleep(sleepTime)
  return result
}
// options = {
//   method: 'POST',
//   body: JSON.stringify(${Object}),
// }
export const richFetch = async (payload = initFetchPayload, options: object = {}) => {
  payload = Object.assign({}, initFetchPayload, payload)
  const { url, retryCount, delay } = payload
  const recursive = async (): Promise<Response|false> => {
    if (retryCount <= 1) {
      return false
    }
    await sleep(delay)
    return richFetch({
      url,
      retryCount: retryCount - 1,
      delay,
    }, options)
  }

  try {
    return await fetch(url, options)
      .then(async (response: Response) => {
        if (!response.ok) {
          return await recursive()
        }
        return response
      })
      .catch(async (_e: string) => {
        return await recursive()
      })
  } catch (_e) {
    return await recursive()
  }
}

export const getURLQuery = (param: string, url = location.href) => {
  if (!param || !url) { return '' }
  param = param.replace(/[\[\]]/g, '\\$&')

  const regex = new RegExp('[?&]' + param + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)

  if (!results) { return null }
  if (!results[2]) { return '' }

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
