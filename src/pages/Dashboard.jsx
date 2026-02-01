import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Tabs, Tab, IconButton, Typography, Container, Button } from '@mui/material';
import { LogOut, Calendar, Box as BoxIcon, Plus } from 'lucide-react';
import JobsTab from './JobsTab.jsx';
import InventoryTab from './InventoryTab.jsx';
import { equipmentService, jobService } from '../services/firebase';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = async () => {
    try {
      await onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getTabIcon = (index) => {
    switch (index) {
      case 0:
        return <Calendar size={20} />;
      case 1:
        return <BoxIcon size={20} />;
      default:
        return null;
    }
  };

  return (
    <Box className="dashboard-container">
      <AppBar position="fixed" className="dashboard-appbar">
        <Toolbar className="dashboard-toolbar">
          <Box className="brand-section">
            <Typography variant="h6" className="brand-name">
              JuniorKits
            </Typography>
            <Typography variant="caption" className="brand-tagline">
              Equipment Management System
            </Typography>
          </Box>
          
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className="dashboard-tabs"
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab 
              label="Jobs" 
              icon={getTabIcon(0)} 
              iconPosition="start"
              className="dashboard-tab"
            />
            <Tab 
              label="Inventory" 
              icon={getTabIcon(1)} 
              iconPosition="start"
              className="dashboard-tab"
            />
          </Tabs>

          <Box className="user-section">
            <Typography variant="body2" className="user-info">
              Admin User
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              className="logout-button"
              aria-label="Logout"
            >
              <LogOut size={20} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box className="dashboard-content">
        <Container maxWidth="xl" className="dashboard-container-inner">
          {tabValue === 0 && <JobsTab />}
          {tabValue === 1 && <InventoryTab />}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;