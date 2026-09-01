import { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  X,
  AlertTriangle,
  Calendar,
  Clock,
  Bookmark,
  MessageSquare,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  INITIAL_ADMIN_USERS,
  type AdminUser,
} from '../../data/mockAdminData';
import { USER_TYPE_LABELS, type UserType } from '../../data/mockUserData';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants } from '../../styles/animation';

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_ADMIN_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal States
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);
  const [actionModal, setActionModal] = useState<{
    user: AdminUser;
    type: 'activate' | 'deactivate';
  } | null>(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.organization && u.organization.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedUserType === 'all' || u.userType === selectedUserType;
      const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [users, searchTerm, selectedUserType, selectedStatus]);

  // Handlers for User Actions
  const handleToggleStatusConfirm = () => {
    if (!actionModal) return;
    const { user, type } = actionModal;
    const nextStatus = type === 'activate' ? 'Active' : 'Inactive';

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    setActionModal(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* PAGE HEADER */}
        <div>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Users</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage user accounts, monitor activity, review MSME classifications, and adjust access statuses.
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All User Types</option>
                <option value="msme">MSME / Startup</option>
                <option value="engineer">Engineer / QA</option>
                <option value="procurement">Procurement Officer</option>
                <option value="consumer">Consumer</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>

              {(searchTerm || selectedUserType !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedUserType('all');
                    setSelectedStatus('all');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Email & Org</th>
                  <th className="py-3.5 px-4">User Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 text-sm">
                      No users found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {u.fullName}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-gray-900 text-xs font-medium">{u.email}</p>
                        <p className="text-gray-500 text-xs">{u.organization || 'Individual'}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                          {USER_TYPE_LABELS[u.userType as UserType] || u.userType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-semibold ${
                            u.status === 'Active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : u.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'Active'
                                ? 'bg-green-600'
                                : u.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-gray-400'
                            }`}
                          />
                          <span>{u.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{u.joinedDate}</td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">{u.lastActivity}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setDetailUser(u)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                            title="View User Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {u.status === 'Active' ? (
                            <button
                              onClick={() => setActionModal({ user: u, type: 'deactivate' })}
                              className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => setActionModal({ user: u, type: 'activate' })}
                              className="px-2.5 py-1 text-xs font-medium text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 border border-green-200 rounded-md"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {filteredUsers.length} of {users.length} registered users</span>
            <span>Frontend Mock User Directory</span>
          </div>
        </div>

        {/* USER DETAILS MODAL */}
        <AnimatePresence>
          {detailUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 relative space-y-4"
              >
                <button
                  onClick={() => setDetailUser(null)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close user details"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-[#D7193F] font-bold flex items-center justify-center text-base">
                    {detailUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{detailUser.fullName}</h3>
                    <p className="text-xs text-gray-500">{detailUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 block">User Classification</span>
                    <span className="font-semibold text-gray-900">
                      {USER_TYPE_LABELS[detailUser.userType as UserType]}
                    </span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 block">Account Status</span>
                    <span className="font-semibold text-gray-900">{detailUser.status}</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg col-span-2">
                    <span className="text-gray-500 block">Organization</span>
                    <span className="font-semibold text-gray-900">
                      {detailUser.organization || 'N/A (Individual Practitioner)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs text-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-500">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span>Member Since:</span>
                    </span>
                    <span className="font-medium text-gray-900">{detailUser.joinedDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-500">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      <span>Last Session Activity:</span>
                    </span>
                    <span className="font-medium text-gray-900">{detailUser.lastActivity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-500">
                      <Bookmark className="h-3.5 w-3.5 text-gray-400" />
                      <span>Saved Standards Count:</span>
                    </span>
                    <span className="font-medium text-gray-900">{detailUser.savedStandardsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-500">
                      <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                      <span>AI Assistant Queries:</span>
                    </span>
                    <span className="font-medium text-gray-900">{detailUser.conversationsCount}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setDetailUser(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Close Detail View
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CONFIRMATION ACTION MODAL */}
        <AnimatePresence>
          {actionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200 space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-full">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {actionModal.type === 'activate' ? 'Activate User Account' : 'Deactivate User Account'}
                  </h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Are you sure you want to {actionModal.type} access for{' '}
                  <strong className="text-gray-900">{actionModal.user.fullName}</strong>?
                  This is a frontend demo action that updates the session user state.
                </p>
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setActionModal(null)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleStatusConfirm}
                    className={`px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer ${actionModal.type === 'activate'
                      ? 'bg-[#0E8A43] hover:bg-green-700'
                      : 'bg-[#D7193F] hover:bg-[#BE1435]'
                      }`}
                  >
                    Confirm {actionModal.type === 'activate' ? 'Activation' : 'Deactivation'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}

export default UserManagementPage;
