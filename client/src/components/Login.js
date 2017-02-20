import React, { Component } from 'react';
import twitter from '../assets/images/twitter_bird.png'
import $ from 'jquery'


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: null
    }
    this.twitterSignIn = this.twitterSignIn.bind(this);
  }
  twitterSignIn() {
    var self = this;
    $.ajax({
      url: '/auth/twitter',
      method: 'GET'
    })
    .done(function(data){
      self.setState({test: data})
      self.twitterToken(data);
    }).fail(function(err) {

    })
  }
  twitterToken(data) {
    $.ajax({
      url: '/auth/twitter_token',
      method: 'POST',
      data: {data: data},
      dataType: 'text'
    })
    .done(function(data){
    })
  }
  render() {
    return (
      <div className='login-container'>
        <a href="#" onClick={this.twitterSignIn}><img src={twitter} /></a><br/>
         Login with Twitter<br/>
          {this.state.test != null ? <a href={this.state.test}>Click here to continue to twitter</a> : ''}
      </div>
    )
  }
}

