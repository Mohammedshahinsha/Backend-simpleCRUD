import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PostmanSimulation() {
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState<string>("http://localhost:5000/api/students");
  const [requestBody, setRequestBody] = useState<string>('{\n  "name": "John Doe",\n  "rollNumber": "R1234",\n  "email": "john.doe@example.com",\n  "mobile": "1234567890"\n}');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("body");
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      if (method !== "GET" && method !== "DELETE") {
        options.body = requestBody;
      }
      
      const res = await fetch(url, options);
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const formatJson = (json: any): string => {
    return JSON.stringify(json, null, 2);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
        Postman-like API Testing Tool
      </h1>
      
      {/* Request Section */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-semibold">Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET" className="text-blue-600 font-semibold">GET</SelectItem>
                  <SelectItem value="POST" className="text-green-600 font-semibold">POST</SelectItem>
                  <SelectItem value="PUT" className="text-orange-500 font-semibold">PUT</SelectItem>
                  <SelectItem value="DELETE" className="text-red-600 font-semibold">DELETE</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL"
                className="flex-1 font-mono text-sm"
              />
              
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border-b w-full justify-start">
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="body" className="py-4">
                {method !== "GET" && method !== "DELETE" ? (
                  <Textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    placeholder="Enter request body (JSON)"
                    className="min-h-[200px] font-mono text-sm"
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded border text-gray-500 italic">
                    No request body needed for {method} requests
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="headers" className="py-4">
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="font-mono text-sm">Content-Type: application/json</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Response Section */}
      <Card className="mb-6">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl font-semibold">Response</CardTitle>
          {response && (
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-mono ${
                response.status >= 200 && response.status < 300
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                Status: {response.status} {response.statusText}
              </span>
              <span className="text-xs text-gray-500">
                Time: {new Date().toLocaleTimeString()}
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              Error: {error}
            </div>
          ) : response ? (
            <Textarea
              readOnly
              value={formatJson(response.data)}
              className="min-h-[300px] font-mono text-sm"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded border text-gray-500 italic min-h-[300px] flex items-center justify-center">
              Send a request to see the response
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* API Test Examples */}
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl font-semibold">API Test Examples</CardTitle>
          <CardDescription>
            Click on any example to load it into the request form above
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setMethod("GET");
                setUrl("http://localhost:5000/api/students");
                setActiveTab("body");
              }}
              className="justify-start font-mono text-sm"
            >
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">GET</span>
              /api/students - Get All Students
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setMethod("POST");
                setUrl("http://localhost:5000/api/students");
                setRequestBody('{\n  "name": "John Doe",\n  "rollNumber": "R1234",\n  "email": "john.doe@example.com",\n  "mobile": "1234567890"\n}');
                setActiveTab("body");
              }}
              className="justify-start font-mono text-sm"
            >
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">POST</span>
              /api/students - Create Student
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setMethod("GET");
                setUrl("http://localhost:5000/api/students/1");
                setActiveTab("body");
              }}
              className="justify-start font-mono text-sm"
            >
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">GET</span>
              /api/students/1 - Get Student by ID
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setMethod("PUT");
                setUrl("http://localhost:5000/api/students/1");
                setRequestBody('{\n  "name": "John Doe Updated",\n  "rollNumber": "R1234",\n  "email": "john.updated@example.com",\n  "mobile": "1234567890"\n}');
                setActiveTab("body");
              }}
              className="justify-start font-mono text-sm"
            >
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded mr-2">PUT</span>
              /api/students/1 - Update Student
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setMethod("DELETE");
                setUrl("http://localhost:5000/api/students/1");
                setActiveTab("body");
              }}
              className="justify-start font-mono text-sm"
            >
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded mr-2">DELETE</span>
              /api/students/1 - Delete Student
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}