import React, { useState, useEffect } from "react";
import { updateDoc, getDoc, arrayUnion, arrayRemove, doc, collection, query, where, getDocs } from "firebase/firestore";
import { TextField, ListItemButton, Chip, Box, List, ListItemText, Typography } from "@mui/material";

const ShareDoc = ({ docId, database, isOwner }) => {
  // State
  const [email, setEmail] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [noMatch, setNoMatch] = useState(false);
  const [sharedUsers, setSharedUsers] = useState([]); // Manage shared users state here

  // Effect to fetch the initial shared users when the component mounts or docId changes
  useEffect(() => {
    const fetchSharedUsers = async () => {
      const docRef = doc(database, "docsData", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userIds = data.sharedWith || [];
        const userDocs = await Promise.all(
          userIds.map((uid) =>
            getDoc(doc(database, "users", uid)).then((userSnap) => ({ ...userSnap.data(), uid }))
          )
        );
        setSharedUsers(userDocs);
      }
    };

    fetchSharedUsers();
  }, [docId, database]);

  // Function to query users as the user types
  const handleSearch = async (e) => {
    const searchEmail = e.target.value;
    setEmail(searchEmail);

    if (searchEmail.length < 1) {
      setMatchingUsers([]);
      setNoMatch(false);
      return;
    }

    const usersRef = collection(database, "users");
    const q = query(
      usersRef,
      where("email", ">=", searchEmail),
      where("email", "<=", searchEmail + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const users = querySnapshot.docs
        .map((doc) => ({ ...doc.data(), uid: doc.id }))
        .filter((user) => !sharedUsers.some((sharedUser) => sharedUser.uid === user.uid)); // Filter out existing collaborators

      setMatchingUsers(users);
      setNoMatch(users.length === 0);
    } else {
      setMatchingUsers([]);
      setNoMatch(true);
    }
  };

  // Function to handle sharing the document with a selected user
  const handleShare = async (selectedUser) => {
    const { uid, email } = selectedUser;

    const docRef = doc(database, "docsData", docId);
    await updateDoc(docRef, {
      sharedWith: arrayUnion(uid),
    });

    setSharedUsers((prev) => [...prev, selectedUser]);
    alert(`Document shared with ${email}!`);
    setEmail("");
    setMatchingUsers([]);
    setNoMatch(false);
  };

  // Function to handle removing a user from the shared list
  const handleRemove = async (uid) => {
    const docRef = doc(database, "docsData", docId);
    await updateDoc(docRef, {
      sharedWith: arrayRemove(uid),
    });

    setSharedUsers((prev) => prev.filter((user) => user.uid !== uid));
    alert(`User removed from shared users.`);
  };

  return (
    <div>
      {isOwner && (
        <>
          <TextField
            label="Share with (Email)"
            variant="outlined"
            fullWidth
            value={email}
            onChange={handleSearch}
            margin="normal"
          />
          {matchingUsers.length > 0 && (
            <List>
              {matchingUsers.map((user) => (
                <ListItemButton
                  key={user.uid}
                  onClick={() => handleShare(user)}
                >
                  <ListItemText primary={user.email} />
                </ListItemButton>
              ))}
            </List>
          )}
          {noMatch && (
            <Typography variant="body2" color="error">
              No matching users found.
            </Typography>
          )}
        </>
      )}
      <Box sx={{ mt: 2 }}>
        {sharedUsers.map((user) => (
          <Chip
            key={user.uid}
            label={user.email}
            onDelete={isOwner ? () => handleRemove(user.uid) : undefined}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>
    </div>
  );
};

export default ShareDoc;
