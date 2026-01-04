import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 4, 2026</p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We collect information that you provide directly to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create an account</li>
                  <li>Create and manage itineraries</li>
                  <li>Contact us for support</li>
                  <li>Use our services</li>
                </ul>
                <p className="mt-4">
                  This information may include: name, email address, and travel preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Create and manage your account</li>
                  <li>Process your itineraries and activities</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>Public itineraries are visible to other users</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We implement appropriate security measures to protect your personal information. Your password is encrypted using industry-standard bcrypt hashing, and all data transmission is secured using HTTPS.
                </p>
                <p>
                  However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We retain your personal information for as long as your account is active or as needed to provide you services. You can delete your account at any time, which will remove your personal information from our active databases.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Update or correct your information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We use localStorage to store your authentication session. We do not use third-party tracking cookies or analytics tools.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>8. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p className="font-semibold">nivashinidhiyanesh@gmail.com</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
