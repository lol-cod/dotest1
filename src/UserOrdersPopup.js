import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserOrdersPopup({ userId, onClose }) {
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    axios.get('/api/sales/userOrders', { params: { userId } })
      .then((response) => {
        setUserOrders(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user orders:', error);
      });
  }, [userId]);

  return (
    <div className="user-orders-popup">
      <h2>Orders for {userId}</h2>
      <table>
        <thead>
          <tr>
            <th>Order No</th>
            <th>Client Name</th>
            {/* Add more table headers for other order details */}
          </tr>
        </thead>
        <tbody>
          {userOrders.map((order) => (
            <tr key={order.orderNo}>
              <td>{order.orderNo}</td>
              <td>{order.clientName}</td>
              {/* Add more table cells for other order details */}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default UserOrdersPopup;
