'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  FileText, 
  Zap, 
  TrendingUp,
  Clock,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';

export default function Dashboard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalConversions: 0,
    totalToolUsage: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Simulate loading dashboard data
      setTimeout(() => {
        setStats({
          totalGenerations: Math.floor(Math.random() * 50) + 10,
          totalConversions: Math.floor(Math.random() * 30) + 5,
          totalToolUsage: Math.floor(Math.random() * 100) + 20,
          recentActivity: [
            { type: 'generation', title: 'Generated Blog Post', time: new Date().toISOString() },
            { type: 'conversion', title: 'Converted document.pdf to DOCX', time: new Date().toISOString() },
            { type: 'tool', title: 'Used Password Generator', time: new Date().toISOString() }
          ]
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Sign in to view your usage statistics, recent activity, and manage your account.
            </p>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Sign In to Continue
            </Button>
          </motion.div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const statCards = [
    {
      title: 'Content Generated',
      value: stats.totalGenerations,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'AI-powered content pieces'
    },
    {
      title: 'Files Converted',
      value: stats.totalConversions,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Successful conversions'
    },
    {
      title: 'Tools Used',
      value: stats.totalToolUsage,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Web utility executions'
    },
    {
      title: 'Total Actions',
      value: stats.totalGenerations + stats.totalConversions + stats.totalToolUsage,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Combined activities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your WebTools Pro activity and usage statistics.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {loading ? '...' : stat.value.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest actions across all WebTools Pro features
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'generation' ? 'bg-purple-100' :
                        activity.type === 'conversion' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {activity.type === 'generation' && <FileText className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'conversion' && <Zap className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'tool' && <Activity className="w-4 h-4 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.time).toLocaleDateString()} at{' '}
                          {new Date(activity.time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No recent activity yet</p>
                  <p className="text-sm text-gray-500">
                    Start using WebTools Pro features to see your activity here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump into your favorite WebTools Pro features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => window.location.href = '/content-generation'}
                >
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span>Generate Content</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => window.location.href = '/file-conversion'}
                >
                  <Zap className="w-6 h-6 text-blue-600" />
                  <span>Convert Files</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => window.location.href = '/web-tools'}
                >
                  <Activity className="w-6 h-6 text-green-600" />
                  <span>Use Web Tools</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}