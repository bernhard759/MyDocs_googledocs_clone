import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { Container, Typography, Box, Paper, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EditDocs({ database }) {
  // State
  const isMounted = useRef();
  const [documentTitle, setDocumentTitle] = useState("");
  const [docsDesc, setDocsDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Data
  const collectionRef = collection(database, "docsData");

  // Router stuff
  let params = useParams();
  let navigate = useNavigate();

  // Effect (keypress to save)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Prevent the default browser save behavior
        saveDocument(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [docsDesc]);

  // Effect (periodic saving of document)
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveDocument(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [docsDesc, hasUnsavedChanges]);

  // Save the document
  const saveDocument = (showToast) => {
    // Set saving state
    setIsSaving(true);
    // Get and update the doc
    const document = doc(collectionRef, params.id);
    updateDoc(document, {
      docsDesc: docsDesc,
    })
      .then(() => {
        // Saving done
        setIsSaving(false);
        setHasUnsavedChanges(false); // All changes are now saved
        if (showToast) {
          toast.success("Document Saved", {
            autoClose: 2000,
          });
        }
      })
      .catch(() => {
        setIsSaving(false);
        if (showToast) {
          toast.error("Cannot Save Document", {
            autoClose: 2000,
          });
        }
      });
  };

  // Get data from document from database
  const getData = () => {
    // Document
    const document = doc(collectionRef, params.id);
    // This code is run whenever there are changes to the document
    onSnapshot(document, (docs) => {
      setDocumentTitle(docs.data().title);
      setDocsDesc(docs.data().docsDesc);
      setHasUnsavedChanges(false); // Initial load, no unsaved changes
    });
  };

  // Content change
  const handleContentChange = (value) => {
    setDocsDesc(value);
    setHasUnsavedChanges(true); // Mark as having unsaved changes
  };

  // Effect (mounted)
  useEffect(() => {
    // Do nothing when already mounted
    if (isMounted.current) {
      return;
    }
    isMounted.current = true;
    // Get the data from the document by setting up the onSnapshot listener
    getData();
  }, []);

  // Markup
  return (
    <Container>
      <Box sx={{ mt: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
          {documentTitle}
        </Typography>
        {isSaving ? (
          <CircularProgress size={24} />
        ) : (
          <CheckCircleIcon color={hasUnsavedChanges ? "action" : "success"} />
        )}
      </Box>
      <Paper elevation={3} sx={{ p: 2 }}>
        <ReactQuill value={docsDesc} onChange={handleContentChange} />
      </Paper>
      <ToastContainer />
    </Container>
  );
}
