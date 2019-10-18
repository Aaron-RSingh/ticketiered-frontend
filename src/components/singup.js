import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Signup extends Component {
  state = {
    username: "",
    password: "",
    primaryLocation: ""
  };

  componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (token) {
      this.props.history.push("/");
    }
  }

  handlechange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  signup = e => {
    e.preventDefault();
    const { username, password, primaryLocation } = this.state;
    console.log(username, password, primaryLocation);
    fetch("http://localhost:3000/users", {
      method: "POST",
      body: JSON.stringify({
        
        username: username,
        password: password,
        primary_location: primaryLocation
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        this.props.history.push("/login");
      });
  };
  render() {
    const { username, password, primaryLocation } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <br />
            <br />
            <br />
            <h2>Already Have An Account?</h2>
            <Link to="/login" className="btn btn-outline-success">
              Sign in
            </Link>
          </div>
          <div className="col-sm">
            <br />
            <br />
            <br />
            <form>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={this.handlechange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={this.handlechange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="primaryLocation"
                  name="primaryLocation"
                  value={primaryLocation}
                  onChange={this.handlechange}
                />
              </div>
              <button className="btn btn-outline-success" onClick={this.signup}>
                Sign Up
              </button>
            </form>
          </div>
          <div className="col-sm"></div>
        </div>
      </div>
    );
  }
}
