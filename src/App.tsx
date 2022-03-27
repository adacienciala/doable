import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
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
  const logged = localStorage.getItem("token");
  if (!logged) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}

export default App;
