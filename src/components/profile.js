import React, { Component } from "react";
import Navbar from "./navbar";
import Event from "./event";
import Ticket from "./ticket";
import EventForm from "./eventForm";

export default class Profile extends Component {
  state = {
    events: [],
    name: "",
    description: "",
    image_url: "",
    date_time: "",
    location: "",
    update: false,
    user: {},
    ticketCounter: 0,
    tickets: {},
    ticketInfo: [],
    eventsToggle: true,
    selectedTab: "created"
  };
  componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      this.props.history.push("/login");
    } else {
      this.fetchMyEvents();
    }
  }

  fetchMyEvents = () => {
    const token = localStorage.getItem("access_token");

    fetch("http://localhost:3000/events", { headers: { Authorization: token } })
      .then(res => res.json())
      .then(res => {
        this.setState(
          {
            events: res
          },
          () => {
            this.getUserInfo();
          }
        );
      });
  };

  handlechange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getUserInfo = () => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:3000/user-info", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(res => {
        this.setState(
          {
            user: res
          },
          () => {
            this.getUsertickets();
          }
        );
      });
  };

  createNewEvent = e => {
    e.preventDefault();
    const { name, description, date_time, location, image_url } = this.state;
    console.log(name, description, date_time, location, image_url);
    const token = localStorage.getItem("access_token");
    console.log(token);
    const self = this;
    fetch("http://localhost:3000/events", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        description: description,
        location: location,
        date_time: date_time,
        image_url: image_url
      }),
      headers: { Authorization: token, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(function(response) {
        self.setState({
          name: "",
          description: "",
          image_url: "",
          date_time: "",
          location: ""
        });
        self.fetchMyEvents();
        // this.props.history.push("/profile")
      });
  };

  logout = e => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    this.props.history.push("/login");
  };

  deleteEvent = (e, id) => {
    console.log("12");
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: token, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {});
    window.location.reload();
  };

  updateState = (e, id) => {
    const { events } = this.state;
    console.log(events);
    const filterEvent = events.filter(event => event.id === id);
    const updateEvent = filterEvent[0];
    this.setState({
      name: updateEvent.name,
      location: updateEvent.location,
      description: updateEvent.description,
      image_url: updateEvent.image_url,
      date_time: updateEvent.date_time,
      update: true,
      updateEventId: id
    });
  };

  updateEvent = e => {
    e.preventDefault();
    const self = this;
    const {
      name,
      location,
      description,
      image_url,
      date_time,
      updateEventId
    } = this.state;
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/events/${updateEventId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: name,
        description: description,
        location: location,
        date_time: date_time,
        image_url: image_url
      }),
      headers: { Authorization: token, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(function(response) {
        self.setState({
          name: "",
          description: "",
          image_url: "",
          date_time: "",
          location: "",
          update: false
        });
        self.fetchMyEvents();
      });
  };

  cancelUpdate = () => {
    this.setState({
      name: "",
      description: "",
      image_url: "",
      date_time: "",
      location: "",
      update: false
    });
  };

  getUsertickets = () => {
    const id = this.state.user.id;
    fetch(`http://localhost:3000/users/${id}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          ticketInfo: resp.event.complete_user.tickets
        });
      });
  };

  displayedHeader = () => {
    const { selectedTab } = this.state;

    switch (selectedTab) {
      case "created":
        return (
          <div>
            <h2>Hosting Events</h2>
          </div>
        );
      case "attending":
        return (
          <div>
            <h2>Attending Events</h2>
          </div>
        );
      case "form":
        return (
          <div>
            <h2>Create an event</h2>
            <p>Give a few details about what the event is about and set a date for it</p>
          </div>
        );
    }
  };

  displayedEvents = () => {
    const {
      events,
      name,
      description,
      date_time,
      location,
      image_url,
      update,
      // user,
      ticketInfo,
      selectedTab
    } = this.state;

    let myEvents = [];
    myEvents = events.map((event, key) => (
      <>
        <Event
          name={event.name}
          location={event.location}
          description={event.description}
          datetime={event.date_time}
          id={event.id}
          isEdit={true}
          deleteEvent={this.deleteEvent}
          updateState={this.updateState}
          image_url={this.image_url}
        />
        <br />
      </>
    ));

    let attendingEvents = [];
    attendingEvents = ticketInfo.map(ticket => (
      <>
        <Ticket
          ticket_class={ticket.class}
          description={ticket.description}
          event_id={ticket.event_id}
          price={ticket.price}
        />
        <br />
      </>
    ));

    let eventForm = [];
    eventForm = ticketInfo.map(ticket => (
      <>
        <EventForm />
        <br />
      </>
    ));

    switch (selectedTab) {
      case "created":
        return <div>{myEvents}</div>;
      case "attending":
        return <div>{attendingEvents}</div>;
      case "form":
        return (
          <div>
            <form>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={this.handlechange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Location"
                  name="location"
                  value={location}
                  onChange={this.handlechange}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Time-date"
                  name="date_time"
                  value={date_time}
                  onChange={this.handlechange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Description"
                  name="description"
                  value={description}
                  onChange={this.handlechange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Image Url"
                  name="image_url"
                  value={image_url}
                  onChange={this.handlechange}
                />
              </div>
              {!update ? (
                <button
                  className="btn btn-outline-success"
                  onClick={this.createNewEvent}
                >
                  Create
                </button>
              ) : (
                <span>
                  <button
                    className="btn btn-outline-success"
                    style={{ margin: "1rem" }}
                    onClick={this.updateEvent}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-success"
                    onClick={this.cancelUpdate}
                  >
                    cancel
                  </button>
                </span>
              )}
            </form>
          </div>
        );
      default:
        return console.log("not worked");
    }
  };

  renderMyEvents = () => {
    this.setState({
      selectedTab: "created"
    });
    console.log(this.state.selectedTab);
  };

  renderAttendingEvents = () => {
    this.setState({
      selectedTab: "attending"
    });
    console.log(this.state.selectedTab);
  };

  renderEventForm = e => {
    this.setState({
      selectedTab: "form"
    });
    console.log(this.state.selectedTab);
  };

  render() {
    const {
      // name,
      // location,
      user,
      events,
      // update,
      date_time
      // description,
      // image_url
      // selectedTab
    } = this.state;
    
    let myEvents = [];
    myEvents = events.map(event => (
      <>
        <Event
          datetime={event.date_time}
          deleteEvent={this.deleteEvent}
          description={event.description}
          id={event.id}
          image_url={event.image_url}
          isEdit={true}
          location={event.location}
          name={event.name}
          updateState={this.updateState}
        />
        <br />
      </>
    ));

    return (
      <div>
        <Navbar logout={this.logout} />
        <br />
        <br />
        <div className="container">
          <h2>Welcome! {user && user.username}</h2>
          <p>{user && user.primary_location}</p>
          <button
            className={
              this.state.selectedTab === "created"
                ? "btn btn-outline-success"
                : "btn btn-outline-success my-2 my-sm-0"
            }
            onClick={this.renderMyEvents}
          >
            Hosted Events
          </button>
          <button
            className={
              this.state.selectedTab === "attending"
                ? "btn btn-outline-success"
                : "btn btn-outline-success my-2 my-sm-0"
            }
            onClick={this.renderAttendingEvents}
          >
            My Tickets
          </button>
          <button
            className={
              this.state.selectedTab === "form"
                ? "btn btn-outline-success"
                : "btn btn-outline-success my-2 my-sm-0"
            }
            onClick={e => {
              this.renderEventForm(e);
            }}
          >
            Create Event
          </button>
          <hr />
          <br />
          {this.displayedHeader()}
          {this.displayedEvents()}
          <br />
          <div className="row"></div>
          {/* This is where I took out the untitled-1 file */}
        </div>
      </div>
    );
  }
}

// {this.state.selectedTab === "attending" ? "btn btn-outline-success" : "btn btn-outline-success my-2 my-sm-0"}
