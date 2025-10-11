import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute"; // 👈 import

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewSolicitation from "./pages/SolicitationSala/NewSolicitation";
import SolicitationList from "./pages/SolicitationSala/SolicitationList";
import TeachersList from "./pages/Management/TeachersList";
import UsersList from "./pages/Management/UsersList";
import SchedulesList from "./pages/Management/SchedulesList";
import RoomsList from "./pages/Management/RoomsList";
import Agenda from "./pages/Agenda";
import Reports from "./pages/Reports";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import RequerimentoLaboratorio from "./pages/SolicitationLaboratorio/NewSolicitationLab";
import LabList from "./pages/Management/LabList";
import About from "./pages/About";
import SearchSolicitation from "./pages/SearchSolicitation";
import SolicitationLabList from "./pages/SolicitationLaboratorio/SolicitationLabList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login (rota pública) */}
          <Route path="/" element={<Login />} />

          {/* Todas as outras rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitation/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewSolicitation />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitation/newlab"
            element={
              <ProtectedRoute>
                <Layout>
                  <RequerimentoLaboratorio />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitation/list"
            element={
              <ProtectedRoute>
                <Layout>
                  <SolicitationList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitation/search"
            element={
              <ProtectedRoute>
                <Layout>
                  <SearchSolicitation />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/agenda"
            element={
              <ProtectedRoute>
                <Layout>
                  <Agenda />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/teachers"
            element={
              <ProtectedRoute>
                <Layout>
                  <TeachersList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <UsersList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/labs"
            element={
              <ProtectedRoute>
                <Layout>
                  <LabList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/schedules"
            element={
              <ProtectedRoute>
                <Layout>
                  <SchedulesList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/management/rooms"
            element={
              <ProtectedRoute>
                <Layout>
                  <RoomsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/solicitation/lab-list"
            element={
              <ProtectedRoute>
                <Layout>
                  <SolicitationLabList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Layout>
                  <Support />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <About />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotFound />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
