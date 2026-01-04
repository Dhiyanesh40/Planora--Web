import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Mail, Book } from 'lucide-react';

const HelpCenter = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6">Help Center</h1>
            <p className="text-muted-foreground mb-8">Find answers to commonly asked questions</p>

            {/* Quick Help Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Book className="h-6 w-6 text-primary" />
                    <CardTitle>Getting Started</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn how to create your first itinerary and plan your perfect trip.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    <CardTitle>FAQs</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Browse through frequently asked questions and find quick answers.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* FAQs */}
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  How do I create an itinerary?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Creating an itinerary is easy! Follow these steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Sign in to your account or create one</li>
                  <li>Click on "Create Itinerary" in the navigation</li>
                  <li>Enter your destination, dates, and budget</li>
                  <li>Select your preferences (photography, relaxation, adventure, etc.)</li>
                  <li>Click "Generate Itinerary" - we'll create budget-optimized activities for you!</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Can I edit my itinerary after creating it?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Yes! You can edit your itinerary at any time. Simply:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Go to your dashboard</li>
                  <li>Find the itinerary you want to edit</li>
                  <li>Click the edit icon</li>
                  <li>Make your changes and save</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  How does budget-based planning work?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Planora uses your budget to generate optimized activities:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Activities are generated based on your total budget</li>
                  <li>Each activity has an estimated cost</li>
                  <li>The system ensures activities fit within your budget</li>
                  <li>You can add, remove, or modify activities as needed</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Can I share my itinerary with others?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Yes! You can make your itinerary public:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Open your itinerary details page</li>
                  <li>Click the "Share" button</li>
                  <li>Your itinerary will be made public and the link will be copied</li>
                  <li>Share the link with friends, family, or the community</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  How do I delete my account?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you wish to delete your account, please contact us at <span className="font-semibold">nivashinidhiyanesh@gmail.com</span> and we'll help you with the process.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Is my data secure?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Yes! We take security seriously:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Passwords are encrypted using bcrypt</li>
                  <li>JWT authentication for secure sessions</li>
                  <li>HTTPS for all data transmission</li>
                  <li>Regular security updates</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-primary/5 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <CardTitle>Still need help?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Can't find what you're looking for? Our support team is here to help!
                </p>
                <p className="font-semibold">
                  Email us at: <a href="mailto:nivashinidhiyanesh@gmail.com" className="text-primary hover:underline">nivashinidhiyanesh@gmail.com</a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
