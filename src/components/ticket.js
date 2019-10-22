import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Ticket extends Component {
  state = {
    events: []
  };

  componentDidMount() {
    this.getEvents();
  }

  getEvents = () => {
    const token = localStorage.getItem("access_token");
    fetch("http://localhost:3000/get-all-events", {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(data => this.setState({ events: data }));
  };

  //   getEvent = id => {
  //     debugger;

  //     const token = localStorage.getItem("access_token");
  //     fetch(`http://localhost:3000/events/${id}`, {
  //       headers: { Authorization: token }
  //     })
  //       .then(resp => resp.json())
  //       .then(resp => {
  //         this.setState({
  //           events: resp.name
  //         });
  //       });
  //     this.getEventName();
  //   };

  getEventName = id => {
    const event = this.state.events.filter(event => event.id === id);
    const eventName = event[0];
    return eventName.name;
  };

  render() {
    const { event_id, ticket_class, price, description } = this.props;

    if (this.state.events.length > 0) {
      return (
        <div
          className="card p-6 mb-2 bg-secondary text-white"
          style={{ margin: "1rem" }}
          key={event_id}
        >
          <div className="card-header">
            Event: {this.getEventName(event_id)}{" "}
          </div>
          {/* {this.getEvent(event_id)}</div> */}
          <div className="card-body">
            Ticket Tier: {ticket_class}
            <br />
            Ticket description: {description}
            <br />
            Ticket price: £{price}
            <br />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
