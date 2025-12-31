import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ComparisionPage from './pages/ComparisionPage';
import QueueStatusPage from './pages/QueueStatusPage';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ToastProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:id" element={<ArticleDetailPage />} />
              <Route path="/compare/:id" element={<ComparisionPage />} />
              <Route path="/queue" element={<QueueStatusPage />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;