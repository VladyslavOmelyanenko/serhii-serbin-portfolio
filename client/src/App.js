import React from 'react';
import { Routes, Route } from "react-router-dom";



import Panel from "./components/panel";
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from "./pages/AdminPage"
import ProjectsPage from './pages/ProjectsPage';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <ProjectsPage /> } />
        <Route path='/panel' element={ <Panel /> } />
        <Route path="/admin" element={ <ProtectedRoute element={ AdminPage }/> } />
      </Routes>
    </div>
  );
};

export default App;