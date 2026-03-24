import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function DataDisplay({ setLoggedIn }) {
  const [submissions, setSubmissions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  function handleLogout() {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => setLoggedIn(false));
  }

  useEffect(() => {
    fetch("http://localhost:5000/forms", { method: "GET", credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("ERROR RESPONSE:", text);
          throw new Error("Request failed");
        }
        return res.json();
      })
      .then((data) => {
        setSubmissions(data);

        // 1️⃣ Dynamically generate columns from all keys in all answers
        const allKeys = [];
        data.forEach((submission) => {
          Object.keys(submission.answers || {}).forEach((key) => {
            if (!allKeys.includes(key)) allKeys.push(key); // preserve first-seen order
          });
        });

        const generatedColumns = [
          { field: "id", headerName: "ID", width: 220 },
          { field: "formId", headerName: "Form ID", width: 150 },
          ...allKeys.map((key) => ({
            field: key,
            headerName: key,
            width: 150,
          })),
        ];
        setColumns(generatedColumns);

        // 2️⃣ Generate rows with answers mapped to the dynamic columns
        const generatedRows = data.map((s) => {
          const row = {
            id: s._id,
            formId: s.formId,
          };
          Object.keys(s.answers || {}).forEach((key) => {
            row[key] = s.answers[key] || "";
          });
          return row;
        });
        setRows(generatedRows);
      })
      .catch((err) => console.error("Error fetching submissions:", err));
  }, []);

  return (
    <div style={{ 
      // padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1>Form Submissions</h1>

      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div style={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
          />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}