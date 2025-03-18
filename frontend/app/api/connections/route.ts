import { NextResponse } from "next/server"

// This would be replaced with actual database operations in a real app
const mockDbConnections = [
  { id: 1, name: "Production DB", host: "prod-db.example.com", database: "prod", tables: 24 },
  { id: 2, name: "Staging DB", host: "staging-db.example.com", database: "staging", tables: 24 },
  { id: 3, name: "Development DB", host: "dev-db.example.com", database: "dev", tables: 22 },
]

export async function GET() {
  return NextResponse.json(mockDbConnections)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validate required fields
  if (!data.name || !data.host || !data.database || !data.username) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // In a real app, we would test the connection and save it to the database
  // For now, we'll just return a mock response
  const newConnection = {
    id: mockDbConnections.length + 1,
    name: data.name,
    host: data.host,
    database: data.database,
    tables: Math.floor(Math.random() * 30),
  }

  return NextResponse.json(newConnection, { status: 201 })
}

