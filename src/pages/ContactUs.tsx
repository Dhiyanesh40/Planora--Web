import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactUs = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-muted-foreground mb-8">
              Have questions or feedback? We'd love to hear from you!
            </p>

            {/* Contact Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <CardTitle>Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Send us an email</p>
                <a 
                  href="mailto:nivashinidhiyanesh@gmail.com" 
                  className="text-primary hover:underline font-semibold"
                >
                  nivashinidhiyanesh@gmail.com
                </a>
              </CardContent>
            </Card>

            {/* Main Contact Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">General Inquiries</h3>
                  <p className="text-muted-foreground">
                    For general questions about Planora, features, or how to use the platform, feel free to reach out via email.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Technical Support</h3>
                  <p className="text-muted-foreground">
                    Experiencing technical issues? Contact us with details about the problem, and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Feedback & Suggestions</h3>
                  <p className="text-muted-foreground">
                    We're always looking to improve! Share your feedback, feature requests, or suggestions for making Planora better.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Business Inquiries</h3>
                  <p className="text-muted-foreground">
                    Interested in collaborating or partnership opportunities? Let's discuss how we can work together.
                  </p>
                </div>

                <div className="pt-4">
                  <Button asChild className="w-full md:w-auto">
                    <a href="mailto:nivashinidhiyanesh@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Developer Info */}
            <Card className="bg-gradient-sunset text-primary-foreground">
              <CardHeader>
                <CardTitle>About the Developer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-semibold">Dhiyanesh</p>
                    <p className="text-sm opacity-90">Full Stack Developer</p>
                  </div>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  Planora is built with modern web technologies including React, Node.js, Express, and MySQL. 
                  The project focuses on providing travelers with an intuitive platform to plan budget-optimized trips.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
