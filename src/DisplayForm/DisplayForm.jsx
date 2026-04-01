// src/DisplayForm/displayform.jsx
import { useState, useEffect } from "react";

function DisplayForm() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set the form ID you want to display
  const formId = "form_frowns_registration";

  useEffect(() => {
    fetch("http://127.0.0.1:5000/built-forms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch forms");
        return res.json();
      })
      .then((data) => {
        setForms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading form...</div>;
  if (error) return <div>Error: {error}</div>;

  // Find the specific form
  const selectedForm = forms.find((f) => f.id === formId);

  if (!selectedForm) return <div>Form not found</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {};

    selectedForm.fields.forEach((field) => {
      if (field.type === "radio") {
        const checked = e.target[field.id].value;
        formData[field.id] = checked;
      } else {
        formData[field.id] = e.target[field.id].value;
      }
    });

    console.log("Form Submitted:", formData);
    // TODO: send formData to backend via fetch("/submit-form", { ... })
  };

  return (
    <div>
      <h2>{selectedForm.title}</h2>
      <p>{selectedForm.description}</p>
      <form onSubmit={handleSubmit}>
        {selectedForm.fields.map((field) => {
          switch (field.type) {
            case "text":
            case "email":
              return (
                <div key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    required={field.required}
                  />
                </div>
              );
            case "number":
              return (
                <div key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    type="number"
                    id={field.id}
                    name={field.id}
                    min={field.validation?.min}
                    max={field.validation?.max}
                    required={field.required}
                  />
                </div>
              );
            case "date":
              return (
                <div key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <input
                    type="date"
                    id={field.id}
                    name={field.id}
                    required={field.required}
                  />
                </div>
              );
            case "textarea":
              return (
                <div key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <textarea
                    id={field.id}
                    name={field.id}
                    required={field.required}
                  />
                </div>
              );
            case "select":
              return (
                <div key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  <select
                    id={field.id}
                    name={field.id}
                    required={field.required}
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            case "radio":
              return (
                <div key={field.id}>
                  <label>{field.label}</label>
                  {field.options.map((opt) => (
                    <label key={opt.value}>
                      <input
                        type="radio"
                        name={field.id}
                        value={opt.value}
                        required={field.required}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DisplayForm;