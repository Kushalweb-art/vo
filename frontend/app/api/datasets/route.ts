import { NextResponse } from "next/server"

// This would be replaced with actual file system operations in a real app
const mockCsvFiles = [
  { id: 1, name: "customers.csv", size: "1.2 MB", rows: 5000, columns: 12, date: "2023-03-15" },
  { id: 2, name: "products.csv", size: "0.8 MB", rows: 3200, columns: 8, date: "2023-03-10" },
  { id: 3, name: "sales.csv", size: "2.4 MB", rows: 10000, columns: 15, date: "2023-03-05" },
]

export async function GET() {
  return NextResponse.json(mockCsvFiles)
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // In a real app, we would save the file to the file system
  // For now, we'll just return a mock response
  const newFile = {
    id: mockCsvFiles.length + 1,
    name: file.name,
    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    rows: Math.floor(Math.random() * 10000),
    columns: Math.floor(Math.random() * 20),
    date: new Date().toISOString().split("T")[0],
  }

  return NextResponse.json(newFile, { status: 201 })
}

