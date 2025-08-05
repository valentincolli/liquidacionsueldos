import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import PanelDeControl from './Pages/PanelDeControl/PanelDeControl';
import Employees from './Pages/Employees/Employees.jsx';
import Convenios from './Pages/Convenios/Convenios';
import Sidebar from './Components/Sidebar/Sidebar.jsx';
import './main.scss';

function App() {

  return (
    <BrowserRouter>
       <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/inicio" element={<Dashboard />} />
              <Route path="/empleados" element={<Employees />} />
              <Route path="/convenios" element={<Convenios/>}/>
              <Route path="/PanelDeControl" element={<PanelDeControl/>} />      
            </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;