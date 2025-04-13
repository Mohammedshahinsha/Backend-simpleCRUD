import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Sample student data for testing
const newStudent = {
  name: "John Smith",
  rollNumber: "R2001",
  email: "john.smith@example.com",
  mobile: "9876543210"
};

// Function to take a screenshot of the Postman-like interface for a specific API operation
async function takeScreenshot(method, endpoint, requestBody, fileName) {
  console.log(`Taking screenshot for ${method} ${endpoint}...`);
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });
    
    // Navigate to the Postman-like UI page
    await page.goto('http://localhost:5000/postman', { waitUntil: 'networkidle0' });
    
    // Set the method and URL
    await page.select('select[name="method-select"]', method);
    await page.type('input[name="url-input"]', API_BASE_URL + endpoint);
    
    // Set request body if needed
    if (requestBody && (method === 'POST' || method === 'PUT')) {
      await page.click('textarea[name="body-input"]', { clickCount: 3 }); // Select all text
      await page.type('textarea[name="body-input"]', JSON.stringify(requestBody, null, 2));
    }
    
    // Click the Send button
    await page.click('button[name="send-button"]');
    
    // Wait for the response to load
    await page.waitForTimeout(1000);
    
    // Take a screenshot and save it
    const filePath = path.join(screenshotsDir, fileName);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log(`Screenshot saved to ${filePath}`);
    
  } catch (error) {
    console.error(`Error taking screenshot for ${method} ${endpoint}:`, error);
  } finally {
    await browser.close();
  }
}

// Function to create a simple HTML postman-like interface for screenshots
async function createHtmlPostmanInterface(method, endpoint, requestBody, responseData, fileName) {
  console.log(`Creating HTML Postman interface for ${method} ${endpoint}...`);
  
  const methodColors = {
    'GET': '#3b82f6',
    'POST': '#10b981',
    'PUT': '#f59e0b',
    'DELETE': '#ef4444'
  };
  
  const responseStatus = responseData.success ? 200 : 400;
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Postman - ${method} ${endpoint}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
    }
    .postman-container {
      max-width: 900px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      overflow: hidden;
    }
    .postman-header {
      background-color: #f26b3a;
      color: white;
      padding: 15px 20px;
      display: flex;
      align-items: center;
    }
    .postman-header h1 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .postman-header img {
      height: 30px;
      margin-right: 10px;
    }
    .request-section {
      padding: 20px;
      border-bottom: 1px solid #eaeaea;
    }
    .url-bar {
      display: flex;
      margin-bottom: 15px;
    }
    .method-badge {
      background-color: ${methodColors[method]};
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-weight: bold;
      margin-right: 10px;
      width: 70px;
      text-align: center;
    }
    .url-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-family: monospace;
    }
    .send-button {
      padding: 8px 15px;
      background-color: #4f46e5;
      color: white;
      border: none;
      border-radius: 4px;
      font-weight: bold;
      margin-left: 10px;
      cursor: pointer;
    }
    .request-body, .response-body {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 4px;
      overflow: auto;
    }
    pre {
      margin: 0;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
    }
    .response-section {
      padding: 20px;
    }
    .response-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 14px;
      color: white;
      background-color: ${responseStatus >= 200 && responseStatus < 300 ? '#22c55e' : '#ef4444'};
    }
    .request-tab {
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .request-tab h3 {
      margin-top: 0;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="postman-container">
    <div class="postman-header">
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4wQJEhQJ6VZ3CQAAAVdJREFUaN7tmi1SwzAUx3+TUeIqcAE6wIFs6QVKBydpBYfBA1BxAA6AqGBkJnMADsBMuQBdBi/TZWlCPtrkOe9/RmP1vffT09fLBssxBs7AB6AAKEHUQGi+V8DNuoOdLRnfAR7MeN+Il5KW/JL4egWAo5MwlJK+tArURJKDIrLfPFU4wNUcIFM2yy5PAZDZwHVDe1akKoRIvsUlKlsREAMnxJ0ZSYEjYK+DjwDIgUfgrGksWlLWXfQIXHQZbAHJUHMpM0Wb5VxaFWK3gRjUjG9LPhYgpyZPpDVA5q2NLEC+zWGYtATxLBH+H/JrJVIj/jYgP3bdcifI31wnZVcNsFfkzXLbAhRtf89NwU19+3OhC1Q2kA+TexcMrPjeRVu0+UWHX3IkstDyE6DoyJcj0WS7aN2R9hB/QTIQkIGADARkICADARkIyEDgkPLTYSGVYhTiZfFahKUYFZChwQFwDKF/7Q9rG0IUW3KFfwAAAABJRU5ErkJggg==">
      <h1>POSTMAN</h1>
    </div>
    
    <div class="request-section">
      <div class="url-bar">
        <div class="method-badge">${method}</div>
        <div class="url-input">${API_BASE_URL}${endpoint}</div>
        <button class="send-button">Send</button>
      </div>
      
      ${requestBody ? `
      <div class="request-tab">
        <h3>Request Body</h3>
        <div class="request-body">
          <pre>${JSON.stringify(requestBody, null, 2)}</pre>
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="response-section">
      <div class="response-header">
        <h3>Response</h3>
        <div class="status-badge">Status: ${responseStatus}</div>
      </div>
      
      <div class="response-body">
        <pre>${JSON.stringify(responseData, null, 2)}</pre>
      </div>
    </div>
  </div>
</body>
</html>`;

  const filePath = path.join(screenshotsDir, fileName);
  fs.writeFileSync(filePath, html);
  console.log(`HTML Postman interface saved to ${filePath}`);
}

// Main function to create all screenshots
async function createAllScreenshots() {
  try {
    console.log('Starting to create Postman-like screenshots...');
    
    // 1. Create a new student (POST)
    const createResponse = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStudent)
    });
    const createData = await createResponse.json();
    await createHtmlPostmanInterface('POST', '/students', newStudent, createData, 'POST-create-student.html');
    
    // Store the student ID for later requests
    const studentId = createData.data.id;
    
    // 2. Get all students (GET)
    const getAllResponse = await fetch(`${API_BASE_URL}/students`);
    const getAllData = await getAllResponse.json();
    await createHtmlPostmanInterface('GET', '/students', null, getAllData, 'GET-all-students.html');
    
    // 3. Get one student by ID (GET)
    const getOneResponse = await fetch(`${API_BASE_URL}/students/${studentId}`);
    const getOneData = await getOneResponse.json();
    await createHtmlPostmanInterface('GET', `/students/${studentId}`, null, getOneData, 'GET-student-by-id.html');
    
    // 4. Update student (PUT)
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
    await createHtmlPostmanInterface('PUT', `/students/${studentId}`, updatedStudent, updateData, 'PUT-update-student.html');
    
    // 5. Delete student (DELETE)
    const deleteResponse = await fetch(`${API_BASE_URL}/students/${studentId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteResponse.json();
    await createHtmlPostmanInterface('DELETE', `/students/${studentId}`, null, deleteData, 'DELETE-student.html');
    
    console.log('All Postman-like screenshots created successfully!');
    
  } catch (error) {
    console.error('Error creating screenshots:', error);
  }
}

// Run the main function
createAllScreenshots();