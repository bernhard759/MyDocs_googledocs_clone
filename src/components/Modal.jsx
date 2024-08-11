import * as React from "react";
import { Box, Modal, TextField, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function ModalComponent({
  open,
  setOpen,
  title,
  setTitle,
  addData,
}) {
  // handle close
  const handleClose = () => setOpen(false);

  // MArkup
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <TextField
          label="Document Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth onClick={addData}>
          Add Document
        </Button>
      </Box>
    </Modal>
  );
}
