import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon
import Button from '@mui/material/Button'; // Import the Button component

function Sidebar({ onFetchUserOrders }) {
  const [isSideDrawerOpen, setSideDrawerOpen] = useState(false);

  const toggleSideDrawer = () => {
    setSideDrawerOpen(!isSideDrawerOpen);
  };

  return (
    <div className="sidebar">
      <IconButton
        onClick={toggleSideDrawer}
        edge="start"
        color="inherit"
        aria-label="open drawer"
      >
        <MenuIcon /> {/* Use the Menu icon as the toggle button */}
      </IconButton>

      <Drawer
        anchor="left"
        open={isSideDrawerOpen}
        onClose={toggleSideDrawer}
      >
        <div className="side-drawer">
          <Button onClick={onFetchUserOrders}>Fetch My Orders</Button>
        </div>
      </Drawer>

      {/* ... (other sidebar content) */}
    </div>
  );
}

export default Sidebar;
