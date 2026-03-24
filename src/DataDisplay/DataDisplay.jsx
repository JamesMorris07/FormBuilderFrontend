import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function DataDisplay({ setLoggedIn }) {
  const [submissions, setSubmissions] = useState([]);

  function handleLogout() {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setLoggedIn(false);
    });
  }

  useEffect(() => {
    fetch("http://localhost:5000/forms", {
      method: "GET",
      credentials: "include"
    })
      .then(async (res) => {
        console.log("STATUS:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("ERROR RESPONSE:", text);
          throw new Error("Request failed");
        }

        return res.json();
      })
      .then((data) => {
        console.log("FORMS DATA:", data);
        setSubmissions(data);
      })
      .catch((err) => {
        console.error("Error fetching submissions:", err);
      });
  }, []);

  const rows = submissions.map((s) => ({
    id: s._id,
    formId: s.formId,
    answers: JSON.stringify(s.answers),
  }));

  const columns = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "formId", headerName: "Form ID", width: 150 },
    { field: "answers", headerName: "Answers", width: 400 },
  ];

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={handleLogout}>Logout</button>

      <h1>Form Submissions</h1>

      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </div>
    </div>
  );
}