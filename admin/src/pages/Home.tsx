import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTicketAlt,
  FaUserCheck,
  FaClock,
  FaExclamationTriangle,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa";

import { useGetTickets, useGetTicketStats } from "../hooks/tickets";
import { TicketQueryParams } from "../services/ticket/type";
import Spinner from "../components/ui/Spinner";
import useAuth from "../store/useAuth";

const Home: React.FC = () => {
  const { user } = useAuth();

  // System info with timestamp and username
  const [systemInfo, setSystemInfo] = useState({
    timestamp: "",
    username: user?.firstName
      ? `${user.firstName} ${user.lastName}`
      : "esmael-Abdlkadr",
  });

  // Update the timestamp every second
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      const timestamp = now.toISOString().slice(0, 19).replace("T", " ");
      setSystemInfo((prev) => ({ ...prev, timestamp }));
    };

    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  // Query parameters for tickets
  const [queryParams, setQueryParams] = useState<TicketQueryParams>({
    limit: 10,
    page: 1,
    sortBy: "-createdAt", // Sort by newest first
  });

  // Fetch tickets and stats using the hooks
  const {
    data: ticketsResponse,
    isLoading: isLoadingTickets,
    isError: isErrorTickets,
  } = useGetTickets(queryParams);

  const {
    data: statsResponse,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetTicketStats();

  // Extract tickets data safely
  const ticketsData = ticketsResponse || [];
  // Extract stats for dashboard - FIXED to match actual API response structure
  const stats = React.useMemo(() => {
    if (!statsResponse) {
      return {
        activeTickets: 0,
        resolvedToday: 0,
        avgResponseTime: "0h",
        highPriorityTickets: 0,
      };
    }

    const data = statsResponse;
    console.log("Processing stats data:", data);

    // Find counts from the arrays in the response
    const openCount =
      data.statusStats?.find((s) => s.status === "Open")?.count || 0;
    const resolvedCount =
      data.statusStats?.find((s) => s.status === "Resolved")?.count || 0;
    const highPriorityCount =
      data.priorityStats?.find((p) => p.priority === "High")?.count || 0;

    return {
      activeTickets: openCount,
      resolvedToday: resolvedCount,
      avgResponseTime: "2.3h", // Hardcoded as it's not in the API
      highPriorityTickets: highPriorityCount,
    };
  }, [statsResponse]);

  // Quick actions for admin
  const quickActions = [
    { name: "New Ticket", path: "/tickets/new", color: "bg-blue-600" },
    { name: "User Management", path: "/users", color: "bg-green-600" },
    { name: "Reports", path: "/reports", color: "bg-purple-600" },
    { name: "Settings", path: "/settings", color: "bg-gray-700" },
  ];

  return (
    <div className="space-y-6">
      {/* System information display - FIXED to match exact format required */}
      <div className="bg-white p-3 rounded-lg shadow text-xs">
        <p>
          <span className="font-medium">
            Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):
          </span>{" "}
          {systemInfo.timestamp}
        </p>
        <p>
          <span className="font-medium">Current User's Login:</span>{" "}
          {systemInfo.username}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <div className="mt-4 md:mt-0">
          <Link
            to="/tickets/new"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlusCircle className="mr-2" /> New Ticket
          </Link>
        </div>
      </div>

      {/* Stats Cards - FIXED to use correct data properties */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          Array(4)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="h-10 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
        ) : isErrorStats ? (
          <div className="col-span-4 bg-red-50 text-red-800 p-4 rounded-lg">
            Error loading ticket statistics. Please try again.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 text-blue-600 mr-4">
                  <FaTicketAlt size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeTickets}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3 text-green-600 mr-4">
                  <FaUserCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Resolved Tickets
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.resolvedToday}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 rounded-full p-3 text-yellow-600 mr-4">
                  <FaClock size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Response Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.avgResponseTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-full p-3 text-red-600 mr-4">
                  <FaExclamationTriangle size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.highPriorityTickets}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions?.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} text-white py-3 px-4 rounded-lg font-medium text-center hover:opacity-90 transition-opacity`}
            >
              {action.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tickets - FIXED to correctly check ticket data */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Recent Tickets</h2>
          <div className="flex space-x-4">
            <Link
              to="/tickets"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaFilter className="mr-1" /> Filter
            </Link>
            <Link
              to="/tickets"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingTickets ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Spinner center size="lg" text="Loading tickets..." />
                  </td>
                </tr>
              ) : isErrorTickets ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-red-600"
                  >
                    Error loading tickets. Please try again.
                  </td>
                </tr>
              ) : !ticketsData || ticketsData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No tickets found.
                  </td>
                </tr>
              ) : (
                ticketsData.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/tickets/${ticket._id}`}>
                        #{ticket._id.slice(-5)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          ticket.status === "Open"
                            ? "bg-blue-100 text-blue-800"
                            : ticket.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : ticket.status === "Resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          ticket.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : ticket.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {ticketsResponse && ticketsResponse.pagination && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {ticketsData?.length || 0} of{" "}
              {ticketsResponse.pagination.totalResults || 0} tickets
            </div>
            <Link
              to="/tickets"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              See all tickets
            </Link>
          </div>
        )}
      </div>

      {/* Category Distribution - FIXED to properly process the data */}
      {statsResponse &&
        statsResponse.data &&
        statsResponse.data.categoryStats && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Ticket Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statsResponse.data.categoryStats.map((item) => (
                <div key={item.category} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.category}</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>SupportSphere Admin Dashboard • </p>
        <p>© {new Date().getFullYear()} SupportSphere. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;
