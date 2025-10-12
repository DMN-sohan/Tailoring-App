import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import {
  Help as HelpIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';

const HelpButton = ({ title, instructions }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Fab
        color="primary"
        aria-label="help"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#34656D',
          '&:hover': {
            backgroundColor: '#4A8B95',
          },
        }}
      >
        <HelpIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#34656D',
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          📖 How to Use: {title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
            Follow these simple steps:
          </Typography>
          <List>
            {instructions.map((instruction, index) => (
              <ListItem key={index} sx={{ alignItems: 'flex-start', py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: '#34656D',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {index + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={instruction}
                  primaryTypographyProps={{
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              backgroundColor: '#34656D',
              color: '#FFFFFF',
              fontWeight: 'bold',
              px: 4,
            }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpButton;

