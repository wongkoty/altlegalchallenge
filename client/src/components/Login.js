import React, { Component } from 'react';
import twitter from '../assets/images/twitter_bird.png'
import $ from 'jquery'


export default class Login extends Component {
  constructor(props) {
    super(props);
  }
  twitterSignIn() {
    console.log('twitter sign in')
    $.ajax({
      url: '/auth/twitter1',
      method: 'GET'
    })
  }
  test(){
    $.ajax({
      url: '/test',
      method: 'GET'
    })
    .done(function(data){
      console.log(data);
    })
  }
  render() {
    return (
      <div className='login-container'>
        <a href="#" onClick={this.twitterSignIn}><img src={twitter} /></a><br/>
         Login with Twitter
         <a href='#' onClick={this.test}>test</a>
      </div>
    )
  }
}

