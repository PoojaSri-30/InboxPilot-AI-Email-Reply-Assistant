import { useState } from 'react'
import './App.css'
import {
  Box, Button, CircularProgress, Container, FormControl,
  InputLabel, MenuItem, Select, TextField, Typography, Paper
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3730A3' },      // deep indigo
    secondary: { main: '#0F766E' },    // muted teal
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    subtitle1: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
  },
});

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary.main">
              InboxPilot
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Your AI-powered email assistant — reply smarter, faster.
            </Typography>
          </Box>

          <Paper elevation={0} sx={{ p: 4, border: '1px solid #E2E8F0' }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label="Original Email Content"
              value={emailContent || ''}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Tone (Optional)</InputLabel>
              <Select
                value={tone || ''}
                label="Tone (Optional)"
                onChange={(e) => setTone(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!emailContent || loading}
              fullWidth
              sx={{ py: 1.3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Draft with InboxPilot"}
            </Button>
          </Paper>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {generatedReply && (
            <Paper elevation={0} sx={{ mt: 4, p: 4, border: '1px solid #E2E8F0' }}>
              <Typography variant="h6" gutterBottom color="secondary.main">
                Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply || ''}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2 }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App