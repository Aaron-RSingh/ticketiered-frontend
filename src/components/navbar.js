import React, { Component } from 'react'
import {  Link } from 'react-router-dom';


export default class Navbar extends Component {

  
  render() {
    return (
    <nav className="navbar navbar-light bg-light">
        <Link className="navbar-brand" to="/">Home</Link>
        <form className="form-inline my-2 my-lg-0">
          <Link className="btn btn-outline-success my-2 my-sm-0" to="/profile" >Profile</Link>
          <button style={{margin: "1rem"}} className="btn btn-outline-success my-2 my-sm-0" onClick = {this.props.logout}>Logout</button>
        </form>
    </nav>
    )
  }
}
