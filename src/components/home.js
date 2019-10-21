import React, { Component } from "react";
import Navbar from "./navbar";
import Event from "./event";
// import EventDetail from "./eventDetail";

export default class Home extends Component {
  state = {
    events: [],
    search: "",
    filteredEvents: []
  };
  componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      this.props.history.push("/login");
    } else {
      this.getEvents();
    }
  }

  // logout = e => {
  //   e.preventDefault();
  //   this.props.history.push("/login");
  // };

  logout = e => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    this.props.history.push("/login");
  };

  updateSearch(e) {
    this.setState({ search: e.target.value });
  }

  getEvents = () => {
    this.setState({ search: "" });
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:3000/get-all-events", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => this.setState({ events: [...data] }));
  };

  getFilteredEvents = () => {
    const filter = this.state.search;
    fetch("http://localhost:3000/filtered-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter })
    })
      .then(resp => resp.json())
      .then(resp => this.setState({ events: [...resp] }))
      .then(resp => console.log(this.state.events));
  };

  render() {
    let searchedTerm = this.state.search;
    // let filteredEvents = this.state.events.filter(event => {
    // return (
    // event.name
    //   .toLocaleLowerCase()
    //   .indexOf(this.state.search.toLocaleLowerCase()) !== -1
    // );
    // });
    const { events } = this.state;
    const all = events.map((event, key) => (
      <Event
        name={event.name}
        location={event.location}
        description={event.description}
        id={event.id}
        imageurl={event.image_url}
      />
    ));

    return (
      <div>
        <Navbar logout={this.logout} />
        <br />
        <br />
        <br />
        <div className="container">
          <h3> All Events</h3>
          <input
            type="text"
            value={this.state.search}
            onChange={e => this.updateSearch(e)}
          />
          <button onClick={() => this.getFilteredEvents(searchedTerm)}>
            Search
          </button>
          <button onClick={this.getEvents}>Reset Filter</button>
          {all}
        </div>
      </div>
    );
  }
}
