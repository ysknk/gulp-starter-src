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
