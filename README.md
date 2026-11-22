# Mindful Signal frontend

React frontend for the FastAPI mental-health score model.

## Run locally

1. Start the backend from this folder:

   ```powershell
   uvicorn main:app --reload
   ```

2. In another terminal, install frontend dependencies and start Vite:

   ```powershell
   npm.cmd install
   npm.cmd run dev
   ```

The UI sends the form data to `http://localhost:8000/predict`. To use a
different backend address, set `VITE_API_URL` to the backend base URL before
starting Vite (for example, `http://127.0.0.1:8000`).
# Mental-Health-Score
# Mental-Health-Score
# Mental-Health-Score
