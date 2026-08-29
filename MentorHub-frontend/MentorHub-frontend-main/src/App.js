import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import routes from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";
import useThemeStore from "./store/theme";

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="mx-auto max-w-screen-3xl dark:bg-gray-950">
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<RouteElement route={route} />}
            ></Route>
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const RouteElement = ({ route }) => {
  return route.isProtected ? (
    <ProtectedRoute>{route.element}</ProtectedRoute>
  ) : (
    <> {route.element}</>
  );
};
export default App;
