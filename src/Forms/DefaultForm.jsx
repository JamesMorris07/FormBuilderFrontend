import { useState } from "react";

export default function FormComponent() {
  const questions = [
    "What is your name?",
    "What is your email?",
    "What is your major?",
    "What year are you in school?",
    "What is your favorite programming language?",
    "What is your career goal?",
    "What tools do you use most?",
    "What is your biggest challenge in coding?",
    "What project are you most proud of?",
    "Any additional comments?"
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      formId: "default-survey",
      answers: answers
    };

    const res = await fetch("http://127.0.0.1:5000/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Server response:", data);

  } catch (err) {
    console.error("Submission failed:", err);
  }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>default form</h1>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <label>
              <strong>{question}</strong>
            </label>
            <br />

            <input
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px"
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
//chatgpt did the initial styling, will need to be redone once we have the actual form questions and structure finalized.