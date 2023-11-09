import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Page1() {
  const [request, setRequest] = useState('');
  const [approvalMessage, setApprovalMessage] = useState('');
  const [approvedRequests, setApprovedRequests] = useState([]);

  const sendRequest = () => {
    axios
      .post('/api/requests', { request_text: request })
      .then((response) => {
        setApprovalMessage('Request sent successfully');
        // Refresh the approved requests list when a new request is sent
        fetchApprovedRequests();
      })
      .catch((error) => {
        console.error('Error sending request:', error);
        setApprovalMessage('Error sending request');
      });
  };

  // Function to fetch approved requests
  const fetchApprovedRequests = () => {
    axios
      .get('/api/approved-requests')
      .then((response) => {
        setApprovedRequests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching approved requests:', error);
      });
  };

  useEffect(() => {
    // Fetch approved requests when the component mounts
    fetchApprovedRequests();
  }, []);

  return (
    <div>
      <h1>Page 1</h1>
      <input
        type="text"
        placeholder="Enter request"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
      />
      <button onClick={sendRequest}>Send Request</button>
      <p>{approvalMessage}</p>

      <h2>Approved Requests:</h2>
      <ul>
        {approvedRequests.map((approvedRequest, index) => (
          <li key={index}>{approvedRequest.request_text}</li>
        ))}
      </ul>
    </div>
  );
}

export default Page1;
