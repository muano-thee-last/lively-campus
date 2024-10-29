import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  styled
} from '@mui/material';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '12px',
    padding: '16px',
    minWidth: '320px'
  }
}));

const StyledDialogTitle = styled(DialogTitle)({
  color: '#003B5C',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '16px 24px 8px 24px'
});

const StyledDialogContent = styled(DialogContent)({
  padding: '20px 24px'
});

const StyledTypography = styled(Typography)({
  color: '#555',
  textAlign: 'center',
  fontSize: '1.1rem'
});

const StyledDialogActions = styled(DialogActions)({
  padding: '16px 24px',
  justifyContent: 'center',
  gap: '16px'
});

const CancelButton = styled(Button)({
  padding: '8px 24px',
  borderRadius: '25px',
  color: '#003B5C',
  border: '2px solid #003B5C',
  '&:hover': {
    backgroundColor: 'rgba(0, 59, 92, 0.04)',
    border: '2px solid #003B5C',
  }
});

const ConfirmButton = styled(Button)({
  padding: '8px 24px',
  borderRadius: '25px',
  backgroundColor: '#003B5C',
  color: 'white',
  '&:hover': {
    backgroundColor: '#002b44',
  }
});

function ConfirmationDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3
      }}
    >
      <StyledDialogTitle>{title}</StyledDialogTitle>
      <StyledDialogContent>
        <StyledTypography>{message}</StyledTypography>
      </StyledDialogContent>
      <StyledDialogActions>
        <CancelButton 
          onClick={onClose} 
          variant="outlined"
        >
          Cancel
        </CancelButton>
        <ConfirmButton 
          onClick={onConfirm} 
          variant="contained"
        >
          Confirm
        </ConfirmButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

export default ConfirmationDialog; 