import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import PostDetail from './pages/PostDetail';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';

function App() {

  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("isAuth");
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <nav>
        <h1>BlogHub</h1>
        <Link className="nav-btn" to="/">Home</Link>

        {
          !isAuth ? (
          <Link className="nav-btn" to="/login"> Login </Link>
          ) : (
            <>
              <Link className="nav-btn" to="/createpost">Create Post</Link>
              <button className="logout-btn" onClick={signUserOut}>Log Out</button>
            </>
            )}
      </nav>
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/post/:postId" element={<PostDetail isAuth={isAuth} />} />
      </Routes>
    </Router>
  )
}

export default App
