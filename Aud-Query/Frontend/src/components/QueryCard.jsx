import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AssignmentInd as AssignIcon,
  CheckCircle as ResolveIcon,
  PriorityHigh as PriorityIcon,
} from '@mui/icons-material';

const QueryCard = ({ query, users, onUpdate }) => {
  const [assignedTo, setAssignedTo] = React.useState(query.assignedTo?._id || '');
  const [status, setStatus] = React.useState(query.status);
  const [priority, setPriority] = React.useState(query.priority);

  const handleAssignment = async (userId) => {
    setAssignedTo(userId);
    try {
      await onUpdate(query._id, { assignedTo: userId || null });
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    try {
      await onUpdate(query._id, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    try {
      await onUpdate(query._id, { priority: newPriority });
    } catch (error) {
      console.error('Error updating priority:', error);
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

  const quickResolve = async () => {
    await handleStatusChange('resolved');
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderLeft: `4px solid ${
          priority === 'urgent' ? '#f44336' :
          priority === 'high' ? '#ff9800' :
          priority === 'medium' ? '#2196f3' : '#4caf50'
        }`,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {query.customerName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {query.customerEmail} • {new Date(query.createdAt).toLocaleString()}
            </Typography>
            {query.subject && (
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mt: 0.5 }}>
                {query.subject}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Tooltip title={`Priority: ${query.priority}`}>
              <Chip 
                icon={query.priority === 'urgent' ? <PriorityIcon /> : undefined}
                label={query.priority} 
                color={getPriorityColor(query.priority)}
                size="small" 
              />
            </Tooltip>
            <Chip label={query.source} variant="outlined" size="small" />
            <Chip label={query.category} variant="outlined" size="small" />
          </Box>
        </Box>

        {/* Message */}
        <Typography variant="body1" paragraph sx={{ 
          backgroundColor: '#f8f9fa', 
          p: 2, 
          borderRadius: 1,
          border: '1px solid #e9ecef'
        }}>
          {query.message}
        </Typography>

        {/* Tags */}
        {query.tags && query.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="textSecondary" display="block" gutterBottom>
              Auto-detected tags:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {query.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small" 
                  variant="outlined"
                  sx={{ backgroundColor: '#e3f2fd' }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Assign To</InputLabel>
              <Select
                value={assignedTo}
                label="Assign To"
                onChange={(e) => handleAssignment(e.target.value)}
                startAdornment={assignedTo ? <AssignIcon sx={{ mr: 1, color: 'action.active' }} /> : null}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name} ({user.team})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => handlePriorityChange(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{ flex: 1 }}>
                {query.assignedTo?.name || 'Unassigned'}
              </Typography>
              {status !== 'resolved' && (
                <Tooltip title="Mark as resolved">
                  <IconButton 
                    size="small" 
                    onClick={quickResolve}
                    sx={{ color: '#4caf50' }}
                  >
                    <ResolveIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QueryCard;