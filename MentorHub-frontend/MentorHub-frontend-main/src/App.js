import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ConfigProvider } from "antd";
import routes from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7e22ce", // matches the site's purple-600 accent
        },
      }}
    >
      <div className="mx-auto max-w-screen-3xl">
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
    <ProtectedRoute roles={route.roles}>{route.element}</ProtectedRoute>
  ) : (
    <> {route.element}</>
  );
};
export default App;
