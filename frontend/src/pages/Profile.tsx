import React, { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useTranslation } from '../store/preferences.store';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const t = useTranslation();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    avatarUrl: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update profile would go here
    console.log('Updating profile:', profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t.passwordsMismatch);
      return;
    }
    // Logic to change password would go here
    console.log('Changing password...');
  };

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.profile}</h1>
        <p className="text-muted-foreground">{t.profileDescription}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t.profile}</TabsTrigger>
          <TabsTrigger value="security">{t.security}</TabsTrigger>
          <TabsTrigger value="sessions">{t.sessions}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t.profileInfo}</CardTitle>
              <CardDescription>
                {t.profileInfoDescription}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t.firstName}
                    </label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleProfileInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      {t.lastName}
                    </label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileInputChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="avatarUrl" className="text-sm font-medium">
                    {t.avatarUrl}
                  </label>
                  <Input
                    id="avatarUrl"
                    value={profileData.avatarUrl}
                    onChange={(e) => handleProfileInputChange('avatarUrl', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">{t.saveChanges}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t.changePassword}</CardTitle>
              <CardDescription>
                Atualize a senha da sua conta.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    {t.currentPassword}
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    {t.newPassword}
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t.confirmPassword}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">{t.updatePassword}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>{t.sessions}</CardTitle>
              <CardDescription>
                Gerencie suas sessões ativas no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Funcionalidade em desenvolvimento.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;