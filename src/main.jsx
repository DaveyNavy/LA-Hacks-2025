import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./app";
import Login from "./Login";
import Home from "./home";
import Register from "./Register";
import { Globaler, host_url } from "./global.jsx";
import { ThemeContextProvider } from './theme.jsx';

// Create your router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

// Mount the app with RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeContextProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </ThemeContextProvider>
);
