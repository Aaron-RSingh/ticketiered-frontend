import React, { Component } from "react";
import {  Link } from 'react-router-dom';
import Navbar from "./navbar";

export default class EventDetail extends Component {
  state = {
    event: {}
  };

  componentDidMount() {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // this.props.history.push('/login')
    }
    // debugger;
    const eventId = this.props.match.params.id;
    this.fetchEventDetail(eventId);
    // this.fetchAllTickets(event.id);
  }

  logout = e => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    this.props.history.push("/login");
  };

  fetchEventDetail = id => {
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/events/${id}`, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.setState({
          event: res.event
        });
      });
  };

  fetchAllTickets = id => {
    console.log(this.props);
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/events/${id}`, {
      headers: { Authorization: `bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      });
  };

  filterTickets = () => {
    // const allTickets = this.state
    console.log(this.state);
  };

  render() {
    const { event } = this.state;
    return (
      <div>
        <Navbar logout={this.logout} />
        <br />
        <br />
        <br />
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              {event && (
                <img
                  src={event.image_url}
                  alt="12"
                  style={{ float: "right" }}
                />
              )}
            </div>
            <div className="col">
              {event && (
                <>
                  <h3>
                    <strong>{event.name}</strong>
                  </h3>
                  <h4>Description: {event.description}</h4>
                  <h4>Location: {event.location}</h4>
                  <h4>Date time: {event.date_time}</h4>
                  <hr />
                </>
              )}
              {/* <hr /> */}
              {event.tickets &&
                event.tickets.map(ticket => {
                  return (
                    <div
                      className="p-3 mb-2 bg-secondary text-white"
                      style={{ margin: "1rem" }}
                      key={ticket.id}
                    >
                      Ticket class: {ticket.ticket_class}
                      <br />
                      Ticket description: {ticket.description}
                      <br />
                      Ticket availability: {ticket.availability}
                      <br />
                      Ticket price: £{ticket.price}
                      <br />
                      <Link className="btn btn-outline-success my-2 my-sm-0" to="/tickets/1" >Purchase Ticket</Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
