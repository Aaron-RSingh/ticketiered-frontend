import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
  state = {
    username: "",
    password: ""
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

  login = e => {
    e.preventDefault();
    const { username, password } = this.state;
    console.log(username, password);
    fetch("http://localhost:3000/authenticate", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        const jwt = res.auth_token;
        localStorage.setItem("access_token", jwt);
        this.props.history.push("/");
      });
  };

  render() {
    const { username, password } = this.state;
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <br />
            <br />
            <br />
            <h1>Ticketiered</h1>
            <p>blurb about what the app is</p>
            <Link to="/signup" className="btn btn-outline-success">
              Sign up
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
                  id="exampleInputEmail1"
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
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={this.handlechange}
                />
              </div>
              <button className="btn btn-outline-success" onClick={this.login}>
                Sign In
              </button>
            </form>
          </div>
          <div className="col-sm"></div>
        </div>
      </div>
    );
  }
}
