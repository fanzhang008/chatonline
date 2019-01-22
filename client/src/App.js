import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');
// 这个根据用户ID
const username = (Math.random()).toFixed(2);

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      onlineUsers: {},
      onlineCount: 0,
      text: ''
    }
  }
  componentDidMount () {
    let {enqueueMsg} = this.props;
    socket.on('connect', function () {
      console.log('connect');
      socket.emit('login', {userid: username})
    })
    socket.on('login', function(data) {
      console.log('---login', data);
    })
    socket.on('event', function (data) {
      console.log(data);
      socket.on('disconnect', function () {
        console.log('disconnect')
      })
    })
    socket.on('message', function (data) {
      console.log('---enqueue', data)
      enqueueMsg(data);
    })
  }
  handleChange({target: {value}}) {
    this.setState({
      text: value
    })
  }

  handleSend() {
    let {text} = this.state;
    socket.emit('message', {
      username,
      content: text 
    });
    this.setState({
      text: ''
    })
  }

  render() {
    let {msgQueue} = this.props;
    let {text} = this.state;
    return (
      <div className="App">
        <h1>凡哥的聊天室</h1>
        <div className="talkBox">
        {
          msgQueue.map((item, index) => (
            <p key={index} className={item.username == username ? 'f-right' : 'f-left'}><span>【{item.username}】</span><span>{item.username == username ? '<-说' : '说->'}</span><span>{item.content}</span></p>
          ))
        }
        </div>
        <p><input type="text" onChange={this.handleChange.bind(this)} value={text}/> <button onClick={this.handleSend.bind(this)}>go</button></p>
      </div>
    );
  }
}

function mapStateToProps ({msgQueue}) {
  return {
    msgQueue
  }
}

function mapDispatchToProps (dispatch) {
  return {
    enqueueMsg: (content) => dispatch({type: 'enqueueMsg', content})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
