import React from "react";
import { Form, Button, Container } from "react-bootstrap";
import "./Contact.css";

const Contact = () => {
  return (
    <Container className="contact-container">
      <Form
        action="https://formsubmit.co/YourMailId"
        method="POST"
      >
        <h2>CONTACT US</h2>

        <Form.Group controlId="formName">
          <Form.Label className="form-label">Name</Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail">
          <Form.Label className="form-label">Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group controlId="formMessage">
          <Form.Label className="form-label">Message</Form.Label>
          <Form.Control
            name="message"
            as="textarea"
            rows={4}
            placeholder="Enter your message"
            required
          />
        </Form.Group>

        {/* Hidden input to prevent spam */}
        <input type="hidden" name="_captcha" value="false" />

        <Button type="submit" className="submit-btn">
          Send Message
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;
