import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation();
  const logged = localStorage.getItem("username");
  if (!logged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default App;
