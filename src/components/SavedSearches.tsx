import React, { useState, useEffect } from 'react';
import { Search, Bell, BellOff, Trash2, Plus, Edit2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: {
    category?: string;
    condition?: string;
    search?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
  };
  alertEnabled: boolean;
  createdAt: string;
  lastMatched: string | null;
}

interface SavedSearchesProps {
  accessToken: string | null;
  onApplySearch: (filters: any) => void;
}

export default function SavedSearches({ accessToken, onApplySearch }: SavedSearchesProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null);
  
  // Form state
  const [searchName, setSearchName] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [keyword, setKeyword] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [alertEnabled, setAlertEnabled] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchSearches();
    }
  }, [accessToken]);

  const fetchSearches = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await api.getSavedSearches(accessToken);
      setSearches(response.searches || []);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      toast.error('Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      toast.error('Please sign in to save searches');
      return;
    }

    if (!searchName.trim()) {
      toast.error('Please enter a name for this search');
      return;
    }

    const filters: any = {};
    if (category) filters.category = category;
    if (condition) filters.condition = condition;
    if (keyword) filters.search = keyword;
    if (priceMin) filters.priceMin = parseFloat(priceMin);
    if (priceMax) filters.priceMax = parseFloat(priceMax);

    if (Object.keys(filters).length === 0) {
      toast.error('Please add at least one filter');
      return;
    }

    try {
      if (editingSearch) {
        await api.updateSavedSearch(
          editingSearch.id,
          { name: searchName, filters, alertEnabled },
          accessToken
        );
        toast.success('Search updated successfully!');
      } else {
        await api.createSavedSearch(
          { name: searchName, filters, alertEnabled },
          accessToken
        );
        toast.success('Search saved successfully!');
      }

      setShowCreateDialog(false);
      resetForm();
      fetchSearches();
    } catch (error) {
      console.error('Error saving search:', error);
      toast.error('Failed to save search');
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    if (!accessToken) return;

    try {
      await api.deleteSavedSearch(searchId, accessToken);
      setSearches(searches.filter(s => s.id !== searchId));
      toast.success('Search deleted');
    } catch (error) {
      console.error('Error deleting search:', error);
      toast.error('Failed to delete search');
    }
  };

  const handleToggleAlert = async (search: SavedSearch) => {
    if (!accessToken) return;

    try {
      await api.updateSavedSearch(
        search.id,
        { ...search, alertEnabled: !search.alertEnabled },
        accessToken
      );
      setSearches(searches.map(s => 
        s.id === search.id ? { ...s, alertEnabled: !s.alertEnabled } : s
      ));
      toast.success(search.alertEnabled ? 'Alerts disabled' : 'Alerts enabled');
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Failed to update alert setting');
    }
  };

  const handleEditSearch = (search: SavedSearch) => {
    setEditingSearch(search);
    setSearchName(search.name);
    setCategory(search.filters.category || '');
    setCondition(search.filters.condition || '');
    setKeyword(search.filters.search || '');
    setPriceMin(search.filters.priceMin?.toString() || '');
    setPriceMax(search.filters.priceMax?.toString() || '');
    setAlertEnabled(search.alertEnabled);
    setShowCreateDialog(true);
  };

  const resetForm = () => {
    setSearchName('');
    setCategory('');
    setCondition('');
    setKeyword('');
    setPriceMin('');
    setPriceMax('');
    setAlertEnabled(true);
    setEditingSearch(null);
  };

  const getFilterSummary = (filters: any) => {
    const parts = [];
    if (filters.category) parts.push(filters.category);
    if (filters.condition) parts.push(filters.condition);
    if (filters.search) parts.push(`"${filters.search}"`);
    if (filters.priceMin || filters.priceMax) {
      parts.push(`$${filters.priceMin || '0'} - $${filters.priceMax || '∞'}`);
    }
    return parts.join(' • ') || 'No filters';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Saved Searches</h2>
          <p className="text-muted-foreground">Loading your saved searches...</p>
        </div>
        <Card className="p-12 text-center text-muted-foreground">
          Loading...
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-blue-900 mb-2">Saved Searches</h2>
          <p className="text-muted-foreground">
            Save your searches and get alerts for new matches
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSearch ? 'Edit' : 'Create'} Saved Search</DialogTitle>
              <DialogDescription>
                Save your search criteria and get notified when new matches appear
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateSearch} className="space-y-4">
              <div>
                <Label htmlFor="name">Search Name *</Label>
                <Input
                  id="name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., Reclaimed Wood in Denver"
                  required
                />
              </div>

              <div>
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search term..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Any</option>
                    <option value="Wood">Wood</option>
                    <option value="Metal">Metal</option>
                    <option value="Brick & Stone">Brick & Stone</option>
                    <option value="Concrete">Concrete</option>
                    <option value="Glass">Glass</option>
                    <option value="Fixtures">Fixtures</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Any</option>
                    <option value="New Surplus">New Surplus</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priceMin">Min Price ($)</Label>
                  <Input
                    id="priceMin"
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="priceMax">Max Price ($)</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    placeholder="Any"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <Label htmlFor="alerts">Enable Alerts</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get notified when new matches appear
                  </p>
                </div>
                <Switch
                  id="alerts"
                  checked={alertEnabled}
                  onCheckedChange={setAlertEnabled}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingSearch ? 'Update' : 'Save'} Search
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Searches List */}
      {searches.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground mb-2">No saved searches yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Create a search to save your filters and get alerts for new matches
          </p>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Search
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {searches.map((search) => (
            <Card key={search.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{search.name}</h3>
                    {search.alertEnabled && (
                      <Badge className="bg-green-100 text-green-700 border-0">
                        <Bell className="w-3 h-3 mr-1" />
                        Alerts ON
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getFilterSummary(search.filters)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onApplySearch(search.filters)}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Apply
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSearch(search)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAlert(search)}
                >
                  {search.alertEnabled ? (
                    <BellOff className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSearch(search.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-muted-foreground">
                  Created {new Date(search.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
