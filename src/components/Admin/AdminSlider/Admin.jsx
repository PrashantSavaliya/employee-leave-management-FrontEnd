import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import Dashboard from '../Dashboard/Dashboard';
import Employee from '../Employee/Employee';
import LeaveRequest from '../LeaveRequest/LeaveRequest';
import { AiOutlineDashboard } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { IoBookSharp } from "react-icons/io5";
import { RiLogoutBoxRLine } from "react-icons/ri";

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div
            className="sign-in__wrapper"
            style={{
                backgroundImage: `url('https://images.pexels.com/photos/604684/pexels-photo-604684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
            }}
        >
            <div className="admin-page">
                <div className="sidebar">
                    <div className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}> <AiOutlineDashboard /> Dashboard</div>
                    <div className={`tab ${activeTab === 'employee' ? 'active' : ''}`} onClick={() => handleTabChange('employee')}> <FaUsers /> Employees</div>
                    <div className={`tab ${activeTab === 'leave' ? 'active' : ''}`} onClick={() => handleTabChange('leave')}> <IoBookSharp /> Leave-Requests</div>
                    <div className="logout-btn" onClick={handleLogout}>Logout <RiLogoutBoxRLine /></div>
                </div>
                <div className="content">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'employee' && <Employee />}
                    {activeTab === 'leave' && <LeaveRequest />}
                </div>
            </div>
        </div>
    );
};

export default Admin;
