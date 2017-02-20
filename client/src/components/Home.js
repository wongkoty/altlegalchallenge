import React, { Component } from 'react';
import logo from '../assets/images/logo_2x.png';
import cookie from 'react-cookie'
import Tweets from './Tweets';
import $ from 'jquery'

import io from 'socket.io-client'
const socket = io()

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_user: null,
      hashtags: [],
      hashtag_data: []
    };
    this.loggedInUser = this.loggedInUser.bind(this);
    this.test = this.test.bind(this);
      this.getTweets = this.getTweets.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);


        var self = this;
    socket.on('hello', function(data){
      // console.log('meow')
      console.log(data.data)
      self.handleStateChange(data.data)
    })

  }
  componentWillMount(){
    console.log('component will mount')
    console.log(cookie);
    this.loggedInUser();
  }
  getTweets(){
    console.log('getting tweets')
    console.log(this.state.hashtags) 
    $.ajax({
      method: 'POST',
      url: '/gettweets',
      data: {data: this.state.hashtags}
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
    this.setState({hashtag_data: arr})
    // console.log(this.state)
  }
  loggedInUser(){
    console.log('loggedinuser');
    var self = this;
    $.ajax({
      method: 'GET',
      url: '/loggedinuser'
    }).done(function(data){
      console.log(data)
      self.setState({
        current_user: data.user,
        hashtags: data.hashtags})
        self.getTweets();
    }).fail(function(err){
      console.log(err)
    })
  }
  login(e) {
    e.preventDefault();
    this.setState({page: 'login'})
    console.log('this has been reached')
  }
  test(data){
    console.log('weeee callback')
    console.log(data);
    this.setState({hashtag_data: data})
  }
  render() {
    const isLoggedIn = this.state.current_user
      return (
        <div className="App">
          <nav>
            <div className="nav">
              <div className ="nav-links">
                <a href="#" onClick={this.props.stateChange} className='default'><img src={logo} className='default'/></a>
                <a href="#">features</a>
                <a href="#">testimonials</a>
                <a href="#">about</a>
                <a href="#">contact</a>
                {isLoggedIn ? <a href='/logout' onClick={this.props.stateChange} className='logout'>Logout</a> 
                  : <a href='#' onClick={this.props.stateChange} className='login'>Sign in</a>}
                {isLoggedIn ? <a href="#">{this.state.current_user}</a> : ''}
              </div>
            </div>
          </nav>
          {isLoggedIn ? <Tweets callback={this.test} hashtag_data={this.state.hashtag_data} hashtags={this.state.hashtags}/> : ''}
          {this.props.goodBye}
        </div>
      );
    }
}

