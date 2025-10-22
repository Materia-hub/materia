# Distance Filter Feature

## Overview
Added comprehensive distance-based filtering to the Browse Listings page, allowing users to find materials near their location.

## Features Implemented

### 1. Distance Calculation Utility (`/utils/distance.ts`)
- **Haversine Formula**: Calculates accurate distances between coordinates in miles
- **Zip Code Mapping**: Maps US zip code prefixes to approximate coordinates
- **State Defaults**: Provides fallback coordinates for states when zip codes aren't available
- **Browser Geolocation**: Supports automatic location detection via browser API

### 2. User Location Input
- **Zip Code Entry**: Users can manually enter their zip code (3+ digits required)
- **Current Location Button**: One-click browser geolocation with Navigation icon
- **Visual Feedback**: Toast notifications for successful/failed location detection

### 3. Distance Filtering
- **Toggle Switch**: Enable/disable distance filtering
- **Distance Slider**: Adjustable range from 10-500 miles (default: 500)
- **Smart Filtering**: Only filters when distance is enabled and user location is set
- **Real-time Updates**: Distance calculated for each listing dynamically

### 4. Sorting & Display
- **Distance Sort**: New "Distance (Nearest)" sort option (only visible when location is set)
- **Distance Badges**: Shows distance in miles on each listing card when enabled
- **Clean UI**: Distance badge styled consistently with existing badges

### 5. Integration
- **State Persistence**: All distance settings reset with "Reset Filters" button
- **Coordinate Mapping**: Works with both zip codes and locationData in listings
- **Fallback Logic**: Gracefully handles missing location data

## Technical Details

### Supported Zip Code Prefixes
The system includes coordinates for major US metro areas:
- 495 - Grand Rapids, MI
- 490 - Detroit, MI
- 600 - Chicago, IL
- 100 - New York, NY
- 900 - Los Angeles, CA
- And many more...

### Distance Calculation
- Uses Haversine formula for accurate great-circle distance
- Returns rounded integer miles
- Earth radius: 3,959 miles

### Browser Geolocation
- Requests user permission via `navigator.geolocation`
- Provides high-accuracy position
- Falls back to zip code entry on failure

## User Experience

1. **Enable Distance Filter**: Toggle the "Filter by Distance" switch in filters panel
2. **Set Location**: 
   - Enter zip code (3-5 digits), OR
   - Click Navigation icon to use current location
3. **Adjust Range**: Use slider to set maximum distance (10-500 miles)
4. **View Results**: 
   - Listings show distance badges
   - Sort by "Distance (Nearest)" option appears
   - Listings beyond max distance are filtered out

## Future Enhancements
- Expand zip code database for better coverage
- Add city/address search with geocoding API
- Display distance in listing detail view
- Add "Near Me" quick filter button
- Support metric units (kilometers)
