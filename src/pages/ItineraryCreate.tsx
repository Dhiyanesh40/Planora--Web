import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Sparkles, ArrowRight, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { differenceInDays, addDays, format } from 'date-fns';
import { generateActivitiesForBudget } from '@/utils/activityGenerator';

const itinerarySchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  budget: z.number().positive('Budget must be greater than 0'),
});

const preferenceOptions = [
  'Sightseeing',
  'Adventure',
  'Relaxation',
  'Food & Dining',
  'Culture',
  'Nature',
  'Shopping',
  'Nightlife',
  'Photography',
  'History',
];

const ItineraryCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
    budget: '',
    preferences: [] as string[],
    notes: '',
  });

  const togglePreference = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  const validate = () => {
    try {
      itinerarySchema.parse({
        ...formData,
        budget: parseFloat(formData.budget) || 0,
      });

      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        setErrors({ end_date: 'End date must be after start date' });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('auth_session');
      if (!token) {
        throw new Error('No auth token');
      }
      const session = JSON.parse(token);

      // Create itinerary
      const itineraryResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          destination: formData.destination,
          start_date: formData.start_date,
          end_date: formData.end_date,
          budget: parseFloat(formData.budget),
          preferences: formData.preferences,
          notes: formData.notes || null,
        }),
      });

      if (!itineraryResponse.ok) {
        throw new Error('Failed to create itinerary');
      }

      const itinerary = await itineraryResponse.json();

      // Generate budget-based activities
      const days = differenceInDays(
        new Date(formData.end_date),
        new Date(formData.start_date)
      ) + 1;

      const generatedActivities = generateActivitiesForBudget(
        formData.destination, 
        days, 
        parseFloat(formData.budget)
      );

      const activities = generatedActivities.map((activity) => ({
        itinerary_id: itinerary.id,
        day_number: activity.day_number,
        title: activity.title,
        description: activity.description,
        duration_minutes: activity.duration_minutes,
        estimated_cost: activity.estimated_cost,
        order_index: activity.order_index,
        start_time: activity.start_time,
      }));

      const activitiesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activities/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ activities }),
      });

      if (!activitiesResponse.ok) {
        throw new Error('Failed to create activities');
      }

      toast({
        title: 'Itinerary created!',
        description: 'Your trip has been planned with budget-optimized activities.',
      });

      navigate(`/itineraries/${itinerary.id}`);
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to create itinerary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const days = formData.start_date && formData.end_date
    ? differenceInDays(new Date(formData.end_date), new Date(formData.start_date)) + 1
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <div className="flex-1 bg-background py-8">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary mb-4">
                  <Sparkles className="h-4 w-4 text-coral" />
                  <span className="text-sm font-medium text-secondary-foreground">
                    Budget-Optimized Planning
                  </span>
                </div>
                <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                  Plan Your Next Trip
                </h1>
                <p className="text-muted-foreground text-lg">
                  Tell us about your dream destination and we'll create a budget-optimized itinerary.
                </p>
              </div>

              {/* Form */}
              <Card variant="elevated">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Destination */}
                    <div className="space-y-2">
                      <Label htmlFor="destination">Where are you going?</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="destination"
                          placeholder="e.g., Paris, France"
                          value={formData.destination}
                          onChange={(e) =>
                            setFormData({ ...formData, destination: e.target.value })
                          }
                          className="pl-11 h-12 text-lg"
                        />
                      </div>
                      {errors.destination && (
                        <p className="text-sm text-destructive">{errors.destination}</p>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={(e) =>
                              setFormData({ ...formData, start_date: e.target.value })
                            }
                            className="pl-11 h-12"
                          />
                        </div>
                        {errors.start_date && (
                          <p className="text-sm text-destructive">{errors.start_date}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={(e) =>
                              setFormData({ ...formData, end_date: e.target.value })
                            }
                            className="pl-11 h-12"
                          />
                        </div>
                        {errors.end_date && (
                          <p className="text-sm text-destructive">{errors.end_date}</p>
                        )}
                      </div>
                    </div>

                    {days > 0 && (
                      <div className="p-4 rounded-xl bg-secondary text-center">
                        <span className="text-secondary-foreground font-medium">
                          🗓️ {days} {days === 1 ? 'day' : 'days'} of adventure!
                        </span>
                      </div>
                    )}

                    {/* Budget */}
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="budget"
                          type="number"
                          placeholder="2000"
                          value={formData.budget}
                          onChange={(e) =>
                            setFormData({ ...formData, budget: e.target.value })
                          }
                          className="pl-11 h-12 text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Activities will be automatically optimized based on your budget.
                      </p>
                      {errors.budget && (
                        <p className="text-sm text-destructive">{errors.budget}</p>
                      )}
                    </div>

                    {/* Preferences */}
                    <div className="space-y-3">
                      <Label>What interests you?</Label>
                      <div className="flex flex-wrap gap-2">
                        {preferenceOptions.map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => togglePreference(pref)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.preferences.includes(pref)
                                ? 'bg-coral text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific requirements or preferences..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={3}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        'Creating your itinerary...'
                      ) : (
                        <>
                          Generate Itinerary
                          <Sparkles className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ItineraryCreate;
