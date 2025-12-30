import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, DollarSign, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchFilters';

interface Itinerary {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  preferences: string[];
  created_at: string;
}

interface SearchFilters {
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: string;
  maxBudget: string;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    startDate: '',
    endDate: '',
    minBudget: '',
    maxBudget: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchItineraries();
    }
  }, [user]);

  const fetchItineraries = async () => {
    try {
      const token = localStorage.getItem('auth_session');
      if (!token) {
        throw new Error('No auth token');
      }
      const session = JSON.parse(token);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch itineraries');
      }

      const data = await response.json();
      setItineraries(data || []);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your itineraries.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_session');
      if (!token) {
        throw new Error('No auth token');
      }
      const session = JSON.parse(token);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete itinerary');
      }

      setItineraries(itineraries.filter((item) => item.id !== id));
      toast({
        title: 'Deleted',
        description: 'Itinerary has been removed.',
      });
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete itinerary.',
        variant: 'destructive',
      });
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const filteredItineraries = itineraries.filter((item) => {
    // Destination filter
    const matchesDestination = !filters.destination || 
      item.destination.toLowerCase().includes(filters.destination.toLowerCase());

    // Date filters
    let matchesDate = true;
    if (filters.startDate || filters.endDate) {
      const itemStart = new Date(item.start_date);
      const itemEnd = new Date(item.end_date);
      
      if (filters.startDate) {
        const filterStart = new Date(filters.startDate);
        matchesDate = matchesDate && itemEnd >= filterStart;
      }
      if (filters.endDate) {
        const filterEnd = new Date(filters.endDate);
        matchesDate = matchesDate && itemStart <= filterEnd;
      }
    }

    // Budget filters
    let matchesBudget = true;
    const budget = Number(item.budget);
    if (filters.minBudget) {
      matchesBudget = matchesBudget && budget >= Number(filters.minBudget);
    }
    if (filters.maxBudget) {
      matchesBudget = matchesBudget && budget <= Number(filters.maxBudget);
    }

    return matchesDestination && matchesDate && matchesBudget;
  });

  const stats = {
    totalTrips: itineraries.length,
    upcomingTrips: itineraries.filter(
      (item) => new Date(item.start_date) > new Date()
    ).length,
    totalBudget: itineraries.reduce((sum, item) => sum + Number(item.budget), 0),
  };

  // Get display name
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  if (authLoading || (!user && !authLoading)) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Welcome back, {displayName}!
            </h1>
            <p className="text-muted-foreground text-lg">
              {user?.email}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <Card variant="elevated" className="bg-gradient-ocean text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary-foreground/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Total Trips</p>
                    <p className="text-3xl font-bold">{stats.totalTrips}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="bg-gradient-sunset text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary-foreground/20">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Upcoming</p>
                    <p className="text-3xl font-bold">{stats.upcomingTrips}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-secondary">
                    <DollarSign className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${stats.totalBudget.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1 w-full">
                <AdvancedSearchFilters 
                  onFilterChange={handleFilterChange}
                  showCreateButton={false}
                />
              </div>
              <Link to="/itineraries/new">
                <Button variant="hero" size="lg" className="w-full md:w-auto whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  New Trip
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Itineraries Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-secondary rounded-t-xl" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-secondary rounded mb-2" />
                    <div className="h-4 bg-secondary rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItineraries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                No trips yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start planning your next adventure today!
              </p>
              <Link to="/itineraries/new">
                <Button variant="hero" size="lg">
                  <Plus className="h-4 w-4" />
                  Create Your First Trip
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary, index) => {
                const days = differenceInDays(
                  new Date(itinerary.end_date),
                  new Date(itinerary.start_date)
                ) + 1;

                return (
                  <motion.div
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card variant="interactive" className="overflow-hidden h-full">
                      {/* Decorative Header */}
                      <div className="h-32 bg-gradient-ocean relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-primary-foreground/30" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium">
                            {days} {days === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{itinerary.destination}</CardTitle>
                        <CardDescription>
                          {format(new Date(itinerary.start_date), 'MMM d')} -{' '}
                          {format(new Date(itinerary.end_date), 'MMM d, yyyy')}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-2 mb-4">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">
                            ${Number(itinerary.budget).toLocaleString()} budget
                          </span>
                        </div>

                        {itinerary.preferences && itinerary.preferences.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {itinerary.preferences.slice(0, 3).map((pref) => (
                              <span
                                key={pref}
                                className="px-2 py-1 rounded-full bg-secondary text-xs text-secondary-foreground"
                              >
                                {pref}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Link to={`/itineraries/${itinerary.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </Link>
                          <Link to={`/itineraries/${itinerary.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(itinerary.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
