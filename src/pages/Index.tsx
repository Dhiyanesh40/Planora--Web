import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar, Wallet, Sparkles, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import heroImage from '@/assets/hero-travel.jpg';

const features = [
  {
    icon: MapPin,
    title: 'Smart Destinations',
    description: 'Get personalized suggestions based on your travel preferences and style.',
  },
  {
    icon: Calendar,
    title: 'Day-by-Day Planning',
    description: 'Organize activities, timing, and travel between locations effortlessly.',
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'Set budgets and track expenses to stay on top of your travel spending.',
  },
  {
    icon: Sparkles,
    title: 'AI Suggestions',
    description: 'Smart recommendations for activities, restaurants, and hidden gems.',
  },
  {
    icon: Globe,
    title: 'Share & Collaborate',
    description: 'Share itineraries with friends and plan trips together in real-time.',
  },
  {
    icon: Users,
    title: 'Community Insights',
    description: 'Discover popular destinations and trending travel experiences.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Layout>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Beautiful sunset over Santorini, Greece"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-hero" />
          </div>

          {/* Content */}
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-coral-light" />
                <span className="text-sm font-medium text-primary-foreground">
                  Smart Travel Planning Made Simple
                </span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                Your Next Adventure
                <br />
                <span className="text-gradient bg-gradient-to-r from-coral-light via-sunset to-coral">
                  Starts Here
                </span>
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Plan stunning itineraries, track your budget, and create unforgettable 
                travel memories with our intelligent trip planner.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/auth?mode=signup">
                  <Button variant="hero" size="xl">
                    Start Planning Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/itineraries">
                  <Button 
                    variant="outline" 
                    size="xl"
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Explore Trips
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex justify-center pt-2">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Everything You Need to
                <br />
                <span className="text-coral">Travel Smarter</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to make your travel planning effortless and enjoyable.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-ocean">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Plan Your
                <br />
                Dream Vacation?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join thousands of travelers who plan smarter, travel better, and create memories that last a lifetime.
              </p>
              <Link to="/auth?mode=signup">
                <Button 
                  size="xl" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
                >
                  Get Started for Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    </div>
  );
};

export default Index;
