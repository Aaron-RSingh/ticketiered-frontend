import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Event extends Component {
  state = {
    event: {},
    tickets: [],
    new_ticket_class: "",
    new_description: "",
    new_availability: "",
    new_price: "",
    update: false,
    date_time: ""
  };
  componentDidMount() {
    const eventId = this.props.id;
    this.fetchAllEventInfo(eventId);
    this.editDatesInState();
  }

  fetchAllEventInfo = id => {
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/events/${id}`, {
      headers: { Authorization: token }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          event: res.event
        });
      });
  };

  editDatesInState = () => {
    // debugger
    // console.log(this.props.date_time.split("T")[0]);
    // const date = this.props.date_time.split("T")[0];
    // console.log(this.state);
    // this.setState({
    //   date_time: date
    // });
    // console.log(this.state);
    // const {date_time} = this.props.events
    // this.setState({})
  };

  handlechange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addNew = e => {
    const { id } = this.props;
    e.preventDefault();
    const {
      new_ticket_class,
      new_description,
      new_availability,
      new_price
    } = this.state;
    const token = localStorage.getItem("access_token");
    const self = this;
    fetch(`http://localhost:3000/events/${id}/tickets`, {
      method: "post",
      body: JSON.stringify({
        ticket_class: new_ticket_class,
        description: new_description,
        availability: new_availability,
        price: new_price
      }),
      headers: { Authorization: token, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(function(response) {
        self.setState({
          new_ticket_class: "",
          new_description: "",
          new_availability: "",
          new_price: ""
        });
        self.fetchAllEventInfo(id);
      });
  };

  updateState = (e, id) => {
    e.preventDefault();
    const { event } = this.state;
    const filterResult = event.tickets.filter(ticket => ticket.id === id);
    this.setState({
      new_price: filterResult[0].price,
      new_availability: filterResult[0].availability,
      new_description: filterResult[0].description,
      new_ticket_class: filterResult[0].ticket_class,
      update: true,
      updateTicketId: filterResult[0].id
    });
  };

  updateTicket = e => {
    e.preventDefault();
    const {
      new_ticket_class,
      new_description,
      new_availability,
      new_price,
      updateTicketId
    } = this.state;
    const token = localStorage.getItem("access_token");
    const self = this;
    fetch(`http://localhost:3000/tickets/${updateTicketId}`, {
      method: "PUT",
      body: JSON.stringify({
        ticket_class: new_ticket_class,
        description: new_description,
        availability: new_availability,
        price: new_price
      }),
      headers: { Authorization: token, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(function(res) {
        self.setState({
          new_ticket_class: "",
          new_description: "",
          new_availability: "",
          new_price: "",
          update: false
        });
        self.fetchAllEventInfo(res.event_id);
      });
  };

  deleteTicket = (e, id) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:3000/tickets/${id}`, {
      method: "DELETE",
      headers: { Authorization: token, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {});
    window.location.reload();
  };

  cancelUpdate = () => {
    this.setState({
      new_price: "",
      new_availability: "",
      new_description: "",
      new_ticket_class: "",
      update: false
    });
  };

  render() {
    console.log(this.state);
    const styles = {
      fontWeight: "bold"
    };
    const {
      name,
      image_url,
      description,
      id,
      location,
      isEdit,
      date_time
    } = this.props;

    const {
      new_ticket_class,
      new_description,
      new_availability,
      new_price,
      update
      // date_time
    } = this.state;
    const { event } = this.state;

    return (
      <div className="card">
        <div className="card-header">{name}</div>
        <div className="card-body">
          <img
            src={event.image_url}
            key={id}
            alt=""
            style={{ width: "25vw", height: "25vw" }}
          />
          <br />
          <br />
          <p className="card-title">
            <b>Location: </b>
            {location}
          </p>
          <p className="card-date">
            <b>Date:</b> Tomorrow
          </p>
          <p className="card-text">{description}</p>
          <Link
            className="btn btn-outline-success"
            to={{ pathname: `/eventDetail/${id}` }}
          >
            View Details
          </Link>
          {isEdit && (
            <button
              style={{ margin: "1rem" }}
              className="btn btn-outline-success my-2 my-sm-0"
              onClick={e => this.props.updateState(e, id)}
            >
              Edit
            </button>
          )}
          {isEdit && (
            <>
              <button
                className="btn btn-outline-success my-2 my-sm-0"
                onClick={e => this.props.deleteEvent(e, id)}
              >
                Delete
              </button>
              <br />
              <hr />
              <h6>Tickets</h6>
              {event.tickets &&
                event.tickets.map(ticket => {
                  return (
                    <div
                      className="card p-6 mb-2 bg-secondary text-white"
                      style={{ margin: "1rem" }}
                      key={ticket.id}
                    >
                      <div className="card-header">
                        <b>Ticket class: {ticket.ticket_class.toLocaleUpperCase()}</b>
                      </div>
                      <div className="card-body">
                        Ticket description: {ticket.description}
                        <br />
                        Ticket availability: {ticket.availability}
                        <br />
                        Ticket price: £{ticket.price}
                        <br />
                        <button
                          style={{ margin: "0.5rem" }}
                          className="btn btn-outline-success"
                          onClick={e => this.updateState(e, ticket.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ margin: "0.5rem" }}
                          className="btn btn-outline-success"
                          onClick={e => this.deleteTicket(e, ticket.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              <hr />
              {!update ? <h6>Add New Ticket</h6> : <h6>Update</h6>}
              <div className="container">
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Ticket Class"
                        name="new_ticket_class"
                        value={new_ticket_class}
                        onChange={this.handlechange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    {" "}
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Description"
                        name="new_description"
                        value={new_description}
                        onChange={this.handlechange}
                      />
                    </div>
                  </div>
                  <div className="w-100"></div>
                  <div className="col">
                    {" "}
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Availablilty"
                        name="new_availability"
                        value={new_availability}
                        onChange={this.handlechange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    {" "}
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Price"
                        name="new_price"
                        value={new_price}
                        onChange={this.handlechange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {!update ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={this.addNew}
                >
                  Add
                </button>
              ) : (
                <>
                  <button
                    style={{ margin: "1rem" }}
                    className="btn btn-outline-primary"
                    onClick={this.updateTicket}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={this.cancelUpdate}
                  >
                    Cancel
                  </button>
                </>
              )}
            </>
          )}
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}
