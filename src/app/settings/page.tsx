'use client'

import { useState } from 'react'
import { Wallet, Bell, Shield, User } from 'lucide-react'

interface SettingsSection {
  id: string
  name: string
  icon: typeof User
}

const sections: SettingsSection[] = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'wallet', name: 'Wallet', icon: Wallet },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
]

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
        <p className="mt-1 text-sm text-gray-600">
          Update your personal information and how it appears on your profile.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="first-name"
                id="first-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="last-name"
                id="last-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Write a few sentences about yourself.
          </p>
        </div>
      </div>
    </div>
  )
}

function WalletSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Wallet Settings</h3>
        <p className="mt-1 text-sm text-gray-600">
          Manage your Algorand wallet settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700">
            Wallet Address
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="wallet-address"
              id="wallet-address"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="Enter your Algorand wallet address"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="auto-connect"
              name="auto-connect"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="auto-connect" className="ml-2 block text-sm text-gray-900">
              Auto-connect wallet on startup
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-600">
          Choose what updates you want to receive and how.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="investment-updates"
                name="investment-updates"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="investment-updates" className="text-sm font-medium text-gray-700">
                Investment Updates
              </label>
              <p className="text-sm text-gray-500">
                Get notified about changes in your investment performance.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="project-updates"
                name="project-updates"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="project-updates" className="text-sm font-medium text-gray-700">
                Project Updates
              </label>
              <p className="text-sm text-gray-500">
                Receive updates about projects you're involved with.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account security and authentication preferences.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="current-password"
              id="current-password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="new-password"
              id="new-password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="two-factor"
              name="two-factor"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
            />
            <label htmlFor="two-factor" className="ml-2 block text-sm text-gray-900">
              Enable two-factor authentication
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [currentSection, setCurrentSection] = useState('profile')

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col gap-10 sm:flex-row">
          {/* Navigation Sidebar */}
          <nav className="space-y-1 sm:w-48">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`${
                    currentSection === section.id
                      ? 'bg-gray-50 text-blue-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full`}
                >
                  <Icon
                    className={`${
                      currentSection === section.id
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{section.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Settings Content */}
          <div className="flex-1 sm:max-w-2xl">
            {currentSection === 'profile' && <ProfileSettings />}
            {currentSection === 'wallet' && <WalletSettings />}
            {currentSection === 'notifications' && <NotificationSettings />}
            {currentSection === 'security' && <SecuritySettings />}

            {/* Save Button */}
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 