import React, { useState } from 'react';
import { CheckCircle2, Package2, Shield, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { api } from '../utils/api';

interface OnboardingProps {
  onComplete: (userData: any) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [mode, setMode] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessType: '',
    location: ''
  });

  const steps = [
    {
      title: 'Welcome to Materia',
      description: 'Your sustainable marketplace for building and industrial materials',
      icon: Package2,
      features: [
        'Buy, sell, and trade surplus materials',
        'Reduce waste and save money',
        'Connect with local builders and manufacturers',
        'Support the circular economy',
      ],
    },
    {
      title: 'Quality & Trust',
      description: 'We ensure a safe and reliable marketplace',
      icon: Shield,
      features: [
        'Verified listings with quality badges',
        'Detailed material descriptions and photos',
        'Secure in-app messaging',
        'Admin-moderated content',
      ],
    },
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Incorrect email or password. Don't have an account? Sign up below!");
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please confirm your email address');
        } else {
          toast.error(error.message || 'Failed to sign in');
        }
        
        setLoading(false);
        return;
      }
      
      if (!data.session) {
        toast.error('Failed to create session');
        setLoading(false);
        return;
      }
      
      // Fetch user profile from server
      const response = await api.getCurrentUser(data.session.access_token);
      
      if (!response || !response.user) {
        toast.error('Failed to load user profile');
        setLoading(false);
        return;
      }
      
      const userProfile = response.user;
      
      const userData = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        businessType: userProfile.businessType,
        location: userProfile.location,
        membershipStatus: userProfile.membershipStatus,
        subscriptionTier: userProfile.subscriptionTier,
        joinDate: userProfile.joinDate,
        avatar: userProfile.avatar,
        isAdmin: userProfile.isAdmin || false,
      };
      
      toast.success('Welcome back!');
      onComplete(userData);
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.businessType) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create account on server
      const signupResponse = await api.signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        businessType: formData.businessType,
        location: formData.location,
      });
      
      if (!signupResponse || !signupResponse.success) {
        toast.error('Failed to create account. Please try again.');
        setLoading(false);
        return;
      }
      
      // Now sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        console.error('Auto sign in error:', error);
        toast.success('Account created! Please sign in.');
        setMode('signin');
        setLoading(false);
        return;
      }
      
      if (!data.session) {
        toast.success('Account created! Please sign in.');
        setMode('signin');
        setLoading(false);
        return;
      }
      
      // Fetch user profile
      const response = await api.getCurrentUser(data.session.access_token);
      
      if (!response || !response.user) {
        toast.error('Account created but failed to load profile. Please sign in.');
        setMode('signin');
        setLoading(false);
        return;
      }
      
      const userProfile = response.user;
      
      const userData = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
        businessType: userProfile.businessType,
        location: userProfile.location,
        membershipStatus: userProfile.membershipStatus,
        subscriptionTier: userProfile.subscriptionTier,
        joinDate: userProfile.joinDate,
        avatar: userProfile.avatar,
        isAdmin: userProfile.isAdmin || false,
      };
      
      toast.success('Account created successfully!');
      onComplete(userData);
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Provide user-friendly error messages
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        toast.error('This email is already registered. Please sign in instead.');
        setMode('signin');
      } else if (error.message?.includes('Invalid email')) {
        toast.error('Please enter a valid email address');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show welcome/intro screens
  if (mode === 'welcome' && currentStep < 2) {
    const currentStepData = steps[currentStep];
    const Icon = currentStepData.icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-white p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Icon className="w-12 h-12 text-white" />
            </div>
            <h2 className="mb-2">
              {currentStepData.title === 'Welcome to Materia' ? (
                <>Welcome to <span className="materia-brand">Materia</span></>
              ) : (
                currentStepData.title
              )}
            </h2>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-blue-200'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                if (currentStep < 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setMode('signup');
                  setCurrentStep(2);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {currentStep > 0 && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="text-blue-600"
              >
                Back
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Show sign in form
  if (mode === 'signin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-blue-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your <span className="materia-brand">Materia</span> account</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center pt-4 space-y-3">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setCurrentStep(2);
                  }}
                  className="text-blue-600 hover:text-blue-700 underline"
                  disabled={loading}
                >
                  Create one here
                </button>
              </p>
              
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-500">
                  First time? Create a new account to get started!
                </p>
              </div>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Show sign up form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-blue-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join as a buyer, seller, or both</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input 
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 6 characters"
              required
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type *</Label>
            <Select 
              value={formData.businessType} 
              onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Construction Contractor">Construction Contractor</SelectItem>
                <SelectItem value="Builder/Developer">Builder/Developer</SelectItem>
                <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                <SelectItem value="Artisan/Craftsperson">Artisan/Craftsperson</SelectItem>
                <SelectItem value="Hobbyist">Hobbyist</SelectItem>
                <SelectItem value="Demolition Company">Demolition Company</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input 
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
              disabled={loading}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-700"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
