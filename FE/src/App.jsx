import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import jaclogo from "./assets/logo.png";
import { registerJacSuggestions } from "./jacSuggestions";

const App = () => {
  const [code, setCode] = useState("with entry { \n\tprint('Welcome to Jac'); \n}");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState([]);
  const [inputMode, setInputMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputVars, setInputVars] = useState([]);
  const [pyodide, setPyodide] = useState(null);


  const handleEditorDidMount = (editor, monaco) => {
    registerJacSuggestions(monaco); // Register Jac Suggestions
  };

  useEffect(() => {
    // Extract input variable names from the code
    const inputRegex = /(\w+)\s*(?::\s*(int|float|str)\s*)?(\s*=\s*(int|float|str)?\s*\(?input\(\)\)?)/g;
    let matches;
    const vars = [];
    while ((matches = inputRegex.exec(code)) !== null) {
      const inputVar = matches[1].trim();
      if (inputVar && !vars.includes(inputVar)) {
        vars.push(inputVar);
      }
    }

    setInputVars(vars.map((varName) => ({ name: varName, value: "", type: "str" })));
  }, [code]);


  // Run event Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const runCode = async () => {
    setOutput("");
    setError("");
    setLoading(true);

    if (code.includes("input(")) {
      setInputMode(true);
      setLoading(false);
      return;
    }
    await executeCode(inputs);
  };


  useEffect(() => {
    const loadPyodideAndJacLang = async () => {
      setLoading(true);
      try {
        const pyodideInstance = await loadPyodide();
        await pyodideInstance.loadPackage('micropip');
        await pyodideInstance.runPythonAsync(`
                import micropip
                await micropip.install("jaclang==0.7.0")
            `);

        // Check if JacLang is installed
        await pyodideInstance.runPythonAsync(`
                import jaclang
                print("JacLang is available!")
            `);

        setPyodide(pyodideInstance);
      } catch (error) {
        console.error('Error loading Pyodide or JacLang:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!pyodide) {
      loadPyodideAndJacLang();      
    }
  }, []);


  // Function to handle running JacLang code
  const runJacCode = async () => {
    if (!pyodide) return;

    setOutput('');

    try {
      const result = await pyodide.runPythonAsync(`
from jaclang.cli.cli import run
import sys
from io import StringIO

# Capture both stdout and stderr
captured_output = StringIO()
sys.stdout = captured_output
sys.stderr = captured_output

jac_code = '''${code}'''

# Create a temporary file using the input code and run it directly
with open("/tmp/temp.jac", "w") as f:
    f.write(jac_code)
run("/tmp/temp.jac")

# Get the captured output
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
captured_output.getvalue()
`);
      setOutput(result || "No output");
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white p-4">
      <h2 className="text-3xl font-semibold mb-2 flex items-center">
        <img src={jaclogo} alt="Jac Logo" className="w-8 h-8 mr-2" />
        Jac Playground
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full h-full p-4">
        {/* Code Editor */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col h-full md:col-span-2">
          <span className="text-lg font-medium">Code Editor</span>
          <Editor
            height="100%"
            defaultLanguage="jac"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{ fontSize: 18, wordWrap: "on" }}
            onMount={handleEditorDidMount}
          />
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
            onClick={runJacCode}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run Jac Code'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 ml-2"  // Add ml-2 for spacing between text and icon
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={!loading ? "M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" : "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"}
              />
            </svg>
          </button>
        </div>

        {/* Output */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-4 h-full overflow-auto md:col-span-1">
          <h3 className="text-lg font-medium text-center mb-3">Output</h3>
          <div className="bg-gray-900 p-3 rounded-lg shadow-md">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-12 h-12 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {!error && (
                  <pre className="text-green-400 whitespace-pre-wrap break-words font-mono text-md p-2">
                    {output || "No output yet..."}
                  </pre>
                )}
                <pre className="text-red-400 whitespace-pre-wrap break-words font-mono text-sm p-2">
                  {error}
                </pre>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Input Mode Popup */}
      {inputMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-md z-50">
          <div className="bg-[#1e1e1e] text-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-center">Enter Inputs</h3>

            {inputVars.map((inputVar, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center space-x-3">
                  {/* Dropdown for selecting input type */}
                  <select
                    className="p-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => {
                      const updatedInputVars = [...inputVars];
                      updatedInputVars[index].type = e.target.value; // Update type for the specific input
                      setInputVars(updatedInputVars);
                    }}
                    value={inputVar.type}
                  >
                    <option value="str">Str</option>
                    <option value="int">Int</option>
                    <option value="float">Float</option>
                  </select>

                  {/* Text input field */}
                  <input
                    type={inputVar.type}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder={`Enter the value of ${inputVar.name}`}
                    value={inputVar.value}
                    onChange={(e) => {
                      const updatedInputVars = [...inputVars];
                      updatedInputVars[index].value = e.target.value; // Update value for the specific input
                      setInputVars(updatedInputVars);
                    }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              {/* Cancel Button */}
              <button
                className="w-1/3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                onClick={() => setInputMode(false)}
              >
                Close
              </button>

              {/* Run Button */}
              <button
                className="w-2/3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition ml-4"
                onClick={() => {
                  const formattedInputs = inputVars.map(input => `${input.value}:${input.type}`);
                  setInputs(formattedInputs); // Set the inputs to be used when executing the code
                  executeCode(formattedInputs); // Run code with all inputs
                }}
              >
                Run Code
              </button>
            </div>


          </div>
        </div>
      )}

    </div>
  );
};

export default App;
