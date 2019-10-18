import React from "react";
import "./App.css";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/singup";
import Home from "./components/home";
import Profile from "./components/profile";
import EventDetail from "./components/eventDetail";

class App extends React.Component {
  register = () => {
    fetch("http://localhost:3000/signup", {
      username: "moose1",
      password: "123",
      primary_location: "london"
    })
      .then(res => res.json())
      .then(res => {
        console.log("succesful");
      });
  };

  login = () => {
    fetch("http://localhost:3000/signin", {
      method: "POST",
      body: JSON.stringify({
        username: "moose1",
        password: "123"
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        const jwt = res.data.csrf;
        localStorage.setItem("access_token", jwt);
      });
  };
  logout = () => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:3000/events")
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  };
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/eventDetail/:id" component={EventDetail} />
        </div>
      </Router>
    );
  }
}

export default App;
