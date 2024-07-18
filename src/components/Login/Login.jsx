import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const response = await axios.post(`https://localhost:7062/api/Auth/login`, {
        Email: inputUsername,
        Password: inputPassword
      }); 
  
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        
        if (response.data.user.name === 'Admin') {
          navigate("/admin", { state: { username: inputUsername } });
        } else {
          navigate("/home", { state: { username: inputUsername } });
        }
      } else {
        setShow(true);
      }
    } catch (error) {
      setShow(true);
    }
  
    setLoading(false);
  };  

  const handlePassword = () => { };

  return (
    <div
      className="sign-in__wrapper"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/604684/pexels-photo-604684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        height: "100vh",
        widows: '100vh'
      }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop text-white text-center h2 p-4">Employee Leave Management</div>
      {/* Form */}
      <Form className="max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-blur" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="h2 mb-2 text-center text-white">Login</div>
        {/* Error Alert */}
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        )}
        {/* Username Field */}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label className="text-white">User Email</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="User Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        {/* Password Field */}
        <Form.Group className="mb-2" controlId="password">
          <Form.Label className="text-white">Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        {/* Remember me Checkbox */}
        <Form.Group className="mb-2" controlId="checkbox">
          <Form.Check type="checkbox" className="text-white" label="Remember me" />
        </Form.Group>
        {/* Submit Button */}
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        {/* Forgot Password Link */}
        <div className="d-grid justify-content-end">
          <Button
            className="text-white px-0"
            variant="link"
            onClick={handlePassword}
            style={{ color: 'white' }}
          >
            Forgot password?
          </Button>
        </div>
        {/* Register Link */}
        <div>
          <p className="text-center text-white">Not registered ? <Link to='/register' className="button-register">Register</Link></p>
        </div>
      </Form>
    </div>
  );
};

export default Login; 