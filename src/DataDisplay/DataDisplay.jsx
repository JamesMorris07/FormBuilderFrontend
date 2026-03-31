import { useEffect, useState } from "react";
import {
  DataGrid,
  GridRowModes,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function DataDisplay({ setLoggedIn }) {
  const [submissions, setSubmissions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [selectedRowId, setSelectedRowId] = useState(null);

  function handleLogout() {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => setLoggedIn(false));
  }

  const isEditing = selectedRowId !== null && rowModesModel[selectedRowId]?.mode === GridRowModes.Edit;

  const handleEditClick = () => {
    if (!selectedRowId) return;
    setRowModesModel((prev) => ({
      ...prev,
      [selectedRowId]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = () => {
    if (!selectedRowId) return;
    setRowModesModel((prev) => ({
      ...prev,
      [selectedRowId]: { mode: GridRowModes.View },
    }));
    setSelectedRowId(null);
  };

  const handleCancelClick = () => {
    if (!selectedRowId) return;
    setRowModesModel((prev) => ({
      ...prev,
      [selectedRowId]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    setSelectedRowId(null);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

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

        const allKeys = [];
        data.forEach((submission) => {
          Object.keys(submission.answers || {}).forEach((key) => {
            if (!allKeys.includes(key)) allKeys.push(key);
          });
        });

        const generatedColumns = [
          { field: "id", headerName: "ID", width: 220, editable: false },
          { field: "formId", headerName: "Form ID", width: 150, editable: false },
          ...allKeys.map((key) => ({
            field: key,
            headerName: key,
            width: 150,
            editable: true,
          })),
        ];

        setColumns(generatedColumns);

        const generatedRows = data.map((s) => {
          const row = { id: s._id, formId: s.formId };
          Object.keys(s.answers || {}).forEach((key) => {
            row[key] = s.answers[key] || "";
          });
          return row;
        });

        setRows(generatedRows);
      })
      .catch((err) => console.error("Error fetching submissions:", err));
  }, []);

  const processRowUpdate = async (updatedRow, originalRow) => {
    const { id, formId, ...answerFields } = updatedRow;
    try {
      const res = await fetch(`http://localhost:5000/forms/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, answers: answerFields }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Update failed:", text);
        return originalRow;
      }
      return updatedRow;
    } catch (err) {
      console.error("Error updating row:", err);
      return originalRow;
    }
  };

  const handleProcessRowUpdateError = (err) => {
    console.error("Row update error:", err);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Form Submissions</h1>
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 4 }}>
          {!selectedRowId && (
            <span style={{ fontSize: 13, color: "#888", marginRight: 8 }}>Select a row to edit</span>
          )}
          {selectedRowId && !isEditing && (
            <Tooltip title="Edit selected row">
              <IconButton onClick={handleEditClick} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {isEditing && (
            <>
              <Tooltip title="Save">
                <IconButton onClick={handleSaveClick} color="success">
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton onClick={handleCancelClick} color="error">
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <div style={{ height: 500 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={setRowModesModel}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            onRowSelectionModelChange={(selection) => {
              const id = selection.ids ? [...selection.ids][0] ?? null : selection[0] ?? null;
              setSelectedRowId(id);
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}