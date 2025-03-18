"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileDown } from 'lucide-react'
import { getValidationResults } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export function ResultsViewer({ initialResult = null }) {
  const [selectedResultId, setSelectedResultId] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [currentResult, setCurrentResult] = useState<any | null>(initialResult)

  // Fetch validation results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getValidationResults();
        setResults(data);
        
        // If we have an initial result, set the selected result ID
        if (initialResult) {
          setSelectedResultId(initialResult.id);
        } else if (data.length > 0) {
          // Otherwise, select the first result
          setSelectedResultId(data[0].id);
          setCurrentResult(data[0]);
        }
      } catch (error) {
        console.error("Error fetching validation results:", error);
      }
    };
    
    fetchResults();
  }, [initialResult]);

  // Update current result when selected result changes
  useEffect(() => {
    if (!selectedResultId) return;
    
    const result = results.find(r => r.id === selectedResultId);
    if (result) {
      setCurrentResult(result);
    }
  }, [selectedResultId, results]);

  // Handle export
  const handleExport = (format: string) => {
    if (!currentResult) return;
    
    // For JSON export, we can create a downloadable file directly
    if (format === 'json') {
      const dataStr = JSON.stringify(currentResult, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `validation-${currentResult.dataset}-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
    
    // For CSV and PDF, in a real app we would call the backend API
    // For now, we'll just show an alert
    if (format === 'csv' || format === 'pdf') {
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
        <Card>
          <CardHeader>
            <CardTitle>Select Validation Result</CardTitle>
            <CardDescription>
              Choose a validation run to view results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="result">Validation Run</Label>
              <Select 
                value={selectedResultId} 
                onValueChange={setSelectedResultId}
              >
                <SelectTrigger id="result">
                  <SelectValue placeholder="Select validation run" />
                </SelectTrigger>
                <SelectContent>
                  {results.map((result) => (
                    <SelectItem key={result.id} value={result.id}>
                      {result.dataset} - {new Date(result.timestamp).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {currentResult && (
          <Card>
            <CardHeader>
              <CardTitle>Validation Summary</CardTitle>
              <CardDescription>
                Overview of validation results for {currentResult.dataset}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{currentResult.summary.passed}</div>
                    <div className="text-sm font-medium">Passed Checks</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{currentResult.summary.warnings}</div>
                    <div className="text-sm font-medium">Warning Checks</div>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{currentResult.summary.failed}</div>
                    <div className="text-sm font-medium">Failed Checks</div>
                  </div>
                </div>
                
                {currentResult.summary.failed > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium">Failed Checks</h3>
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
                        {currentResult.checks
                          .filter(check => check.status === 'failed')
                          .map((check, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{check.name}</TableCell>
                              <TableCell>{check.definition}</TableCell>
                              <TableCell>{check.result}</TableCell>
                              <TableCell>
                                <Badge variant="destructive">Failed</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {currentResult.summary.warnings > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium">Warning Checks</h3>
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
                        {currentResult.checks
                          .filter(check => check.status === 'warning')
                          .map((check, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{check.name}</TableCell>
                              <TableCell>{check.definition}</TableCell>
                              <TableCell>{check.result}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="details">
        {currentResult && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>
                Complete validation results with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">All Checks</h3>
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
                      {currentResult.checks.map((check, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{check.name}</TableCell>
                          <TableCell>{check.definition}</TableCell>
                          <TableCell>{check.result}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={check.status === 'failed' ? 'destructive' : 'outline'} 
                              className={cn(
                                check.status === 'passed' && "bg-green-100 text-green-800 hover:bg-green-100",
                                check.status === 'warning' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              )}
                            >
                              {check.status === 'passed' ? 'Passed' : 
                               check.status === 'failed' ? 'Failed' : 'Warning'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {currentResult.invalid_records && currentResult.invalid_records.length > 0 && (
                  <div>
                    <h3 className="mb-2 font-medium">Invalid Records</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Column</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Issue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentResult.invalid_records.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>{record.row}</TableCell>
                            <TableCell>{record.column}</TableCell>
                            <TableCell>{record.value}</TableCell>
                            <TableCell>{record.issue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="export">
        <Card>
          <CardHeader>
            <CardTitle>Export Results</CardTitle>
            <CardDescription>
              Download validation results in different formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <div className="font-medium">JSON Format</div>
                  <div className="text-sm text-muted-foreground">Complete validation results in JSON format</div>
                </div>
                <Button onClick={() => handleExport('json')} disabled={!currentResult}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <div className="font-medium">CSV Format</div>
                  <div className="text-sm text-muted-foreground">Tabular validation results in CSV format</div>
                </div>
                <Button onClick={() => handleExport('csv')} disabled={!currentResult}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <div className="font-medium">PDF Report</div>
                  <div className="text-sm text-muted-foreground">Formatted validation report in PDF format</div>
                </div>
                <Button onClick={() => handleExport('pdf')} disabled={!currentResult}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}