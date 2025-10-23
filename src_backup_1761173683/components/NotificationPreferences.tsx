import React, { useState, useEffect } from 'react';
import { Bell, Mail, Save } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface NotificationPreferencesProps {
  accessToken: string | null;
}

export default function NotificationPreferences({ accessToken }: NotificationPreferencesProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState('weekly');
  const [notifyOnFavorite, setNotifyOnFavorite] = useState(true);
  const [notifyOnReview, setNotifyOnReview] = useState(true);
  const [notifyOnMessage, setNotifyOnMessage] = useState(true);
  const [notifyOnOffer, setNotifyOnOffer] = useState(true);
  const [notifyOnPurchase, setNotifyOnPurchase] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchPreferences();
    }
  }, [accessToken]);

  const fetchPreferences = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await api.getNotificationPreferences(accessToken);
      const prefs = response.preferences;

      setEmailNotifications(prefs.emailNotifications ?? true);
      setEmailDigest(prefs.emailDigest ?? 'weekly');
      setNotifyOnFavorite(prefs.notifyOnFavorite ?? true);
      setNotifyOnReview(prefs.notifyOnReview ?? true);
      setNotifyOnMessage(prefs.notifyOnMessage ?? true);
      setNotifyOnOffer(prefs.notifyOnOffer ?? true);
      setNotifyOnPurchase(prefs.notifyOnPurchase ?? true);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!accessToken) return;

    try {
      setSaving(true);
      const preferences = {
        emailNotifications,
        emailDigest,
        notifyOnFavorite,
        notifyOnReview,
        notifyOnMessage,
        notifyOnOffer,
        notifyOnPurchase,
      };

      await api.updateNotificationPreferences(preferences, accessToken);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Notification Preferences</h2>
          <p className="text-muted-foreground">Loading your preferences...</p>
        </div>
        <Card className="p-12 text-center text-muted-foreground">
          Loading...
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-blue-900 mb-2">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Manage how and when you receive notifications
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email updates about your activity
                </p>
              </div>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {emailNotifications && (
            <div className="mt-4 ml-4">
              <Label className="text-sm">Email Digest Frequency</Label>
              <Select value={emailDigest} onValueChange={setEmailDigest}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Instant (every notification)</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                {emailDigest === 'instant' && 'Get an email for every notification'}
                {emailDigest === 'daily' && 'Get a daily summary of all notifications'}
                {emailDigest === 'weekly' && 'Get a weekly summary of all notifications'}
                {emailDigest === 'never' && 'Only in-app notifications, no emails'}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* In-App Notifications */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Label>In-App Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Choose which events trigger notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm">Favorites</Label>
                <p className="text-xs text-muted-foreground">
                  When someone favorites your listing
                </p>
              </div>
              <Switch
                checked={notifyOnFavorite}
                onCheckedChange={setNotifyOnFavorite}
              />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm">Reviews</Label>
                <p className="text-xs text-muted-foreground">
                  When someone leaves you a review
                </p>
              </div>
              <Switch
                checked={notifyOnReview}
                onCheckedChange={setNotifyOnReview}
              />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm">Messages</Label>
                <p className="text-xs text-muted-foreground">
                  When you receive a new message
                </p>
              </div>
              <Switch
                checked={notifyOnMessage}
                onCheckedChange={setNotifyOnMessage}
              />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm">Offers</Label>
                <p className="text-xs text-muted-foreground">
                  When someone makes an offer on your listing
                </p>
              </div>
              <Switch
                checked={notifyOnOffer}
                onCheckedChange={setNotifyOnOffer}
              />
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm">Purchases</Label>
                <p className="text-xs text-muted-foreground">
                  When someone purchases your listing
                </p>
              </div>
              <Switch
                checked={notifyOnPurchase}
                onCheckedChange={setNotifyOnPurchase}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-blue-900 mb-2">💡 Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Instant emails are great for time-sensitive notifications</li>
          <li>• Daily or weekly digests help reduce email clutter</li>
          <li>• You can always check in-app notifications in the bell menu</li>
          <li>• Disabling a type of notification affects both email and in-app</li>
        </ul>
      </Card>
    </div>
  );
}
