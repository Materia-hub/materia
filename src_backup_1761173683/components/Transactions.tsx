import React, { useState } from 'react';
import { DollarSign, Check, X, MessageSquare, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { mockTransactions } from './data/mockData';
import { toast } from 'sonner@2.0.3';

interface TransactionsProps {
  onViewListing: (listingId: string) => void;
}

export default function Transactions({ onViewListing }: TransactionsProps) {
  const [counterOfferAmount, setCounterOfferAmount] = useState('');
  const [counterOfferNotes, setCounterOfferNotes] = useState('');

  const currentUserId = '1';

  const pendingTransactions = mockTransactions.filter(t => t.status === 'pending');
  const acceptedTransactions = mockTransactions.filter(t => t.status === 'accepted');
  const completedTransactions = mockTransactions.filter(t => t.status === 'completed');
  const declinedTransactions = mockTransactions.filter(t => t.status === 'declined');

  const handleAcceptOffer = (transactionId: string) => {
    toast.success('Offer accepted! The buyer has been notified.');
  };

  const handleDeclineOffer = (transactionId: string) => {
    toast.success('Offer declined.');
  };

  const handleCounterOffer = () => {
    if (!counterOfferAmount) {
      toast.error('Please enter an amount');
      return;
    }
    toast.success('Counter-offer sent successfully!');
    setCounterOfferAmount('');
    setCounterOfferNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white border-0">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-600 text-white border-0">Accepted</Badge>;
      case 'completed':
        return <Badge className="bg-blue-600 text-white border-0">Completed</Badge>;
      case 'declined':
        return <Badge className="bg-gray-500 text-white border-0">Declined</Badge>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'offer':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Offer</Badge>;
      case 'purchase':
        return <Badge variant="outline" className="border-blue-200 text-blue-700">Purchase</Badge>;
      case 'counter-offer':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Counter-Offer</Badge>;
      default:
        return null;
    }
  };

  const TransactionCard = ({ transaction }: { transaction: any }) => {
    const isSeller = transaction.sellerId === currentUserId;
    const otherPartyName = isSeller ? transaction.buyerName : transaction.sellerName;
    const isPending = transaction.status === 'pending';

    return (
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <button
              onClick={() => onViewListing(transaction.listingId)}
              className="text-gray-900 hover:text-blue-700 transition-colors mb-2 block"
            >
              {transaction.listingTitle}
            </button>
            <div className="flex items-center gap-2 mb-2">
              {getTypeBadge(transaction.type)}
              {getStatusBadge(transaction.status)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-700">${transaction.amount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{isSeller ? 'Buyer' : 'Seller'}:</span>
            <span>{otherPartyName}</span>
          </div>
          {transaction.notes && (
            <div className="bg-gray-50 p-2 rounded text-muted-foreground">
              {transaction.notes}
            </div>
          )}
        </div>

        {isPending && isSeller && transaction.type === 'offer' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleAcceptOffer(transaction.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Accept
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1 border-orange-200 text-orange-700">
                  Counter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make Counter-Offer</DialogTitle>
                  <DialogDescription>
                    Propose a different price for this transaction
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="counter-amount">Counter-Offer Amount ($)</Label>
                    <Input
                      id="counter-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={counterOfferAmount}
                      onChange={(e) => setCounterOfferAmount(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Current offer: ${transaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="counter-notes">Notes (Optional)</Label>
                    <Textarea
                      id="counter-notes"
                      placeholder="Add a message..."
                      value={counterOfferNotes}
                      onChange={(e) => setCounterOfferNotes(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCounterOffer} className="bg-orange-600 hover:bg-orange-700">
                    Send Counter-Offer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeclineOffer(transaction.id)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-1" />
              Decline
            </Button>
          </div>
        )}

        {transaction.status === 'accepted' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 border-green-200 text-green-700">
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Pickup
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-blue-900 mb-2">Transactions</h2>
        <p className="text-muted-foreground">
          Manage offers, purchases, and counter-offers
        </p>
      </div>

      {/* Sales Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200">
        <h3 className="text-blue-900 mb-4">Sales Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
            <p className="text-blue-700">
              ${completedTransactions
                .filter(t => t.type === 'sale')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-1">Completed Transactions</p>
            <p className="text-blue-700">
              {completedTransactions.filter(t => t.type === 'sale').length}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-muted-foreground mb-1">Average Sale</p>
            <p className="text-blue-700">
              ${completedTransactions.filter(t => t.type === 'sale').length > 0
                ? Math.round(
                    completedTransactions
                      .filter(t => t.type === 'sale')
                      .reduce((sum, t) => sum + t.amount, 0) /
                      completedTransactions.filter(t => t.type === 'sale').length
                  ).toLocaleString()
                : '0'}
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingTransactions.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white border-0 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {pendingTransactions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingTransactions.length > 0 ? (
              pendingTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <Card className="lg:col-span-2 p-12 text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No pending transactions</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accepted" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {acceptedTransactions.length > 0 ? (
              acceptedTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <Card className="lg:col-span-2 p-12 text-center">
                <p className="text-muted-foreground">No accepted transactions</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedTransactions.length > 0 ? (
              completedTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <Card className="lg:col-span-2 p-12 text-center">
                <p className="text-muted-foreground">No completed transactions</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="declined" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {declinedTransactions.length > 0 ? (
              declinedTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <Card className="lg:col-span-2 p-12 text-center">
                <p className="text-muted-foreground">No declined transactions</p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
