import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Page2() {
  const [requests, setRequests] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState('');

  // Function to fetch all requests from the server
  const fetchRequests = () => {
    axios
      .get('/api/requests')
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
      });
  };

  // Function to approve or deny a request
  const handleApproval = (requestId, isApproved) => {
    axios
      .put(`/api/requests/${requestId}`, { is_approved: isApproved })
      .then((response) => {
        setApprovalStatus(`Request ${isApproved ? 'approved' : 'denied'} successfully.`);
        fetchRequests(); // Refresh the request list after an approval or denial
      })
      .catch((error) => {
        console.error('Error updating request:', error);
        setApprovalStatus(`Error updating request.`);
      });
  };

  useEffect(() => {
    fetchRequests(); // Fetch requests when the component mounts
  }, []);

  return (
    <div>
      <h1>Page 2</h1>
      <div>
        <h2>Requests:</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              {request.request_text}
              <button onClick={() => handleApproval(request.id, true)}>Approve</button>
              <button onClick={() => handleApproval(request.id, false)}>Deny</button>
            </li>
          ))}
        </ul>
      </div>
      <p>{approvalStatus}</p>
    </div>
  );
}

export default Page2;
