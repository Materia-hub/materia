// Email template components for Resend
// These are React components that render to HTML for emails

export const WelcomeEmail = ({ userName, loginUrl }: { userName: string; loginUrl: string }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Welcome to <span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span>!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Welcome to <span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span> - your marketplace for sustainable building materials!</p>
            <p>We're excited to have you join our community of builders, contractors, and artisans who are making construction more sustainable by buying and selling reclaimed materials.</p>
            <h3>Get Started:</h3>
            <ul>
              <li>Browse available materials</li>
              <li>Create your first listing (3 free!)</li>
              <li>Connect with sellers and buyers</li>
              <li>Save your favorite listings</li>
            </ul>
            <a href="${loginUrl}" class="button">Go to Dashboard</a>
            <p>If you have any questions, just reply to this email. We're here to help!</p>
            <p>Happy building,<br>The <span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span> Team</p>
          </div>
          <div class="footer">
            <p><span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span> - Sustainable Building Materials Marketplace</p>
            <p><a href="${loginUrl}/settings">Notification Preferences</a> | <a href="${loginUrl}/help">Help Center</a></p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const NotificationDigestEmail = ({ 
  userName, 
  notifications, 
  digestPeriod 
}: { 
  userName: string; 
  notifications: any[]; 
  digestPeriod: 'daily' | 'weekly';
}) => {
  const notificationHtml = notifications.map(n => `
    <div style="padding: 15px; margin: 10px 0; background: #f9fafb; border-left: 4px solid #2563EB; border-radius: 4px;">
      <strong>${n.title}</strong>
      <p style="margin: 5px 0; color: #6b7280;">${n.message}</p>
      <small style="color: #9ca3af;">${new Date(n.createdAt).toLocaleDateString()}</small>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">Your ${digestPeriod === 'daily' ? 'Daily' : 'Weekly'} Digest</h2>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Here's what happened on <span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span>:</p>
            <h3>You have ${notifications.length} new notification${notifications.length !== 1 ? 's' : ''}:</h3>
            ${notificationHtml}
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">View All Notifications</a>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const NewMessageEmail = ({ 
  recipientName, 
  senderName, 
  messagePreview,
  conversationUrl 
}: { 
  recipientName: string; 
  senderName: string; 
  messagePreview: string;
  conversationUrl: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .message { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>💬 New Message from ${senderName}</h2>
          <p>Hi ${recipientName},</p>
          <p>You have a new message on <span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span>:</p>
          <div class="message">
            <strong>${senderName}</strong>
            <p>${messagePreview}</p>
          </div>
          <a href="${conversationUrl}" class="button">Reply Now</a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            You can change your email preferences in your account settings.
          </p>
        </div>
      </body>
    </html>
  `;
};

export const NewReviewEmail = ({ 
  sellerName, 
  rating, 
  comment,
  listingTitle,
  listingUrl 
}: { 
  sellerName: string; 
  rating: number; 
  comment: string;
  listingTitle: string;
  listingUrl: string;
}) => {
  const stars = '⭐'.repeat(rating);
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .review { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>⭐ New Review Received!</h2>
          <p>Hi ${sellerName},</p>
          <p>Someone left you a review on <span style="font-weight: 800; background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">Materia</span>!</p>
          <div class="review">
            <div style="font-size: 24px; margin-bottom: 10px;">${stars}</div>
            <strong>On: ${listingTitle}</strong>
            ${comment ? `<p>"${comment}"</p>` : ''}
          </div>
          <a href="${listingUrl}" class="button">View Full Review</a>
        </div>
      </body>
    </html>
  `;
};

export const FavoriteEmail = ({ 
  sellerName, 
  listingTitle,
  listingUrl 
}: { 
  sellerName: string; 
  listingTitle: string;
  listingUrl: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>❤️ Someone Favorited Your Listing!</h2>
          <p>Hi ${sellerName},</p>
          <p>Great news! Someone just added your listing to their favorites:</p>
          <div style="background: #fce7f3; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ec4899;">
            <strong>${listingTitle}</strong>
            <p style="color: #6b7280; margin-top: 10px;">This shows buyers are interested in your materials!</p>
          </div>
          <a href="${listingUrl}" class="button">View Listing</a>
        </div>
      </body>
    </html>
  `;
};

export const SavedSearchMatchEmail = ({ 
  userName, 
  searchName,
  newListings,
  searchUrl 
}: { 
  userName: string; 
  searchName: string;
  newListings: any[];
  searchUrl: string;
}) => {
  const listingsHtml = newListings.slice(0, 3).map(listing => `
    <div style="border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 8px;">
      <strong>${listing.title}</strong>
      <p style="color: #2563EB; font-size: 18px; margin: 5px 0;">$${listing.price.toLocaleString()}</p>
      <p style="color: #6b7280; font-size: 14px;">${listing.location}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🔔 New Matches for "${searchName}"</h2>
          <p>Hi ${userName},</p>
          <p>We found ${newListings.length} new listing${newListings.length !== 1 ? 's' : ''} matching your saved search:</p>
          ${listingsHtml}
          ${newListings.length > 3 ? `<p style="color: #6b7280;">...and ${newListings.length - 3} more!</p>` : ''}
          <a href="${searchUrl}" class="button">View All Matches</a>
        </div>
      </body>
    </html>
  `;
};
