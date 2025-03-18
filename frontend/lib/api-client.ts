// API client for interacting with the FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Dataset functions
export async function uploadDataset(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/datasets/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload dataset: ${response.statusText}`)
  }

  return await response.json()
}

export async function getDatasets() {
  const response = await fetch(`${API_BASE_URL}/datasets`)

  if (!response.ok) {
    throw new Error(`Failed to fetch datasets: ${response.statusText}`)
  }

  return await response.json()
}

export async function deleteDataset(filename: string) {
  const response = await fetch(`${API_BASE_URL}/datasets/${filename}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete dataset: ${response.statusText}`);
  }
  
  return await response.json();
}

// Database connection functions
export async function createConnection(connection: {
  name: string
  host: string
  port: number
  database: string
  username: string
  password: string
}) {
  const response = await fetch(`${API_BASE_URL}/connections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(connection),
  })

  if (!response.ok) {
    throw new Error(`Failed to create connection: ${response.statusText}`)
  }

  return await response.json()
}

export async function getConnections() {
  const response = await fetch(`${API_BASE_URL}/connections`)

  if (!response.ok) {
    throw new Error(`Failed to fetch connections: ${response.statusText}`)
  }

  return await response.json()
}

export async function deleteConnection(connectionId: number) {
  const response = await fetch(`${API_BASE_URL}/connections/${connectionId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete connection: ${response.statusText}`);
  }
  
  return await response.json();
}

// Validation functions
export async function runValidation(config: {
  dataset: string
  config: string
  dataset_type: "csv" | "database"
}) {
  const response = await fetch(`${API_BASE_URL}/validation/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  })

  if (!response.ok) {
    throw new Error(`Failed to run validation: ${response.statusText}`)
  }

  return await response.json()
}

export async function getValidationResults() {
  const response = await fetch(`${API_BASE_URL}/validation/results`)

  if (!response.ok) {
    throw new Error(`Failed to fetch validation results: ${response.statusText}`)
  }

  return await response.json()
}

export async function getValidationResult(resultId: string) {
  const response = await fetch(`${API_BASE_URL}/validation/results/${resultId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch validation result: ${response.statusText}`)
  }

  return await response.json()
}

// Export functions
export async function exportJson(resultId: string) {
  const response = await fetch(`${API_BASE_URL}/export/json/${resultId}`)

  if (!response.ok) {
    throw new Error(`Failed to export JSON: ${response.statusText}`)
  }

  return await response.json()
}

export async function exportCsv(resultId: string) {
  const response = await fetch(`${API_BASE_URL}/export/csv/${resultId}`)

  if (!response.ok) {
    throw new Error(`Failed to export CSV: ${response.statusText}`)
  }

  return await response.json()
}

