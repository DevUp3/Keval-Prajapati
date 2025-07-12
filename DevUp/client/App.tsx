import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import Tags from "./pages/Tags";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Index />
                    </Layout>
                  }
                />
                <Route
                  path="/ask"
                  element={
                    <Layout>
                      <AskQuestion />
                    </Layout>
                  }
                />
                <Route
                  path="/question/:id"
                  element={
                    <Layout>
                      <QuestionDetail />
                    </Layout>
                  }
                />
                <Route
                  path="/tags"
                  element={
                    <Layout>
                      <Tags />
                    </Layout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <Layout>
                      <Users />
                    </Layout>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <Layout>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold mb-4">
                          User Profile
                        </h1>
                        <p className="text-muted-foreground">
                          User profile page will be implemented next
                        </p>
                      </div>
                    </Layout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Layout>
                      <Login />
                    </Layout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Layout>
                      <Register />
                    </Layout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Layout>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                        <p className="text-muted-foreground">
                          Profile page will be implemented next
                        </p>
                      </div>
                    </Layout>
                  }
                />
                <Route
                  path="/my-questions"
                  element={
                    <Layout>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold mb-4">
                          My Questions
                        </h1>
                        <p className="text-muted-foreground">
                          My questions page will be implemented next
                        </p>
                      </div>
                    </Layout>
                  }
                />
                <Route
                  path="/my-answers"
                  element={
                    <Layout>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold mb-4">My Answers</h1>
                        <p className="text-muted-foreground">
                          My answers page will be implemented next
                        </p>
                      </div>
                    </Layout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Layout>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold mb-4">Settings</h1>
                        <p className="text-muted-foreground">
                          Settings page will be implemented next
                        </p>
                      </div>
                    </Layout>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route
                  path="*"
                  element={
                    <Layout>
                      <NotFound />
                    </Layout>
                  }
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
