import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout page="dashboard">
                <Dashboard />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/projects"
          element={
            <RequireAuth>
              <MainLayout page="projects"></MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/calendar"
          element={
            <RequireAuth>
              <MainLayout page="calendar"></MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/party"
          element={
            <RequireAuth>
              <MainLayout page="party"></MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/rewards"
          element={
            <RequireAuth>
              <MainLayout page="rewards"></MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <p>settings</p>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const logged = localStorage.getItem("token");
  if (!logged) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

export default App;
