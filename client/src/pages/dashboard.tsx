import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ApiInterface from "@/components/api-interface";
import { AlertCircle, Database, Server, Menu, X, FileText, Package } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`w-64 bg-dark text-white ${isMobile ? 'hidden' : 'block'}`}>
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-semibold">Student API Dashboard</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <p className="text-sm text-gray-400 mb-2">API ENDPOINTS</p>
            <ul className="space-y-2">
              <li>
                <a href="#post" className="block px-4 py-2 rounded-md bg-primary bg-opacity-20 text-primary hover:bg-opacity-30 transition">
                  POST /students
                </a>
              </li>
              <li>
                <a href="#get-all" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
                  GET /students
                </a>
              </li>
              <li>
                <a href="#get-one" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
                  GET /students/:id
                </a>
              </li>
              <li>
                <a href="#put" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
                  PUT /students/:id
                </a>
              </li>
              <li>
                <a href="#delete" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition">
                  DELETE /students/:id
                </a>
              </li>
            </ul>

            <div className="mt-8 space-y-2">
              <p className="text-sm text-gray-400 mb-2">PROJECT FILES</p>
              <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                server.js
              </a>
              <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                init-db.js
              </a>
              <a href="#" className="block px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm flex items-center">
                <Package className="h-4 w-4 mr-2" />
                screenshots/
              </a>
            </div>
          </nav>
        </ScrollArea>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-dark text-white py-4 px-4 lg:hidden z-10 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Student API Dashboard</h1>
          <button 
            className="text-white focus:outline-none" 
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-dark text-white z-20 transform transition-transform duration-300 lg:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button 
              className="text-white focus:outline-none" 
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <ScrollArea className="h-screen">
            <nav className="p-4">
              <p className="text-sm text-gray-400 mb-2">API ENDPOINTS</p>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#post" 
                    className="block px-4 py-3 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    POST /students
                  </a>
                </li>
                <li>
                  <a 
                    href="#get-all" 
                    className="block px-4 py-3 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    GET /students
                  </a>
                </li>
                <li>
                  <a 
                    href="#get-one" 
                    className="block px-4 py-3 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    GET /students/:id
                  </a>
                </li>
                <li>
                  <a 
                    href="#put" 
                    className="block px-4 py-3 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PUT /students/:id
                  </a>
                </li>
                <li>
                  <a 
                    href="#delete" 
                    className="block px-4 py-3 rounded-md hover:bg-gray-800 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    DELETE /students/:id
                  </a>
                </li>
              </ul>
            </nav>
          </ScrollArea>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-0 lg:pt-0">
        <div className="p-6 mt-16 lg:mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Student Management API</h2>
                <p className="text-gray-600">A RESTful API for managing student records using Node.js, Express, and SQLite</p>
              </div>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Port 5000
                </span>
              </div>
            </div>
          </div>

          {/* Server Status & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                <h3 className="font-medium">Server Status</h3>
              </div>
              <p className="text-gray-600 text-sm">Running at http://localhost:5000</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-2">
                <Database className="w-4 h-4 mr-2 text-primary" />
                <h3 className="font-medium">Database</h3>
              </div>
              <p className="text-gray-600 text-sm">SQLite3 (in-memory)</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-2">
                <Server className="w-4 h-4 mr-2 text-primary" />
                <h3 className="font-medium">Students Table Schema</h3>
              </div>
              <p className="text-gray-600 text-sm">id, name, rollNumber, email, mobile</p>
            </div>
          </div>

          {/* API Testing Interface */}
          <ApiInterface />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
