import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Inbox as InboxIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { queryAPI } from '../services/api';
import { io } from 'socket.io-client';

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color = '#1976d2' }) => (
  <Card 
    sx={{ 
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color, opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQueries: 0,
    newQueries: 0,
    resolvedQueries: 0,
    avgResponseTime: 0,
  });
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    fetchDashboardData();
    
    // Setup real-time socket connection
    const socket = io('http://localhost:5000');
    
    socket.on('newQuery', () => {
      fetchDashboardData();
      showSnackbar('New query received!', 'info');
    });
    
    socket.on('queryUpdated', () => {
      fetchDashboardData();
      showSnackbar('Query updated!', 'success');
    });

    return () => socket.disconnect();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, queriesRes] = await Promise.all([
        queryAPI.getAnalytics(),
        queryAPI.getAll({ status: 'new' })
      ]);

      setStats(analyticsRes.data);
      setRecentQueries(queriesRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showSnackbar('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const createSampleQuery = async () => {
    const sampleMessages = [
      "My order hasn't arrived yet. This is urgent!",
      "How do I reset my password?",
      "The website is broken and not loading properly",
      "I love your product! Just wanted to say thanks",
      "Can you help me with my account settings?",
      "This is terrible service! I want a refund NOW!"
    ];

    const sources = ['email', 'twitter', 'facebook', 'chat', 'website'];
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];

    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];

    try {
      await queryAPI.create({
        source: randomSource,
        customerName: randomName,
        customerEmail: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
        subject: `Query from ${randomName}`,
        message: randomMessage
      });
      showSnackbar('Sample query created successfully!', 'success');
    } catch (error) {
      console.error('Error creating sample query:', error);
      showSnackbar('Error creating sample query', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'error',
      high: 'warning',
      medium: 'info',
      low: 'success'
    };
    return colors[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'primary',
      assigned: 'secondary',
      'in-progress': 'warning',
      resolved: 'success'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Real-time monitoring of customer queries and team performance
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createSampleQuery}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          Add Sample Query
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Queries"
            value={stats.totalQueries}
            subtitle="All time"
            icon={<InboxIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Queries"
            value={stats.newQueries}
            subtitle="Require attention"
            icon={<WarningIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resolved"
            value={stats.resolvedQueries}
            subtitle="Completed"
            icon={<CheckCircleIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Response Time"
            value={`${Math.round(stats.avgResponseTime)}m`}
            subtitle="Average"
            icon={<TimeIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      {/* Recent Queries */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card 
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1, color: '#ed6c02' }} />
                Recent Queries Requiring Attention
              </Typography>
              
              {recentQueries.map((query) => (
                <Box 
                  key={query._id} 
                  sx={{ 
                    mb: 2, 
                    p: 2, 
                    border: '1px solid #e0e0e0', 
                    borderRadius: 2,
                    backgroundColor: '#fafafa',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      borderColor: '#1976d2'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {query.customerName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {query.customerEmail} • {new Date(query.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <Chip 
                        label={query.priority} 
                        color={getPriorityColor(query.priority)}
                        size="small" 
                      />
                      <Chip 
                        label={query.status} 
                        color={getStatusColor(query.status)}
                        variant="outlined"
                        size="small" 
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
                    "{query.message.length > 120 ? `${query.message.substring(0, 120)}...` : query.message}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={query.source} variant="outlined" size="small" />
                    <Chip label={query.category} variant="outlined" size="small" />
                    {query.tags?.slice(0, 3).map((tag, index) => (
                      <Chip key={index} label={tag} size="small" sx={{ backgroundColor: '#e3f2fd' }} />
                    ))}
                  </Box>
                </Box>
              ))}
              
              {recentQueries.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No pending queries!
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    All queries are currently handled.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => window.location.href = '/inbox'}
                >
                  View All Queries
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={() => window.location.href = '/analytics'}
                >
                  View Analytics
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={createSampleQuery}
                >
                  Test System
                </Button>
              </Box>

              {/* System Status */}
              <Box sx={{ mt: 4, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  System Status
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Real-time updates: Active
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • NLP Processing: Active
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Database: Connected
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}