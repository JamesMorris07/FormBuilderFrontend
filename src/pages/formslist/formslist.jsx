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

        // 🚨 Fix URL if someone typed wrong org
        if (orgName !== realOrg) {
          navigate(`/${realOrg}`, { replace: true });
          return;
        }

        // 📥 Fetch forms
        const res = await fetch("http://localhost:5000/built-forms", {
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
      <h2>{userOrg} Forms</h2>

      {forms.map((form) => (
        <div
          key={form.id}
          onClick={() => navigate(`/${userOrg}/${form.id}`)}
          style={{ cursor: "pointer", margin: "10px 0", color: "blue" }}
        >
          {form.title}
        </div>
      ))}
    </div>
  );
}