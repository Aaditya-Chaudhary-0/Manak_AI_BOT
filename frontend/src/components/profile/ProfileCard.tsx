import React, { useState } from 'react';
import {
  type UserProfile,
  type UserType,
  USER_TYPE_LABELS,
} from '../../data/mockUserData';
import { 
  User, 
  Mail, 
  Building2, 
  Calendar, 
  Globe2, 
  Edit3, 
  Check, 
  BadgeCheck
} from 'lucide-react';

interface ProfileCardProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export function ProfileCard({ user, onUpdateProfile }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [userType, setUserType] = useState<UserType>(user.userType);
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'hi'>(user.preferredLanguage);
  const [organization, setOrganization] = useState(user.organization || '');
  const [successToast, setSuccessToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName: fullName.trim() || user.fullName,
      userType,
      preferredLanguage,
      organization: organization.trim(),
    });
    setIsEditing(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  const handleCancel = () => {
    setFullName(user.fullName);
    setUserType(user.userType);
    setPreferredLanguage(user.preferredLanguage);
    setOrganization(user.organization || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-6">
      {successToast && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Profile information updated successfully</span>
          </div>
          <span className="text-[10px] text-green-600">Saved</span>
        </div>
      )}

      {/* Header & Avatar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
            {user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'MU'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {user.fullName}
              </h2>
              <BadgeCheck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1.5">
              <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                {USER_TYPE_LABELS[user.userType]}
              </span>
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {user.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
              </span>
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer self-start sm:self-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Edit Profile Form vs View Details */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Edit Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="profile-name"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
              >
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            {/* Email (Read only) */}
            <div>
              <label
                htmlFor="profile-email"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
              >
                Email Address <span className="text-gray-400 font-normal lowercase">(read only)</span>
              </label>
              <input
                id="profile-email"
                type="email"
                disabled
                value={user.email}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* User Type */}
            <div>
              <label
                htmlFor="profile-usertype"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
              >
                User Classification
              </label>
              <select
                id="profile-usertype"
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserType)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                {Object.entries(USER_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Language */}
            <div>
              <label
                htmlFor="profile-lang"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
              >
                Preferred Language
              </label>
              <select
                id="profile-lang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as 'en' | 'hi')}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                <option value="en">English (Default)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Organization */}
            <div className="sm:col-span-2">
              <label
                htmlFor="profile-org"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1"
              >
                Organization / Company Name
              </label>
              <input
                id="profile-org"
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Enterprise Manufacturing Ltd."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Read-only Information Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <User className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Full Name</span>
              <span className="font-semibold text-gray-900">{user.fullName}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Email Address</span>
              <span className="font-semibold text-gray-900">{user.email}</span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Building2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Organization</span>
              <span className="font-semibold text-gray-900">
                {user.organization || 'Individual Enterprise'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Globe2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Language Preference</span>
              <span className="font-semibold text-gray-900">
                {user.preferredLanguage === 'hi' ? 'हिन्दी (Hindi)' : 'English'}
              </span>
            </div>
          </div>

          <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3 flex items-start space-x-2.5">
            <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-xs">
              <span className="text-gray-400 block font-medium">Member Since</span>
              <span className="font-semibold text-gray-900">{user.joinedDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
