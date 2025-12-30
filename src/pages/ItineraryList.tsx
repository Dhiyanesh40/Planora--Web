import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, DollarSign, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchFilters';

interface Itinerary {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  preferences: string[];
  is_public: boolean;
  user_id: string;
}

interface SearchFilters {
  destination: string;
  startDate: string;
  endDate: string;
  minBudget: string;
  maxBudget: string;
}

const ItineraryList = () => {
  const { user } = useAuth();
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
    fetchItineraries();
  }, [user]);

  const fetchItineraries = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/itineraries`;
      
      if (user) {
        // Authenticated user - get all itineraries
        const token = localStorage.getItem('auth_session');
        if (token) {
          const session = JSON.parse(token);
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setItineraries(data || []);
          }
        }
      } else {
        // Non-authenticated user - get only public itineraries
        const response = await fetch(`${url}/public`);
        if (response.ok) {
          const data = await response.json();
          setItineraries(data || []);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Explore <span className="text-coral">Itineraries</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse travel plans from the community or find your perfect trip inspiration.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full">
                  <AdvancedSearchFilters 
                    onFilterChange={handleFilterChange}
                    showCreateButton={false}
                  />
                </div>
                {user && (
                  <Link to="/itineraries/new">
                    <Button variant="hero" className="whitespace-nowrap">
                      <Plus className="h-4 w-4" />
                      Create Trip
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                  No itineraries found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters.
                </p>
                {user && (
                  <Link to="/itineraries/new">
                    <Button variant="hero">
                      <Plus className="h-4 w-4" />
                      Create Your Own
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItineraries.map((itinerary, index) => {
                  const days =
                    differenceInDays(
                      new Date(itinerary.end_date),
                      new Date(itinerary.start_date)
                    ) + 1;
                  const isOwn = user?.id === itinerary.user_id;

                  return (
                    <motion.div
                      key={itinerary.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card variant="interactive" className="overflow-hidden h-full">
                        <div className={`h-32 relative ${isOwn ? 'bg-gradient-sunset' : 'bg-gradient-ocean'}`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-primary-foreground/30" />
                          </div>
                          <div className="absolute top-3 left-3 flex gap-2">
                            <span className="px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium">
                              {days} {days === 1 ? 'day' : 'days'}
                            </span>
                            {isOwn && (
                              <span className="px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-medium">
                                Yours
                              </span>
                            )}
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

                          <Link to={`/itineraries/${itinerary.id}`}>
                            <Button variant="outline" className="w-full">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ItineraryList;
