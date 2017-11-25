import './scss/main.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import * as TVMazeApi from './api/tvmazeApi'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

function getbaseUrl () {
  if (process.env.NODE_ENV === 'production') {
    return '/tvbland/'
  }

  return '/'
}

function ShowThumbnail (props) {
  const ratingFullStars = [...Array(props.rating)].map((e, i) =>
    <i className='fa fa-star' aria-hidden='true' />
  )
  // TODO remove the number of max star dependency (i.e. 5 should be replaced with a param)
  const ratingEmptyStars = [...Array(5 - props.rating)].map((e, i) =>
    <i className='fa fa-star-o' aria-hidden='true' />
  )
  const displayRatingStars = ratingFullStars.concat(ratingEmptyStars)

  return (
    <div className='show-thumbnail'>
      <div className='show-thumbnail__image' style={{backgroundImage: 'url(' + props.img + ')'}} />
      <div className='show-thumbnail__rating'>
        {displayRatingStars}
      </div>
      <div className='show-thumbnail__description'>
        <Link to={`${getbaseUrl()}show/${props.id}`}>{props.title}</Link>
      </div>
    </div>
  )
}

ShowThumbnail.propTypes = {
  img: PropTypes.string,
  id: PropTypes.number,
  title: PropTypes.string,
  rating: PropTypes.number
}

function Footer (props) {
  return (
    <footer className='app__footer' />
  )
}

function Show (props) {
  // FIXME duplicated code (i.e. already used function within the ShowThumbnail component)
  const ratingFullStars = [...Array(props.show.rating)].map((e, i) =>
    <i className='fa fa-star' aria-hidden='true' />
  )
  // TODO remove the number of max star dependency (i.e. 5 should be replaced with a param)
  const ratingEmptyStars = [...Array(5 - props.show.rating)].map((e, i) =>
    <i className='fa fa-star-o' aria-hidden='true' />
  )
  const displayRatingStars = ratingFullStars.concat(ratingEmptyStars)

  const displayedCast = props.show.staring.map((e) =>
    <div className='block' key={e.person.name.toString() + Math.random()}>
      <span className='block__title'>{e.person.name}</span>
      <span className='block__info'>{e.character.name}</span>
    </div>
  )

  return (
    <div className='show'>
      <div className='show__description'>
        <div className='show__image' style={{backgroundImage: 'url(' + props.show.image + ')'}} />
        <div className='show__rating'>{displayRatingStars}</div>
        <div className='show__title'>{props.show.title}</div>
        {props.show.description}
      </div>
      <div className='show__info'>
        <h2>Show Info</h2>
        <div className='block'>
          <span className='block__title'>Schedule</span>
          <span className='block__info'>{props.show.info.schedule}</span>
        </div>
        <div className='block'>
          <span className='block__title'>Status</span>
          <span className='block__info'>{props.show.info.status}</span>
        </div>
        <div className='block'>
          <span className='block__title'>Genres</span>
          <span className='block__info'>{props.show.info.genres.join(', ')}</span>
        </div>
      </div>
      <div className='show__staring'>
        <h2>Starring</h2>
        {displayedCast}
      </div>
    </div>
  )
}

Show.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.number,
    image: PropTypes.string,
    rating: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    staring: PropTypes.array,
    info: PropTypes.shape({
      schedule: PropTypes.string,
      status: PropTypes.string,
      genres: PropTypes.array
    })
  })
}

function HomePage (props) {
  const displayedShows = props.shows.map((e) =>
    <ShowThumbnail key={e.id + Math.random()} title={e.title} img={e.image} id={e.id} rating={e.rating} />
  )

  return (
    <div>
      <p className='app-description'>
        TV Shows and web series database.<br />
        Create personalized schedules. Episode guide, cast, crew and character information.
      </p>
      <div className='app-content'>
        <h2 className='app-content__title'>
          Last Added Shows
        </h2>
        {displayedShows}
      </div>
    </div>
  )
}

HomePage.propTypes = {
  shows: PropTypes.array
}

class Application extends React.Component {
  constructor (props) {
    super(props)

    this.state = {shows: []}
  }

  componentDidMount () {
    TVMazeApi.getFullSchedule(this, this.setState)
  }

  render () {
    const setShowCast = (id, cast) => {
      for (let i = 0; i < this.state.shows.length; i++) {
        if (this.state.shows[i].id === id) {
          this.state.shows[i].staring = cast
          this.setState(this.state)
        }
      }
    }

    const getShow = (id) => {
      id = parseInt(id)
      for (let i = 0; i < this.state.shows.length; i++) {
        if (this.state.shows[i].id === id) {
          if (this.state.shows[i].staring.length === 0) {
            TVMazeApi.getShowCast(this, setShowCast, id)
          }
          return this.state.shows[i]
        }
      }
    }

    return (
      <Router>
        <div>
          <div className='app-background-helper' />
          <div className='app-container'>
            <h1 className='app-title'>
              <Link to={getbaseUrl()}>TV Bland</Link>
            </h1>
            <Route exact path={getbaseUrl()} render={() => (
              <HomePage shows={this.state.shows} />
            )} />
            <Route path={`${getbaseUrl()}show/:id`} render={(props) => (
              <Show show={getShow(props.match.params.id)} />
            )} />
          </div>
          <Footer />
        </div>
      </Router>
    )
  }
}

ReactDOM
  .render(
    <Application />,
    document
      .getElementById(
        'application'
      )
  )
