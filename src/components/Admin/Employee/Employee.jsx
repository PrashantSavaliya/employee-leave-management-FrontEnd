import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [sortType, setSortType] = useState("asc");
  const [sortKey, setSortKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailsFields, setDetailsFields] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFields, setDeleteFields] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      debugger
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://localhost:7062/api/Employees/Getall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetails = (employeeId) => {
    const selectedLeave = employees.find(
      (request) => request.employeeId === employeeId
    );
    setSelectedEmployeeId(employeeId);
    setDetailsFields(selectedLeave);
    setDetailModalOpen(true);
  };
  const handleDetailsModalClose = () => {
    setDetailModalOpen(false);
    setSelectedEmployeeId(null);
    setDetailsFields({});
  };

  const handleEdit = (employeeId) => {
    const selectedLeave = employees.find(
      (request) => request.employeeId === employeeId
    );
    setSelectedEmployeeId(employeeId);
    setEditedFields(selectedLeave);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedEmployeeId(null);
    setEditedFields({});
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7062/api/Employees/Update`,
        {
          employeeId: editedFields.employeeId,
          Name: editedFields.name,
          age: parseInt(editedFields.age),
          Birthdate: editedFields.birthdate,
          Department: editedFields.department,
          Position: editedFields.position,
          PreviousLeave: editedFields.previousLeave,
          Email: editedFields.email,
          Password: editedFields.password,
          ContactNumber: editedFields.contactNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      handleEditModalClose();
    } catch (error) {
      console.error("Error updating Employee:", error);
    }
  };

  const handleDelete = (employeeId) => {
    const selectedLeave = employees.find(
      (request) => request.employeeId === employeeId
    );
    setSelectedEmployeeId(employeeId);
    setDeleteFields(selectedLeave);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedEmployeeId(null);
    setDeleteFields({});
  };
  const handleDeleteLeaveRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://localhost:7062/api/Employees/Delete?id=${deleteFields.employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      handleDeleteModalClose();
    } catch (error) {
      console.error("Error Deleting leave request:", error);
    }
  };

  const sortData = (key) => {
    const sortedEmployees = [...employees].sort((a, b) => {
      if (sortType === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setSortType(sortType === "asc" ? "desc" : "asc");
    setSortKey(key);
    setEmployees(sortedEmployees);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-blur blurclass">
      <div className="employees-list-container text-white">
        <h2>Employee List</h2>
        <input
          type="text"
          placeholder="Search here..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th onClick={() => sortData("employeeId")}>
                ID
                {sortKey === "employeeId" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("name")}>
                Name
                {sortKey === "name" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("email")}>
                Email
                {sortKey === "email" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("age")}>
                Age
                {sortKey === "age" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("birthdate")}>
                DateOfBirth
                {sortKey === "birthdate" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("previousleave")}>
                Previous Leave
                {sortKey === "previousleave" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              {/* <th onClick={() => sortData("password")}>
                Password
                {sortKey === "password" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th> */}
              <th onClick={() => sortData("contactNumber")}>
                Contact Number
                {sortKey === "contactNumber" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("department")}>
                Department
                {sortKey === "department" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("position")}>
                Position
                {sortKey === "position" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              {/* <th onClick={() => sortData("isActive")}>
                IsActive
                {sortKey === "isActive" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : (
              currentEmployees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.age}</td>
                  <td>{employee.birthdate}</td>
                  <td>{employee.previousLeave}</td>
                  {/* <td>{employee.password}</td> */}
                  <td>{employee.contactNumber}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  {/* <td>{employee.isActive}</td> */}
                  <td
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FaEdit onClick={() => handleEdit(employee.employeeId)} />
                    <FaTrash
                      onClick={() => handleDelete(employee.employeeId)}
                    />
                    <FaInfoCircle
                      onClick={() => handleDetails(employee.employeeId)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ul className="pagination">
          {Array.from({
            length: Math.ceil(filteredEmployees.length / employeesPerPage),
          }).map((_, index) => (
            <li
              key={index}
              className={index + 1 === currentPage ? "active" : ""}
            >
              <button onClick={() => paginate(index + 1)}>{index + 1}</button>
            </li>
          ))}
        </ul>

        {/* Edit modal */}
        {editModalOpen && (
          <div className="edit-modal">
            <h2 className="text-primary text-center">Edit Employee</h2>
            {/* Form fields for editing */}
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Employee ID</label>
                  <input type="text" value={editedFields.employeeId} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Name</label>
                  <input type="text" value={editedFields.name} onChange={(e) => setEditedFields({ ...editedFields, name: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Email</label>
                  <input type="text" value={editedFields.email} onChange={(e) => setEditedFields({ ...editedFields, email: e.target.value })} />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Age</label>
                  <input type="text" value={editedFields.age} onChange={(e) => setEditedFields({ ...editedFields, age: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Birth Date</label>
                  <input type="text" value={editedFields.birthdate} onChange={(e) => setEditedFields({ ...editedFields, birthdate: e.target.value })} />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Previous Leave</label>
                  <input type="text" value={editedFields.previousleave} onChange={(e) => setEditedFields({ ...editedFields, previousLeave: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-md-6">
                <div>
                  <label className="text-dark">Password</label>
                  <input type="text" value={editedFields.password} onChange={(e) => setEditedFields({ ...editedFields, password: e.target.value }) } />
                </div>
              </div> */}
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Position</label>
                  <input type="text" value={editedFields.position} onChange={(e) => setEditedFields({ ...editedFields, position: e.target.value })} />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Contact No.</label>
                  <input type="text" value={editedFields.contactNumber} onChange={(e) => setEditedFields({ ...editedFields, contactNumber: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Department</label>
                  <input type="text" value={editedFields.department} onChange={(e) => setEditedFields({ ...editedFields, department: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button className=" me-2" onClick={handleSave}>
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Details modal */}
        {detailModalOpen && (
          <div className="details-modal">
            <h2 className="text-primary text-center">Employee Details</h2>
            {/* Display fields for details */}
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Employee ID</label>
                  <input
                    type="text"
                    value={detailsFields.employeeId}
                    disabled
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Name</label>
                  <input type="text" value={detailsFields.name} disabled />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Email</label>
                  <input type="text" value={detailsFields.email} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Age</label>
                  <input type="text" value={detailsFields.age} disabled />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Birth Date</label>
                  <input type="text" value={detailsFields.birthdate} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Previous Leave</label>
                  <input
                    type="text"
                    value={detailsFields.previousleave}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-md-6">
                <div>
                  <label className="text-dark">Password</label>
                  <input type="text" value={detailsFields.password} disabled />
                </div>
              </div> */}
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Position</label>
                  <input type="text" value={detailsFields.position} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Conteact No.</label>
                  <input
                    type="text"
                    value={detailsFields.contactNumber}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Department</label>
                  <input
                    type="text"
                    value={detailsFields.department}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <button onClick={handleDetailsModalClose}>Close</button>
            </div>
          </div>
        )}

        {/* Delete modal */}
        {deleteModalOpen && (
          <div className="delete-modal">
            <h2 className="text-primary text-center">Employee Delete</h2>
            {/* Display fields for details */}
            <div className="row">
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Employee ID</label>
                  <input type="text" value={deleteFields.employeeId} disabled />
                </div>
                <div>
                  <label className="text-dark">Email</label>
                  <input type="text" value={deleteFields.email} disabled />
                </div>
                <div>
                  <label className="text-dark">Birth Date</label>
                  <input type="text" value={deleteFields.birthdate} disabled />
                </div>
                {/* <div>
                  <label className="text-dark">Password</label>
                  <input type="text" value={deleteFields.password} disabled />
                </div> */}
                <div>
                  <label className="text-dark">Position</label>
                  <input type="text" value={deleteFields.position} disabled />
                </div>
                <div>
                  <label className="text-dark">Department</label>
                  <input type="text" value={deleteFields.department} disabled />
                </div>
              </div>
              <div className="col-md-6">
                <div>
                  <label className="text-dark">Name</label>
                  <input type="text" value={deleteFields.name} disabled />
                </div>
                <div>
                  <label className="text-dark">Age</label>
                  <input type="text" value={deleteFields.age} disabled />
                </div>
                <div>
                  <label className="text-dark">Previous Leave</label>
                  <input
                    type="text"
                    value={deleteFields.previousleave}
                    disabled
                  />
                </div>
                <div>
                  <label className="text-dark">Conteact No.</label>
                  <input
                    type="text"
                    value={deleteFields.contactNumber}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-danger me-2"
                onClick={handleDeleteLeaveRequest}
              >
                {" "}
                Delete{" "}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                {" "}
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;
