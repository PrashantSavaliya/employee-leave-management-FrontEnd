import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Home from "./components/Home/Home.jsx";
import Dashboard from "./components/Admin/Dashboard/Dashboard.jsx";
import Employee from "./components/Admin/Employee/Employee.jsx";
import LeaveRequest from "./components/Admin/LeaveRequest/LeaveRequest.jsx";
import Admin from "./components/Admin/AdminSlider/Admin.jsx";
import Display from "./components/Home/Display/Display.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/display" element={<Display />} />
      <Route path="/admin" element={<Admin />}>
        <Route index element={<Dashboard />} />
        <Route path="employee" element={<Employee />} />
        <Route path="leave" element={<LeaveRequest />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
