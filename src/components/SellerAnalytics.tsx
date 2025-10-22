import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, Heart, Star, Package, DollarSign, BarChart3, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface SellerAnalyticsProps {
  accessToken: string | null;
}

const COLORS = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];

export default function SellerAnalytics({ accessToken }: SellerAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (accessToken) {
      fetchAnalytics();
    }
  }, [accessToken]);

  const fetchAnalytics = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await api.getAnalytics(accessToken);
      setAnalytics(response.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Seller Analytics</h2>
          <p className="text-muted-foreground">Loading your performance data...</p>
        </div>
        <Card className="p-12 text-center text-muted-foreground">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading...
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-blue-900 mb-2">Seller Analytics</h2>
          <p className="text-muted-foreground">No data available yet</p>
        </div>
        <Card className="p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-muted-foreground">Start creating listings to see your analytics</p>
        </Card>
      </div>
    );
  }

  // Prepare category data for chart
  const categoryData = Object.entries(analytics.byCategory || {}).map(([name, data]: any) => ({
    name,
    listings: data.count,
    views: data.views,
    favorites: data.favorites,
  }));

  // Prepare rating distribution data
  const ratingData = [
    { rating: '5 ⭐', count: 0 },
    { rating: '4 ⭐', count: 0 },
    { rating: '3 ⭐', count: 0 },
    { rating: '2 ⭐', count: 0 },
    { rating: '1 ⭐', count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-blue-900 mb-2">Seller Analytics</h2>
          <p className="text-muted-foreground">
            Track your performance and grow your business
          </p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <Badge variant="outline" className="text-green-700 border-green-200">
              Active
            </Badge>
          </div>
          <h3 className="text-3xl text-blue-900 mb-1">
            {analytics.overview.totalListings}
          </h3>
          <p className="text-sm text-muted-foreground">Total Listings</p>
          <p className="text-xs text-green-600 mt-2">
            +{analytics.recent.newListings} this month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl text-blue-900 mb-1">
            {analytics.overview.totalViews.toLocaleString()}
          </h3>
          <p className="text-sm text-muted-foreground">Total Views</p>
          <p className="text-xs text-muted-foreground mt-2">
            Avg {Math.round(analytics.overview.totalViews / Math.max(analytics.overview.totalListings, 1))} per listing
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-3xl text-blue-900 mb-1">
            {analytics.overview.totalFavorites}
          </h3>
          <p className="text-sm text-muted-foreground">Total Favorites</p>
          <p className="text-xs text-green-600 mt-2">
            +{analytics.recent.newFavorites} this month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-3xl text-blue-900 mb-1">
            {analytics.overview.averageRating}
          </h3>
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="text-xs text-muted-foreground mt-2">
            From {analytics.overview.totalReviews} reviews
          </p>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listings">Top Listings</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Performance */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Performance by Category</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#2563EB" name="Views" />
                    <Bar dataKey="favorites" fill="#EF4444" name="Favorites" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No category data available
                </div>
              )}
            </Card>

            {/* Engagement Metrics */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-6">Engagement Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">View Rate</span>
                    <span className="text-blue-700">
                      {analytics.overview.totalListings > 0 
                        ? Math.round((analytics.overview.totalViews / analytics.overview.totalListings) * 100) / 100
                        : 0} views/listing
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((analytics.overview.totalViews / analytics.overview.totalListings / 100) * 100, 100)} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Favorite Rate</span>
                    <span className="text-red-600">
                      {analytics.overview.totalListings > 0
                        ? Math.round((analytics.overview.totalFavorites / analytics.overview.totalListings) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.overview.totalListings > 0
                      ? (analytics.overview.totalFavorites / analytics.overview.totalListings) * 100
                      : 0} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Review Rate</span>
                    <span className="text-yellow-600">
                      {analytics.overview.totalListings > 0
                        ? Math.round((analytics.overview.totalReviews / analytics.overview.totalListings) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={analytics.overview.totalListings > 0
                      ? (analytics.overview.totalReviews / analytics.overview.totalListings) * 100
                      : 0} 
                    className="h-2"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Recent Activity (Last 30 Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl text-blue-700 mb-1">{analytics.recent.newListings}</p>
                <p className="text-sm text-muted-foreground">New Listings</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl text-red-600 mb-1">{analytics.recent.newFavorites}</p>
                <p className="text-sm text-muted-foreground">New Favorites</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-3xl text-yellow-600 mb-1">{analytics.recent.newReviews}</p>
                <p className="text-sm text-muted-foreground">New Reviews</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Top Performing Listings</h3>
            {analytics.topListings && analytics.topListings.length > 0 ? (
              <div className="space-y-4">
                {analytics.topListings.map((listing: any, index: number) => (
                  <div key={listing.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate">{listing.title}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {listing.views} views
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {listing.favorites} favorites
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      Top {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No listing data available yet
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Category Breakdown</h3>
            {categoryData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="listings"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-sm text-muted-foreground mt-2">Listings by Category</p>
                </div>
                <div className="space-y-3">
                  {categoryData.map((cat, index) => (
                    <div key={cat.name} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-gray-900">{cat.name}</span>
                        </div>
                        <Badge variant="outline">{cat.listings} listings</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>{cat.views} views</span>
                        <span>{cat.favorites} favorites</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No category data available yet
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
