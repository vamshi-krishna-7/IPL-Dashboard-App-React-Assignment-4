// Write your code here

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

class TeamMatches extends Component {
  state = {isLoading: true, teamBanner: '', latestMatch: {}, recentMatches: []}

  componentDidMount() {
    this.getMatchDetails()
  }

  getMatchDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
    const data = await response.json()

    const teamBannerUrl = data.team_banner_url
    const latestMatchData = data.latest_match_details
    const formattedLatestMatchData = {
      id: latestMatchData.id,
      competingTeam: latestMatchData.competing_team,
      competingTeamLogo: latestMatchData.competing_team_logo,
      date: latestMatchData.date,
      firstInnings: latestMatchData.first_innings,
      manOfTheMatch: latestMatchData.man_of_the_match,
      matchStatus: latestMatchData.match_status,
      result: latestMatchData.result,
      secondInnings: latestMatchData.second_innings,
      umpires: latestMatchData.umpires,
      venue: latestMatchData.venue,
    }

    const recentMatchesData = data.recent_matches
    const formattedRecentMatchesData = recentMatchesData.map(each => ({
      id: each.id,
      competingTeam: each.competing_team,
      competingTeamLogo: each.competing_team_logo,
      date: each.date,
      firstInnings: each.first_innings,
      manOfTheMatch: each.man_of_the_match,
      matchStatus: each.match_status,
      result: each.result,
      secondInnings: each.second_innings,
      umpires: each.umpires,
      venue: each.venue,
    }))

    this.setState({
      teamBanner: teamBannerUrl,
      latestMatch: formattedLatestMatchData,
      recentMatches: formattedRecentMatchesData,
      isLoading: false,
    })
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height="50" />
    </div>
  )

  renderMatchDetails = () => {
    const {teamBanner, latestMatch, recentMatches} = this.state

    return (
      <div className="team-matches-container">
        <img src={teamBanner} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchDetails={latestMatch} key={latestMatch.id} />
        <ul className="recent-matches-list">
          {recentMatches.map(eachMatch => (
            <MatchCard matchCardDetails={eachMatch} key={eachMatch.id} />
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const backgroundClass = id.toLowerCase()
    const {isLoading} = this.state
    return (
      <div className={`bg-container ${backgroundClass}`}>
        {isLoading ? this.renderLoader() : this.renderMatchDetails()}
      </div>
    )
  }
}

export default TeamMatches
