import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ConfigProvider, theme as antdTheme } from "antd";
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
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#7e22ce", // matches the site's purple-600 accent
        },
      }}
    >
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
    </ConfigProvider>
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
