import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import Spinner from "../../components/ui/Spinner";
import { User, UserRole } from "../../services/users/types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  isError,
  selectedUserId,
  onSelectUser,
}) => {
  return (
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
              <td colSpan={6} className="px-6 py-4 text-center text-red-600">
                <div className="flex flex-col items-center">
                  <FaExclamationCircle size={24} className="mb-2" />
                  <p>Error loading users. Please try again.</p>
                </div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                <p className="text-lg mb-2">No users found</p>
                <p className="text-sm">Create a new user or adjust your filters to see results.</p>
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr 
                key={user._id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedUserId === user._id ? "bg-blue-50" : ""
                }`}
                onClick={() => onSelectUser(user._id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                      {user.firstName ? user.firstName[0] : ''}
                      {user.lastName ? user.lastName[0] : ''}
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
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === UserRole.ADMIN 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === UserRole.SUPPORT
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;