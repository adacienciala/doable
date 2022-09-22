import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/Auth";
import Calendar from "./pages/Calendar";
import Challenges from "./pages/Challenges";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Party from "./pages/Party";
import NoParty from "./pages/Party/NoParty";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/Projects/ProjectPage";
import QuestProfile from "./pages/QuestProfile";
import ServerError from "./pages/ServerError";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
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
                <MainLayout page="projects">
                  <Projects />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <RequireAuth>
                <MainLayout page="projects" noTour={true}>
                  <ProjectPage />
                  {/* <p>asd</p> */}
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/calendar"
            element={
              <RequireAuth>
                <MainLayout page="calendar">
                  <Calendar />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/party"
            element={
              <RequireAuth>
                <MainLayout page="party">
                  <NoParty />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/party/:partyId"
            element={
              <RequireAuth>
                <MainLayout page="party">
                  <Party />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/challenges"
            element={
              <RequireAuth>
                <MainLayout page="challenges">
                  <Challenges />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <RequireAuth>
                <MainLayout page="questProfile">
                  <QuestProfile />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <MainLayout page="settings">
                  <Settings />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </>
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
