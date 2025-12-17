import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import FrameworkPage from './pages/FrameworkPage';
import LandingPage from './pages/LandingPage';
import NavBar from './components/NavBar';
import ModulePage from './pages/ModulePage';
import docs from './data';
import EditorDashboard from './admin/EditorDashboard';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ReviewQueuePage from './pages/ReviewQueuePage';




const theme = createTheme({
  palette: {
    primary: {
      main: '#321B2D',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFF0EB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#321B2D',
      secondary: '#321B2D',
    },
    secondary: {
      main: '#FFF0EB',
      contrastText: '#321B2D',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#321B2D',
          color: '#FFF0EB',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {Object.keys(docs).map(framework => (
              <Route
                key={framework}
                path={`/${framework}`}
                element={<FrameworkPage framework={framework} />}
              />
            ))}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredGroups={['admin']}>
                <EditorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/review" element={
              <ProtectedRoute requiredGroups={['admin']}>
                <ReviewQueuePage />
              </ProtectedRoute>
            } />
            <Route path=":framework/module/:moduleIdx/submodule/:submoduleIdx" element={<ModulePage />} />
            <Route path=":framework/module/:moduleIdx" element={<ModulePage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App; 