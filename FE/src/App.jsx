import { useState } from "react";
import Editor from "@monaco-editor/react";
import jaclogo from "./assets/logo.png";

const App = () => {
  const [code, setCode] = useState("with entry { \n\tprint('Welcome to Jac'); \n}");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const runCode = async () => {
    setOutput("");
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setOutput(data.output || "");
      setError(data.error || "");
    } catch {
      setError("Failed to connect to backend.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl font-semibold mb-5 flex items-center">
        <img src={jaclogo} alt="Jac Logo" className="w-8 h-8 mr-2" />
        Jac Playground
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full p-4">
        {/* Code Editor */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full md:col-span-2">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-medium">Code Editor</span>
          </div>
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{ fontSize: 18, wordWrap: "on" }}
          />
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={runCode}
          >
            Run Jac Code
          </button>
        </div>

        {/* Output */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 h-full overflow-auto md:col-span-1">
          <h3 className="text-lg font-medium text-center mb-3">Output</h3>
          <div className="bg-gray-900 p-3 rounded-lg shadow-md">
            <pre className="text-green-400 whitespace-pre-wrap break-words font-mono text-md p-2">
              {output || "No output yet..."}
            </pre>
            <pre className="text-red-400 whitespace-pre-wrap break-words font-mono text-sm p-2">
              {error}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;