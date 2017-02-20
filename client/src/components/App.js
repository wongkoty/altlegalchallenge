import React, { Component } from 'react';
import Home from './Home';
import Login from './Login';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'default'
    };
    this.stateChange = this.stateChange.bind(this);
  }
  stateChange(e) {
    e.preventDefault()
    this.setState({page: e.target.className})
  }
  render() {
    if(this.state.page == 'login') {
      return (
        <div className="App">
          <Home stateChange={this.stateChange} />
          <Login />
        </div>
      );
    } else if (this.state.page == 'logout') {
      return (
        <div className="App">
          <Home stateChange={this.stateChange} goodBye={'thanks for coming'} />
        </div>
        )
    }
    return (
      <div className="App">
        <Home stateChange={this.stateChange} />
      </div>
    );
  }
}

