import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaUserEdit,
  FaTrash,
  FaUserTag,
  FaUserShield,
  FaFilter,
  FaExclamationCircle,
  FaEye,
} from "react-icons/fa";
import Spinner from "../components/ui/Spinner";
import useAuth from "../store/useAuth";
import Modal from "../components/ui/Modal";

// Define mock data for initial development
// Replace with actual API calls
const MOCK_USERS = [
  {
    _id: "67c39c59bc5733efe788c61c",
    firstName: "Esmael",
    lastName: "Abdu",
    email: "esmaelabdlkadr00@gmail.com",
    role: "admin",
    status: "active",
    createdAt: "2023-03-01T10:00:00.000Z",
    lastLogin: "2023-03-01T12:30:00.000Z",
  },
  {
    _id: "67c39c59bc5733efe788c61d",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    role: "support",
    status: "active",
    createdAt: "2023-03-02T09:00:00.000Z",
    lastLogin: "2023-03-02T14:20:00.000Z",
  },
  {
    _id: "67c39c59bc5733efe788c61e",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    role: "user",
    status: "inactive",
    createdAt: "2023-03-03T11:00:00.000Z",
    lastLogin: "2023-03-03T16:45:00.000Z",
  },
  {
    _id: "67c39c59bc5733efe788c61f",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@example.com",
    role: "support",
    status: "active",
    createdAt: "2023-03-04T08:30:00.000Z",
    lastLogin: "2023-03-04T17:15:00.000Z",
  },
  {
    _id: "67c39c59bc5733efe788c620",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    role: "user",
    status: "active",
    createdAt: "2023-03-05T10:15:00.000Z",
    lastLogin: "2023-03-05T15:30:00.000Z",
  },
];

// Role options
const ROLE_OPTIONS = ["admin", "support", "user"];
const STATUS_OPTIONS = ["active", "inactive", "blocked"];

const UsersPage: React.FC = () => {
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

  // State for users data and pagination
  const [users, setUsers] = useState(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    limit: 10,
    totalResults: MOCK_USERS.length,
  });

  // Selected user for actions
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = users.find((u) => u._id === selectedUserId);

  // Search and filters
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Modal states
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [assignRoleModalOpen, setAssignRoleModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Form state for creating/editing user
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    password: "", // Only needed for create
    confirmPassword: "", // Only needed for create
  });

  // Handle searching and filtering
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call your API with the search parameters
    console.log("Searching with filters:", filters);

    // Mocking filtered results
    let filteredUsers = [...MOCK_USERS];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    if (filters.role !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.role === filters.role
      );
    }

    if (filters.status !== "all") {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === filters.status
      );
    }

    setUsers(filteredUsers);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Here you would fetch the new page of data
  };

  // Handle row selection
  const handleRowSelect = (userId: string) => {
    setSelectedUserId((prev) => (prev === userId ? null : userId));
  };

  // User actions
  const handleViewUser = () => {
    if (selectedUserId) {
      setViewUserModalOpen(true);
    }
  };

  const handleCreateUser = () => {
    setIsCreating(true);
    setUserForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });
    setCreateEditModalOpen(true);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setIsCreating(false);
      setUserForm({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role,
        password: "",
        confirmPassword: "",
      });
      setCreateEditModalOpen(true);
    }
  };

  const handleAssignRole = () => {
    if (selectedUserId) {
      setAssignRoleModalOpen(true);
    }
  };

  const handleDeleteUser = () => {
    if (selectedUserId) {
      setDeleteModalOpen(true);
    }
  };

  // Form submission handlers
  const handleSubmitUserForm = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call the API to create/update the user
    console.log(isCreating ? "Creating user:" : "Updating user:", userForm);

    // Close modal after successful submission
    setCreateEditModalOpen(false);

    // Mock update of the users list
    if (isCreating) {
      const newUser = {
        _id: `temp-${Date.now()}`,
        ...userForm,
        status: "active",
        createdAt: new Date().toISOString(),
        lastLogin: null,
      };
      setUsers((prev) => [...prev, newUser]);
    } else if (selectedUserId) {
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUserId
            ? {
                ...user,
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                email: userForm.email,
                role: userForm.role,
              }
            : user
        )
      );
    }
  };

  const handleSubmitRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call the API to change the user's role
    if (selectedUserId) {
      console.log(
        "Changing role for user:",
        selectedUserId,
        "New role:",
        userForm.role
      );

      // Mock update of the users list
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selectedUserId ? { ...user, role: userForm.role } : user
        )
      );

      setAssignRoleModalOpen(false);
    }
  };

  const handleConfirmDelete = async () => {
    // Here you would call the API to delete the user
    if (selectedUserId) {
      console.log("Deleting user:", selectedUserId);

      // Mock removal from the users list
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));

      setDeleteModalOpen(false);
      setSelectedUserId(null);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    const currentPage = pagination.page || 1;
    const pageNumbers = [];

    // Logic to show a reasonable number of page links
    pageNumbers.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pageNumbers.push("...");

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < totalPages - 1) pageNumbers.push("...");

    if (totalPages > 1) pageNumbers.push(totalPages);

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
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <div className="mt-4 sm:mt-0 space-x-2">
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus className="mr-2" /> Add User
          </button>
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
                  placeholder="Search users..."
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
          </div>

          {/* Expanded filters */}
          {isFilterExpanded && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.role}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                >
                  <option value="all">All Roles</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      role: "all",
                      status: "all",
                    });
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons - enabled only when a row is selected */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2">
          <button
            onClick={handleViewUser}
            disabled={!selectedUserId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedUserId
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaEye className="mr-1" /> View Details
          </button>

          <button
            onClick={handleEditUser}
            disabled={!selectedUserId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedUserId
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaUserEdit className="mr-1" /> Edit
          </button>

          <button
            onClick={handleAssignRole}
            disabled={!selectedUserId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedUserId
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaUserTag className="mr-1" /> Assign Role
          </button>

          <button
            onClick={handleDeleteUser}
            disabled={!selectedUserId}
            className={`px-3 py-1.5 rounded-md flex items-center ${
              selectedUserId
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaTrash className="mr-1" /> Delete
          </button>

          {selectedUserId && (
            <div className="ml-auto text-sm text-gray-600 flex items-center">
              Selected: {selectedUser?.firstName} {selectedUser?.lastName}
              <button
                onClick={() => setSelectedUserId(null)}
                className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                title="Clear selection"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Spinner center size="lg" text="Loading users..." />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-red-600"
                  >
                    <div className="flex flex-col items-center">
                      <FaExclamationCircle size={24} className="mb-2" />
                      <p>Error loading users. Please try again.</p>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <p className="text-lg mb-2">No users found</p>
                    <p className="text-sm">
                      Create a new user or adjust your filters to see results.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedUserId === user._id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleRowSelect(user._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "support"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.page * pagination.limit,
                pagination.totalResults
              )}{" "}
              of {pagination.totalResults} users
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
      {/* View User Details Modal */}
      <Modal
        isOpen={viewUserModalOpen}
        onClose={() => setViewUserModalOpen(false)}
        title="User Details"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xl font-medium mr-4">
                {selectedUser.firstName[0]}
                {selectedUser.lastName[0]}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p>{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p>{selectedUser.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created On</p>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Login</p>
                <p>
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleDateString()
                    : "Never"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h4 className="text-md font-medium mb-2">Recent Activity</h4>
              <p className="text-gray-500 italic">
                Activity tracking will be implemented in a future update.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={createEditModalOpen}
        onClose={() => setCreateEditModalOpen(false)}
        title={isCreating ? "Create User" : "Edit User"}
        size="md"
      >
        <form onSubmit={handleSubmitUserForm} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={userForm.firstName}
                onChange={(e) =>
                  setUserForm((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={userForm.lastName}
                onChange={(e) =>
                  setUserForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg p-2"
              value={userForm.email}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={userForm.role}
              onChange={(e) =>
                setUserForm((prev) => ({ ...prev, role: e.target.value }))
              }
              required
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {isCreating && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg p-2"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required={isCreating}
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full border rounded-lg p-2"
                  value={userForm.confirmPassword}
                  onChange={(e) =>
                    setUserForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required={isCreating}
                />
                {userForm.password !== userForm.confirmPassword &&
                  userForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCreateEditModalOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              disabled={
                isCreating && userForm.password !== userForm.confirmPassword
              }
            >
              {isCreating ? "Create User" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Role Modal */}
      <Modal
        isOpen={assignRoleModalOpen}
        onClose={() => setAssignRoleModalOpen(false)}
        title="Assign Role"
        size="sm"
      >
        <form onSubmit={handleSubmitRoleChange} className="space-y-4">
          {selectedUser && (
            <>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                  {selectedUser.firstName[0]}
                  {selectedUser.lastName[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Role
                </label>
                <div className="text-sm text-gray-900 mb-4">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      selectedUser.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : selectedUser.role === "support"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Role
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={userForm.role}
                  onChange={(e) =>
                    setUserForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  required
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>

                <div className="mt-4 text-xs text-gray-500">
                  <div className="font-medium mb-1">Role permissions:</div>
                  <ul className="list-disc list-inside">
                    <li>
                      <strong>Admin:</strong> Full access to all features
                    </li>
                    <li>
                      <strong>Support:</strong> Can manage tickets and users
                    </li>
                    <li>
                      <strong>User:</strong> Can create and view tickets
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setAssignRoleModalOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              disabled={selectedUser && userForm.role === selectedUser.role}
            >
              <FaUserTag className="inline mr-1" /> Assign Role
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete User"
        size="sm"
      >
        <div className="text-center">
          <FaExclamationCircle className="mx-auto text-red-500 text-5xl mb-4" />

          {selectedUser && (
            <>
              <h3 className="text-lg font-medium mb-2">Delete User Account?</h3>
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete the user account for:
              </p>
              <div className="font-medium text-gray-900 mb-6">
                {selectedUser.firstName} {selectedUser.lastName} (
                {selectedUser.email})
              </div>
              <p className="text-sm text-red-600 mb-4">
                This action cannot be undone. All data associated with this user
                will be permanently deleted.
              </p>
            </>
          )}

          <div className="flex justify-center space-x-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
