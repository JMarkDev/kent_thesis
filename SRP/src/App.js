/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LayoutStudent from './components/LayoutStudent';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Admin/Dashboard';
import Users from './pages/Admin/Users';
import Login from './pages/Login/Login/Login';
import Register from './pages/Login/Login/Register';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Students/Students/Home';
import ProtectedRoute from './pages/ProtectedRoute';
import Admin from './pages/Admin/admin';
import AboutUs from './pages/Students/Students/AboutUs';
import Strands from './pages/Students/Students/Strands';
import Input from './pages/Students/Students/input';
import Recommendation from './pages/Students/Students/recommendation';
import Add_admin from './pages/Admin/Add_admin';
import Edit_admin from './pages/Admin/Edit_admin';
import Course from './pages/Admin/Course';
import AddCourse from './pages/Admin/Courses/AddCourse';
import EditCourse from './pages/Admin/Courses/EditCourse';
import Strand from './pages/Admin/Strand';
import AddStrand from './pages/Admin/Strand/AddStrand';
import EditStrand from './pages/Admin/Strand/EditStrand';
import SingleStrand from './pages/Students/Students/SingleStrand';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [recommendedStrand, setRecommendedStrand] = useState('');

  const handleRecommendation = (strand) => {
    setRecommendedStrand(strand);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(token !== null);
    setUserRole(role);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<PageNotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/log-in" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Routes for admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/strand"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Strand />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
        path="/strand/add"
        element={
          <ProtectedRoute
            element={
              <Layout>
                <AddStrand />
              </Layout>
            }
            allowedRoles={['admin']}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
          />
        }
      />
      <Route
      path="/strand/edit/:id"
      element={
        <ProtectedRoute
          element={
            <Layout>
              <EditStrand />
            </Layout>
          }
          allowedRoles={['admin']}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
        />
      }
    />
        <Route
        path="/courses"
        element={
          <ProtectedRoute
            element={
              <Layout>
                <Course />
              </Layout>
            }
            allowedRoles={['admin']}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
          />
        }
      />
    <Route
    path="/courses/add"
    element={
      <ProtectedRoute
        element={
          <Layout>
            <AddCourse />
          </Layout>
        }
        allowedRoles={['admin']}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
    }
  />
  
  <Route
  path="/course/edit/:id"
  element={
    <ProtectedRoute
      element={
        <Layout>
          <EditCourse />
        </Layout>
      }
      allowedRoles={['admin']}
      isLoggedIn={isLoggedIn}
      userRole={userRole}
    />
  }
/>

        <Route
          path="/users"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Users />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Login />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Admin />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/add-admin"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Add_admin />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute
              element={
                <Layout>
                  <Edit_admin />
                </Layout>
              }
              allowedRoles={['admin']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />

        {/* Routes for student */}
        <Route
          path="/home"
          element={
            <ProtectedRoute
              element={
                <LayoutStudent>
                  <Home />
                </LayoutStudent>
              }
              allowedRoles={['student']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
        path="/strand/:id"
        element={
          <ProtectedRoute
            element={
              <LayoutStudent>
                <SingleStrand />
              </LayoutStudent>
            }
            allowedRoles={['student']}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
          />
        }
      />
        <Route
          path="/input"
          element={
            <ProtectedRoute
              element={
                <LayoutStudent>
                  <Input />
                </LayoutStudent>
              }
              allowedRoles={['student']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/recommendation"
          element={
            
            <ProtectedRoute
              element={
                <LayoutStudent>
                  <Recommendation/>
                </LayoutStudent>
              }
              allowedRoles={['student']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/aboutus"
          element={
            <ProtectedRoute
              element={
                <LayoutStudent>
                  <AboutUs />
                </LayoutStudent>
              }
              allowedRoles={['student']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        <Route
          path="/strands"
          element={
            <ProtectedRoute
              element={
                <LayoutStudent>
                  <Strands />
                </LayoutStudent>
              }
              allowedRoles={['student']}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
            />
          }
        />
        
       
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;