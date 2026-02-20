Vidora - Movie Platform


Backend
The backend uses SQLite database (movies.db by default). The schema is automatically created on first run.

JWT secret is hardcoded (for demo purposes). In production, use environment variables.

Frontend
API base URL is set to http://localhost:5000 in the code. If your backend runs elsewhere, update the URLs in components.

🚀 Usage
Register a new account or login with existing credentials.

Browse the home page with various movie carousels.

Use the search bar to find specific movies.

Hover over any movie card to see a quick preview and play the trailer.

Click on a movie to view detailed information.

Navigate to the "Plans" page (subscription demo).

Logout from the header.

📁 Project Structure
text
VidoraMERN/
├── backend/
│   ├── server.js
│   ├── movies.db (SQLite)
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── About/
    │   │   ├── Header/
    │   │   ├── Home/
    │   │   ├── Login/
    │   │   ├── MovieDetails/
    │   │   ├── NotFound/
    │   │   ├── ProtectedRoute/
    │   │   ├── Register/
    │   │   └── Subscribe/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── README.md
📡 API Endpoints (Backend)
Method	Endpoint	Description	Auth Required
POST	/api/register	Register a new user	No
POST	/api/login	Login and receive JWT	No
GET	/api/movies	Get all movies	Yes
GET	/api/movies/:id	Get a single movie by ID	Yes
