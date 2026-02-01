import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Chip, IconButton, Button, Grid, Alert } from '@mui/material';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Box as BoxIcon } from 'lucide-react';
import './EquipmentChecklist.css';

const EquipmentChecklist = ({ job, equipment, onUpdate }) => {
  const [checklist, setChecklist] = useState(() => {
    // Initialize checklist with equipment status
    return (job.gear || []).map(equipmentId => ({
      equipmentId,
      packed: false,
      available: true,
      notes: ''
    }));
  });

  const [error, setError] = useState('');

  const getEquipmentById = (id) => {
    return equipment.find(item => item.id === id);
  };

  const getStatusColor = (item) => {
    const equipmentItem = getEquipmentById(item.equipmentId);
    if (!equipmentItem) return 'default';
    
    if (!item.available) return 'error';
    if (item.packed) return 'success';
    return 'default';
  };

  const getStatusIcon = (item) => {
    const equipmentItem = getEquipmentById(item.equipmentId);
    if (!equipmentItem) return null;
    
    if (!item.available) {
      return <AlertTriangle size={20} />;
    }
    if (item.packed) {
      return <CheckCircle size={20} />;
    }
    return <XCircle size={20} />;
  };

  const handleTogglePacked = (equipmentId) => {
    setChecklist(prev => prev.map(item => 
      item.equipmentId === equipmentId 
        ? { ...item, packed: !item.packed }
        : item
    ));
  };

  const handleToggleAvailable = (equipmentId) => {
    setChecklist(prev => prev.map(item => 
      item.equipmentId === equipmentId 
        ? { ...item, available: !item.available, packed: false } // If not available, can't be packed
        : item
    ));
  };

  const handleUpdateNotes = (equipmentId, notes) => {
    setChecklist(prev => prev.map(item => 
      item.equipmentId === equipmentId 
        ? { ...item, notes }
        : item
    ));
  };

  const handleSave = () => {
    // Update job with checklist status
    const updatedJob = {
      ...job,
      gear: job.gear.map((equipmentId, index) => ({
        id: equipmentId,
        packed: checklist[index]?.packed || false,
        available: checklist[index]?.available || true,
        notes: checklist[index]?.notes || ''
      }))
    };
    
    onUpdate(updatedJob);
    setError('');
  };

  const getOverallStatus = () => {
    const totalItems = checklist.length;
    const packedItems = checklist.filter(item => item.packed).length;
    const availableItems = checklist.filter(item => item.available).length;
    
    if (totalItems === 0) return { status: 'none', message: 'No equipment required for this job.' };
    if (packedItems === totalItems) return { status: 'complete', message: 'All equipment packed and ready!' };
    if (availableItems === 0) return { status: 'error', message: 'No equipment is available!' };
    if (packedItems === 0) return { status: 'pending', message: 'No equipment packed yet.' };
    
    return { 
      status: 'partial', 
      message: `${packedItems}/${totalItems} items packed. ${availableItems}/${totalItems} items available.` 
    };
  };

  const status = getOverallStatus();

  return (
    <Box className="equipment-checklist">
      <Box className="checklist-header">
        <Typography variant="h6" className="checklist-title">
          Equipment Checklist
        </Typography>
        <Chip 
          label={status.message}
          color={status.status === 'complete' ? 'success' : status.status === 'error' ? 'error' : 'primary'}
          variant="outlined"
          className="status-chip"
        />
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} className="checklist-error">
          {error}
        </Alert>
      )}

      {checklist.length === 0 ? (
        <Alert severity="info" className="no-equipment-alert">
          No equipment has been assigned to this job yet. Add equipment from the job edit dialog.
        </Alert>
      ) : (
        <>
          <Box className="checklist-summary">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box className="summary-card">
                  <Box className="summary-icon total">
                    <BoxIcon size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="summary-value">{checklist.length}</Typography>
                    <Typography variant="caption" className="summary-label">Total Items</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box className="summary-card">
                  <Box className="summary-icon packed">
                    <CheckCircle size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="summary-value">{checklist.filter(item => item.packed).length}</Typography>
                    <Typography variant="caption" className="summary-label">Packed</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box className="summary-card">
                  <Box className="summary-icon available">
                    <RefreshCw size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h6" className="summary-value">{checklist.filter(item => item.available).length}</Typography>
                    <Typography variant="caption" className="summary-label">Available</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <List className="checklist-list">
            {checklist.map((item, index) => {
              const equipmentItem = getEquipmentById(item.equipmentId);
              if (!equipmentItem) return null;

              return (
                <ListItem 
                  key={item.equipmentId} 
                  className={`checklist-item ${!item.available ? 'unavailable' : ''}`}
                >
                  <ListItemIcon className="checklist-icon">
                    {getStatusIcon(item)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box className="equipment-primary">
                        <Typography variant="subtitle1" className="equipment-name">
                          {equipmentItem.shortName}
                        </Typography>
                        <Typography variant="body2" className="equipment-full-name">
                          {equipmentItem.fullName}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box className="equipment-details">
                        <Box className="equipment-meta">
                          <Chip 
                            size="small" 
                            label={`Value: $${equipmentItem.value || 0}`}
                            variant="outlined"
                            className="meta-chip"
                          />
                          <Chip 
                            size="small" 
                            label={`Status: ${equipmentItem.status || 'Unknown'}`}
                            variant="outlined"
                            className="meta-chip"
                          />
                          {equipmentItem.howMany > 1 && (
                            <Chip 
                              size="small" 
                              label={`Qty: ${equipmentItem.howMany}`}
                              variant="outlined"
                              className="meta-chip"
                            />
                          )}
                        </Box>
                        
                        {equipmentItem.defects && equipmentItem.defects.length > 0 && (
                          <Box className="defects-info">
                            <Typography variant="caption" color="error">
                              Defects: {equipmentItem.defects.join(', ')}
                            </Typography>
                          </Box>
                        )}
                        
                        {equipmentItem.notes && (
                          <Typography variant="body2" className="equipment-notes">
                            Notes: {equipmentItem.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  
                  <Box className="checklist-actions">
                    <Box className="action-group">
                      <Button
                        variant={item.available ? "contained" : "outlined"}
                        color="primary"
                        size="small"
                        onClick={() => handleToggleAvailable(item.equipmentId)}
                        className={`availability-btn ${item.available ? 'available' : 'unavailable'}`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </Button>
                      
                      <Button
                        variant={item.packed ? "contained" : "outlined"}
                        color="success"
                        size="small"
                        onClick={() => handleTogglePacked(item.equipmentId)}
                        disabled={!item.available}
                        className={`packed-btn ${item.packed ? 'packed' : 'not-packed'}`}
                      >
                        {item.packed ? 'Packed' : 'Not Packed'}
                      </Button>
                    </Box>
                    
                    <Box className="notes-section">
                      <Typography variant="caption" className="notes-label">
                        Notes:
                      </Typography>
                      <input
                        type="text"
                        placeholder="Add notes for this item..."
                        value={item.notes}
                        onChange={(e) => handleUpdateNotes(item.equipmentId, e.target.value)}
                        className="notes-input"
                      />
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </>
      )}

      <Box className="checklist-actions-footer">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          className="save-checklist-btn"
          startIcon={<CheckCircle />}
        >
          Save Checklist
        </Button>
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            // Reset checklist to initial state
            setChecklist((job.gear || []).map(() => ({
              packed: false,
              available: true,
              notes: ''
            })));
          }}
          className="reset-checklist-btn"
          startIcon={<RefreshCw />}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default EquipmentChecklist;