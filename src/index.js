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

function ShowThumbnail (props) {
  const ratingFullStars = [...Array(props.rating)].map((e, i) =>
    <i className='fa fa-star' aria-hidden='true' />
  )
  const ratingEmptyStars = [...Array(5 - props.rating)].map((e, i) =>
    <i className='fa fa-star-o' aria-hidden='true' />
  )
  const displayRatingStars = ratingFullStars.concat(ratingEmptyStars)

  return (
    <div className='show-thumbnail'>
      <div className='show-thumbnail__image' style={{background: 'url(' + props.img + ')'}} />
      <div className='show-thumbnail__rating'>
        {displayRatingStars}
      </div>
      <div className='show-thumbnail__description'>
        <Link to={`/show/${props.id}`}>{props.title}</Link>
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
  const displayedCast = props.show.staring.map((e) =>
    <li key={e.person.name.toString() + Math.random()}>{e.person.name} — {e.character.name}</li>
  )

  return (
    <div className='show'>
      <img className='show__image' src={props.show.id} />
      <div className='show__rating'>{props.show.rating}</div>
      <div className='show__title'>{props.show.title}</div>
      <div className='show__description'>{props.show.description}</div>
      <div className='show__info'>
        <li>Schedule: {props.show.info.schedule}</li>
        <li>Status: {props.show.info.status}</li>
        <li>Genres: {props.show.info.genres.join(', ')}</li>
      </div>
      <div className='show__staring'>
        {displayedCast}
      </div>
    </div>
  )
}

Show.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.number,
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
              <Link to='/'>TV Bland</Link>
            </h1>
            <Route exact path='/' render={() => (
              <HomePage shows={this.state.shows} />
            )} />
            <Route path='/show/:id' render={(props) => (
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
