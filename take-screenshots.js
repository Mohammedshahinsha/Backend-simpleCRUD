import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const API_BASE_URL = 'http://localhost:5000/api';

// Sample student data for testing
const newStudent = {
  name: "John Smith",
  rollNumber: "R2001",
  email: "john.smith@example.com",
  mobile: "9876543210"
};

// Function to save response to a file
const saveResponseToFile = (filename, data) => {
  const filePath = path.join(screenshotsDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Saved response to ${filePath}`);
};

// Function to make requests and save responses
const takeScreenshots = async () => {
  try {
    console.log('Taking API screenshots...');
    
    // 1. POST - Create new student
    console.log('1. Creating a new student (POST)...');
    const createResponse = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    });
    
    const createData = await createResponse.json();
    saveResponseToFile('1-post-create-student.json', {
      request: {
        method: 'POST',
        url: `${API_BASE_URL}/students`,
        body: newStudent
      },
      response: {
        status: createResponse.status,
        statusText: createResponse.statusText,
        data: createData
      }
    });
    
    // Store student ID for later requests
    const studentId = createData.data.id;
    
    // 2. GET All - Fetch all students
    console.log('2. Fetching all students (GET all)...');
    const getAllResponse = await fetch(`${API_BASE_URL}/students`);
    const getAllData = await getAllResponse.json();
    
    saveResponseToFile('2-get-all-students.json', {
      request: {
        method: 'GET',
        url: `${API_BASE_URL}/students`
      },
      response: {
        status: getAllResponse.status,
        statusText: getAllResponse.statusText,
        data: getAllData
      }
    });
    
    // 3. GET One - Fetch student by ID
    console.log(`3. Fetching student by ID (GET one) for ID: ${studentId}...`);
    const getOneResponse = await fetch(`${API_BASE_URL}/students/${studentId}`);
    const getOneData = await getOneResponse.json();
    
    saveResponseToFile('3-get-student-by-id.json', {
      request: {
        method: 'GET',
        url: `${API_BASE_URL}/students/${studentId}`
      },
      response: {
        status: getOneResponse.status,
        statusText: getOneResponse.statusText,
        data: getOneData
      }
    });
    
    // 4. PUT - Update student
    console.log(`4. Updating student (PUT) for ID: ${studentId}...`);
    const updatedStudent = {
      ...newStudent,
      name: "John Smith Updated",
      email: "john.updated@example.com"
    };
    
    const updateResponse = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent)
    });
    
    const updateData = await updateResponse.json();
    saveResponseToFile('4-put-update-student.json', {
      request: {
        method: 'PUT',
        url: `${API_BASE_URL}/students/${studentId}`,
        body: updatedStudent
      },
      response: {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        data: updateData
      }
    });
    
    // 5. DELETE - Delete student
    console.log(`5. Deleting student (DELETE) for ID: ${studentId}...`);
    const deleteResponse = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE'
    });
    
    const deleteData = await deleteResponse.json();
    saveResponseToFile('5-delete-student.json', {
      request: {
        method: 'DELETE',
        url: `${API_BASE_URL}/students/${studentId}`
      },
      response: {
        status: deleteResponse.status,
        statusText: deleteResponse.statusText,
        data: deleteData
      }
    });
    
    console.log('All API screenshots taken successfully!');
    
  } catch (error) {
    console.error('Error taking screenshots:', error);
  }
};

// Run the screenshot process
takeScreenshots();