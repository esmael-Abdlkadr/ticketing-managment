import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaExclamationCircle,
  FaDownload,
  FaCommentDots,
} from "react-icons/fa";

import {
  useGetTickets,
  useGetTicketById,
  useUpdateTicket,
  useDeleteTicket,
} from "../hooks/tickets";
import { TicketQueryParams } from "../services/ticket/type";
import Spinner from "../components/ui/Spinner";
import useAuth from "../store/useAuth";
import TicketDetailModal from "../sections/TicketDetail";
import UpdateStatusModal from "../sections/UpdateTicket";
import ConfirmDeleteModal from "../sections/DeleteTicket";

// Define available filters
const STATUS_OPTIONS = ["All", "Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];
const CATEGORY_OPTIONS = [
  "All",
  "Technical",
  "Billing",
  "Feature Request",
  "Account",
  "Other",
];
const SORT_OPTIONS = [
  { value: "-createdAt", label: "Newest First" },
  { value: "createdAt", label: "Oldest First" },
  { value: "-priority", label: "Highest Priority" },
  { value: "status", label: "Status" },
];

const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // System info with timestamp and username
  const [systemInfo, setSystemInfo] = useState({
    timestamp: "",
    username: user?.firstName
    
  });

  // State for selected ticket
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

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

  // Filter and pagination state
  const [queryParams, setQueryParams] = useState<TicketQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "-createdAt",
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    priority: "All",
    category: "All",
  });

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Fetch tickets with current query parameters
  const {
    data: ticketsResponse,
    isLoading,
    isError,
    refetch,
  } = useGetTickets(queryParams);


  const {
    data: ticketDetailResponse,
    isLoading: isLoadingTicketDetail,
    refetch: refetchTicket,
  } = useGetTicketById(selectedTicketId || "");



  const { updateTicket, updateTicketLoading } = useUpdateTicket(
    selectedTicketId || ""
  );


  const { deleteTicket, deleteTicketLoading } = useDeleteTicket(
    selectedTicketId || ""
  );

 
  const tickets = ticketsResponse || [];
  const pagination = ticketsResponse?.pagination || {
    page: 1,
    totalPages: 1,
    totalResults: 0,
  };
  const selectedTicket = ticketDetailResponse;

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setQueryParams((prev) => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };
  const handleAnswer = () => {
    if (selectedTicketId) {
      navigate(`/tickets/answer/${selectedTicketId}`);
    }
  };

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedQuery: TicketQueryParams = { ...queryParams, page: 1 };

    if (filters.search) updatedQuery.search = filters.search;
    if (filters.status !== "All") updatedQuery.status = filters.status;
    if (filters.priority !== "All") updatedQuery.priority = filters.priority;
    if (filters.category !== "All") updatedQuery.category = filters.category;

    setQueryParams(updatedQuery);
    refetch();
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  // Handle sort change
  const handleSortChange = (sortOption: string) => {
    setQueryParams((prev) => ({ ...prev, sortBy: sortOption }));
  };

  // Handle row selection
  const handleRowSelect = (ticketId: string) => {
    setSelectedTicketId((prevId) => (prevId === ticketId ? null : ticketId));
  };

  // Handle ticket actions
  const handleViewDetails = () => {
    if (selectedTicketId) {
      setDetailModalOpen(true);
      refetchTicket();
    }
  };

  const handleOpenStatusUpdate = () => {
    if (selectedTicketId) {
      setStatusModalOpen(true);
    }
  };

  interface UpdateStatusData {
    status: string;
    priority?: string;
    category?: string;
  }

  const handleUpdateStatus = async (data: UpdateStatusData) => {
    if (selectedTicketId) {
      await updateTicket(data);
      setStatusModalOpen(false);
      refetch();
    }
  };

  const handleOpenDeleteConfirm = () => {
    if (selectedTicketId) {
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteTicket = async () => {
    if (selectedTicketId) {
      await deleteTicket(selectedTicketId);
      setDeleteModalOpen(false);
      setSelectedTicketId(null);
      refetch();
    }
  };

  const handleAssign = () => {
    // Will be implemented later
    alert("Assign functionality will be implemented soon!");
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
    const currentPage = pagination?.page || 1;
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Calculate range to show around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pageNumbers.push("...");
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="space-y-6">
      {/* System information display */}
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

      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
        <div className="mt-4 sm:mt-0 space-x-2">
          <Link
            to="/tickets/new"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> New Ticket
          </Link>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="w-full md:w-auto flex-grow"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-blue-600 text-white p-1 rounded-md"
                >
                  Go
                </button>
              </div>
            </form>

            {/* Filter toggle button */}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              <FaFilter className="mr-2" />
              {isFilterExpanded ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Export button */}
            <button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              <FaDownload className="mr-2" /> Export
            </button>
          </div>

          {/* Expanded filters */}
          {isFilterExpanded && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={queryParams.sortBy || "-createdAt"}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-4">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      status: "All",
                      priority: "All",
                      category: "All",
                    });
                    setQueryParams({
                      page: 1,
                      limit: 10,
                      sortBy: "-createdAt",
                    });
                  }}
                  className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons - enabled only when a row is selected */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
          <button
            onClick={handleViewDetails}
            disabled={!selectedTicketId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedTicketId
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaEye className="mr-1" /> View Details
          </button>
          <button
      onClick={handleAnswer}
      disabled={!selectedTicketId}
      className={`px-3 py-1.5 rounded-md flex items-center ${
        selectedTicketId
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
    >
      <FaCommentDots className="mr-1" /> Answer
    </button>

          <button
            onClick={handleOpenStatusUpdate}
            disabled={!selectedTicketId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedTicketId
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaEdit className="mr-1" /> Update Status
          </button>

          <button
            onClick={handleOpenDeleteConfirm}
            disabled={!selectedTicketId || deleteTicketLoading}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedTicketId && !deleteTicketLoading
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaTrash className="mr-1" />{" "}
            {deleteTicketLoading ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedTicketId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedTicketId
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaUserPlus className="mr-1" /> Assign
          </button>

          {selectedTicketId && (
            <div className="ml-auto text-sm text-gray-600 flex items-center">
              Selected: #{selectedTicketId.slice(-5)}
              <button
                onClick={() => setSelectedTicketId(null)}
                className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                title="Clear selection"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Tickets table */}
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
                  Category
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Spinner center size="lg" text="Loading tickets..." />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-red-600"
                  >
                    <div className="flex flex-col items-center">
                      <FaExclamationCircle size={24} className="mb-2" />
                      <p>Error loading tickets. Please try again.</p>
                    </div>
                  </td>
                </tr>
              ) : !tickets || tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <p className="text-lg mb-2">No tickets found</p>
                    <p className="text-sm">
                      Create a new ticket or adjust your filters to see results.
                    </p>
                  </td>
                </tr>
              ) : (
                tickets?.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedTicketId === ticket._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleRowSelect(ticket._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      #{ticket._id.slice(-5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
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
                      {ticket.category}
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

        {/* Pagination */}
        {!isLoading && !isError && tickets && tickets.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * (queryParams.limit || 10) + 1} to{" "}
              {Math.min(
                pagination.page * (queryParams.limit || 10),
                pagination.totalResults
              )}{" "}
              of {pagination.totalResults} tickets
            </div>
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="mr-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {getPageNumbers().map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === "..." ? (
                    <span className="px-3 py-1">...</span>
                  ) : (
                    <button
                      onClick={() =>
                        typeof pageNum === "number" && handlePageChange(pageNum)
                      }
                      className={`px-3 py-1 mx-1 rounded-md ${
                        pageNum === pagination.page
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="ml-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modals */}
      <TicketDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        ticket={selectedTicket}
        isLoading={isLoadingTicketDetail}
      />

      <UpdateStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        ticket={selectedTicket}
        onUpdate={handleUpdateStatus}
        isLoading={updateTicketLoading}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteTicket}
        ticketId={selectedTicketId}
        isLoading={deleteTicketLoading}
      />
    </div>
  );
};

export default TicketsPage;
