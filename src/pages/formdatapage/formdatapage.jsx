import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

export default function FormDataPage({ setLoggedIn }) {
  const { formId, orgName } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState("");
  const [userOrg, setUserOrg] = useState(null);

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
            navigate(`/${realOrg}/${formId}`, { replace: true });
            return;
        }

        // 📥 Fetch submissions
        const res = await fetch("http://localhost:5000/forms", {
            credentials: "include",
        });

        const data = await res.json();
        const filtered = data.filter(f => f.formId === formId);

        const allKeys = [];
        filtered.forEach(submission => {
            Object.keys(submission.responses || {}).forEach(key => {
            if (!allKeys.includes(key)) allKeys.push(key);
            });
        });

        const cols = allKeys.map(key => ({
            field: key,
            headerName: key,
            width: 150,
            editable: true,
        }));
        setColumns(cols);

        const rows = filtered.map(s => {
            const row = { id: s._id };
            Object.keys(s.responses || {}).forEach(key => {
            row[key] = s.responses[key];
            });
            return row;
        });
        setRows(rows);

        // get form title
        const formsRes = await fetch("http://localhost:5000/built-forms", {
            credentials: "include",
        });
        const formsData = await formsRes.json();
        const match = formsData.find(f => f.id === formId);
        if (match) setTitle(match.title);

        } catch (err) {
        console.error(err);
        }
    }

    fetchData();
    }, [formId, orgName, navigate]);

  return (
    <div>
      <button onClick={() => navigate(`/${userOrg || ""}`)}>← Back</button>
      <button onClick={handleLogout}>Logout</button>

      <h2>{title || formId}</h2>

      <div style={{ height: 500 }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
}