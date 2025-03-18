"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileDown } from 'lucide-react'
import { getValidationResults } from "@/lib/api-client"
import { cn } from "@/lib/utils"

// Define TypeScript interfaces for validation results
interface ValidationCheck {
  name: string;
  definition: string;
  result: string;
  status: "passed" | "failed" | "warning";
}

interface InvalidRecord {
  row: number;
  column: string;
  value: string;
  issue: string;
}

interface ValidationResult {
  id: string;
  dataset: string;
  timestamp: string;
  summary: {
    passed: number;
    warnings: number;
    failed: number;
  };
  checks: ValidationCheck[];
  invalid_records?: InvalidRecord[];
}

export function ResultsViewer({ initialResult = null }: { initialResult?: ValidationResult | null }) {
  const [selectedResultId, setSelectedResultId] = useState<string>("")
  const [results, setResults] = useState<ValidationResult[]>([])
  const [currentResult, setCurrentResult] = useState<ValidationResult | null>(initialResult)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data: ValidationResult[] = await getValidationResults();
        setResults(data);
        
        if (initialResult) {
          setSelectedResultId(initialResult.id);
        } else if (data.length > 0) {
          setSelectedResultId(data[0].id);
          setCurrentResult(data[0]);
        }
      } catch (error) {
        console.error("Error fetching validation results:", error);
      }
    };
    
    fetchResults();
  }, [initialResult]);

  useEffect(() => {
    if (!selectedResultId) return;
    const result = results.find(r => r.id === selectedResultId);
    if (result) {
      setCurrentResult(result);
    }
  }, [selectedResultId, results]);

  const handleExport = (format: string) => {
    if (!currentResult) return;

    if (format === "json") {
      const dataStr = JSON.stringify(currentResult, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileName = `validation-${currentResult.dataset}-${new Date().toISOString().split("T")[0]}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
    } else {
      alert(`${format.toUpperCase()} export would be implemented in a real app`);
    }
  };

  return (
    <Tabs defaultValue="summary" className="space-y-4">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="details">Detailed Results</TabsTrigger>
        <TabsTrigger value="export">Export</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="space-y-4">
        {currentResult && (
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
              <CardDescription>Overview of validation results for {currentResult.dataset}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Check</TableHead>
                    <TableHead>Definition</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResult.checks.map((check: ValidationCheck, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{check.name}</TableCell>
                      <TableCell>{check.definition}</TableCell>
                      <TableCell>{check.result}</TableCell>
                      <TableCell>
                        <Badge
                          variant={check.status === 'failed' ? 'destructive' : 'outline'}
                          className={cn(
                            check.status === 'passed' && "bg-green-100 text-green-800",
                            check.status === 'warning' && "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle>Export Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleExport('json')} disabled={!currentResult}>
              <FileDown className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
