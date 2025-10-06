import React from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Auth/signup';
import Login from './components/Auth/Login';
import PostList from './components/Posts/postlist';
import PostCreate from './components/Posts/postcreate';
import PostEdit from './components/Posts/postedit'; // ← ✅ Import edit component
import Navbar from './components/layout/navbar';
import Header from './components/layout/header';
import AdminRoute from './components/Auth/adminroute'; // ← ✅ Guard for admin-only routes

function App() {
  const location = useLocation();
  const hideNavAndHeader = ['/login', '/signup', '/create'].includes(location.pathname);
  return (
    <div className="responsive-scale-wrapper">
      <div className="app-bg-martha flex flex-col px-0">
        {!hideNavAndHeader && <Navbar />}
        {!hideNavAndHeader && <Header />}
        <div style={{width: '100%', maxWidth: '1280px', margin: '0 auto', boxSizing: 'border-box', overflowX: 'hidden'}}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:category/:subcategory" element={<PostList />} />
            <Route
              path="/create"
              element={
                <AdminRoute>
                  <PostCreate />
                </AdminRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <AdminRoute>
                  <PostEdit />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
