// Group-3/frontend/src/components/login/login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Input, Button, ErrorMessage } from "./loginStyled.js";
// Import the specific service function needed
import { loginUser } from "../../services/apiServices.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Use the imported service function instead of fetch
      const data = await loginUser(email, password);

      // Assuming the token is returned in the 'token' property of the response data
      if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("Login successful, token stored.");
          navigate("/"); // Redirect after successful login
      } else {
          // Handle cases where login is successful but no token is returned (if possible)
          console.warn("Login successful but no token received.");
          setError("Login completed but couldn't retrieve session token.");
      }

    } catch (err) {
      // Display the error message thrown by the service (or a default)
      setError(err.message || "Login failed. Please check your credentials.");
      console.error("Login component error:", err);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Welcome!</h2>
        {/* Display error message if it exists */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <h3>Email</h3>
        <Input
          type="email"
          placeholder="Example@email.com"
          value={email}
          // Update state when email input changes
          onChange={(e) => setEmail(e.target.value)}
          required // HTML5 form validation
        />
        <h3>Password</h3>
        <Input
          type="password"
          placeholder="Atleast 8 characters"
          value={password}
          // Update state when password input changes
          onChange={(e) => setPassword(e.target.value)}
          required // HTML5 form validation
        />
        <a href="#">Forgot password?</a>
        <Button type="submit">Login</Button>
        <p>Don't have an account? <a href="#">Sign up</a></p>
      </Form>
    </Container>
  );
};

export default Login;