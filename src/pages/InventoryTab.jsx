import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Alert, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';
import { Plus, Edit, Trash2, Search, Filter, Download, Upload } from 'lucide-react';
import { equipmentService } from '../services/firebase';
import './InventoryTab.css';

const InventoryTab = () => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('shortName');
  const [sortOrder, setSortOrder] = useState('asc');

  // Form state
  const [equipmentForm, setEquipmentForm] = useState({
    shortName: '',
    fullName: '',
    value: '',
    defects: [],
    howMany: 1,
    buyDate: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'NEW'
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [equipment, searchTerm, statusFilter, sortField, sortOrder]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getAll();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...equipment];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle numeric fields
      if (sortField === 'value' || sortField === 'howMany') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      }

      // Handle date fields
      if (sortField === 'buyDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEquipment(filtered);
  };

  const handleCreate = () => {
    setEquipmentForm({
      shortName: '',
      fullName: '',
      value: '',
      defects: [],
      howMany: 1,
      buyDate: new Date().toISOString().split('T')[0],
      notes: '',
      status: 'NEW'
    });
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setEquipmentForm({
      shortName: item.shortName || '',
      fullName: item.fullName || '',
      value: item.value || '',
      defects: item.defects || [],
      howMany: item.howMany || 1,
      buyDate: item.buyDate ? new Date(item.buyDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: item.notes || '',
      status: item.status || 'NEW'
    });
    setEditingId(item.id);
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const equipmentData = {
        ...equipmentForm,
        value: parseFloat(equipmentForm.value) || 0,
        howMany: parseInt(equipmentForm.howMany) || 1,
        defects: equipmentForm.defects || []
      };

      if (editingId) {
        await equipmentService.update(editingId, equipmentData);
      } else {
        await equipmentService.create(equipmentData);
      }

      await fetchData();
      setOpenDialog(false);
      setError('');
    } catch (error) {
      console.error('Error saving equipment:', error);
      setError(editingId ? 'Failed to update equipment.' : 'Failed to create equipment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment item?')) {
      return;
    }

    try {
      setLoading(true);
      await equipmentService.delete(id);
      await fetchData();
      setError('');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      setError('Failed to delete equipment.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NEW': return 'success';
      case 'OLD': return 'warning';
      case 'DAMAGED': return 'error';
      case 'UNAVAILABLE': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'NEW': return '🆕';
      case 'OLD': return '📅';
      case 'DAMAGED': return '⚠️';
      case 'UNAVAILABLE': return '🚫';
      default: return '📦';
    }
  };

  const getEquipmentValue = (item) => {
    const value = parseFloat(item.value) || 0;
    const quantity = parseInt(item.howMany) || 1;
    return value * quantity;
  };

  const getTotalValue = () => {
    return filteredEquipment.reduce((total, item) => total + getEquipmentValue(item), 0);
  };

  const getStatusDistribution = () => {
    const distribution = { NEW: 0, OLD: 0, DAMAGED: 0, UNAVAILABLE: 0 };
    equipment.forEach(item => {
      const status = item.status || 'NEW';
      distribution[status] = (distribution[status] || 0) + (item.howMany || 1);
    });
    return distribution;
  };

  return (
    <Box className="inventory-tab-container">
      <Box className="inventory-header">
        <Box className="inventory-title-section">
          <Typography variant="h4" className="inventory-title">
            Equipment Inventory
          </Typography>
          <Typography variant="body2" color="textSecondary" className="inventory-subtitle">
            Manage and track all your production equipment and gear
          </Typography>
        </Box>
        
        <Box className="inventory-actions">
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={handleCreate}
            disabled={loading}
            className="add-equipment-button"
          >
            Add Equipment
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} className="error-alert">
          {error}
        </Alert>
      )}

      <Grid container spacing={3} className="inventory-content">
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Box className="summary-content">
                <Box className="summary-icon">📦</Box>
                <Box>
                  <Typography variant="h6" className="summary-value">{equipment.length}</Typography>
                  <Typography variant="caption" className="summary-label">Total Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Box className="summary-content">
                <Box className="summary-icon">💰</Box>
                <Box>
                  <Typography variant="h6" className="summary-value">${getTotalValue().toLocaleString()}</Typography>
                  <Typography variant="caption" className="summary-label">Total Value</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Box className="summary-content">
                <Box className="summary-icon">🆕</Box>
                <Box>
                  <Typography variant="h6" className="summary-value">{getStatusDistribution().NEW}</Typography>
                  <Typography variant="caption" className="summary-label">New Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card className="summary-card">
            <CardContent>
              <Box className="summary-content">
                <Box className="summary-icon">⚠️</Box>
                <Box>
                  <Typography variant="h6" className="summary-value">{getStatusDistribution().DAMAGED}</Typography>
                  <Typography variant="caption" className="summary-label">Damaged Items</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters and Search */}
        <Grid item xs={12}>
          <Card className="filters-card">
            <CardContent className="filters-content">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search size={18} style={{ marginRight: 8, color: '#6c757d' }} />,
                    }}
                    className="search-input"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status Filter"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="filter-select"
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="NEW">New</MenuItem>
                      <MenuItem value="OLD">Old</MenuItem>
                      <MenuItem value="DAMAGED">Damaged</MenuItem>
                      <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortField}
                      label="Sort By"
                      onChange={(e) => setSortField(e.target.value)}
                      className="filter-select"
                    >
                      <MenuItem value="shortName">Name</MenuItem>
                      <MenuItem value="fullName">Full Name</MenuItem>
                      <MenuItem value="value">Value</MenuItem>
                      <MenuItem value="buyDate">Buy Date</MenuItem>
                      <MenuItem value="status">Status</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    fullWidth
                    variant={sortOrder === 'asc' ? 'contained' : 'outlined'}
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="sort-button"
                    startIcon={<Filter />}
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Equipment Table */}
        <Grid item xs={12}>
          <Card className="equipment-table-card">
            <CardContent className="table-content">
              <TableContainer component={Paper} className="equipment-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Equipment</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredEquipment.map((item) => (
                      <TableRow key={item.id} className="equipment-row">
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle1" className="equipment-name">
                              {item.shortName}
                            </Typography>
                            <Typography variant="body2" className="equipment-full-name">
                              {item.fullName}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Box className="equipment-details">
                            <Chip 
                              size="small" 
                              label={`Qty: ${item.howMany || 1}`}
                              variant="outlined"
                              className="detail-chip"
                            />
                            <Chip 
                              size="small" 
                              label={`$${(item.value || 0).toLocaleString()}`}
                              variant="outlined"
                              className="detail-chip"
                            />
                            <Typography variant="caption" className="buy-date">
                              Bought: {item.buyDate ? new Date(item.buyDate).toLocaleDateString() : 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="body2" className="total-value">
                            ${getEquipmentValue(item).toLocaleString()}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Tooltip title={item.status || 'Unknown'}>
                            <Chip
                              icon={getStatusIcon(item.status)}
                              label={item.status || 'Unknown'}
                              color={getStatusColor(item.status)}
                              variant="outlined"
                              size="small"
                              className="status-chip"
                            />
                          </Tooltip>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Box className="action-buttons">
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(item)}
                              aria-label="Edit"
                              className="action-icon"
                            >
                              <Edit size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(item.id)}
                              aria-label="Delete"
                              className="action-icon delete"
                              color="error"
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredEquipment.length === 0 && (
                <Box className="no-results">
                  <Typography variant="body1" color="textSecondary">
                    {equipment.length === 0 ? 'No equipment in inventory. Add your first item!' : 'No equipment found matching your filters.'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Equipment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Edit Equipment' : 'Add New Equipment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Short Name"
                value={equipmentForm.shortName}
                onChange={(e) => setEquipmentForm({...equipmentForm, shortName: e.target.value})}
                required
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name (Manufacturer, Model, etc.)"
                value={equipmentForm.fullName}
                onChange={(e) => setEquipmentForm({...equipmentForm, fullName: e.target.value})}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Value ($)"
                type="number"
                value={equipmentForm.value}
                onChange={(e) => setEquipmentForm({...equipmentForm, value: e.target.value})}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={equipmentForm.howMany}
                onChange={(e) => setEquipmentForm({...equipmentForm, howMany: e.target.value})}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buy Date"
                type="date"
                value={equipmentForm.buyDate}
                onChange={(e) => setEquipmentForm({...equipmentForm, buyDate: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
                className="form-input"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={equipmentForm.status}
                  label="Status"
                  onChange={(e) => setEquipmentForm({...equipmentForm, status: e.target.value})}
                  className="form-input"
                >
                  <MenuItem value="NEW">New</MenuItem>
                  <MenuItem value="OLD">Old</MenuItem>
                  <MenuItem value="DAMAGED">Damaged</MenuItem>
                  <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={equipmentForm.notes}
                onChange={(e) => setEquipmentForm({...equipmentForm, notes: e.target.value})}
                className="form-input"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={loading || !equipmentForm.shortName.trim()}
          >
            {editingId ? 'Update Equipment' : 'Add Equipment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryTab;