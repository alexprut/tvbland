import axios from 'axios'

export function getFullSchedule (context, callback) {
  // TODO provide properer error handling
  axios.get('http://api.tvmaze.com/schedule')
    .then(res => {
      const shows = res.data
      let newState = []
      console.log(shows)

      shows.forEach((e) => {
        if (e && e.show && e.show.image && e.show.network) {
          newState.push({
            id: e.show.id,
            title: e.name,
            rating: (e.show.rating.average) ? fromBaseToBase(e.show.rating.average, 10, 5) : 0,
            image: e.show.image.medium,
            info: {
              streamedOn: e.show.network.name,
              schedule: e.airdate,
              status: e.show.status,
              genres: e.show.genres
            },
            staring: []
          })
        }
      })

      console.log(newState)
      callback.call(context, {shows: newState})
    })
    .catch(function (err) { console.log(err) })
}

export function getShowCast (context, callback, showId) {
  axios.get(`http://api.tvmaze.com/shows/${showId}/cast`)
    .then(res => {
      console.log(res.data)
      callback.call(context, showId, res.data)
    })
    .catch(function (error) { console.log(error) })
}

function fromBaseToBase (number, currentBase, desiredBase) {
  return Math.round(number * desiredBase / currentBase)
}

// TODO convert machine readable dates in human readable dates
