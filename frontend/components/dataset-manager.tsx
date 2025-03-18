"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Database, FileUp, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadDataset, getDatasets, deleteDataset, createConnection, getConnections, deleteConnection } from "@/lib/api-client"

export function DatasetManager() {
  const [csvFiles, setCsvFiles] = useState<any[]>([])
  const [dbConnections, setDbConnections] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Form refs for database connection
  const nameRef = useRef<HTMLInputElement>(null)
  const hostRef = useRef<HTMLInputElement>(null)
  const portRef = useRef<HTMLInputElement>(null)
  const databaseRef = useRef<HTMLInputElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  
  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch datasets and connections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datasetsData, connectionsData] = await Promise.all([
          getDatasets(),
          getConnections()
        ]);
        
        setCsvFiles(datasetsData);
        setDbConnections(connectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please check your connection to the backend.");
      }
    };
    
    fetchData();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!fileInputRef.current?.files?.length) {
      setError("Please select a file to upload");
      return;
    }
    
    const file = fileInputRef.current.files[0];
    
    if (!file.name.endsWith('.csv')) {
      setError("Only CSV files are supported");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await uploadDataset(file);
      setSuccess(`File ${file.name} uploaded successfully`);
      
      // Refresh datasets list
      const datasetsData = await getDatasets();
      setCsvFiles(datasetsData);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle dataset deletion
  const handleDeleteDataset = async (filename: string) => {
    try {
      await deleteDataset(filename);
      
      // Refresh datasets list
      const datasetsData = await getDatasets();
      setCsvFiles(datasetsData);
      
      setSuccess(`File ${filename} deleted successfully`);
    } catch (error) {
      console.error("Error deleting file:", error);
      setError("Failed to delete file. Please try again.");
    }
  };

  // Handle database connection creation
  const handleCreateConnection = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!nameRef.current?.value || !hostRef.current?.value || !databaseRef.current?.value || !usernameRef.current?.value) {
      setError("Please fill in all required fields");
      return;
    }
    
    setIsConnecting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await createConnection({
        name: nameRef.current.value,
        host: hostRef.current.value,
        port: parseInt(portRef.current?.value || "5432"),
        database: databaseRef.current.value,
        username: usernameRef.current.value,
        password: passwordRef.current?.value || ""
      });
      
      setSuccess(`Connection ${nameRef.current.value} created successfully`);
      
      // Refresh connections list
      const connectionsData = await getConnections();
      setDbConnections(connectionsData);
      
      // Reset form
      if (nameRef.current) nameRef.current.value = '';
      if (hostRef.current) hostRef.current.value = '';
      if (portRef.current) portRef.current.value = '5432';
      if (databaseRef.current) databaseRef.current.value = '';
      if (usernameRef.current) usernameRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
    } catch (error) {
      console.error("Error creating connection:", error);
      setError("Failed to create connection. Please check your connection details and try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle connection deletion
  const handleDeleteConnection = async (connectionId: number) => {
    try {
      await deleteConnection(connectionId);
      
      // Refresh connections list
      const connectionsData = await getConnections();
      setDbConnections(connectionsData);
      
      setSuccess(`Connection deleted successfully`);
    } catch (error) {
      console.error("Error deleting connection:", error);
      setError("Failed to delete connection. Please try again.");
    }
  };

  return (
    <Tabs defaultValue="csv" className="space-y-4">
      <TabsList>
        <TabsTrigger value="csv">CSV Files</TabsTrigger>
        <TabsTrigger value="database">Database Connections</TabsTrigger>
      </TabsList>
      
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
      
      <TabsContent value="csv" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
            <CardDescription>
              Upload a CSV file to use for validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFileUpload} className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="csv-upload">CSV File</Label>
              <div className="flex gap-2">
                <Input 
                  id="csv-upload" 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef}
                />
                <Button type="submit" disabled={isUploading}>
                  <FileUp className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>CSV Files</CardTitle>
            <CardDescription>
              Manage your uploaded CSV files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {csvFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No CSV files uploaded yet. Upload a file to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvFiles.map((file) => (
                    <TableRow key={file.name}>
                      <TableCell className="font-medium">{file.name}</TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.rows}</TableCell>
                      <TableCell>{file.columns}</TableCell>
                      <TableCell>{new Date(file.date * 1000).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteDataset(file.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="database" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Database Connection</CardTitle>
            <CardDescription>
              Connect to a PostgreSQL database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateConnection} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="connection-name">Connection Name*</Label>
                  <Input 
                    id="connection-name" 
                    placeholder="My Database" 
                    ref={nameRef}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="host">Host*</Label>
                  <Input 
                    id="host" 
                    placeholder="localhost" 
                    ref={hostRef}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port" 
                    placeholder="5432" 
                    ref={portRef}
                    defaultValue="5432"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="database">Database*</Label>
                  <Input 
                    id="database" 
                    placeholder="postgres" 
                    ref={databaseRef}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username*</Label>
                  <Input 
                    id="username" 
                    placeholder="postgres" 
                    ref={usernameRef}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    ref={passwordRef}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isConnecting}>
                <Database className="mr-2 h-4 w-4" />
                {isConnecting ? "Connecting..." : "Add Connection"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Database Connections</CardTitle>
            <CardDescription>
              Manage your database connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbConnections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No database connections added yet. Add a connection to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Database</TableHead>
                    <TableHead>Tables</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dbConnections.map((connection) => (
                    <TableRow key={connection.id}>
                      <TableCell className="font-medium">{connection.name}</TableCell>
                      <TableCell>{connection.host}</TableCell>
                      <TableCell>{connection.database}</TableCell>
                      <TableCell>{connection.tables}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteConnection(connection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}