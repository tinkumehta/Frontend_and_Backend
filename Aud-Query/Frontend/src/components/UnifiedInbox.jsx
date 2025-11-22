import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { queryAPI, userAPI } from '../services/api';
import { io } from 'socket.io-client';
import QueryCard from './QueryCard';

export default function UnifiedInbox() {
  const [queries, setQueries] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    source: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
    
    const socket = io('http://localhost:5000');
    socket.on('newQuery', fetchQueries);
    socket.on('queryUpdated', fetchQueries);

    return () => socket.disconnect();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchQueries(), fetchUsers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchQueries = async () => {
    try {
      const response = await queryAPI.getAll(filters);
      setQueries(response.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [filters]);

  const handleUpdateQuery = async (queryId, updateData) => {
    try {
      await queryAPI.update(queryId, updateData);
      // Socket will trigger refetch
    } catch (error) {
      console.error('Error updating query:', error);
      setError('Failed to update query');
    }
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      source: ''
    });
    setSearchTerm('');
  };

  const filteredQueries = queries.filter(query =>
    query.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCount = (status) => {
    return queries.filter(q => q.status === status).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Unified Inbox
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage all customer queries from one centralized location
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Status Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { status: 'new', label: 'New', color: 'primary', count: getStatusCount('new') },
          { status: 'assigned', label: 'Assigned', color: 'secondary', count: getStatusCount('assigned') },
          { status: 'in-progress', label: 'In Progress', color: 'warning', count: getStatusCount('in-progress') },
          { status: 'resolved', label: 'Resolved', color: 'success', count: getStatusCount('resolved') },
        ].map((item) => (
          <Grid item xs={6} sm={3} key={item.status}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: filters.status === item.status ? '#e3f2fd' : 'white',
                border: filters.status === item.status ? '2px solid #1976d2' : '1px solid #e0e0e0',
              }}
              onClick={() => setFilters(prev => ({ ...prev, status: prev.status === item.status ? '' : item.status }))}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: `${item.color}.main` }}>
                  {item.count}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters Card */}
      <Card sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          Filters & Search
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search queries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Priority Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              >
                <MenuItem value="">All Priority</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="question">Question</MenuItem>
                <MenuItem value="complaint">Complaint</MenuItem>
                <MenuItem value="request">Request</MenuItem>
                <MenuItem value="feedback">Feedback</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Source Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Source</InputLabel>
              <Select
                value={filters.source}
                label="Source"
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
              >
                <MenuItem value="">All Sources</MenuItem>
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="chat">Chat</MenuItem>
                <MenuItem value="website">Website</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} sm={6} md={1}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              fullWidth
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {/* Active Filters */}
        {(filters.status || filters.priority || filters.category || filters.source || searchTerm) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Active filters:
            </Typography>
            {filters.status && (
              <Chip 
                label={`Status: ${filters.status}`} 
                onDelete={() => setFilters(prev => ({ ...prev, status: '' }))}
                size="small"
              />
            )}
            {filters.priority && (
              <Chip 
                label={`Priority: ${filters.priority}`} 
                onDelete={() => setFilters(prev => ({ ...prev, priority: '' }))}
                size="small"
              />
            )}
            {filters.category && (
              <Chip 
                label={`Category: ${filters.category}`} 
                onDelete={() => setFilters(prev => ({ ...prev, category: '' }))}
                size="small"
              />
            )}
            {filters.source && (
              <Chip 
                label={`Source: ${filters.source}`} 
                onDelete={() => setFilters(prev => ({ ...prev, source: '' }))}
                size="small"
              />
            )}
            {searchTerm && (
              <Chip 
                label={`Search: ${searchTerm}`} 
                onDelete={() => setSearchTerm('')}
                size="small"
              />
            )}
          </Box>
        )}
      </Card>

      {/* Query List */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          Customer Queries
          <Chip 
            label={filteredQueries.length} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }} 
          />
        </Typography>
        
        {filteredQueries.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No queries found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {queries.length === 0 
                ? "No queries in the system yet. Create some sample queries to get started."
                : "No queries match your current filters. Try adjusting your search criteria."
              }
            </Typography>
          </Card>
        ) : (
          filteredQueries.map((query) => (
            <QueryCard 
              key={query._id} 
              query={query} 
              users={users}
              onUpdate={handleUpdateQuery}
            />
          ))
        )}
      </Box>
    </Box>
  );
}