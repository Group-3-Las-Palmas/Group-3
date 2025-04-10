import React, { useState } from "react";
import { registerUser } from "../services/apiServices";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Form,
  Input,
  Label,
  Button,
  ErrorMessage,
  FooterText,
} from "../styles/registerStyled";

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(form.username, form.email, form.password);
      console.log("Registered user:", data.user);
      navigate("/"); // Redirect to login
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Label>Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>

        <FooterText>
          Already have an account? <Link to="/">Login</Link>
        </FooterText>
      </Form>
    </Container>
  );
};

export default Register;
