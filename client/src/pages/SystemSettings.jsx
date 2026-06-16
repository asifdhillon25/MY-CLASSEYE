import React, { useState } from "react";
import { 
  FaSave, 
  FaBell, 
  FaDatabase, 
  FaShieldAlt, 
  FaPalette,
  FaCalendarAlt,
  FaEnvelope,
  FaKey
} from "react-icons/fa";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "ClassEye",
    siteEmail: "admin@classeye.edu",
    timezone: "UTC+5",
    dateFormat: "DD/MM/YYYY",
    
    // Security Settings
    passwordPolicy: "medium",
    sessionTimeout: 30,
    twoFactorAuth: false,
    ipRestriction: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // System Settings
    maintenanceMode: false,
    backupFrequency: "daily",
    logRetention: 90,
    
    // Theme Settings
    defaultTheme: "light",
    accentColor: "#169BA0",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage("Saving settings...");
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Settings saved successfully!");
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: <FaCalendarAlt /> },
    { id: "security", label: "Security", icon: <FaShieldAlt /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "system", label: "System", icon: <FaDatabase /> },
    { id: "appearance", label: "Appearance", icon: <FaPalette /> },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 bg-light-background dark:bg-dark-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-light-textPrimary dark:text-dark-textPrimary mb-2">
            System Settings
          </h1>
          <p className="text-light-textSecondary dark:text-dark-textSecondary">
            Configure system-wide settings and preferences
          </p>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${saveMessage.includes("success") ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
            {saveMessage}
          </div>
        )}

        <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow border border-light-border dark:border-dark-border overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-light-border dark:border-dark-border">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'border-brand-teal text-brand-teal' 
                      : 'border-transparent text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
                  General Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="siteEmail"
                      value={settings.siteEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={settings.timezone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    >
                      <option value="UTC+5">UTC+5 (Pakistan)</option>
                      <option value="UTC+0">UTC+0 (GMT)</option>
                      <option value="UTC-5">UTC-5 (EST)</option>
                      <option value="UTC-8">UTC-8 (PST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
                      Date Format
                    </label>
                    <select
                      name="dateFormat"
                      value={settings.dateFormat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
                  Security Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">Password Policy</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Set password strength requirements</p>
                    </div>
                    <select
                      name="passwordPolicy"
                      value={settings.passwordPolicy}
                      onChange={handleInputChange}
                      className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary"
                    >
                      <option value="low">Low (6+ characters)</option>
                      <option value="medium">Medium (8+ with mix)</option>
                      <option value="high">High (10+ with special chars)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">Session Timeout</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Minutes of inactivity before logout</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        name="sessionTimeout"
                        min="5"
                        max="120"
                        value={settings.sessionTimeout}
                        onChange={handleInputChange}
                        className="w-32"
                      />
                      <span className="w-12 text-center">{settings.sessionTimeout} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">Two-Factor Authentication</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Require 2FA for admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={settings.twoFactorAuth}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">IP Restriction</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Restrict admin access to specific IPs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="ipRestriction"
                        checked={settings.ipRestriction}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
                  Notification Settings
                </h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'emailNotifications', label: 'Email Notifications', description: 'Send notifications via email' },
                    { name: 'smsNotifications', label: 'SMS Notifications', description: 'Send notifications via SMS' },
                    { name: 'pushNotifications', label: 'Push Notifications', description: 'Send push notifications to mobile' },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                      <div>
                        <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">{item.label}</h3>
                        <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={item.name}
                          checked={settings[item.name]}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === "system" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
                  System Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">Maintenance Mode</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Take system offline for maintenance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-teal"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">Backup Frequency</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">How often to backup system data</p>
                    </div>
                    <select
                      name="backupFrequency"
                      value={settings.backupFrequency}
                      onChange={handleInputChange}
                      className="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                    <div>
                      <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary">Log Retention</h3>
                      <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary">Days to keep system logs</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        name="logRetention"
                        min="7"
                        max="365"
                        value={settings.logRetention}
                        onChange={handleInputChange}
                        className="w-32"
                      />
                      <span className="w-12 text-center">{settings.logRetention} days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-light-textPrimary dark:text-dark-textPrimary mb-4">
                  Appearance Settings
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
                      Default Theme
                    </label>
                    <select
                      name="defaultTheme"
                      value={settings.defaultTheme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary mb-2">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        name="accentColor"
                        value={settings.accentColor}
                        onChange={handleInputChange}
                        className="w-12 h-12 cursor-pointer rounded-lg border border-light-border dark:border-dark-border"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          name="accentColor"
                          value={settings.accentColor}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-background dark:bg-dark-background text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-light-surfaceMuted dark:bg-dark-surfaceMuted rounded-lg">
                  <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2">Preview</h3>
                  <p className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4">
                    How your theme will look with selected colors
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-20 rounded-lg" style={{ backgroundColor: settings.accentColor }}></div>
                      <p className="text-xs text-center mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                        Primary Color
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="h-20 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border flex items-center justify-center">
                        <span className="text-light-textPrimary dark:text-dark-textPrimary">Sample Card</span>
                      </div>
                      <p className="text-xs text-center mt-2 text-light-textSecondary dark:text-dark-textSecondary">
                        Card Background
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 border-t border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-lg hover:bg-light-primaryHover dark:hover:bg-dark-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-light-textPrimary dark:text-dark-textPrimary mb-2 flex items-center gap-2">
            <FaKey /> Settings Tips
          </h3>
          <ul className="text-sm text-light-textSecondary dark:text-dark-textSecondary space-y-1">
            <li>• Always test settings changes in a staging environment first</li>
            <li>• Backup your system before making major configuration changes</li>
            <li>• Document any custom settings for future reference</li>
            <li>• Consider peak usage times when scheduling maintenance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;