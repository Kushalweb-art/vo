import { NextResponse } from "next/server"

// This would be replaced with actual database operations in a real app
const mockValidationResults = [
  {
    id: "customers-20230315",
    dataset: "customers.csv",
    timestamp: "2023-03-15T10:30:00Z",
    summary: {
      total: 13,
      passed: 10,
      warnings: 2,
      failed: 1,
    },
  },
  {
    id: "products-20230314",
    dataset: "products.csv",
    timestamp: "2023-03-14T15:45:00Z",
    summary: {
      total: 8,
      passed: 6,
      warnings: 0,
      failed: 2,
    },
  },
  {
    id: "prod-customers-20230313",
    dataset: "prod.customers",
    timestamp: "2023-03-13T09:15:00Z",
    summary: {
      total: 12,
      passed: 10,
      warnings: 2,
      failed: 0,
    },
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    const result = mockValidationResults.find((r) => r.id === id)
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }
    return NextResponse.json(result)
  }

  return NextResponse.json(mockValidationResults)
}

