import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, toastOption } from "./config";
import { Toaster } from "react-hot-toast";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./utils/ErrorBoundary";
import Spinner from "./components/Spinner";
import Layout from "./page/Layout";

const NotFound = lazy(() => import("./page/NotFound"));
const Home = lazy(() => import("./page/Home"));
const Login = lazy(() => import("./page/Login"));
const Signup = lazy(() => import("./page/Signup"));
const CreateTicket = lazy(() => import("./page/CreateTicket"));
const Verify = lazy(() => import("./page/VerifyOtp"));
const Tickets = lazy(() => import("./page/TicketList"));
const TicketDetail = lazy(() => import("./page/TicketDetail"));
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/" element={<Home />} />

              <Route path={"/"} element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/create-ticket" element={<CreateTicket />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />

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
