import React from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface CustomHeaderProps {
  label: string;
  setOpenDatepickerModal: (open: boolean) => void;
}

const CustomHeader = ({ label, setOpenDatepickerModal } : CustomHeaderProps) => {
  
  const handleIconButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevents the event from propagating to the parent elements
    setOpenDatepickerModal(true);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: "space-between",
      width: "120%",

    }}>
      <span style={{ fontSize: "19px"}}>{label}</span>
      <IconButton onClick={handleIconButtonClick} size="medium">
        <AddIcon fontSize="medium" sx={{ color: "#bebdbd", backgroundColor: "#ffff", borderRadius: 10}} />
      </IconButton>
    </div>
  );
};

export default CustomHeader;
