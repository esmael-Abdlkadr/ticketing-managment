import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, toastOption } from "./config";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./utils/ErrorBoundary";
import Spinner from "./components/ui/Spinner";
const Layout = lazy(() => import("./pages/Layout"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Tickets = lazy(() => import("./pages/Tickets"));
const Users = lazy(() => import("./pages/Users"));
const CompleteRegistration = lazy(() => import("./pages/CompleetRegistration"));
const TicketAnswer= lazy(() => import("./pages/TicketAnswer"));

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/complete-registration" element={<CompleteRegistration />} />

              <Route path={"/"} element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/users" element={<Users />} />
                <Route path="/tickets/answer/:id" element={<TicketAnswer />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="bottom-center" toastOptions={toastOption} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
