"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, FileCheck, Files, AlertTriangle, BarChart3 } from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Files className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 CSV, 4 Database Tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Connections</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 PostgreSQL, 1 SQLite</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validations Run</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Last run: 2 hours ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 critical, 4 warnings</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Validations</CardTitle>
            <CardDescription>Last 5 validation runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Customer Data", date: "Today, 10:30 AM", status: "Passed" },
                { name: "Product Inventory", date: "Yesterday, 2:15 PM", status: "Failed" },
                { name: "Sales Transactions", date: "Yesterday, 11:45 AM", status: "Passed" },
                { name: "User Accounts", date: "Mar 15, 9:20 AM", status: "Warning" },
                { name: "Marketing Campaign", date: "Mar 14, 4:30 PM", status: "Passed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                  </div>
                  <div
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      item.status === "Passed"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex w-full items-center justify-between rounded-md border p-3 text-left font-medium hover:bg-muted">
                Upload new dataset
                <Files className="h-4 w-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-md border p-3 text-left font-medium hover:bg-muted">
                Add database connection
                <Database className="h-4 w-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-md border p-3 text-left font-medium hover:bg-muted">
                Run validation
                <FileCheck className="h-4 w-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-md border p-3 text-left font-medium hover:bg-muted">
                View latest results
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

