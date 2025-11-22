import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { queryAPI } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Analytics() {
  const [analytics, setAnalytics] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, queriesRes] = await Promise.all([
        queryAPI.getAnalytics(),
        queryAPI.getAll({ status: 'resolved' })
      ]);

      setAnalytics(analyticsRes.data);
      setRecentActivity(queriesRes.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const priorityData = analytics.priorityDistribution?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    count: item.count
  })) || [];

  const categoryData = analytics.categoryDistribution?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    count: item.count
  })) || [];

  const sourceData = analytics.sourceDistribution?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    count: item.count
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2" fontWeight="bold">{label}</Typography>
          <Typography variant="body2" color={payload[0].color}>
            Count: {payload[0].value}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
        Analytics & Reports
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Comprehensive insights into query performance and team efficiency
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {analytics.totalQueries || 0}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Total Queries
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', backgroundColor: '#fff3e0' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                    {analytics.newQueries || 0}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Pending
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {analytics.resolvedQueries || 0}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Resolved
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', backgroundColor: '#f3e5f5' }}>
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                    {Math.round(analytics.avgResponseTime) || 0}m
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Avg Response Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Query Priority Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Query Category Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Source Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Query Source Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Performance Overview
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                      {analytics.totalQueries ? Math.round((analytics.resolvedQueries / analytics.totalQueries) * 100) : 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Resolution Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>
                      {analytics.newQueries || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Require Attention
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ p: 2, backgroundColor: '#e8f5e8', borderRadius: 1, mt: 1 }}>
                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      Quick Stats
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • Average response time: {Math.round(analytics.avgResponseTime) || 0} minutes
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • New queries per day: {Math.round((analytics.totalQueries || 0) / 30)} (estimated)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      • Resolution target: 85% (industry standard)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Recently Resolved Queries
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Resolved At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.map((query) => (
                      <TableRow 
                        key={query._id}
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {query.customerName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {query.customerEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {query.message.length > 60 
                              ? `${query.message.substring(0, 60)}...`
                              : query.message
                            }
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textTransform: 'capitalize',
                              color: query.category === 'complaint' ? 'error.main' : 'primary.main',
                              fontWeight: 'medium'
                            }}
                          >
                            {query.category}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              fontWeight: 'bold',
                              color: 
                                query.priority === 'urgent' ? 'error.main' :
                                query.priority === 'high' ? 'warning.main' :
                                query.priority === 'medium' ? 'info.main' : 'success.main'
                            }}
                          >
                            {query.priority}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              textTransform: 'capitalize',
                              fontWeight: 'medium'
                            }}
                          >
                            {query.source}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(query.updatedAt).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(query.updatedAt).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {recentActivity.length === 0 && (
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                  No resolved queries found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}