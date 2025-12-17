import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Stack, Snackbar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

function ReviewQueuePage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: null, reason: '' });

  async function fetchQueue() {
    setLoading(true);
    try {
      const res = await fetch('/api/review-queue', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (!res.ok) throw new Error('Failed to fetch review queue');
      const data = await res.json();
      setQueue(data);
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
    setLoading(false);
  }

  useEffect(() => { fetchQueue(); }, []);

  async function handleApprove(id) {
    try {
      const res = await fetch('/api/approve-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to approve');
      setSnackbar({ open: true, message: 'Approved!', severity: 'success' });
      fetchQueue();
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
  }

  async function handleReject(id, reason) {
    try {
      const res = await fetch('/api/reject-change', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ id, reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      setSnackbar({ open: true, message: 'Rejected!', severity: 'success' });
      fetchQueue();
    } catch (e) {
      setSnackbar({ open: true, message: e.message, severity: 'error' });
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Review Queue</Typography>
      {loading ? <CircularProgress /> : (
        queue.length === 0 ? <Typography>No pending reviews.</Typography> : (
          <Stack spacing={3}>
            {queue.map(item => (
              <Paper key={item.id} sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Submitted by: {item.submitter} at {new Date(item.submittedAt).toLocaleString()}</Typography>
                <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4, maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(item.data, null, 2)}</pre>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" color="success" onClick={() => handleApprove(item.id)}>Approve</Button>
                  <Button variant="contained" color="error" onClick={() => setRejectDialog({ open: true, id: item.id, reason: '' })}>Reject</Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, id: null, reason: '' })}>
        <DialogTitle>Reject Submission</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason (optional)"
            fullWidth
            value={rejectDialog.reason}
            onChange={e => setRejectDialog(r => ({ ...r, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, id: null, reason: '' })}>Cancel</Button>
          <Button color="error" onClick={() => { handleReject(rejectDialog.id, rejectDialog.reason); setRejectDialog({ open: false, id: null, reason: '' }); }}>Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReviewQueuePage; 