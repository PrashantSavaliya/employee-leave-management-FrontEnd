import React, { useState, useEffect } from "react";
import "./LeaveRequest.css";
import {
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import axios from "axios";

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const leaveRequestsPerPage = 10;
  const [sortType, setSortType] = useState("asc");
  const [sortKey, setSortKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedFields, setEditedFields] = useState({});
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailsFields, setDetailsFields] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteFields, setDeleteFields] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://localhost:7062/api/LeaveManagement/Getall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLeaveRequests(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (leaveId) => {
    const selectedLeave = leaveRequests.find(
      (request) => request.leaveId === leaveId
    );
    setSelectedLeaveId(leaveId);
    setEditedFields(selectedLeave);
    setEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedLeaveId(null);
    setEditedFields({});
  };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://localhost:7062/api/LeaveManagement/Update`,
        {
          leaveId: editedFields.leaveId,
          employeeId: editedFields.employeeId,
          startDate: editedFields.startDate,
          endDate: editedFields.endDate,
          reason: editedFields.reason,
          status: parseInt(editedFields.status),
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
      console.error("Error updating leave request:", error);
    }
  };

  const handleDelete = (leaveId) => {
    const selectedLeave = leaveRequests.find(
      (request) => request.leaveId === leaveId
    );
    setSelectedLeaveId(leaveId);
    setDeleteFields(selectedLeave); // Set deleteFields here
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setSelectedLeaveId(null);
    setDeleteFields({});
  };
  const handleDeleteLeaveRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://localhost:7062/api/LeaveManagement/Delete?id=${deleteFields.leaveId}`,
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

  const handleDetails = (leaveId) => {
    const selectedLeave = leaveRequests.find(
      (request) => request.leaveId === leaveId
    );
    setSelectedLeaveId(leaveId);
    setDetailsFields(selectedLeave);
    setDetailModalOpen(true);
  };
  const handleDetailsModalClose = () => {
    setDetailModalOpen(false);
    setSelectedLeaveId(null);
    setDetailsFields({});
  };

  const sortData = (key) => {
    const sortedLeaveRequests = [...leaveRequests].sort((a, b) => {
      if (sortType === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setSortType(sortType === "asc" ? "desc" : "asc");
    setSortKey(key);
    setLeaveRequests(sortedLeaveRequests);
  };

  const filteredLeaveRequests = Array.isArray(leaveRequests)
    ? leaveRequests.filter((request) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (request.startDate && request.startDate.toLowerCase().includes(searchLower)) ||
        (request.endDate && request.endDate.toLowerCase().includes(searchLower)) ||
        (request.reason && request.reason.toLowerCase().includes(searchLower)) ||
        (request.employeeId && request.employeeId.toLowerCase().includes(searchLower))
      );
    })
    : [];


  const statusOptions = ["Pending", "Approved", "Rejected"];

  const indexOfLastLeaveRequest = currentPage * leaveRequestsPerPage;
  const indexOfFirstLeaveRequest =
    indexOfLastLeaveRequest - leaveRequestsPerPage;
  const currentLeaveRequests = filteredLeaveRequests.slice(
    indexOfFirstLeaveRequest,
    indexOfLastLeaveRequest
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-md mx-auto border border-gray-60 rounded-lg p-5 bg-blur blurclass">
      <div className="leave-requests-list-container text-white">
        <h2>Leave Requests List</h2>
        <input
          type="text"
          placeholder="Search here..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th onClick={() => sortData("leaveId")}>
                Leave ID
                {sortKey === "leaveId" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("employeeId")}>
                Employee Id
                {sortKey === "employeeId" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("startDate")}>
                Start Date
                {sortKey === "startDate" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("endDate")}>
                End Date
                {sortKey === "endDate" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("reason")}>
                Reason
                {sortKey === "reason" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th onClick={() => sortData("status")}>
                Status
                {sortKey === "status" &&
                  (sortType === "asc" ? <FaSortDown /> : <FaSortUp />)}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            ) : currentLeaveRequests.length > 0 ? (
              currentLeaveRequests.map((request) => (
                <tr key={request.leaveId}>
                  <td>{request.leaveId}</td>
                  <td>{request.employeeId}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.reason}</td>
                  <td>{statusOptions[request.status]}</td>
                  <td
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FaEdit onClick={() => handleEdit(request.leaveId)} />
                    <FaTrash onClick={() => handleDelete(request.leaveId)} />
                    <FaInfoCircle
                      onClick={() => handleDetails(request.leaveId)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <ul className="pagination">
          {Array.from({
            length: Math.ceil(
              filteredLeaveRequests.length / leaveRequestsPerPage
            ),
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
            <h2 className="text-primary text-center">Edit Leave Request</h2>
            {/* Form fields for editing */}
            <div>
              <label className="text-dark">Leave ID</label>
              <input type="text" value={editedFields.leaveId} disabled />
            </div>
            <div>
              <label className="text-dark">Employee ID</label>
              <input type="text" value={editedFields.employeeId} disabled />
            </div>
            <div>
              <label className="text-dark">Start Date</label>
              <input type="text" value={editedFields.startDate} disabled />
            </div>
            <div>
              <label className="text-dark">End Date</label>
              <input type="text" value={editedFields.endDate} disabled />
            </div>
            <div>
              <label className="text-dark">Reason</label>
              <input type="text" value={editedFields.reason}  onChange={(e) => setEditedFields({ ...editedFields, reason: e.target.value })} />
            </div>
            <div>
              <label className="text-dark">Status</label>
              <select
                value={editedFields.status}
                onChange={(e) =>
                  setEditedFields({ ...editedFields, status: e.target.value })
                }
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* <button onClick={handleSave}>Save</button> */}
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
            <h2 className="text-primary text-center">Leave Request Details</h2>
            {/* Display fields for details */}
            <div>
              <label className="text-dark">Leave ID</label>
              <input type="text" value={detailsFields.leaveId} disabled />
            </div>
            <div>
              <label className="text-dark">Employee ID</label>
              <input type="text" value={detailsFields.employeeId} disabled />
            </div>
            <div>
              <label className="text-dark">Start Date</label>
              <input type="text" value={detailsFields.startDate} disabled />
            </div>
            <div>
              <label className="text-dark">End Date</label>
              <input type="text" value={detailsFields.endDate} disabled />
            </div>
            <div>
              <label className="text-dark">Reason</label>
              <input type="text" value={detailsFields.reason} disabled />
            </div>
            <div>
              <label className="text-dark">Status</label>
              <select
                value={deleteFields.status}
                onChange={(e) =>
                  setEditedFields({ ...deleteFields, status: e.target.value })
                } 
                disabled
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center mt-3">
              <button onClick={handleDetailsModalClose}>Close</button>
            </div>
          </div>
        )}

        {/* Delete modal */}
        {deleteModalOpen && (
          <div className="delete-modal">
            <h2 className="text-primary text-center">Leave Request Delete</h2>
            {/* Delete fields for details */}
            <div>
              <label className="text-dark">Leave ID</label>
              <input type="text" value={deleteFields.leaveId} disabled />
            </div>
            <div>
              <label className="text-dark">Employee ID</label>
              <input type="text" value={deleteFields.employeeId} disabled />
            </div>
            <div>
              <label className="text-dark">Start Date</label>
              <input type="text" value={deleteFields.startDate} disabled />
            </div>
            <div>
              <label className="text-dark">End Date</label>
              <input type="text" value={deleteFields.endDate} disabled />
            </div>
            <div>
              <label className="text-dark">Reason</label>
              <input type="text" value={deleteFields.reason} disabled />
            </div>
            <div>
              <label className="text-dark">Status</label>
              <select
                value={deleteFields.status}
                onChange={(e) =>
                  setEditedFields({ ...deleteFields, status: e.target.value })
                } 
                disabled
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={index}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* <button onClick={handleDeleteLeaveRequest}>Delete</button> */}
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

export default LeaveRequest;
