import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Alert, IconButton, TextField, MenuItem } from '@mui/material';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { equipmentService, jobService } from '../services/firebase';
import EquipmentChecklist from '../components/EquipmentChecklist.jsx';
import './JobsTab.css';

const JobsTab = () => {
  const [jobs, setJobs] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [openChecklistDialog, setOpenChecklistDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state for job dialog
  const [jobForm, setJobForm] = useState({
    date: new Date(),
    location: '',
    price: '',
    description: '',
    gear: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsData, equipmentData] = await Promise.all([
        jobService.getAll(),
        equipmentService.getAll()
      ]);
      setJobs(jobsData);
      setEquipment(equipmentData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getJobsForDate = (date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.date);
      return isSameDay(jobDate, date);
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const jobsForDate = getJobsForDate(date);
    if (jobsForDate.length > 0) {
      setSelectedJob(jobsForDate[0]); // For simplicity, select first job if multiple
      setOpenChecklistDialog(true);
    } else {
      setJobForm({
        date: date,
        location: '',
        price: '',
        description: '',
        gear: []
      });
      setOpenJobDialog(true);
    }
  };

  const handleCreateJob = async () => {
    try {
      setLoading(true);
      const jobData = {
        ...jobForm,
        price: parseFloat(jobForm.price) || 0,
        gear: jobForm.gear
      };
      
      await jobService.create(jobData);
      await fetchData();
      setOpenJobDialog(false);
      setError('');
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJob = async () => {
    try {
      setLoading(true);
      const jobData = {
        ...jobForm,
        price: parseFloat(jobForm.price) || 0,
        gear: jobForm.gear
      };
      
      await jobService.update(selectedJob.id, jobData);
      await fetchData();
      setOpenJobDialog(false);
      setOpenChecklistDialog(false);
      setError('');
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    
    try {
      setLoading(true);
      await jobService.delete(selectedJob.id);
      await fetchData();
      setOpenChecklistDialog(false);
      setSelectedJob(null);
      setError('');
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    const firstDayOfMonth = start.getDay();
    const daysWithPadding = [
      ...Array(firstDayOfMonth).fill(null),
      ...days
    ];

    return (
      <Grid container spacing={1} className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Grid item xs={1.714} key={day} className="calendar-header">
            <Typography variant="caption" className="calendar-day-label">
              {day}
            </Typography>
          </Grid>
        ))}
        
        {daysWithPadding.map((day, index) => {
          const jobsForDay = day ? getJobsForDate(day) : [];
          
          return (
            <Grid item xs={1.714} key={index} className="calendar-day">
              {day && (
                <Button
                  fullWidth
                  variant={isToday(day) ? "contained" : "outlined"}
                  color={isToday(day) ? "primary" : "inherit"}
                  className={`calendar-day-button ${isSameMonth(day, currentMonth) ? 'current-month' : 'other-month'} ${jobsForDay.length > 0 ? 'has-jobs' : ''}`}
                  onClick={() => handleDateClick(day)}
                  disabled={loading}
                >
                  <div className="day-content">
                    <Typography variant="body2" className="day-number">
                      {format(day, 'd')}
                    </Typography>
                    {jobsForDay.length > 0 && (
                      <div className="job-indicators">
                        {jobsForDay.map((job, idx) => (
                          <Chip
                            key={idx}
                            size="small"
                            label={job.location || 'Job'}
                            className="job-chip"
                            color={isToday(day) ? "secondary" : "primary"}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </Button>
              )}
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box className="jobs-tab-container">
      <Box className="jobs-header">
        <Box className="jobs-title-section">
          <CalendarIcon size={32} className="jobs-icon" />
          <Typography variant="h4" className="jobs-title">
            Job Calendar
          </Typography>
        </Box>
        
        <Box className="jobs-actions">
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => {
              setJobForm({
                date: new Date(),
                location: '',
                price: '',
                description: '',
                gear: []
              });
              setOpenJobDialog(true);
            }}
            disabled={loading}
            className="create-job-button"
          >
            Add Job
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} className="error-alert">
          {error}
        </Alert>
      )}

      <Grid container spacing={3} className="jobs-content">
        <Grid item xs={12} md={8}>
          <Card className="calendar-card">
            <CardContent className="calendar-content">
              <Box className="calendar-header-actions">
                <Typography variant="h6" className="calendar-month">
                  {format(currentMonth, 'MMMM yyyy')}
                </Typography>
                <Box className="calendar-navigation">
                  <Button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                    disabled={loading}
                    className="nav-button"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentMonth(new Date())}
                    disabled={loading}
                    className="nav-button"
                  >
                    Today
                  </Button>
                  <Button
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                    disabled={loading}
                    className="nav-button"
                  >
                    Next
                  </Button>
                </Box>
              </Box>
              
              {renderCalendar()}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="upcoming-jobs-card">
            <CardContent className="upcoming-jobs-content">
              <Typography variant="h6" className="upcoming-jobs-title">
                Upcoming Jobs
              </Typography>
              
              {jobs.length === 0 ? (
                <Typography variant="body2" color="textSecondary" className="no-jobs">
                  No upcoming jobs scheduled.
                </Typography>
              ) : (
                <Box className="jobs-list">
                  {jobs.slice(0, 5).map((job) => (
                    <Card key={job.id} className="job-item">
                      <CardContent className="job-item-content">
                        <Box className="job-header">
                          <Typography variant="subtitle1" className="job-date">
                            {format(new Date(job.date), 'MMM d, yyyy')}
                          </Typography>
                          <Box className="job-actions">
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedJob(job);
                                setJobForm({
                                  date: new Date(job.date),
                                  location: job.location || '',
                                  price: job.price || '',
                                  description: job.description || '',
                                  gear: job.gear || []
                                });
                                setOpenChecklistDialog(true);
                              }}
                              aria-label="View details"
                            >
                              <Eye size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedJob(job);
                                setJobForm({
                                  date: new Date(job.date),
                                  location: job.location || '',
                                  price: job.price || '',
                                  description: job.description || '',
                                  gear: job.gear || []
                                });
                                setOpenJobDialog(true);
                              }}
                              aria-label="Edit job"
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body2" className="job-location">
                          {job.location || 'Location not specified'}
                        </Typography>
                        <Typography variant="body2" className="job-price">
                          ${job.price || 0} budget
                        </Typography>
                        <Typography variant="body2" className="job-description" noWrap>
                          {job.description || 'No description'}
                        </Typography>
                        <Box className="job-gear-count">
                          <Typography variant="caption" color="textSecondary">
                            Equipment: {job.gear ? job.gear.length : 0} items
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Job Dialog */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedJob ? 'Edit Job' : 'Create New Job'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Job Date"
              value={jobForm.date}
              onChange={(date) => setJobForm({...jobForm, date})}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            value={jobForm.location}
            onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Budget ($)"
            type="number"
            value={jobForm.price}
            onChange={(e) => setJobForm({...jobForm, price: e.target.value})}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={jobForm.description}
            onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
          />
          
          <Typography variant="subtitle2" style={{ marginTop: 16, marginBottom: 8 }}>
            Required Equipment
          </Typography>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Add Equipment"
            value=""
            onChange={(e) => {
              const equipmentId = e.target.value;
              if (equipmentId && !jobForm.gear.includes(equipmentId)) {
                setJobForm({...jobForm, gear: [...jobForm.gear, equipmentId]});
              }
            }}
          >
            {equipment.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.shortName} - {item.fullName}
              </MenuItem>
            ))}
          </TextField>
          
          <Box mt={2}>
            {jobForm.gear.map((equipmentId) => {
              const item = equipment.find(e => e.id === equipmentId);
              return item ? (
                <Chip
                  key={equipmentId}
                  label={`${item.shortName} - ${item.fullName}`}
                  onDelete={() => setJobForm({...jobForm, gear: jobForm.gear.filter(id => id !== equipmentId)})}
                  style={{ margin: '4px' }}
                />
              ) : null;
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button 
            onClick={selectedJob ? handleUpdateJob : handleCreateJob} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {selectedJob ? 'Update Job' : 'Create Job'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Checklist Dialog */}
      <Dialog open={openChecklistDialog} onClose={() => setOpenChecklistDialog(false)} maxWidth="md" fullWidth>
        {selectedJob && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6">{selectedJob.location || 'Job Details'}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {format(new Date(selectedJob.date), 'MMM d, yyyy')} • ${selectedJob.price || 0} budget
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={handleDeleteJob} color="error" aria-label="Delete job">
                    <Trash2 />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedJob.description || 'No description provided.'}
              </Typography>
              <EquipmentChecklist 
                job={selectedJob}
                equipment={equipment}
                onUpdate={(updatedJob) => {
                  setSelectedJob(updatedJob);
                  setJobForm({
                    date: new Date(updatedJob.date),
                    location: updatedJob.location || '',
                    price: updatedJob.price || '',
                    description: updatedJob.description || '',
                    gear: updatedJob.gear || []
                  });
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenChecklistDialog(false)}>Close</Button>
              <Button 
                onClick={handleUpdateJob} 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default JobsTab;