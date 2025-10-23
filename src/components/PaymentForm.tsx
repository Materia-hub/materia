import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface PaymentFormProps {
  amount: number;
  planType: 'pay-per-listing' | 'annual';
  onSubmit: (paymentData: PaymentData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function PaymentForm({ amount, planType, onSubmit, onCancel, loading = false }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.slice(0, 16);
    const formatted = limited.match(/.{1,4}/g)?.join(' ') || limited;
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length !== 16) return false;
    
    // Luhn algorithm for card validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiry: string): boolean => {
    const [month, year] = expiry.split('/');
    if (!month || !year) return false;
    
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const now = new Date();
    const expiryDate = new Date(yearNum, monthNum - 1);
    
    return expiryDate > now;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!cardholderName.trim()) {
      toast.error('Please enter the cardholder name');
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      toast.error('Please enter a valid card number');
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }

    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      toast.error('Please complete the billing address');
      return;
    }

    if (zipCode.length !== 5) {
      toast.error('Please enter a valid 5-digit zip code');
      return;
    }

    const paymentData: PaymentData = {
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate,
      cvv,
      cardholderName,
      billingAddress: {
        street,
        city,
        state,
        zipCode,
      },
    };

    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Amount Due</p>
            <p className="text-2xl text-blue-600">${amount.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4" />
            <span>Secure Payment</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {planType === 'annual' 
            ? 'Annual Unlimited Listing Plan - Billed once per year' 
            : 'Pay-per-listing - One-time charge'}
        </p>
      </div>

      <Card className="p-6 border-2 border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">Payment Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(formatCVV(e.target.value))}
                placeholder="123"
                maxLength={4}
                required
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-2 border-gray-200">
        <h3 className="text-gray-900 mb-4">Billing Address</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="123 Main St"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Springfield"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                placeholder="IL"
                maxLength={2}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="billingZipCode">Zip Code</Label>
            <Input
              id="billingZipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              placeholder="62701"
              maxLength={5}
              required
              disabled={loading}
            />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <p>
          Your payment information is encrypted and secure. We never store your full card details.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
}
