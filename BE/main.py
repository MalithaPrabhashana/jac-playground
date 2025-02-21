import subprocess
import os
import uuid
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

class JacCode(BaseModel):
    code: str

@app.post("/run")
def run_jac_code(jac: JacCode):
    try:
        filename = f"temp_{uuid.uuid4().hex}.jac"

        with open(filename, "w") as f:
            f.write(jac.code)

        process = subprocess.run(
            ["jac", "run", filename], capture_output=True, text=True
        )

        output = process.stdout
        error = process.stderr

        os.remove(filename)
        return {"output": output, "error": error}

    except Exception as e:
        return {"error": str(e)}