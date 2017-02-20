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
      change: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getTweets = this.getTweets.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);

  }
  componentWillMount(){
    console.log(this.props)

  }
  componentDidMount(){
    console.log('did mount')
    this.setState({change: true})
  }
  handleChange(e){
    this.setState({value: e.target.value});
  }
  handleSubmit(e){
    e.preventDefault();
  }
  getTweets(){
    console.log('getting tweets') 
    $.ajax({
      method: 'POST',
      url: '/gettweets',
      data: {data: this.props.hashtags}
    }).done(function(data){
      console.log(data);
    })
  }
  handleStateChange(data){
    var arr = []
    data.forEach(function(element){

      // arr.push(element.name)
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
    // console.log(this.state)
  }
  render() {
    var test = this.props.hashtags.map(function(hashtag){
      // console.log(hashtag);
      return (
          <div className='tweets'>
            {hashtag}
          </div>)
    })

    console.log(this.props)
    var blah = this.props.hashtag_data.map(function(obj){
      var blah1 = obj.tweets.map(function(tweet){
        console.log(tweet.text);
        return(<div>{tweet.text}</div>);
      })
      return blah1
    })
    return (
      <div className='tweet-component'>
        <div className='tweets-container'>
          {test}
          {blah}
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Hashtag:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.test}
      </div>

    )
  }
}

