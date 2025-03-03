import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import useAuth from "../store/useAuth"; 
import { 
  useGetAllUsers, 
  useInviteUser, 
  useAssignRole 
} from "../hooks/users"
import { 
  User,
  UserRole, 
  UserQueryParams, 
  AssignRoleDto, 
  CreateUserInviteDto 
} from "../services/users/types";
import showToast from "../utils/toastHelper";

// Import our new components
import UserTable from "../sections/users/UserTable";
import UserFilterForm from "../sections/users/UserFilterForm";
import UserActionButtons from "../sections/users/UserActions";
import UserPagination from "../sections/users/UserPagianation";
import ViewUserModal from "../sections/users/ViewUserModal";
import CreateEditUserModal from "../sections/users/editUser";
import DeleteUserModal from "../sections/users/DeleteUser";
import AssignRoleModal from "../sections/users/AssignRole";

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  
  // System info with timestamp and username
  const [systemInfo, setSystemInfo] = useState({
    timestamp: "",
    username: user?.firstName 
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

  // Query parameters
  const [queryParams, setQueryParams] = useState<UserQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "-createdAt"
  });

  // Selected user for actions
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
  const [userForm, setUserForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    role: UserRole.SUPPORT_AGENT
  });

  // Fetch users data
  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
  } = useGetAllUsers(queryParams);

  // Mutations
  const { 
    inviteUser, 
    inviteLoading 
  } = useInviteUser();
  
  const { 
    assignRole, 
    assignRoleLoading 
  } = useAssignRole(selectedUserId || "");

  // Extract users from the response
  const users = usersResponse || [];
  const selectedUser = users.find((u: User) => u._id === selectedUserId) || null;
  const totalResults = usersResponse?.results || 0;

  // Handle searching and filtering
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedQuery: UserQueryParams = { 
      ...queryParams, 
      page: 1,
      search: filters.search || undefined
    };
    
    if (filters.role !== "all") {
      updatedQuery.role = filters.role;
    }
    
    if (filters.status !== "all") {
      updatedQuery.status = filters.status;
    }
    
    setQueryParams(updatedQuery);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
    });
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setQueryParams(prev => ({ ...prev, page: newPage }));
  };

  // Handle row selection
  const handleRowSelect = (userId: string) => {
    setSelectedUserId(prev => prev === userId ? null : userId);
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
      role: UserRole.SUPPORT_AGENT,
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
      });
      setCreateEditModalOpen(true);
    }
  };

  const handleAssignRole = () => {
    if (selectedUserId && selectedUser) {
      setUserForm(prev => ({ ...prev, role: selectedUser.role }));
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
    

    
    try {
      if (isCreating) {
        // Invite new user
        const userData: CreateUserInviteDto = {
          firstName: userForm.firstName,
          lastName: userForm.lastName,
          email: userForm.email,
          role: userForm.role,
        };
        
        await inviteUser(userData);
        showToast("User invitation sent successfully", "success");
        
        // Close modal and refetch users
        setCreateEditModalOpen(false);
        refetch();
      } else {
        // Update user functionality (not fully implemented yet)
        setCreateEditModalOpen(false);
        showToast("Edit functionality coming soon", "error");
      }
    } catch (error) {
      console.error("Error submitting user form:", error);
      showToast("Failed to process user. Please try again.", "error");
    }
  };

  const handleSubmitRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedUserId) {
        const roleData: AssignRoleDto = {
          roleName: userForm.role
        };
        
        await assignRole(roleData);
        showToast("Role assigned successfully", "success");
        setAssignRoleModalOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Error changing role:", error);
      showToast("Failed to change user role", "error");
    }
  };

  const handleConfirmDelete = async () => {
    // Delete functionality (not fully implemented yet)
    setDeleteModalOpen(false);
    setSelectedUserId(null);
    showToast("Delete functionality coming soon", "error");
  };

  return (
    <div className="space-y-6">
      {/* System information display */}
      <div className="bg-white p-3 rounded-lg shadow text-xs">
        <p>
          <span className="font-medium">Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted):</span>{" "}
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

      {/* Main content area with filters, actions, table and pagination */}
      <div className="bg-white rounded-lg shadow">
        {/* Search and filters */}
        <UserFilterForm 
          filters={filters}
          isFilterExpanded={isFilterExpanded}
          onFilterChange={handleFilterChange}
          onToggleFilters={() => setIsFilterExpanded(!isFilterExpanded)}
          onSearch={handleSearch}
          onClearFilters={handleClearFilters}
        />

        {/* Action buttons */}
        <UserActionButtons
          selectedUserId={selectedUserId}
          selectedUser={selectedUser}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onAssignRole={handleAssignRole}
          onDeleteUser={handleDeleteUser}
          onClearSelection={() => setSelectedUserId(null)}
        />

        {/* Users table */}
        <UserTable
          users={users}
          isLoading={isLoading}
          isError={isError}
          selectedUserId={selectedUserId}
          onSelectUser={handleRowSelect}
        />
        
        {/* Pagination */}
        <UserPagination
          currentPage={queryParams.page || 1}
          totalResults={totalResults}
          limit={queryParams.limit || 10}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Modals */}
      <ViewUserModal
        isOpen={viewUserModalOpen}
        onClose={() => setViewUserModalOpen(false)}
        user={selectedUser}
      />

      <CreateEditUserModal
        isOpen={createEditModalOpen}
        onClose={() => setCreateEditModalOpen(false)}
        onSubmit={handleSubmitUserForm}
        formData={userForm}
        setFormData={setUserForm}
        isCreating={isCreating}
        isLoading={inviteLoading}
      />

      <AssignRoleModal
        isOpen={assignRoleModalOpen}
        onClose={() => setAssignRoleModalOpen(false)}
        onSubmit={handleSubmitRoleChange}
        user={selectedUser}
        selectedRole={userForm.role}
        setSelectedRole={(role) => setUserForm(prev => ({ ...prev, role }))}
        isLoading={assignRoleLoading}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;