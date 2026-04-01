import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

import LoginForm from './login/login.jsx';
import RegisterForm from './register/register.jsx';
import DataDisplay from "./datadisplay/datadisplay.jsx";
import DefaultForm from "./Forms/DefaultForm.jsx";
import DisplayForm from "./DisplayForm/DisplayForm.jsx";
import FormsList from "./pages/formslist/formslist.jsx";
import FormDataPage from "./pages/formdatapage/formdatapage.jsx";

function App() {
  const [authView, setAuthView] = useState("login");
  const [loggedIn, setLoggedIn] = useState(null);
  const [userOrg, setUserOrg] = useState(null); // <- store user's organization

  // Check authentication and get organization
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:5000/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setLoggedIn(true);
          setUserOrg(data.organization); // <- set org from backend
        } else {
          setLoggedIn(false);
        }
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
            loggedIn && userOrg ? (
              <Navigate to={`/${userOrg}`} />
            ) : (
              <div className="app-wrapper">
                <h1>Intake Form MVP</h1>

                {authView === "login" ? (
                  <LoginForm
                    setAuthView={setAuthView}
                    setLoggedIn={setLoggedIn}
                    setUserOrg={setUserOrg} // <- pass setter to LoginForm
                  />
                ) : (
                  <RegisterForm setAuthView={setAuthView} />
                )}
              </div>
            )
          }
        />

        {/* ORG FORMS LIST */}
        <Route
          path="/:orgName"
          element={
            loggedIn ? <FormsList setLoggedIn={setLoggedIn} /> : <Navigate to="/" />
          }
        />

        {/* DEV FORM */}
        <Route path="/dev-form" element={<DefaultForm />} />
        <Route path="/display-form" element={<DisplayForm />} />

        {/* INDIVIDUAL FORM DATA PAGE */}
        <Route
          path="/:orgName/:formId"
          element={
            loggedIn ? <FormDataPage setLoggedIn={setLoggedIn} /> : <Navigate to="/" />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;