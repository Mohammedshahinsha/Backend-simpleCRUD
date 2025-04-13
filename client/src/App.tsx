import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import PostmanSimulation from "@/pages/postman-simulation";

function Router() {
  return (
    <>
      <nav className="bg-gray-50 p-4 border-b mb-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">Student API</h1>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/postman" className="text-blue-600 hover:underline">
                Postman Testing
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/postman" component={PostmanSimulation} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
