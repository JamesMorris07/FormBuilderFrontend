import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import LoginForm from './login/login.jsx';
import RegisterForm from './register/register.jsx';
import DataDisplay from "./datadisplay/datadisplay.jsx";
import DefaultForm from "./Forms/DefaultForm.jsx";

function App() {
  const [authView, setAuthView] = useState("login");
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:5000/check-auth", {
          method: "GET",
          credentials: "include",
        });

        setLoggedIn(res.ok);
      } catch {
        setLoggedIn(false);
      }
    }

    checkAuth();
  }, []);

  if (loggedIn === null) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/data" />
            ) : (
              <div className="app-wrapper">
                <h1>Intake Form MVP</h1>

                {authView === "login" ? (
                  <LoginForm
                    setAuthView={setAuthView}
                    setLoggedIn={setLoggedIn}
                  />
                ) : (
                  <RegisterForm setAuthView={setAuthView} />
                )}
              </div>
            )
          }
        />

        {/* PROTECTED ROUTE */}
        <Route
          path="/data"
          element={
            loggedIn ? (
              <DataDisplay setLoggedIn={setLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/dev-form" element={<DefaultForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;