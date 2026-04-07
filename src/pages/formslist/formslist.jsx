import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function FormsList({ setLoggedIn }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userOrg, setUserOrg] = useState(null);
  const navigate = useNavigate();
  const { orgName } = useParams();

  function handleLogout() {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => setLoggedIn(false));
  }

  function handleCreateForm() {
    // eventually this needs to navigate to a form builder page
    // dummy button for now
    alert("Create Form clicked! This will navigate to the form builder in the future.");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        // 🔐 Get real org from backend
        const authRes = await fetch("http://localhost:5000/check-auth", {
          credentials: "include",
        });

        const authData = await authRes.json();
        const realOrg = authData.organization;
        setUserOrg(realOrg);

        // Fix URL if someone typed wrong org
        if (orgName !== realOrg) {
          navigate(`/${realOrg}`, { replace: true });
          return;
        }

        // Fetch forms
        const res = await fetch("http://localhost:5000/built-forms-list", {
          credentials: "include",
        });

        const data = await res.json();
        setForms(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orgName]);

  if (loading) return <div>Loading forms...</div>;
  if (forms.length === 0) return <div>No forms found</div>;

  return (
    <div style={{ textAlign: "left" }}>
      <button onClick={handleLogout}>Logout</button>
      <br></br>
      <br></br>
      <button onClick={handleCreateForm}>Create New Form</button>
      <h2>{userOrg} Forms</h2>

      {forms.map((form) => (
        <div
          key={form.id}
          onClick={() => navigate(`/${userOrg}/${form.id}`)}
          style={{ cursor: "pointer", margin: "10px 0", color: "lightblue" }}
        >
          {form.title}
        </div>
      ))}
    </div>
  );
}