import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, DollarSign, Clock, Edit, Share2, 
  ArrowLeft, ChevronDown, ChevronUp, Trash2, FileText, Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays, addDays } from 'date-fns';

interface Activity {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string | null;
  duration_minutes: number;
  estimated_cost: number;
  order_index: number;
  notes: string | null;
  photo_url: string | null;
}

interface Itinerary {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  preferences: string[];
  notes: string | null;
  is_public: boolean;
  user_id: string;
}

const ItineraryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  useEffect(() => {
    if (id) {
      fetchItineraryDetails();
    }
  }, [id]);

  const fetchItineraryDetails = async () => {
    try {
      // Fetch itinerary
      const itineraryResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries/${id}`);
      
      if (!itineraryResponse.ok) {
        throw new Error('Failed to fetch itinerary');
      }

      const itineraryData = await itineraryResponse.json();

      if (!itineraryData) {
        toast({
          title: 'Not found',
          description: 'This itinerary does not exist.',
          variant: 'destructive',
        });
        navigate('/dashboard');
        return;
      }

      setItinerary(itineraryData);

      // Fetch activities
      const activitiesResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activities/itinerary/${id}`);
      
      if (!activitiesResponse.ok) {
        throw new Error('Failed to fetch activities');
      }

      const activitiesData = await activitiesResponse.json();
      setActivities(activitiesData || []);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to load itinerary details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const handleShare = async () => {
    if (!itinerary) return;

    try {
      const token = localStorage.getItem('auth_session');
      if (!token) {
        throw new Error('No auth token');
      }
      const session = JSON.parse(token);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries/${itinerary.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ ...itinerary, is_public: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to share itinerary');
      }

      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Your itinerary is now public and the link has been copied.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share itinerary.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const token = localStorage.getItem('auth_session');
      if (!token) {
        throw new Error('No auth token');
      }
      const session = JSON.parse(token);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete activity');
      }

      setActivities(activities.filter((a) => a.id !== activityId));
      toast({ title: 'Activity removed' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete activity.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-48 bg-secondary rounded-2xl" />
              <div className="h-32 bg-secondary rounded-xl" />
              <div className="h-64 bg-secondary rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!itinerary) return null;

  const days = differenceInDays(
    new Date(itinerary.end_date),
    new Date(itinerary.start_date)
  ) + 1;

  const totalExpenses = activities.reduce(
    (sum, activity) => sum + Number(activity.estimated_cost),
    0
  );

  const isOwner = user?.id === itinerary.user_id;

  // Group activities by day
  const activitiesByDay: Record<number, Activity[]> = {};
  for (let i = 1; i <= days; i++) {
    activitiesByDay[i] = activities.filter((a) => a.day_number === i);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        <div className="flex-1 bg-background py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Back Button */}
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>

              {/* Hero Header */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-ocean p-8 mb-8">
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-primary-foreground/80" />
                        <span className="text-primary-foreground/80 font-medium">
                          {days} {days === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                      <h1 className="font-display text-4xl font-bold text-primary-foreground mb-2">
                        {itinerary.destination}
                      </h1>
                      <p className="text-primary-foreground/80 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(itinerary.start_date), 'MMM d')} -{' '}
                        {format(new Date(itinerary.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>

                    {isOwner && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        <Link to={`/itineraries/${itinerary.id}/edit`}>
                          <Button
                            variant="ghost"
                            className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Budget Summary */}
              <Card variant="elevated" className="mb-8">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Budget</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${Number(itinerary.budget).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Estimated Expenses</p>
                      <p className="text-2xl font-bold text-coral">
                        ${totalExpenses.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                      <p className={`text-2xl font-bold ${
                        Number(itinerary.budget) - totalExpenses >= 0 
                          ? 'text-green-600' 
                          : 'text-destructive'
                      }`}>
                        ${(Number(itinerary.budget) - totalExpenses).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Activities</p>
                      <p className="text-2xl font-bold text-foreground">
                        {activities.length}
                      </p>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="mt-4">
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          totalExpenses / Number(itinerary.budget) > 1
                            ? 'bg-destructive'
                            : 'bg-gradient-sunset'
                        }`}
                        style={{
                          width: `${Math.min((totalExpenses / Number(itinerary.budget)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              {itinerary.preferences && itinerary.preferences.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {itinerary.preferences.map((pref) => (
                    <span
                      key={pref}
                      className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-secondary-foreground"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              )}

              {/* Day-by-Day Itinerary */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Your Itinerary
                </h2>

                {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
                  const dayDate = addDays(new Date(itinerary.start_date), day - 1);
                  const dayActivities = activitiesByDay[day] || [];
                  const dayTotal = dayActivities.reduce(
                    (sum, a) => sum + Number(a.estimated_cost),
                    0
                  );
                  const isExpanded = expandedDays.has(day);

                  return (
                    <Card key={day} variant="default" className="overflow-hidden">
                      <button
                        onClick={() => toggleDay(day)}
                        className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">
                              {day}
                            </span>
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground">
                              Day {day}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(dayDate, 'EEEE, MMM d')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {dayActivities.length} activities
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              ${dayTotal}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <CardContent className="pt-0 pb-4">
                          {dayActivities.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No activities planned for this day.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {dayActivities.map((activity, idx) => (
                                <motion.div
                                  key={activity.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  className="p-4 rounded-xl bg-secondary/50 group"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-16 text-center">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        {activity.start_time || '--:--'}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium text-foreground">
                                        {activity.title}
                                      </h4>
                                      {activity.description && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {activity.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {activity.duration_minutes} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <DollarSign className="h-3 w-3" />
                                          ${activity.estimated_cost}
                                        </span>
                                      </div>

                                      {/* Show notes if available */}
                                      {activity.notes && (
                                        <div className="mt-3 p-3 rounded-lg bg-background/50 border border-border/50">
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                            <FileText className="h-3 w-3" />
                                            Personal Notes
                                          </div>
                                          <p className="text-sm text-foreground whitespace-pre-wrap">
                                            {activity.notes}
                                          </p>
                                        </div>
                                      )}

                                      {/* Show photo if available */}
                                      {activity.photo_url && (
                                        <div className="mt-3">
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <Image className="h-3 w-3" />
                                            Photo
                                          </div>
                                          <img 
                                            src={activity.photo_url} 
                                            alt={activity.title}
                                            className="max-h-48 w-auto rounded-lg object-cover"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    {isOwner && (
                                      <button
                                        onClick={() => handleDeleteActivity(activity.id)}
                                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Notes */}
              {itinerary.notes && (
                <Card variant="default" className="mt-8">
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {itinerary.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default ItineraryDetails;
