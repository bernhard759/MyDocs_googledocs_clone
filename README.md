## MyDocs &ndash; React Firebase Google Docs Clone

### Overview
This project is a Google Docs clone built with modern web technologies. It allows users to create, edit, and store documents in real-time, leveraging Firebase for backend services. The app is designed with a clean and responsive UI using Material UI components, ensuring a polished user experience.

### Features
- **Real-time Collaboration:** Multiple users can edit the same document simultaneously, with updates reflecting in real time.
- **Document Management:** Users can create, edit, and delete documents.
- **Rich Text Editing:** Integrated rich text editor (React Quill) for formatting document content.
- **Responsive Design:** The UI is built using Material UI, ensuring responsiveness across different devices.

### Tech Stack
- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **Vite:** A fast development environment for modern web applications.
  - **Material UI:** A popular React UI framework for building responsive and accessible interfaces.
  - **React Router:** For managing routing in the application.
  - **React Quill:** A rich text editor for managing document content.
  - **React Toastify:** For providing feedback to the user with toast notifications.

- **Backend:**
  - **Firebase Firestore:** A NoSQL cloud database to store and sync data in real-time.
  - **Firebase Hosting:** Used for deploying the application.
  
### Firebase Real-time Database Setup
The project uses Firebase Firestore to manage the storage and retrieval of document data in real-time. Below is a brief overview of how Firebase is integrated:

1. **Firestore Initialization:** Firebase is initialized in the project using a `firebaseConfig.js` file where the Firebase credentials are stored.
2. **Real-time Data Sync:** The app uses Firestore's `onSnapshot` method to listen for real-time updates from the database, ensuring that any changes made by users are immediately reflected in the UI.
3. **Document Storage:** Each document's title and content are stored in Firestore, with the content being updated using Firestore's `updateDoc` method as the user makes changes in the editor.

### Getting Started
1. **Clone the repository and cd into the directory:**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database.
   - Add a new web app to your Firebase project and copy the Firebase config object.
   - Create a `firebaseConfig.js` file in the `src` directory and paste your Firebase config object there.
   
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     // Your Firebase config here
   };

   export const app = initializeApp(firebaseConfig);
   export const database = getFirestore(app);
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   - Navigate to `http://localhost:3000` in your browser to view the application.

### Credits
This project is inspired by a tutorial from freeCodeCamp. Special thanks to the original author for the detailed guide on building a Google Docs clone with React and Firebase.

**Original Blog:** [Build a Google Docs Clone with React and Firebase](https://www.freecodecamp.org/news/build-a-google-docs-clone-with-react-and-firebase/)
