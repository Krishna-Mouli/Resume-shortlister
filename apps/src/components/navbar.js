import React from 'react';
import resume from '../assets/images/resume.svg';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#000', color: '#fff' }}>
      <Toolbar>
        <div style={{ marginLeft: '30px', display: 'flex', alignItems: 'center' }}>
          <img
            src={resume}
            alt="resume"
            style={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          <Typography
            sx={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '20px' }}
            variant="h6"
            noWrap
          >
          Resume Analyzer
          </Typography>
        </div>
        <Box sx={{ display: 'flex', marginLeft: 'auto', marginRight: '30px' }}>
          <Typography
            variant="body1"
            sx={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#f0f0f0' } }}
          >
            <NavLink to="/process/view" style={{ color: 'inherit', textDecoration: 'none' }}>
              View Resume
            </NavLink>
          </Typography>

          <Typography
            variant="body1"
            sx={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#f0f0f0' } }}
          >
            <NavLink to="/process/details" style={{ color: 'inherit', textDecoration: 'none' }}>
              Extracted Details
            </NavLink>
          </Typography>

          <Typography
            variant="body1"
            sx={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#f0f0f0' } }}
          >
            <NavLink to="/process/chat" style={{ color: 'inherit', textDecoration: 'none' }}>
              Chat with Resume
            </NavLink>
          </Typography>

          <Typography
            variant="body1"
            sx={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#f0f0f0' } }}
          >
            <NavLink to="/process/questionnaire" style={{ color: 'inherit', textDecoration: 'none' }}>
              Questionnaire
            </NavLink>
          </Typography>

          <Typography
            variant="body1"
            sx={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#f0f0f0' } }}
          >
            <NavLink to="/process/info" style={{ color: 'inherit', textDecoration: 'none' }}>
              Info
            </NavLink>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
