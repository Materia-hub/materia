import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Plus, CheckCircle, XCircle, Upload, Download } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockPickups, mockListings } from './data/mockData';
import { toast } from 'sonner@2.0.3';

export default function PickupScheduler() {
  // Pickup state
  const [pickupDate, setPickupDate] = useState<Date | undefined>(new Date());
  const [pickupTime, setPickupTime] = useState('2:00 PM');
  const [pickupListing, setPickupListing] = useState('');
  const [pickupNotes, setPickupNotes] = useState('');

  // Drop-off state
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(new Date());
  const [dropoffTime, setDropoffTime] = useState('2:00 PM');
  const [dropoffListing, setDropoffListing] = useState('');
  const [dropoffNotes, setDropoffNotes] = useState('');

  const upcomingPickups = mockPickups.filter(p => p.status === 'scheduled');
  const completedPickups = mockPickups.filter(p => p.status === 'completed');

  // Mock drop-offs (using same structure as pickups for now)
  const upcomingDropoffs = mockPickups.filter(p => p.status === 'scheduled').slice(0, 1);
  const completedDropoffs = mockPickups.filter(p => p.status === 'completed').slice(0, 1);

  const handleSchedulePickup = () => {
    if (!pickupDate || !pickupListing) {
      toast.error('Please select a date and listing');
      return;
    }
    toast.success('Pickup scheduled successfully!');
    setPickupDate(new Date());
    setPickupTime('2:00 PM');
    setPickupListing('');
    setPickupNotes('');
  };

  const handleScheduleDropoff = () => {
    if (!dropoffDate || !dropoffListing) {
      toast.error('Please select a date and listing');
      return;
    }
    toast.success('Drop-off scheduled successfully!');
    setDropoffDate(new Date());
    setDropoffTime('2:00 PM');
    setDropoffListing('');
    setDropoffNotes('');
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge className="bg-blue-600 text-white border-0">
            <CalendarIcon className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-600 text-white border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-500 text-white border-0">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-blue-900 mb-2">Scheduler</h2>
        <p className="text-muted-foreground">
          Schedule pickups or drop-offs at our physical hub location
        </p>
      </div>

      {/* Hub Information */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-blue-900 mb-2">Hub Location</h3>
            <p className="text-gray-700 mb-2">2450 Burton St SE, Grand Rapids, MI 49546</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 3:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="pickup" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pickup">
            <Download className="w-4 h-4 mr-2" />
            Pickup
          </TabsTrigger>
          <TabsTrigger value="dropoff">
            <Upload className="w-4 h-4 mr-2" />
            Drop-off
          </TabsTrigger>
        </TabsList>

        {/* PICKUP TAB */}
        <TabsContent value="pickup" className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-900 mb-1">Pickup Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Schedule a visit to pick up materials you've purchased
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Pickup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule a Pickup</DialogTitle>
                  <DialogDescription>
                    Choose a date and time to pick up your purchased materials
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="flex flex-col">
                    <Label>Select Date</Label>
                    <div className="mt-2 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={pickupDate}
                        onSelect={setPickupDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup-listing">Listing</Label>
                      <Select value={pickupListing} onValueChange={setPickupListing}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a listing" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockListings.slice(0, 5).map((listing) => (
                            <SelectItem key={listing.id} value={listing.id}>
                              {listing.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pickup-time">Time Slot</Label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pickup-notes">Notes (Optional)</Label>
                      <Textarea
                        id="pickup-notes"
                        placeholder="Special requirements, truck info, etc."
                        value={pickupNotes}
                        onChange={(e) => setPickupNotes(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSchedulePickup} className="bg-blue-600 hover:bg-blue-700">
                    Confirm Pickup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Upcoming Pickups */}
          <div>
            <h3 className="text-gray-900 mb-4">Upcoming Pickups</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingPickups.length > 0 ? (
                upcomingPickups.map((pickup) => (
                  <Card key={pickup.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-gray-900 flex-1">{pickup.listingTitle}</h4>
                      {getStatusBadge(pickup.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(pickup.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {pickup.time}
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span className="flex-1">{pickup.location}</span>
                      </div>
                      {pickup.notes && (
                        <div className="bg-gray-50 p-2 rounded text-muted-foreground mt-2">
                          {pickup.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-700 border-red-200 hover:bg-red-50">
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="lg:col-span-2 p-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming pickups scheduled</p>
                </Card>
              )}
            </div>
          </div>

          {/* Past Pickups */}
          <div>
            <h3 className="text-gray-900 mb-4">Past Pickups</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedPickups.length > 0 ? (
                completedPickups.map((pickup) => (
                  <Card key={pickup.id} className="p-4 opacity-75">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-gray-900 flex-1">{pickup.listingTitle}</h4>
                      {getStatusBadge(pickup.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(pickup.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {pickup.time}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="lg:col-span-2 p-12 text-center">
                  <p className="text-muted-foreground">No past pickups</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* DROP-OFF TAB */}
        <TabsContent value="dropoff" className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-gray-900 mb-1">Drop-off Scheduling</h3>
              <p className="text-sm text-muted-foreground">
                Schedule a visit to drop off materials you're selling
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Drop-off
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Schedule a Drop-off</DialogTitle>
                  <DialogDescription>
                    Choose a date and time to drop off your materials for sale
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="flex flex-col">
                    <Label>Select Date</Label>
                    <div className="mt-2 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={dropoffDate}
                        onSelect={setDropoffDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dropoff-listing">Listing</Label>
                      <Select value={dropoffListing} onValueChange={setDropoffListing}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a listing" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockListings.slice(0, 5).map((listing) => (
                            <SelectItem key={listing.id} value={listing.id}>
                              {listing.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dropoff-time">Time Slot</Label>
                      <Select value={dropoffTime} onValueChange={setDropoffTime}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dropoff-notes">Notes (Optional)</Label>
                      <Textarea
                        id="dropoff-notes"
                        placeholder="Material details, quantity, condition, etc."
                        value={dropoffNotes}
                        onChange={(e) => setDropoffNotes(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleScheduleDropoff} className="bg-blue-600 hover:bg-blue-700">
                    Confirm Drop-off
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Upcoming Drop-offs */}
          <div>
            <h3 className="text-gray-900 mb-4">Upcoming Drop-offs</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingDropoffs.length > 0 ? (
                upcomingDropoffs.map((dropoff) => (
                  <Card key={dropoff.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-gray-900 flex-1">{dropoff.listingTitle}</h4>
                      {getStatusBadge(dropoff.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(dropoff.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {dropoff.time}
                      </div>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5" />
                        <span className="flex-1">{dropoff.location}</span>
                      </div>
                      {dropoff.notes && (
                        <div className="bg-gray-50 p-2 rounded text-muted-foreground mt-2">
                          {dropoff.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-700 border-red-200 hover:bg-red-50">
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="lg:col-span-2 p-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming drop-offs scheduled</p>
                </Card>
              )}
            </div>
          </div>

          {/* Past Drop-offs */}
          <div>
            <h3 className="text-gray-900 mb-4">Past Drop-offs</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {completedDropoffs.length > 0 ? (
                completedDropoffs.map((dropoff) => (
                  <Card key={dropoff.id} className="p-4 opacity-75">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-gray-900 flex-1">{dropoff.listingTitle}</h4>
                      {getStatusBadge(dropoff.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(dropoff.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {dropoff.time}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="lg:col-span-2 p-12 text-center">
                  <p className="text-muted-foreground">No past drop-offs</p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
