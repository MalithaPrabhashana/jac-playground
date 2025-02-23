import subprocess
import os
import uuid
import re
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class InputData(BaseModel):
    value: str
    type: str


class JacCode(BaseModel):
    code: str
    inputs: list[InputData]


def convert_input(input_data: InputData):
    """Convert input value to the appropriate type."""
    if input_data.type == "int":
        return int(input_data.value)
    elif input_data.type == "float":
        return float(input_data.value)
    elif input_data.type == "str":
        return f'"{input_data.value}"'
    else:
        raise ValueError(f"Unsupported input type: {input_data.type}")


def substitute_inputs(code: str, inputs: list[InputData]) -> str:
    """Replace input() calls with provided values sequentially."""
    input_iter = iter(inputs)

    def replacer(match):
        input_data = next(input_iter)
        return str(convert_input(input_data))

    input_pattern = r"input\s*\(\s*\)"
    return re.sub(input_pattern, replacer, code, count=len(inputs))


@app.post("/run")
def run_jac_code(jac: JacCode):
    try:
        # Substitute inputs in code
        processed_code = substitute_inputs(jac.code, jac.inputs)

        filename = f"/temp_{uuid.uuid4().hex}.jac"
        with open(filename, "w") as f:
            f.write(processed_code)

        process = subprocess.run(
            ["jac", "run", filename],
            capture_output=True,
            text=True
        )

        output = process.stdout
        error = process.stderr

        os.remove(filename)
        subprocess.run(["jac", "clean"])
        return {"output": output, "error": error}

    except Exception as e:
        return {"error": str(e)}



@app.get("/debug")
def check_installed_packages():
    import sys
    import subprocess

    try:
        result = subprocess.run([sys.executable, "-m", "pip", "list"], capture_output=True, text=True)
        return {"installed_packages": result.stdout}
    except Exception as e:
        return {"error": str(e)}
