import { useState } from "react";
import Modal from "../components/ui/Modal";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

const UpdateStatusModal = ({
  isOpen,
  onClose,
  ticket,
  onUpdate,
  isLoading,
}) => {
  const [status, setStatus] = useState(ticket?.status || "Open");
  const [priority, setPriority] = useState(ticket?.priority || "Medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ status, priority });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Ticket Status"
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="w-full border rounded-lg p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
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
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? "Updating..." : "Update Ticket"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateStatusModal;
