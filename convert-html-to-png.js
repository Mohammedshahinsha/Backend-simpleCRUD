import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to screenshots directory
const screenshotsDir = path.join(__dirname, 'screenshots');

// Function to convert HTML file to PNG
async function convertHtmlToPng(htmlFilePath, pngFilePath) {
  console.log(`Converting ${htmlFilePath} to PNG...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });
    
    // Read HTML file content
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
    // Set content directly instead of navigating to file
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    await page.screenshot({
      path: pngFilePath,
      fullPage: false,
    });
    
    console.log(`Successfully saved PNG to ${pngFilePath}`);
  } catch (error) {
    console.error(`Error converting HTML to PNG: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Main function to convert all HTML files
async function convertAllHtmlToPng() {
  try {
    console.log('Starting HTML to PNG conversion...');
    
    // HTML files to convert
    const htmlFiles = [
      'POST-create-student.html',
      'GET-all-students.html',
      'GET-student-by-id.html',
      'PUT-update-student.html',
      'DELETE-student.html'
    ];
    
    // Convert each HTML file to PNG
    for (const htmlFile of htmlFiles) {
      const htmlFilePath = path.join(screenshotsDir, htmlFile);
      const pngFilePath = path.join(screenshotsDir, htmlFile.replace('.html', '.png'));
      
      await convertHtmlToPng(htmlFilePath, pngFilePath);
    }
    
    console.log('All HTML files have been converted to PNG successfully!');
  } catch (error) {
    console.error('Conversion process failed:', error);
  }
}

// Run the conversion
convertAllHtmlToPng();