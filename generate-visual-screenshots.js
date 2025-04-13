import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Read API response data
const postData = JSON.parse(fs.readFileSync(path.join(screenshotsDir, '1-post-create-student.json'), 'utf8'));
const getAllData = JSON.parse(fs.readFileSync(path.join(screenshotsDir, '2-get-all-students.json'), 'utf8'));
const getOneData = JSON.parse(fs.readFileSync(path.join(screenshotsDir, '3-get-student-by-id.json'), 'utf8'));
const putData = JSON.parse(fs.readFileSync(path.join(screenshotsDir, '4-put-update-student.json'), 'utf8'));
const deleteData = JSON.parse(fs.readFileSync(path.join(screenshotsDir, '5-delete-student.json'), 'utf8'));

// Generate HTML screenshots
const generateHTMLScreenshot = (operation, data) => {
  const requestTitle = {
    'post': 'POST /api/students - Create Student',
    'get-all': 'GET /api/students - Get All Students',
    'get-one': `GET /api/students/${data.request.url.split('/').pop()} - Get Student By ID`,
    'put': `PUT /api/students/${data.request.url.split('/').pop()} - Update Student`,
    'delete': `DELETE /api/students/${data.request.url.split('/').pop()} - Delete Student`
  };

  const requestBody = data.request.body 
    ? `<div class="request-body">
         <h3>Request Body:</h3>
         <pre>${JSON.stringify(data.request.body, null, 2)}</pre>
       </div>` 
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${requestTitle[operation]} Screenshot</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #2563eb;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    h2 {
      color: #4b5563;
      margin-top: 20px;
    }
    h3 {
      color: #6b7280;
      margin-top: 15px;
      font-size: 16px;
    }
    .request-info {
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .method {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      color: white;
      margin-right: 10px;
    }
    .post { background-color: #10b981; }
    .get { background-color: #3b82f6; }
    .put { background-color: #f59e0b; }
    .delete { background-color: #ef4444; }
    .url {
      font-family: monospace;
      font-size: 16px;
    }
    .response-info {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 15px;
      border-radius: 5px;
    }
    .status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: bold;
      color: white;
      background-color: ${data.response.status >= 200 && data.response.status < 300 ? '#22c55e' : '#ef4444'};
    }
    pre {
      background-color: #f1f5f9;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>${requestTitle[operation]}</h1>
  
  <h2>Request</h2>
  <div class="request-info">
    <div>
      <span class="method ${data.request.method.toLowerCase()}">${data.request.method}</span>
      <span class="url">${data.request.url}</span>
    </div>
    ${requestBody}
  </div>
  
  <h2>Response</h2>
  <div class="response-info">
    <div>
      <span class="status">${data.response.status}</span>
      <span>${data.response.statusText || ''}</span>
    </div>
    <h3>Response Body:</h3>
    <pre>${JSON.stringify(data.response.data, null, 2)}</pre>
  </div>
</body>
</html>`;

  const filePath = path.join(screenshotsDir, `${operation}-screenshot.html`);
  fs.writeFileSync(filePath, html);
  console.log(`Generated HTML screenshot for ${operation} at ${filePath}`);
};

// Generate screenshots for each operation
generateHTMLScreenshot('post', postData);
generateHTMLScreenshot('get-all', getAllData);
generateHTMLScreenshot('get-one', getOneData);
generateHTMLScreenshot('put', putData);
generateHTMLScreenshot('delete', deleteData);

console.log('\nAll HTML screenshots generated successfully!');
console.log(`They are available in the ${screenshotsDir} directory.`);
console.log('\nHere\'s what you can do with these screenshots:');
console.log('1. View the HTML files in a browser to see formatted API request/response details');
console.log('2. Take browser screenshots of each HTML file to include in your README.md');
console.log('3. Add the JSON files to your repository for reference\n');