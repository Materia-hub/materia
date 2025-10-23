import React, { useState } from 'react';
import { Users, Package, ShieldCheck, Flag, Search, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Switch } from './ui/switch';
import { mockListings, Listing } from './data/mockData';
import { toast } from 'sonner@2.0.3';

interface AdminPanelProps {
  onViewListing: (listingId: string) => void;
  listings: Listing[];
}

export default function AdminPanel({ onViewListing, listings }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Users', value: '247', icon: Users, color: 'text-blue-600' },
    { label: 'Active Listings', value: listings.length.toString(), icon: Package, color: 'text-blue-600' },
    { label: 'Verified Listings', value: listings.filter(l => l.verified).length.toString(), icon: ShieldCheck, color: 'text-purple-600' },
    { label: 'Flagged Items', value: '3', icon: Flag, color: 'text-red-600' },
  ];

  const mockUsers = [
    { id: '1', name: 'Dillon Weldy', email: 'dillon@buildersupply.com', role: 'both', status: 'active', joinDate: '2024-08-15', listings: 5 },
    { id: '2', name: 'Mike Chen', email: 'mike@demolition.com', role: 'seller', status: 'active', joinDate: '2024-09-01', listings: 8 },
    { id: '3', name: 'Valley Logistics', email: 'contact@valleylog.com', role: 'seller', status: 'active', joinDate: '2024-07-20', listings: 3 },
    { id: '4', name: 'Anderson Plumbing', email: 'info@andersonplumb.com', role: 'seller', status: 'active', joinDate: '2024-09-15', listings: 2 },
    { id: '5', name: 'BuildRight Supply', email: 'sales@buildright.com', role: 'both', status: 'active', joinDate: '2024-06-10', listings: 12 },
  ];

  const handleVerifyListing = (listingId: string) => {
    toast.success('Listing verified successfully');
  };

  const handleUnverifyListing = (listingId: string) => {
    toast.success('Verification removed');
  };

  const handleSuspendUser = (userId: string) => {
    toast.success('User suspended');
  };

  const handleActivateUser = (userId: string) => {
    toast.success('User activated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-blue-900 mb-2">Admin Panel</h2>
        <p className="text-muted-foreground">
          Manage users, listings, and site content
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground mb-1">{stat.label}</p>
                  <p className={stat.color}>{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-70`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
        </TabsList>

        {/* Listings Tab */}
        <TabsContent value="listings" className="mt-6">
          <Card className="p-6">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <button
                          onClick={() => onViewListing(listing.id)}
                          className="hover:text-blue-700 transition-colors text-left"
                        >
                          {listing.title}
                        </button>
                      </TableCell>
                      <TableCell>{listing.sellerName}</TableCell>
                      <TableCell>{listing.category}</TableCell>
                      <TableCell>${listing.price.toLocaleString()}</TableCell>
                      <TableCell>
                        {listing.verified ? (
                          <Badge className="bg-blue-600 text-white border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!listing.verified ? (
                            <Button
                              size="sm"
                              onClick={() => handleVerifyListing(listing.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Verify
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnverifyListing(listing.id)}
                            >
                              Unverify
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <Card className="p-6">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Listings</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.role === 'both' ? 'Buyer & Seller' : user.role === 'seller' ? 'Seller' : 'Buyer'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.listings}</TableCell>
                      <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={user.status === 'active' ? 'bg-green-600 text-white border-0' : 'bg-gray-500 text-white border-0'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.status === 'active' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-red-700 border-red-200 hover:bg-red-50"
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleActivateUser(user.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Flagged Content Tab */}
        <TabsContent value="flagged" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">Suspicious listing - "Copper Wire Bulk"</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Flagged by: John Doe • Reason: Possible stolen goods
                  </p>
                  <p className="text-sm text-gray-700">
                    User reports this listing may contain stolen materials based on recent thefts in the area.
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50">
                    Remove
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">Inappropriate image in listing</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Flagged by: Admin System • Reason: Image quality issues
                  </p>
                  <p className="text-sm text-gray-700">
                    Listing contains blurry or unclear images that don't meet quality standards.
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                </div>
              </div>

              <div className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex-1">
                  <h4 className="text-gray-900 mb-2">Spam or misleading content</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Flagged by: Multiple users • Reason: Misleading description
                  </p>
                  <p className="text-sm text-gray-700">
                    Several users report that the actual materials don't match the listing description.
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-700 border-red-200 hover:bg-red-50">
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
