import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { IUser } from "./models/user";
import Auth from "./pages/Auth";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ServerError from "./pages/ServerError";

interface IUserContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const UserContext = React.createContext<IUserContext>({
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  setUser: (user: any) => {},
});

function App() {
  const [user, setUser] = useState<IUser | null>(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
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
          <Route path="/404" element={<NotFound />} />
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </UserContext.Provider>
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
