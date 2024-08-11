import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Skeleton,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addDoc,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ModalComponent from "./Modal";

export default function Docs({ database }) {
  // State
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Router nav
  let navigate = useNavigate();

  // Database
  const collectionRef = collection(database, "docsData");

  // Add data (create a document, modal opens)
  const addData = () => {
    // Validate the title
    if (!title.trim()) {
      alert("Please enter a title for the document.");
      return;
    }

    // Proceed to add the document to Firestore
    addDoc(collectionRef, {
      title: title.trim(), // Trim any extra spaces
      docsDesc: "",
    })
      .then(() => {
        setOpen(false);
        setTitle("");
      })
      .catch(() => {
        alert("Cannot add document");
      });
  };

  // Get data
  const getData = () => {
    // Set up listener
    const unsubscribe = onSnapshot(collectionRef, (data) => {
      setDocsData(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      setLoading(false); // Set loading to false once data is fetched
    });
    // Return the unsubscribe function to clean up the listener on unmount
    return unsubscribe;
  };

  const handleDelete = (id, event) => {
    console.log("delete", id, event);
    event.stopPropagation(); // Prevent the click event from propagating to the parent element
    const documentRef = doc(collectionRef, id); // Create referenc to the document
    // Delete the document using its reference
    deleteDoc(documentRef)
      .then(() => {
        alert("Document deleted successfully.");
      })
      .catch(() => {
        alert("Failed to delete document.");
      });
  };

  // Effect
  useEffect(() => {
    // Call getData and store the unsubscribe function
    const unsubscribe = getData();

    // Cleanup the listener on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Handle click
  const handleDocumentClick = (id) => {
    navigate(`/editDocs/${id}`);
  };

  // Markup
  return (
    <Box sx={{ mt: 4 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{ mb: 3 }}
      >
        Add a Document
      </Button>

      <ModalComponent
        open={open}
        setOpen={setOpen}
        title={title}
        setTitle={setTitle}
        addData={addData}
      />

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={160} />
              </Grid>
            ))
          : docsData.map((doc) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                <Card
                  onClick={() => handleDocumentClick(doc.id)}
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <IconButton
                    aria-label="delete"
                    onClick={(event) => handleDelete(doc.id, event)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {doc.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      dangerouslySetInnerHTML={{ __html: doc.docsDesc }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Box>
  );
}
