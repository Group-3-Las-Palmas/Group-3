import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      const data = await loginUser(email, password);

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Login successful, token and user info stored.");
        navigate("/mainPage");
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        console.warn(
          "Login successful, token stored but user data missing in response."
        );
        navigate("/mainPage");
      } else {
        console.warn("Login successful but no token received.");
        setError("Login completed but couldn't retrieve session token.");
      }
    } catch (err) {
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
        <p>
          Don't have an account? <Link to={"/registerPage"}>Sign up</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Login;
