import React, { Component } from 'react';
import $ from 'jquery'
import io from 'socket.io-client'

const socket = io()

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      hashtags: [],
      change: false,
      status: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getTweets = this.getTweets.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }
  componentDidMount(){
    this.setState({change: true})
  }
  handleChange(e){
    this.setState({value: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
    var self = this;
    $.ajax({
      url: '/newwatch',
      method: 'POST',
      data: {name: this.state.value}
    }).done(function(data){
      self.props.stateChange()
    })
  }
  getTweets(){
    $.ajax({
      method: 'POST',
      url: '/gettweets',
      data: {data: this.props.hashtags}
    }).done(function(data){
    })
  }
  handleStateChange(data){
    var arr = []
    data.forEach(function(element){
      var tweets = []
      element.tweets.statuses.forEach(function(tweet){
        console.log(tweet.text)
        tweets.push(tweet);
      })
      var obj = {
        name: element.name,
        tweets: tweets
      }
      arr.push(obj)
    })
    this.setState({hashtags: arr})
  }
  render() {
    var self = this;
    var tweets_render = this.props.hashtag_data.map(function(obj){
      var self1 = self;
      var tweets = obj.tweets.map(function(tweet){
        return(
          <li>{tweet.text}</li>);
      })
      return (
        <div className="tweets">
          <h3>#{obj.name}</h3><br/>
          <div className="tweet-text-container">
            {tweets}
          </div>
          <button onClick={self1.props.deleteList} id={obj.name}>Delete {obj.name}</button>
        </div>)
    })
    return (
      <div className='tweet-component'>
        <div className="tweets-container">
          {tweets_render}
        </div>
        <form className='watch-form'>
          <label for="hashtag">Hashtag:</label>
            <input type="text" onChange={this.handleChange} />
          <button type="submit" onClick={this.handleSubmit} value="Submit">Submit</button>
        </form>
      </div>

    )
  }
}

