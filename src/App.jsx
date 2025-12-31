import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import CustomGlobalStyles from './styles/GlobalStyles';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ComparisonPage from './pages/ComparisonPage';
import QueueStatusPage from './pages/QueueStatusPage';
import { ToastProvider } from './components/ui/ToastProvider';
import ReducedMotionProvider from './components/ui/ReducedMotionProvider';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CustomGlobalStyles />
      <CssBaseline />
      <Router>
        <ReducedMotionProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/article/:id" element={<ArticleDetailPage />} />
                <Route path="/compare/:id" element={<ComparisonPage />} />
                <Route path="/queue" element={<QueueStatusPage />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </ReducedMotionProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;