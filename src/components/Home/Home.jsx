import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import "./Home.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FaGuilded } from "react-icons/fa";

const Home = () => {
  const [inputEmployeename, setInputEmployeename] = useState("");
  const [inputStartDate, setInputStartDate] = useState(new Date());
  const [inputLastDate, setInputLastDate] = useState(new Date());
  const [inputReason, setInputReason] = useState("");
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileModalShow, setProfileModalShow] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.username) {
      setUsername(location.state.username);
      const timer = setTimeout(() => {
        setUsername("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      debugger
      const token = localStorage.getItem("token");
      const response = await axios.post(`https://localhost:7062/api/LeaveManagement/Add`, {
        Reason: inputReason,
        StartDate: inputStartDate,
        EndDate: inputLastDate,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        navigate("/display");
      } else {
        setShow(true);
      }
    } catch (error) {
      console.log(error);
      setShow(true);
    }

    setLoading(false);
  };

  const fetchLeaveData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7062/api/LeaveManagement/ShowLeaveOfEmp", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeaveData(response.data); 
      setModalShow(true);
    } catch (error) {
      console.log(error);
      // Handle error
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
    }
  };

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://localhost:7062/api/Employees/Getbyid", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfileData(response.data.data);
      setProfileModalShow(true);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put("https://localhost:7062/api/Employees/Update", profileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setProfileModalShow(true);
      } else {
        // Handle failure
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
    setProfileModalShow(false);
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/604684/pexels-photo-604684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
      }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-blur" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="h2 mb-2 text-center text-white">Employee Leave Form</div>
        {/* Welcome Alert */}
        {username && (
          <Alert className="mb-2" variant="success">
            Welcome, {username}!
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label className="text-white">Employee Name : </Form.Label>
          <Form.Control type="text" value={inputEmployeename} placeholder="Employee Name" onChange={(e) => setInputEmployeename(e.target.value)} required />
        </Form.Group>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-2" controlId="startDate">
                <Form.Label className="text-white">Start Date : </Form.Label>
                <DatePicker selected={inputStartDate} onChange={(date) => setInputStartDate(date)} dateFormat="dd/MM/yyyy" placeholderText="Start Date" className="form-control" required maxDate={new Date()} />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-2" controlId="endDate">
                <Form.Label className="text-white">End Date : </Form.Label>
                <DatePicker selected={inputLastDate} onChange={(date) => setInputLastDate(date)} dateFormat="dd/MM/yyyy" placeholderText="End Date" className="form-control" required />
              </Form.Group>
            </div>
          </div>
        </div>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label className="text-white">Reason : </Form.Label>
          <Form.Control type="text" value={inputReason} placeholder="Reason" onChange={(e) => setInputReason(e.target.value)} required />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Submit
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Submitting...
          </Button>
        )}
        <br /><br />
        <div className="text-center text-white">
          <Button className="btn btn-primary w-100" onClick={fetchLeaveData}>My Leaves</Button>
        </div><br />
        <div className="text-center text-white">
          <Button className="btn btn-primary w-100" onClick={fetchProfileData}>My Profile</Button>
        </div>
      </Form>

      {/* Show Leave Model */}
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Leaves</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display leave data here */}
          {leaveData.map((leave, index) => (
            <div key={index}>
              <p className="fw-bold">Leave No : {index + 1} </p>
              {/* Display leave details */}
              <div>
                <label className="text-dark">Start Date</label>
                <input type="text" value={new Date(leave.startDate).toLocaleDateString()} disabled />
              </div><br />
              <div>
                <label className="text-dark">End Date</label>
                <input type="text" value={new Date(leave.endDate).toLocaleDateString()} disabled />
              </div><br />
              <div>
                <label className="text-dark">Reason</label>
                <input type="text" value={leave.reason} disabled />
              </div><br />
              <div>
                <label className="text-dark">Status</label>
                <input type="text" value={getStatusText(leave.status)} disabled />
              </div>
              <hr /> {/* Horizontal line to separate each leave */}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    {/* Profile Modal */}
    <Modal show={profileModalShow} onHide={() => setProfileModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {profileData && (
            <div>
              <div>
                <label className="text-dark">Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
              </div><br />
              <div>
                <label className="text-dark">Age</label>
                <input type="text" value={profileData.age} onChange={(e) => setProfileData({ ...profileData, age: e.target.value })} />
              </div><br />
              <div>
                <label className="text-dark">Birth Date</label>
                <input type="text" value={profileData.birthdate} onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })} />
              </div><br />
              <div>
                <label className="text-dark">Department</label>
                <input type="text" value={profileData.department} onChange={(e) => setProfileData({ ...profileData, department: e.target.value })} />
              </div><br />
              <div>
                <label className="text-dark">Position</label>
                <input type="text" value={profileData.position} onChange={(e) => setProfileData({ ...profileData, position: e.target.value })} />
              </div><br />
              <div>
                <label className="text-dark">Email</label>
                <input type="text" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
              </div><br />
              <div>
                <label className="text-dark">Contact No</label>
                <input type="text" value={profileData.contactNumber} onChange={(e) => setProfileData({ ...profileData, contactNumber: e.target.value })} />
              </div><br />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveProfile}>Save</Button>
          <Button variant="secondary" onClick={() => setProfileModalShow(false)}>Close</Button>
        </Modal.Footer>
    </Modal>
    </div>
  );
};

export default Home;
