  timestamp: false,
  reqCount: 0
}) => {
  payload = Object.assign({}, initFetchPayload, payload)
  const { url, retryCount, delay } = payload
  const reqUrl = options.reqCount === 0 && options?.timestamp
    ? `${url + '?' + (new Date().getTime()) }`
    : url
  const recursive = async (): Promise<Response|false> => {
    if (retryCount <= 1) {
      return false
    }
    await sleep(delay)
    options.reqCount++;
    return richFetch({
      url: reqUrl,
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
