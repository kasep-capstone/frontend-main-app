"use client"
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOut, Trash2, Twitter, Instagram, Settings, Camera, User, Calendar, Edit3, Save, X } from 'lucide-react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    gender: 'Male',
    age: '25'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: 'John Doe',
      gender: 'Male', 
      age: '25'
    });
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    const fileInput = document.getElementById('profile-image-input') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <>
      <MenuBarTop/>
      <div className="container mx-auto mt-12 px-4 py-8 min-h-[calc(100vh-8rem)] flex flex-col">
        <div className="max-w-4xl mx-auto flex-1">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center text-4xl">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{formData.name}</h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Gender:</span> {formData.gender}
                </div>
                <div>
                  <span className="font-medium">Age:</span> {formData.age}
                </div>
                <div>
                  <span className="font-medium">Total Calories:</span> 2,500
                </div>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <hr className="border-muted my-6" />
          
          {/* Social Media Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">Sosial Media</h3>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="flex items-center gap-2 w-full">
                <Twitter className="w-4 h-4" />
                Connect Twitter
              </Button>
              <Button variant="outline" className="flex items-center gap-2 w-full">
                <Instagram className="w-4 h-4" />
                Connect Instagram
              </Button>
            </div>
          </div>
          
          {/* Divider */}
          <hr className="border-muted my-6" />
          
          {/* Account Settings Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">Account Setting</h3>
            
            {!isEditing ? (
              <div className="flex flex-col gap-3">
                {/* Profile Editing Options */}
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full justify-start"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full justify-start"
                  onClick={triggerImageUpload}
                >
                  <Camera className="w-4 h-4" />
                  Edit Profile Picture
                </Button>
                
                {/* Hidden File Input */}
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                {/* Divider */}
                <hr className="border-muted my-2" />
                
                {/* Account Integration */}
                <Button variant="outline" className="flex items-center gap-2 w-full justify-start">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Connect Google Account
                </Button>
              </div>
            ) : (
              /* Edit Form */
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>
                
                {/* Gender Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Age Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleSave}
                    className="flex-1 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Divider */}
          <hr className="border-muted my-6" />
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col gap-4 mt-auto pt-8 max-w-sm mx-auto w-full">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <Button variant="destructive" className="flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <MenuBar/>
      </div>
    </>
  );
}