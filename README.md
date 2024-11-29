# 🍴 Recipe Sharing CRUD Platform

Welcome to the **Recipe Sharing CRUD Platform**, a dynamic application for sharing, viewing, and managing recipes globally! Built with a modern tech stack, this platform offers seamless functionality for recipe enthusiasts to connect and share their culinary creations. 🍳✨

## 🌐 **Live Site**
Visit the live application here: [Recipe Sharing Platform](http://localhost:3000)

---

## 🛠️ **Features**

1. **🔄 CRUD Functionality:**
   - Create, view, update, and delete your recipes.
   - Recipes added by a user can only be edited or deleted by that user.
   - All recipes are visible to everyone, enabling global recipe sharing.

2. **🔒 Authentication:**
   - Log in using **Google OAuth** or register with a **username, email, and password**.
   - Only authenticated users can add, edit, or delete recipes.

3. **✨ Additional Features:**
   - **📸 Image Upload:** Upload images for your recipes to make them visually appealing.
   - **🎥 YouTube Link Support:** Include YouTube links to recipe preparation videos.
   - **🔍 Keyword Search:** Find recipes by name, ingredients, or keywords in the recipe content.

4. **📱 Responsive Design:**
   - Built with React for a dynamic and user-friendly interface, optimized for all devices.

---

## 💻 **Technology Stack**

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (hosted on MongoDB Atlas)  
- **Authentication:** Google OAuth & traditional username/password login (using Passport.js)  
- **Hosting:** Render  
- **Folder Structure:**  
  - **Client Folder:** React frontend files.  
  - **Server Folder:** Backend logic and API routes.  

---

## 🚀 **How to Use**

### **Public View:**
👀 Browse recipes shared by other users in a read-only format.

### **User Features:**
1. **👤 Register/Login:**
   - Register with your email or log in using Google OAuth.
2. **📜 Create Recipe:**
   - Add a recipe with a name, description, ingredients, cooking steps, a dish image, and an optional YouTube link.
3. **✏️ Edit/Delete Recipe:**
   - Manage your own recipes with edit and delete options.
4. **🔍 Search Recipes:**
   - Use the search bar to find recipes by name, ingredients, or keywords.

---

## ⚙️ **Setup and Deployment**

1. Clone the repository:
   ```bash
   git clone https://github.com/yuvraj455/recipe-sharing-platform
   cd recipe-sharing-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the **server folder** with the following:
     ```
     MONGO_URI=<your-mongodb-uri>
     GOOGLE_CLIENT_ID=<your-google-client-id>
     GOOGLE_CLIENT_SECRET=<your-google-client-secret>
     ```

4. Start the development server:
   - **Backend:**
     ```bash
     cd server
     npm start
     ```
   - **Frontend:**
     ```bash
     cd client
     npm start
     ```

5. Deploy the application to a cloud service (e.g., Render, Vercel).

---

## ✨ **Additional Notes**

### **Independent Features:**
This project includes the following advanced features:
1. Google OAuth authentication.
2. Username and password-based authentication.
3. Image uploads for recipes.
4. Keyword search functionality, searching through recipe names, ingredients, and descriptions.

### **Version Control:**
- All code changes were tracked with descriptive commit messages. No manual uploads were made via GitHub Web UI.

### **Acknowledgments (External Sources Used):**
https://stackoverflow.com/questions/27623315/how-to-upload-an-image-from-web-into-google-cloud-storage/27624158

https://stackoverflow.com/questions/48477685/search-functionality-for-mongoose-collection

https://stackoverflow.com/questions/66672119/how-to-store-my-jwt-token-correctly-and-return-data-in-mern-app

https://stackoverflow.com/questions/62384395/protected-route-with-react-router-v6

https://stackoverflow.com/questions/76485856/what-is-the-best-way-to-upload-and-load-files-using-a-google-cloud-bucket\

https://expressjs.com/en/guide/using-middleware.html

https://www.passportjs.org/concepts/authentication/middleware/

https://www.passportjs.org/concepts/authentication/google/

https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

https://chatgpt.com/

---

## 👥 **Contributors**
- [Yuvraj Jindal](https://github.com/yuvraj455)  
- [Kartik ](https://github.com/Kartikshahi)

Feel free to explore, contribute, or provide feedback! 🙌
