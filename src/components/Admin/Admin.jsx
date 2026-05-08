import React, { Component } from "react";
// Bootstrap
import { Container, Button } from "react-bootstrap";
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  render() {
    return (
      <Container>
        <h1>Welcome</h1>
      </Container>
    );
  }
}
