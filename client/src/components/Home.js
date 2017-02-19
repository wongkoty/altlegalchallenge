import React, { Component } from 'react';
import logo from '../assets/images/logo_2x.png';


export default class App extends Component {
  constructor(props) {
    super(props);
  }
  login(e) {
    e.preventDefault();
    this.setState({page: 'login'})
    console.log('this has been reached')
  }
  render() {
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
                <a href='/logout' onClick={this.props.stateChange} className='logout'>Logout</a>
                <a href='#' onClick={this.props.stateChange} className='login'>Sign in</a>
              </div>
            </div>
          </nav>
          {this.props.goodBye}
        </div>
      );
    }
}

