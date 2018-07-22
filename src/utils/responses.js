import status from 'http-status'

export function resSchema (data, statusCode) {
  return {
    results: data,
    status: status[statusCode],
  }
}

export function errSchema (data, statusCode) {
  let res = {
    error: data,
    status: status[statusCode],
  }

  if (typeof data === 'string') res.error = { message: data }

  return res
}
