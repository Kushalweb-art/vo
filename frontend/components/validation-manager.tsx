"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileCheck, Play, AlertCircle, CheckCircle } from 'lucide-react'
import { getDatasets, getConnections, runValidation, getValidationResults } from "@/lib/api-client"
import { cn } from "@/lib/utils"

export function ValidationManager() {
  const [datasetType, setDatasetType] = useState<"csv" | "database">("csv")
  const [selectedDataset, setSelectedDataset] = useState("")
  const [validationConfig, setValidationConfig] = useState(`# Example Soda Core YAML configuration
checks for customers:
  - row_count > 0
  - missing_count(customer_id) = 0
  - duplicate_count(email) = 0
  - avg_length(name) between 5 and 30
  - values in (status) in ('active', 'inactive', 'pending')`)
  
  const [datasets, setDatasets] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [validationHistory, setValidationHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fetch datasets and connections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datasetsData, connectionsData, validationResultsData] = await Promise.all([
          getDatasets(),
          getConnections(),
          getValidationResults()
        ]);
        
        setDatasets(datasetsData);
        setConnections(connectionsData);
        setValidationHistory(validationResultsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please check your connection to the backend.");
      }
    };
    
    fetchData();
  }, []);

  // Handle running validation
  const handleRunValidation = async () => {
    if (!selectedDataset) {
      setError("Please select a dataset");
      return;
    }
    
    if (!validationConfig) {
      setError("Please provide validation configuration");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await runValidation({
        dataset: selectedDataset,
        config: validationConfig,
        dataset_type: datasetType
      });
      
      setSuccess(`Validation completed successfully. ${result.summary.passed} passed, ${result.summary.warnings} warnings, ${result.summary.failed} failed.`);
      
      // Refresh validation history
      const validationResultsData = await getValidationResults();
      setValidationHistory(validationResultsData);
    } catch (error) {
      console.error("Error running validation:", error);
      setError("Failed to run validation. Please check your configuration and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="configure" className="space-y-4">
      <TabsList>
        <TabsTrigger value="configure">Configure Validation</TabsTrigger>
        <TabsTrigger value="history">Validation History</TabsTrigger>
      </TabsList>
      <TabsContent value="configure" className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Select Dataset</CardTitle>
            <CardDescription>
              Choose a dataset to validate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataset-type">Dataset Type</Label>
                <Select 
                  value={datasetType} 
                  onValueChange={(value) => setDatasetType(value as "csv" | "database")}
                >
                  <SelectTrigger id="dataset-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="database">Database Table</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataset">Dataset</Label>
                <Select 
                  value={selectedDataset} 
                  onValueChange={setSelectedDataset}
                >
                  <SelectTrigger id="dataset">
                    <SelectValue placeholder="Select dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasetType === "csv" ? (
                      datasets.map((dataset) => (
                        <SelectItem key={dataset.name} value={dataset.name}>
                          {dataset.name}
                        </SelectItem>
                      ))
                    ) : (
                      connections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.name}>
                          {connection.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Validation Configuration</CardTitle>
            <CardDescription>
              Define Soda Core checks for your dataset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="validation-config">Soda Core Configuration (YAML)</Label>
              <Textarea
                id="validation-config"
                className="font-mono h-64"
                value={validationConfig}
                onChange={(e) => setValidationConfig(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleRunValidation}
              disabled={isLoading}
            >
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Validation
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Validation History</CardTitle>
            <CardDescription>
              Recent validation runs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No validation runs yet. Configure and run a validation to see results here.
                </div>
              ) : (
                validationHistory.map((validation) => (
                  <div key={validation.id} className="flex items-center justify-between rounded-md border p-4">
                    <div>
                      <div className="font-medium">{validation.dataset}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(validation.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        {validation.summary.passed}/{validation.summary.total} checks passed
                      </div>
                      <div className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        validation.summary.failed === 0 && validation.summary.warnings === 0 
                          ? "bg-green-100 text-green-800" 
                          : validation.summary.failed > 0 
                            ? "bg-red-100 text-red-800" 
                            : "bg-yellow-100 text-yellow-800"
                      )}>
                        {validation.summary.failed === 0 && validation.summary.warnings === 0 
                          ? "Passed" 
                          : validation.summary.failed > 0 
                            ? "Failed" 
                            : "Warning"}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={`/results?id=${validation.id}`}>
                          <FileCheck className="mr-2 h-4 w-4" />
                          View Details
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}