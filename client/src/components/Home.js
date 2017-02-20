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
      hashtag_data: [],
      status: false,
    };
    this.loggedInUser = this.loggedInUser.bind(this);
    this.test = this.test.bind(this);
    this.getTweets = this.getTweets.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.deleteList = this.deleteList.bind(this);
    this.stateChange = this.stateChange.bind(this);


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
  componentDidMount(){
    var self = this;
    setInterval(function(){
      self.getTweets()
    }, 5000);
  }
  getTweets(){
    console.log('getting tweets')
    console.log(this.state.hashtags) 
    $.ajax({
        method: 'POST',
        url: '/gettweets',
        dataType: 'json',
        data: {data: this.state.hashtags}
      }).done(function(data){
        console.log(data);
      })

    // var self = this
    // setInterval(function(){
    //   var self1 = self;
    //   $.ajax({
    //     method: 'POST',
    //     url: '/gettweets',
    //     dataType: 'json',
    //     data: {data: self1.state.hashtags}
    //   }).done(function(data){
    //     console.log(data);
    //   })
    // }, 10000)
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
    console.log(this.state)
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
  deleteList(e) {
    console.log('deleteList')
    console.log(e.target.getAttribute('id'))
    var self = this;
    $.ajax({
      method: 'DELETE',
      url: '/hashtag',
      data: {data: e.target.getAttribute('id')}
    }).done(function(data){
      console.log('done deleting')
      console.log(data)
      self.loggedInUser();
      if(self.state.status){
        self.setState({status: false})
      } else {
        self.setState({status: true})
      }
    })
  }
  test(data){
    console.log('weeee callback')
    console.log(data);
    this.setState({hashtag_data: data})
  }
  stateChange(){
    console.log('changing state for tweets component')
    if(this.state.status){
      this.setState({status: false})
    } else {
      this.setState({status: true})
    }
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
                {isLoggedIn ? <a href='#' onClick={this.test} className='logout'>Logout</a> 
                  : <a href='#' onClick={this.props.stateChange} className='login'>Sign in</a>}
                {isLoggedIn ? <a href="#">{this.state.current_user}</a> : ''}
              </div>
            </div>
          </nav>
          {isLoggedIn ? <Tweets stateChange={this.loggedInUser} deleteList={this.deleteList} callback={this.test} hashtag_data={this.state.hashtag_data} hashtags={this.state.hashtags}/> : ''}
          {this.props.goodBye}
        </div>
      );
    }
}

