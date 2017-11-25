export function getbaseUrl () {
  if (process.env.NODE_ENV === 'production') {
    return '/tvbland/'
  }

  return '/'
}

export function fromBaseToBase (number, currentBase, desiredBase) {
  return Math.round(number * desiredBase / currentBase)
}

export function stripHtml (html) {
  let tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

export function dateToDay (dateString) {
  let d = new Date(Date.parse(dateString))
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[d.getDay()]
}
