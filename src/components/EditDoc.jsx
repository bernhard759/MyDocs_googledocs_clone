import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShareDoc from "./ShareDoc";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

export default function EditDocs({ database }) {
  // Mounted ref
  const isMounted = useRef();

  // State
  const [documentTitle, setDocumentTitle] = useState("");
  const [docsDesc, setDocsDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]);

  // User
  const [user] = useAuthState(auth);

  // Get the slug and ID from the URL params
  let { slugId } = useParams();
  let navigate = useNavigate();

  // Extract the ID from the slugId
  const docId = slugId.split("-").pop();

  // Document reference
  const documentRef = doc(database, "docsData", docId);

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

  const saveDocument = async (showToast) => {
    setIsSaving(true);

    try {
      await updateDoc(documentRef, {
        docsDesc: docsDesc,
      });

      setIsSaving(false);
      setHasUnsavedChanges(false);

      if (showToast) {
        toast.success("Document Saved", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      setIsSaving(false);
      if (showToast) {
        toast.error("Cannot Save Document", {
          autoClose: 2000,
        });
      }
    }
  };

  const handleSnapshotUpdate = (docSnap) => {
    console.log("document updated");
    if (docSnap.exists()) {
      const docData = docSnap.data();
      setDocumentTitle(docData.title);
      setDocsDesc(docData.docsDesc);
      setIsOwner(docData.ownerId === user.uid);
      setSharedUsers(docData.sharedWith);
      setHasUnsavedChanges(false);
    } else {
      alert("Document not found");
      navigate("/");
    }
  };

  // Content change
  const handleContentChange = (value) => {
    setDocsDesc(value);
    setHasUnsavedChanges(true); // Mark as having unsaved changes
  };

  useEffect(() => {
    //if (isMounted.current) return;
    isMounted.current = true;

    // Set up Firestore listener for real-time updates
    const unsubscribe = onSnapshot(documentRef, handleSnapshotUpdate);

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
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
      <Paper variant="outlined" sx={{ p: 2 }}>
        <ReactQuill value={docsDesc} onChange={handleContentChange} />
        <Accordion sx={{ mt: 2 }} variant="outlined">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="preview-content"
            id="preview-header"
          >
            <Typography variant="h6">Preview</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div dangerouslySetInnerHTML={{ __html: docsDesc }}></div>
          </AccordionDetails>
        </Accordion>
      </Paper>
      {isOwner && (
        <Container sx={{ mt: 3 }}>
          <h3>Add collaborators to your document</h3>
          <ShareDoc
            docId={docId}
            database={database}
            sharedUsers={sharedUsers}
            isOwner={isOwner}
          />
        </Container>
      )}
      <ToastContainer />
    </Container>
  );
}
