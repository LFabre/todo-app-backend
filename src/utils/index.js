
/**
 * Returns date as string (YYYY-MM-DD)
 *
 * @author Lucas Fabre
 * @date 2021-05-15
 * @param {object} dateObj
 * @return {string} 
 */
function dateAsString(dateObj) {
  if (dateObj instanceof Date)
    return dateObj.toJSON().slice(0, 10)
  return null
}

module.exports = {
  sleep: (t = 1000) => new Promise(r => setTimeout(r, t)),
  today: () => dateAsString(new Date()),
}