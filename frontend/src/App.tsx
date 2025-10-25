import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModuleList from './pages/ModuleList';
import ModuleContent from './pages/ModuleContent';
import ExamList from './pages/ExamList';
import AIExercise from './pages/AIExercise';
import Workspace from './pages/Workspace';
import Leaderboard from './pages/Leaderboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="modules" element={<ModuleList />} />
          <Route path="modules/:moduleId/:sectionId" element={<ModuleContent />} />
          <Route path="exam" element={<ExamList />} />
          <Route path="ai-exercise" element={<AIExercise />} />
          <Route path="workspace/:type/:sessionId" element={<Workspace />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
