import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Student, insertStudentSchema } from "@shared/schema";
import CodeBlock from "./ui/code-block";
import StudentForm, { StudentFormValues } from "./student-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const CodeExamples = {
  post: `// POST endpoint to add a new student
app.post('/students', (req, res) => {
  const { name, rollNumber, email, mobile } = req.body;
  
  // Validate required fields
  if (!name || !rollNumber || !email || !mobile) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Insert new student
  const sql = \`INSERT INTO students (name, rollNumber, email, mobile) 
               VALUES (?, ?, ?, ?)\`;
  
  db.run(sql, [name, rollNumber, email, mobile], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: {
        id: this.lastID,
        name, 
        rollNumber,
        email,
        mobile
      }
    });
  });
});`,
  getAll: `// GET endpoint to fetch all students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Students retrieved successfully',
      data: rows
    });
  });
});`,
  getOne: `// GET endpoint to fetch student by ID
app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM students WHERE id = ?';
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    if (!row) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student retrieved successfully',
      data: row
    });
  });
});`,
  put: `// PUT endpoint to update a student
app.put('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, rollNumber, email, mobile } = req.body;
  
  // Validate required fields
  if (!name || !rollNumber || !email || !mobile) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Update student
  const sql = \`UPDATE students 
               SET name = ?, rollNumber = ?, email = ?, mobile = ?
               WHERE id = ?\`;
  
  db.run(sql, [name, rollNumber, email, mobile, id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: {
        id: parseInt(id),
        name, 
        rollNumber,
        email,
        mobile
      }
    });
  });
});`,
  delete: `// DELETE endpoint to remove a student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  });
});`
};

interface RequestSample {
  post: string;
  getAll: string;
  getOne: string;
  put: string;
  delete: string;
}

type TabType = "post" | "get-all" | "get-one" | "put" | "delete";

const ApiInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("post");
  const [studentIdQuery, setStudentIdQuery] = useState<string>("");
  const [updateStudentId, setUpdateStudentId] = useState<string>("");
  const [deleteStudentId, setDeleteStudentId] = useState<string>("");
  const [responseTime, setResponseTime] = useState<number>(0);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<any>(null);

  // Create Student Mutation
  const createMutation = useMutation({
    mutationFn: (student: StudentFormValues) => {
      const startTime = Date.now();
      return apiRequest("POST", "/api/students", student)
        .then(async (res) => {
          setResponseTime(Date.now() - startTime);
          setResponseStatus(res.status);
          const data = await res.json();
          setResponseData(data);
          return data;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/students']});
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    }
  });
  
  // Get All Students Query
  const getAllStudents = async () => {
    setResponseData(null);
    setResponseStatus(null);
    const startTime = Date.now();
    try {
      const res = await apiRequest("GET", "/api/students");
      setResponseTime(Date.now() - startTime);
      setResponseStatus(res.status);
      const data = await res.json();
      setResponseData(data);
      return data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  };

  // Get Student by ID
  const getStudentById = async () => {
    if (!studentIdQuery) {
      toast({
        title: "Error",
        description: "Please enter a student ID",
        variant: "destructive",
      });
      return;
    }
    
    setResponseData(null);
    setResponseStatus(null);
    const startTime = Date.now();
    try {
      const res = await apiRequest("GET", `/api/students/${studentIdQuery}`);
      setResponseTime(Date.now() - startTime);
      setResponseStatus(res.status);
      const data = await res.json();
      setResponseData(data);
      return data;
    } catch (error) {
      console.error("Error fetching student:", error);
      throw error;
    }
  };

  // Update Student Mutation
  const updateMutation = useMutation({
    mutationFn: (student: StudentFormValues) => {
      if (!updateStudentId) {
        throw new Error("Please enter a student ID");
      }
      
      const startTime = Date.now();
      return apiRequest("PUT", `/api/students/${updateStudentId}`, student)
        .then(async (res) => {
          setResponseTime(Date.now() - startTime);
          setResponseStatus(res.status);
          const data = await res.json();
          setResponseData(data);
          return data;
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['/api/students']});
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    }
  });

  // Delete Student
  const deleteStudent = async () => {
    if (!deleteStudentId) {
      toast({
        title: "Error",
        description: "Please enter a student ID",
        variant: "destructive",
      });
      return;
    }
    
    setResponseData(null);
    setResponseStatus(null);
    const startTime = Date.now();
    try {
      const res = await apiRequest("DELETE", `/api/students/${deleteStudentId}`);
      setResponseTime(Date.now() - startTime);
      setResponseStatus(res.status);
      const data = await res.json();
      setResponseData(data);
      queryClient.invalidateQueries({queryKey: ['/api/students']});
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      return data;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  };

  // Get Student by ID for Update
  const getStudentForUpdate = async () => {
    if (!updateStudentId) {
      toast({
        title: "Error",
        description: "Please enter a student ID",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const res = await apiRequest("GET", `/api/students/${updateStudentId}`);
      if (!res.ok) {
        toast({
          title: "Error",
          description: `Student not found with ID: ${updateStudentId}`,
          variant: "destructive",
        });
        return;
      }
      
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching student for update:", error);
      throw error;
    }
  };

  // Sample request data
  const requestSample: RequestSample = {
    post: JSON.stringify({
      name: "John Doe",
      rollNumber: "R1001",
      email: "john.doe@example.com",
      mobile: "1234567890"
    }, null, 2),
    getAll: "",
    getOne: "",
    put: JSON.stringify({
      name: "John Smith",
      rollNumber: "R1001",
      email: "john.smith@example.com",
      mobile: "1234567890"
    }, null, 2),
    delete: ""
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap">
          <button
            onClick={() => {
              setActiveTab("post");
              setResponseData(null);
            }}
            className={`px-6 py-4 font-medium focus:outline-none border-b-2 ${
              activeTab === "post" ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
            }`}
          >
            POST
          </button>
          <button
            onClick={() => {
              setActiveTab("get-all");
              setResponseData(null);
            }}
            className={`px-6 py-4 font-medium focus:outline-none border-b-2 ${
              activeTab === "get-all" ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
            }`}
          >
            GET All
          </button>
          <button
            onClick={() => {
              setActiveTab("get-one");
              setResponseData(null);
            }}
            className={`px-6 py-4 font-medium focus:outline-none border-b-2 ${
              activeTab === "get-one" ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
            }`}
          >
            GET by ID
          </button>
          <button
            onClick={() => {
              setActiveTab("put");
              setResponseData(null);
            }}
            className={`px-6 py-4 font-medium focus:outline-none border-b-2 ${
              activeTab === "put" ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
            }`}
          >
            PUT
          </button>
          <button
            onClick={() => {
              setActiveTab("delete");
              setResponseData(null);
            }}
            className={`px-6 py-4 font-medium focus:outline-none border-b-2 ${
              activeTab === "delete" ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
            }`}
          >
            DELETE
          </button>
        </nav>
      </div>

      {/* POST Tab Content */}
      {activeTab === "post" && (
        <div id="tab-post" className="p-6 tab-content">
          <h3 className="text-lg font-medium mb-4">Add a New Student</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Request</h4>
              <div className="p-4 bg-gray-800 text-white rounded-md">
                <div className="flex items-center mb-3">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-md mr-2">POST</span>
                  <span className="text-gray-300 font-mono text-sm">/api/students</span>
                </div>

                <CodeBlock content={requestSample.post} />
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Test Endpoint</h4>
                <StudentForm 
                  onSubmit={(values) => createMutation.mutate(values)}
                  submitLabel={createMutation.isPending ? "Sending..." : "Send Request"}
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Response</h4>
              <div className="border border-gray-200 rounded-md">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {responseStatus ? (
                      <>
                        <span className={`px-2 py-1 ${responseStatus >= 200 && responseStatus < 300 ? 'bg-success' : 'bg-error'} text-white text-xs font-bold rounded-md mr-2`}>
                          {responseStatus}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {responseStatus >= 200 && responseStatus < 300 ? 'Created' : 'Error'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 text-sm">Waiting for response...</span>
                    )}
                  </div>
                  {responseTime > 0 && (
                    <span className="text-gray-500 text-sm">{responseTime}ms</span>
                  )}
                </div>
                <div className="p-4 font-mono text-sm overflow-auto max-h-96">
                  {createMutation.isPending ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-400 italic">No response data yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Node.js Code Example</h4>
                <div className="bg-gray-50 rounded-md p-4 font-mono text-xs overflow-auto">
                  <pre>{CodeExamples.post}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GET All Tab Content */}
      {activeTab === "get-all" && (
        <div id="tab-get-all" className="p-6 tab-content">
          <h3 className="text-lg font-medium mb-4">Fetch All Students</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Request</h4>
              <div className="p-4 bg-gray-800 text-white rounded-md">
                <div className="flex items-center mb-3">
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md mr-2">GET</span>
                  <span className="text-gray-300 font-mono text-sm">/api/students</span>
                </div>

                <div className="mt-4">
                  <Button 
                    onClick={getAllStudents} 
                    className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Send Request
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Response</h4>
              <div className="border border-gray-200 rounded-md">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {responseStatus ? (
                      <>
                        <span className={`px-2 py-1 ${responseStatus >= 200 && responseStatus < 300 ? 'bg-success' : 'bg-error'} text-white text-xs font-bold rounded-md mr-2`}>
                          {responseStatus}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Error'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 text-sm">Waiting for response...</span>
                    )}
                  </div>
                  {responseTime > 0 && (
                    <span className="text-gray-500 text-sm">{responseTime}ms</span>
                  )}
                </div>
                <div className="p-4 font-mono text-sm overflow-auto max-h-96">
                  {responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-400 italic">No response data yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Node.js Code Example</h4>
                <div className="bg-gray-50 rounded-md p-4 font-mono text-xs overflow-auto">
                  <pre>{CodeExamples.getAll}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GET by ID Tab Content */}
      {activeTab === "get-one" && (
        <div id="tab-get-one" className="p-6 tab-content">
          <h3 className="text-lg font-medium mb-4">Fetch Student by ID</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Request</h4>
              <div className="p-4 bg-gray-800 text-white rounded-md">
                <div className="flex items-center mb-3">
                  <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-md mr-2">GET</span>
                  <span className="text-gray-300 font-mono text-sm">/api/students/{"{id}"}</span>
                </div>

                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                    <Input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-700 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Enter student ID"
                      value={studentIdQuery}
                      onChange={(e) => setStudentIdQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={getStudentById}
                    className="px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Send Request
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Response</h4>
              <div className="border border-gray-200 rounded-md">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {responseStatus ? (
                      <>
                        <span className={`px-2 py-1 ${responseStatus >= 200 && responseStatus < 300 ? 'bg-success' : 'bg-error'} text-white text-xs font-bold rounded-md mr-2`}>
                          {responseStatus}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Error'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 text-sm">Waiting for response...</span>
                    )}
                  </div>
                  {responseTime > 0 && (
                    <span className="text-gray-500 text-sm">{responseTime}ms</span>
                  )}
                </div>
                <div className="p-4 font-mono text-sm overflow-auto max-h-96">
                  {responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-400 italic">No response data yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Node.js Code Example</h4>
                <div className="bg-gray-50 rounded-md p-4 font-mono text-xs overflow-auto">
                  <pre>{CodeExamples.getOne}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PUT Tab Content */}
      {activeTab === "put" && (
        <div id="tab-put" className="p-6 tab-content">
          <h3 className="text-lg font-medium mb-4">Update Student</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Request</h4>
              <div className="p-4 bg-gray-800 text-white rounded-md">
                <div className="flex items-center mb-3">
                  <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold rounded-md mr-2">PUT</span>
                  <span className="text-gray-300 font-mono text-sm">/api/students/{"{id}"}</span>
                </div>

                <CodeBlock content={requestSample.put} className="mb-4" />

                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-700 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        placeholder="Enter student ID"
                        value={updateStudentId}
                        onChange={(e) => setUpdateStudentId(e.target.value)}
                      />
                      <Button
                        onClick={async () => {
                          try {
                            const student = await getStudentForUpdate();
                            if (student) {
                              setResponseData(null);
                              updateMutation.reset();
                              
                              // Populate form with student data
                              const form = document.querySelector('form') as HTMLFormElement;
                              const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
                              const rollNumberInput = form.querySelector('input[name="rollNumber"]') as HTMLInputElement;
                              const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
                              const mobileInput = form.querySelector('input[name="mobile"]') as HTMLInputElement;
                              
                              if (nameInput) nameInput.value = student.name;
                              if (rollNumberInput) rollNumberInput.value = student.rollNumber;
                              if (emailInput) emailInput.value = student.email;
                              if (mobileInput) mobileInput.value = student.mobile;
                            }
                          } catch (error) {
                            console.error("Failed to get student:", error);
                          }
                        }}
                        className="px-3 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700"
                      >
                        Fetch
                      </Button>
                    </div>
                  </div>
                  
                  <StudentForm 
                    onSubmit={(values) => updateMutation.mutate(values)}
                    submitLabel={updateMutation.isPending ? "Updating..." : "Send Request"}
                    isDark={true}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Response</h4>
              <div className="border border-gray-200 rounded-md">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {responseStatus ? (
                      <>
                        <span className={`px-2 py-1 ${responseStatus >= 200 && responseStatus < 300 ? 'bg-success' : 'bg-error'} text-white text-xs font-bold rounded-md mr-2`}>
                          {responseStatus}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Error'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 text-sm">Waiting for response...</span>
                    )}
                  </div>
                  {responseTime > 0 && (
                    <span className="text-gray-500 text-sm">{responseTime}ms</span>
                  )}
                </div>
                <div className="p-4 font-mono text-sm overflow-auto max-h-96">
                  {updateMutation.isPending ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-400 italic">No response data yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Node.js Code Example</h4>
                <div className="bg-gray-50 rounded-md p-4 font-mono text-xs overflow-auto">
                  <pre>{CodeExamples.put}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE Tab Content */}
      {activeTab === "delete" && (
        <div id="tab-delete" className="p-6 tab-content">
          <h3 className="text-lg font-medium mb-4">Delete Student</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Request</h4>
              <div className="p-4 bg-gray-800 text-white rounded-md">
                <div className="flex items-center mb-3">
                  <span className="px-3 py-1 bg-error text-white text-xs font-bold rounded-md mr-2">DELETE</span>
                  <span className="text-gray-300 font-mono text-sm">/api/students/{"{id}"}</span>
                </div>

                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                    <Input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-700 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      placeholder="Enter student ID"
                      value={deleteStudentId}
                      onChange={(e) => setDeleteStudentId(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={deleteStudent}
                    className="px-4 py-2 bg-error text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Send Request
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Response</h4>
              <div className="border border-gray-200 rounded-md">
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    {responseStatus ? (
                      <>
                        <span className={`px-2 py-1 ${responseStatus >= 200 && responseStatus < 300 ? 'bg-success' : 'bg-error'} text-white text-xs font-bold rounded-md mr-2`}>
                          {responseStatus}
                        </span>
                        <span className="text-gray-600 text-sm">
                          {responseStatus >= 200 && responseStatus < 300 ? 'OK' : 'Error'}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-600 text-sm">Waiting for response...</span>
                    )}
                  </div>
                  {responseTime > 0 && (
                    <span className="text-gray-500 text-sm">{responseTime}ms</span>
                  )}
                </div>
                <div className="p-4 font-mono text-sm overflow-auto max-h-96">
                  {responseData ? (
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                  ) : (
                    <div className="text-gray-400 italic">No response data yet</div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3 text-sm uppercase text-gray-500">Node.js Code Example</h4>
                <div className="bg-gray-50 rounded-md p-4 font-mono text-xs overflow-auto">
                  <pre>{CodeExamples.delete}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiInterface;
