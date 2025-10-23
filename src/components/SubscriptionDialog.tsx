import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, Zap, Crown, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import PaymentForm, { PaymentData } from './PaymentForm';

interface SubscriptionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectPayPerListing: (paymentData: PaymentData) => void;
  onSelectAnnual: (paymentData: PaymentData) => void;
  currentListingCount: number;
}

export default function SubscriptionDialog({ 
  open, 
  onClose, 
  onSelectPayPerListing, 
  onSelectAnnual,
  currentListingCount 
}: SubscriptionDialogProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'pay-per-listing' | 'annual' | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePlanSelect = (plan: 'pay-per-listing' | 'annual') => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    setProcessing(true);
    try {
      if (selectedPlan === 'pay-per-listing') {
        await onSelectPayPerListing(paymentData);
      } else if (selectedPlan === 'annual') {
        await onSelectAnnual(paymentData);
      }
      setShowPaymentForm(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleBack = () => {
    setShowPaymentForm(false);
    setSelectedPlan(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowPaymentForm(false);
      setSelectedPlan(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {showPaymentForm ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  disabled={processing}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <DialogTitle className="text-blue-900">
                    {selectedPlan === 'annual' ? 'Annual Plan Payment' : 'Pay Per Listing'}
                  </DialogTitle>
                  <DialogDescription>
                    Enter your payment information to complete your purchase
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <PaymentForm
              amount={selectedPlan === 'annual' ? 20 : 0.99}
              planType={selectedPlan!}
              onSubmit={handlePaymentSubmit}
              onCancel={handleBack}
              loading={processing}
            />
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-blue-900">Listing Limit Reached</DialogTitle>
              <DialogDescription>
                You've used your {currentListingCount} free listings. Choose a plan to continue listing:
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Pay Per Listing */}
          <Card className="p-6 border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900">Pay Per Listing</h3>
                </div>
                <p className="text-muted-foreground text-sm">Perfect for occasional sellers</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-blue-600">$0.99</span>
                <span className="text-muted-foreground text-sm">per listing</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Pay only when you list</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>No commitment required</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>All standard features included</span>
              </li>
            </ul>

            <Button 
              onClick={() => handlePlanSelect('pay-per-listing')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to Payment
            </Button>
          </Card>

          {/* Annual Subscription */}
          <Card className="p-6 border-2 border-blue-600 hover:border-blue-700 transition-colors relative">
            <Badge className="absolute -top-3 right-4 bg-blue-600">Best Value</Badge>
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900">Annual Plan</h3>
                </div>
                <p className="text-muted-foreground text-sm">For active sellers</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-blue-600">$20</span>
                <span className="text-muted-foreground text-sm">per year</span>
              </div>
              <p className="text-xs text-blue-600">Save money after 20 listings</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span><strong>Unlimited listings</strong> for one year</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Featured listing badge</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Advanced analytics</span>
              </li>
            </ul>

            <Button 
              onClick={() => handlePlanSelect('annual')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue to Payment
            </Button>
          </Card>
        </div>

            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
                I'll decide later
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
