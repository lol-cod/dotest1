import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Import LockOutlinedIcon
import Clock from './clock';
import logo from './logo.jpg';



const theme = createTheme();


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh', // Center vertically
  },
  avatar: {
    backgroundColor: 'primary',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(2), // Add some spacing between logo and the form
  },
  clock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};


function LoginPage() {
  const [employeeID, setEmployeeID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Add state for the role
  const [error, setError] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate(); 
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    try {
      // Simulate user data with roles
      const users = [
        { employeeID: 'Rohit', password: 'MEDI0001', role: 'sales' },
        { employeeID: 'Rajni', password: 'MEDI0002', role: 'sales' },
        { employeeID: 'Ali', password: 'MEDI0003', role: 'sales' },
        { employeeID: 'Athar', password: 'MEDI0004', role: 'sales' },
        { employeeID: 'Pankaj', password: 'MEDI0005', role: 'sales' },
        { employeeID: 'Faiz', password: 'FIN0001', role: 'finance' },
        { employeeID: 'Himanshu', password: 'FIN0002', role: 'finance' },
        { employeeID: 'Suraj', password: 'FIN0003', role: 'finance' },
        { employeeID: 'Saurav', password: 'DIS0001', role: 'dispatch' },
        { employeeID: 'dispatch', password: 'dispatch', role: 'dispatch' },
        { employeeID: 'admin', password: 'admin', role: 'admin'},
        { employeeID: 'finance', password: 'finance', role: 'finance'},
        { employeeID: 'sales', password: 'sales', role: 'sales'},
        { employeeID: 'test', password: 'test', role: 'test'}
        // Add more users with roles as needed 
      ];

      const user = users.find((u) => u.employeeID === employeeID && u.password === password);
      

      if (user) {
        setError('');
        setIsLogged(true);

        // Determine where to navigate based on the user's role
        if (user.role === 'sales') {
          setRole('sales');
          navigate('/sales', { state: { userId: user.employeeID } });
        } else if (user.role === 'finance') {
          setRole('finance');
          navigate('/finance', { state: { userId: user.employeeID } });
        } else if (user.role === 'dispatch'){
          setRole('dispatch');
          navigate('/dispatch', { state: { userId: user.employeeID } })
        } else if (user.role === 'admin'){
          setRole('admin');
          navigate('/admin', { state: { userId: user.employeeID } })
        } else if (user.role === 'test'){
          setRole('test');
          navigate('/mobiledispatch', { state: { userId: user.employeeID } })
        }
      } 
      else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }

    
  

  };



  return (
    <div className="login-container">
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={styles.container}>
            <div style={styles.logo}>
              <img src={logo} alt="Logo" />
            </div>
            <div style={styles.clock}>
              <Clock />
            </div>
            <Avatar style={styles.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <form style={{ width: '100%', marginTop: theme.spacing(1) }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="employeeID"
                label="Employee ID"
                name="employeeID"
                autoComplete="employeeID"
                autoFocus
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress} // Trigger login on Enter key press
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleLogin}
              >
                Sign In
              </Button>
              {error && (
                <Typography variant="body2" color="error" align="center">
                  {error}
                </Typography>
              )}
              {isLogged && (
                <Typography variant="body2" color="primary" align="center">
                  Login successful!
                </Typography>
              )}
            </form>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}


export default LoginPage;
