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
  query,
  where,
  doc,
} from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalComponent from "./Modal";
import slugify from "slugify";

export default function Docs({ database }) {
  // State
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // User
  const [user] = useAuthState(auth);
  console.log(user);

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

    const slug = slugify(title, { lower: true });

    // Proceed to add the document to Firestore
    addDoc(collectionRef, {
      title: title.trim(),
      ownerId: user.uid,
      sharedWith: [],
      slug,
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
    // Query 1: Fetch documents where the user is the owner
    const ownerQuery = query(collectionRef, where("ownerId", "==", user.uid));

    // Query 2: Fetch documents where the user is a collaborator
    const collaboratorQuery = query(
      collectionRef,
      where("sharedWith", "array-contains", user.uid)
    );

    // Listen to the owner query
    const unsubscribeOwner = onSnapshot(ownerQuery, (ownerSnapshot) => {
      const ownerDocs = ownerSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Combine with previous state (e.g., documents from collaborator query)
      setDocsData((prevDocs) => [...prevDocs, ...ownerDocs]);
      setLoading(false);
    });

    // Listen to the collaborator query
    const unsubscribeCollaborator = onSnapshot(
      collaboratorQuery,
      (collaboratorSnapshot) => {
        const collaboratorDocs = collaboratorSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setDocsData((prevDocs) => [...prevDocs, ...collaboratorDocs]);
        setLoading(false);
      }
    );

    // Return a function to unsubscribe both listeners
    return () => {
      unsubscribeOwner();
      unsubscribeCollaborator();
    };
  };

  const handleDelete = (id, event) => {
    console.log("delete", id, event);
    event.stopPropagation(); // Prevent the click event from propagating to the parent element
    const documentRef = doc(collectionRef, id); // Create reference to the document
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
  const handleDocumentClick = (slug, docId) => {
    navigate(`/editDocs/${slug}-${docId}`); // Navigate using the slug
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

      <h3>My documents</h3>
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
                  variant="outlined"
                  onClick={() => handleDocumentClick(doc.slug, doc.id)}
                  sx={{
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 300,
                    aspectRatio: "2/1",
                  }}
                >
                  {doc.ownerId === user.uid && (
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
                  )}
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
