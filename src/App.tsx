import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { IMessage } from "./models/message";
import Auth from "./pages/Auth";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Party from "./pages/Party";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/Projects/ProjectPage";
import QuestProfile from "./pages/QuestProfile";
import Rewards from "./pages/Rewards";
import ServerError from "./pages/ServerError";
import Settings from "./pages/Settings";
import { socket, useChat } from "./utils/chatContext";
import { messagesStorage } from "./utils/socket";

function App() {
  const { state: messages, stateSetter: setMessages } = useChat([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const events = useMemo(
    () => [
      {
        name: "connection",
        callback: () => {
          console.log("[connection]");
          setIsConnected(true);
        },
      },
      {
        name: "disconnect",
        callback: () => {
          console.log("[disconnect]");
          setIsConnected(false);
          setIsAuthenticated(false);
          socket.off();
        },
      },
      {
        name: "authenticated",
        callback: () => {
          console.log("[authenticated]");
          setIsAuthenticated(true);
        },
      },
      {
        name: "auth denied",
        callback: () => {
          console.log("[auth denied]");
          setIsAuthenticated(false);
        },
      },
      {
        name: "messages history",
        callback: (data: IMessage[]) => {
          console.log("[messages history]");
          console.log("  - history messages:", data.length);
          for (const m of data) {
            m.date = new Date(m.date);
          }
          messagesStorage.splice(0, messagesStorage.length);
          messagesStorage.push(...data);
          setMessages(data);
        },
      },
      {
        name: "message",
        callback: (data: IMessage) => {
          console.log("<= message");
          data.date = new Date(data.date);
          const newMessages = [...(messages ?? []), data];
          console.log(`  - current messages: ${messages?.length}`);
          console.log(`  - new messages: ${newMessages.length}`);
          console.log(`    - ${data}`);
          messagesStorage.splice(0, messagesStorage.length);
          messagesStorage.push(...newMessages);
          setMessages(newMessages);
        },
      },
    ],
    [messages, setMessages]
  );

  useEffect(() => {
    for (const event of events) {
      if (socket && !socket.hasListeners(event.name)) {
        console.log("set listen to:", event.name);
        socket.on(event.name, event.callback);
      }
    }
  }, [events]);

  useEffect(() => {
    console.log("socket status", socket?.connected ?? "down");
    setIsConnected(socket.connected);
    return () => {
      console.log("[socket status] closing");
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {
    console.log("[socket status] ", isConnected, isAuthenticated);
    if (!isAuthenticated) {
      console.log("=> try to auth");
      socket.emit("authenticate", {
        token: localStorage.getItem("token")!,
        tokenSelector: localStorage.getItem("tokenSelector")!,
      });
    }
    return () => {
      console.log("[socket status] do not disconnec!");
    };
  }, [isConnected, isAuthenticated]);

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
                  <Party />
                </MainLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/rewards"
            element={
              <RequireAuth>
                <MainLayout page="rewards">
                  <Rewards />
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
