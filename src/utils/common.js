/* eslint-disable */
export const formatDate = function (val, v = '/') {
    const time = new Date(val)
    const y = time.getFullYear()
    const m = (time.getMonth() + 1).toString().padStart(2, '0')
    const d = time.getDate().toString().padStart(2, '0')
    const h = time.getHours().toString().padStart(2, '0')
    const mi = time.getMinutes().toString().padStart(2, '0')
    const timer = y + v + m + v + d + ' ' + h + ':' + mi
    return timer
}
