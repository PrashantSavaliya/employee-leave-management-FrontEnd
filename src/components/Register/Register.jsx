import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import "./Register.css";

const Register = () => {
    const [inputEmployeename, setInputEmployeename] = useState("");
    const [inputAge, setInputAge] = useState("");
    const [inputDOB, setInputDOB] = useState(new Date());
    const [inputDepartment, setInputDepartment] = useState("");
    const [inputPosition, setInputPosition] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputContactNo, setInputContactNo] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [show, setShow] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`https://localhost:7062/api/Auth/Register`, {
                Name: inputEmployeename,
                Age: parseInt(inputAge),
                Birthdate: inputDOB,
                Department: inputDepartment,
                Position: inputPosition,
                Password: inputPassword,
                ContactNumber: inputContactNo,
                Email: inputEmail,
                IsActive: true,
                PreviousLeave: ""
            });
            if (response.status === 200) {
                navigate("/login");
              } else {
                setShow(true);
              }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };


    return (
        <div
            className="sign-in__wrapper"
            style={{
                backgroundImage: `url('https://images.pexels.com/photos/604684/pexels-photo-604684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
                height: "100%",
                widows: '100%'
            }}
        >
            {/* Overlay */}
            <div className="sign-in__backdrop text-white text-center h2 p-4"></div>
            {/* Form */}
            <Form className="max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-blur" onSubmit={handleSubmit}>
                {/* Header */}
                <div className="h2 mb-2 text-center text-white">Register</div>
                {/* Alert */}
                {showError && (
                    <Alert
                        className="mb-2"
                        variant="danger"
                        onClose={() => setShowError(false)}
                        dismissible
                    >
                        Error registering new user.
                    </Alert>
                )}
                {/* Employee Name */}
                <Form.Group className="mb-2" controlId="employeeName">
                    <Form.Label className="text-white">Employee Name:</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputEmployeename}
                        placeholder="Employee Name"
                        onChange={(e) => setInputEmployeename(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* Department */}
                <Form.Group className="mb-2" controlId="email">
                    <Form.Label className="text-white">E-Mail:</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputEmail}
                        placeholder="E-Mail "
                        onChange={(e) => setInputEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* Date of Birth */}
                <Form.Group className="mb-2" controlId="dob">
                    <Form.Label className="text-white">Date of Birth:</Form.Label> <br />
                    <DatePicker
                        selected={inputDOB}
                        onChange={(date) => setInputDOB(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Date of Birth"
                        className="form-control"
                        required
                        maxDate={new Date()}
                    />
                </Form.Group>
                 {/* Age */}
                 <Form.Group className="mb-2" controlId="age">
                    <Form.Label className="text-white">Age:</Form.Label>
                    <Form.Control
                        type="number"
                        value={inputAge}
                        placeholder="Age"
                        onChange={(e) => setInputAge(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* Department */}
                <Form.Group className="mb-2" controlId="department">
                    <Form.Label className="text-white">Department:</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputDepartment}
                        placeholder="Department"
                        onChange={(e) => setInputDepartment(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* Position */}
                <Form.Group className="mb-2" controlId="position">
                    <Form.Label className="text-white">Position:</Form.Label>
                    <Form.Control
                        type="text"
                        value={inputPosition}
                        placeholder="Position"
                        onChange={(e) => setInputPosition(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* Contact Number */}
                <Form.Group className="mb-2" controlId="contactNo">
                    <Form.Label className="text-white">Contact Number:</Form.Label>
                    <Form.Control
                        type="number"
                        value={inputContactNo}
                        placeholder="Contact Number"
                        onChange={(e) => setInputContactNo(e.target.value)}
                        required
                    />
                </Form.Group>
                {/* Password */}
                <Form.Group className="mb-2" controlId="password">
                    <Form.Label className="text-white">Password:</Form.Label>
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
                        Register
                    </Button>
                ) : (
                    <Button className="w-100" variant="primary" type="submit" disabled>
                        Registering...
                    </Button>
                )}

                {/* Link to Login Page */}
                <div>
                    <p className="text-center text-white">
                        Already registered? <Link to="/login" className="button-login">Login</Link>
                    </p>
                </div>
            </Form>
        </div>
    );
};

export default Register;
