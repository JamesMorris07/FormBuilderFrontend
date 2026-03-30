import { useEffect, useState } from "react";
//TODO: display the data in table no JSON, drop garbage data
export default function DataDisplay() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/forms", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
      })
      .catch((err) => console.error("Error fetching submissions:", err));
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Form Submissions</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Form ID</th>
            <th>User ID</th>
            <th>Answers</th>
          </tr>
        </thead>

        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td>{submission._id}</td>
              <td>{submission.formId}</td>
              <td>{submission.userId}</td>
              <td>
                <pre>{JSON.stringify(submission.answers, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}