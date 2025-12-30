import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, ArrowLeft, Save, Plus, Trash2, RefreshCw, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, addDays, format } from 'date-fns';
import { generateActivitiesForBudget } from '@/utils/activityGenerator';

interface Activity {
  id?: string;
  day_number: number;
  title: string;
  description: string;
  start_time: string;
  duration_minutes: number;
  estimated_cost: number;
  order_index: number;
  notes?: string;
  photo_url?: string;
}

interface Itinerary {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  preferences: string[];
  notes: string | null;
}

const preferenceOptions = [
  'Sightseeing', 'Adventure', 'Relaxation', 'Food & Dining', 'Culture',
  'Nature', 'Shopping', 'Nightlife', 'Photography', 'History',
];

const ItineraryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const previousBudgetRef = useRef<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch itinerary
      const itineraryResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries/${id}`);
      
      if (!itineraryResponse.ok) {
        navigate('/dashboard');
        return;
      }

      const itineraryData = await itineraryResponse.json();
      
      if (!itineraryData) {
        navigate('/dashboard');
        return;
      }

      setItinerary(itineraryData);
      previousBudgetRef.current = itineraryData.budget;

      // Fetch activities
      const activitiesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activities/itinerary/${id}`);
      
      if (!activitiesResponse.ok) {
        throw new Error('Failed to fetch activities');
      }

      const activitiesData = await activitiesResponse.json();
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load itinerary.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItineraryChange = (field: keyof Itinerary, value: any) => {
    if (itinerary) {
      setItinerary({ ...itinerary, [field]: value });
    }
  };

  const togglePreference = (pref: string) => {
    if (!itinerary) return;
    const prefs = itinerary.preferences || [];
    const updated = prefs.includes(pref)
      ? prefs.filter((p) => p !== pref)
      : [...prefs, pref];
    setItinerary({ ...itinerary, preferences: updated });
  };

  const regenerateActivities = () => {
    if (!itinerary) return;

    const days = differenceInDays(
      new Date(itinerary.end_date),
      new Date(itinerary.start_date)
    ) + 1;

    const newActivities = generateActivitiesForBudget(
      itinerary.destination,
      days,
      itinerary.budget
    );

    setActivities(newActivities);
    previousBudgetRef.current = itinerary.budget;

    toast({
      title: 'Activities Regenerated',
      description: `Generated new activities based on $${itinerary.budget.toLocaleString()} budget.`,
    });
  };

  const addActivity = (dayNumber: number) => {
    const dayActivities = activities.filter((a) => a.day_number === dayNumber);
    const newActivity: Activity = {
      day_number: dayNumber,
      title: 'New Activity',
      description: '',
      start_time: '10:00',
      duration_minutes: 60,
      estimated_cost: 0,
      order_index: dayActivities.length,
      notes: '',
      photo_url: '',
    };
    setActivities([...activities, newActivity]);
  };

  const updateActivity = (index: number, field: keyof Activity, value: any) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [field]: value };
    setActivities(updated);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!itinerary || !user) return;

    setSaving(true);

    try {
      const token = localStorage.getItem('auth_session');
      if (!token) {
        throw new Error('No auth token');
      }
      const session = JSON.parse(token);

      // Update itinerary
      const itineraryResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries/${itinerary.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          destination: itinerary.destination,
          start_date: itinerary.start_date,
          end_date: itinerary.end_date,
          budget: itinerary.budget,
          preferences: itinerary.preferences,
          notes: itinerary.notes,
        }),
      });

      if (!itineraryResponse.ok) {
        throw new Error('Failed to update itinerary');
      }

      // Delete existing activities
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activities/itinerary/${itinerary.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      // Insert updated activities
      if (activities.length > 0) {
        const activitiesToInsert = activities.map((activity, idx) => ({
          itinerary_id: itinerary.id,
          day_number: activity.day_number,
          title: activity.title,
          description: activity.description || null,
          start_time: activity.start_time || null,
          duration_minutes: activity.duration_minutes,
          estimated_cost: activity.estimated_cost,
          order_index: activity.order_index,
          notes: activity.notes || null,
          photo_url: activity.photo_url || null,
        }));

        const activitiesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activities/bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ activities: activitiesToInsert }),
        });

        if (!activitiesResponse.ok) {
          throw new Error('Failed to save activities');
        }
      }

      toast({
        title: 'Saved!',
        description: 'Your itinerary has been updated.',
      });

      navigate(`/itineraries/${itinerary.id}`);
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !itinerary) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-secondary rounded-xl" />
              <div className="h-64 bg-secondary rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const days = differenceInDays(
    new Date(itinerary.end_date),
    new Date(itinerary.start_date)
  ) + 1;

  const dayActivities = activities.filter((a) => a.day_number === activeDay);

  // Calculate current total expenses
  const totalExpenses = activities.reduce(
    (sum, activity) => sum + Number(activity.estimated_cost),
    0
  );

  const budgetChanged = previousBudgetRef.current !== null && 
    itinerary.budget !== previousBudgetRef.current;

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link
                to={`/itineraries/${itinerary.id}`}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Link>
              <Button variant="hero" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Basic Info */}
            <Card variant="elevated" className="mb-8">
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={itinerary.destination}
                      onChange={(e) => handleItineraryChange('destination', e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={itinerary.start_date}
                      onChange={(e) => handleItineraryChange('start_date', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={itinerary.end_date}
                      onChange={(e) => handleItineraryChange('end_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Budget (USD)</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="number"
                        value={itinerary.budget}
                        onChange={(e) => handleItineraryChange('budget', parseFloat(e.target.value) || 0)}
                        className="pl-11"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant={budgetChanged ? 'default' : 'outline'}
                      onClick={regenerateActivities}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {budgetChanged ? 'Regenerate Activities' : 'Regenerate'}
                    </Button>
                  </div>
                  {budgetChanged && (
                    <p className="text-sm text-coral">
                      Budget changed! Click "Regenerate Activities" to update activities based on new budget.
                    </p>
                  )}
                </div>

                {/* Budget Summary */}
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-lg font-bold text-foreground">
                        ${itinerary.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated</p>
                      <p className="text-lg font-bold text-coral">
                        ${totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className={`text-lg font-bold ${
                        itinerary.budget - totalExpenses >= 0 
                          ? 'text-green-600' 
                          : 'text-destructive'
                      }`}>
                        ${(itinerary.budget - totalExpenses).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferenceOptions.map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => togglePreference(pref)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          itinerary.preferences?.includes(pref)
                            ? 'bg-coral text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={itinerary.notes || ''}
                    onChange={(e) => handleItineraryChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Any additional notes..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Activities Editor */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Day Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                  {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
                    const dayDate = addDays(new Date(itinerary.start_date), day - 1);
                    return (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all ${
                          activeDay === day
                            ? 'bg-gradient-sunset text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        Day {day}
                        <span className="text-xs ml-1 opacity-70">
                          ({format(dayDate, 'MMM d')})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Activities List */}
                <div className="space-y-4">
                  {dayActivities.map((activity, idx) => {
                    const globalIndex = activities.findIndex(
                      (a) => a === activity
                    );
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-secondary/50 space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              placeholder="Activity title"
                              value={activity.title}
                              onChange={(e) =>
                                updateActivity(globalIndex, 'title', e.target.value)
                              }
                            />
                            <Input
                              type="time"
                              value={activity.start_time}
                              onChange={(e) =>
                                updateActivity(globalIndex, 'start_time', e.target.value)
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeActivity(globalIndex)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <Textarea
                          placeholder="Description"
                          value={activity.description}
                          onChange={(e) =>
                            updateActivity(globalIndex, 'description', e.target.value)
                          }
                          rows={2}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Duration (minutes)</Label>
                            <Input
                              type="number"
                              value={activity.duration_minutes}
                              onChange={(e) =>
                                updateActivity(
                                  globalIndex,
                                  'duration_minutes',
                                  parseInt(e.target.value) || 0
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Cost ($)</Label>
                            <Input
                              type="number"
                              value={activity.estimated_cost}
                              onChange={(e) =>
                                updateActivity(
                                  globalIndex,
                                  'estimated_cost',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </div>
                        </div>

                        {/* Optional Notes & Photo */}
                        <div className="border-t border-border/50 pt-4 space-y-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>Optional attachments</span>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-xs flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              Personal Notes
                            </Label>
                            <Textarea
                              placeholder="Add your personal notes for this activity..."
                              value={activity.notes || ''}
                              onChange={(e) =>
                                updateActivity(globalIndex, 'notes', e.target.value)
                              }
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs flex items-center gap-2">
                              <Image className="h-3 w-3" />
                              Photo URL (optional)
                            </Label>
                            <Input
                              placeholder="https://example.com/photo.jpg"
                              value={activity.photo_url || ''}
                              onChange={(e) =>
                                updateActivity(globalIndex, 'photo_url', e.target.value)
                              }
                            />
                            {activity.photo_url && (
                              <div className="mt-2">
                                <img 
                                  src={activity.photo_url} 
                                  alt="Activity preview"
                                  className="h-24 w-auto rounded-lg object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => addActivity(activeDay)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ItineraryEdit;
