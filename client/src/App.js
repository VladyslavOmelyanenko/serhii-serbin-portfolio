import React from 'react';
import cases from "./cases";
import { Routes, Route } from "react-router-dom";



import Panel from "./components/panel";
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from "./pages/AdminPage"
import ProjectsPage from './pages/ProjectsPage';

import CasePage from './pages/CasePage';

import 'normalize.css';
import './App.css';




const App = () => {



  return (
    <div>
      <Routes>
        <Route path='/' element={ <ProjectsPage /> } />
        <Route path='/:projectId' element={ <ProjectsPage /> } />
        <Route path='/about' element={ <ProjectsPage /> } />
        <Route path='/panel' element={ <Panel /> } />
        <Route path="/admin" element={ <ProtectedRoute element={ AdminPage }/> } />
        {cases.map((caseItem, i) => (
          <Route key={i} path={caseItem.route} element={ <CasePage caseObject={caseItem}/> }  />
        ))}
      </Routes>
    </div>
  );
};

export default App;