import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import Liquidaciones from './Pages/Liquidaciones/Liquidacion.jsx';
import Employees from './Pages/Employees/Employees.jsx';
import Convenios from './Pages/Convenios/Convenios';
import ConvenioDetail from './Pages/ConvenioDetail/ConvenioDetail';
import Sidebar from './Components/Sidebar/Sidebar.jsx';
import LiquidacionHistorial from './Pages/Liquidaciones/LiquidacionHistorial.jsx';
import './main.scss';

function App() {

  return (
    <BrowserRouter>
       <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/empleados" element={<Employees />} />
              <Route path="/convenios" element={<Convenios/>}/>
              <Route path="/convenios/:id" element={<ConvenioDetail/>}/>
              <Route path="/liquidacion" element={<Liquidaciones/>}/>
              <Route path="/liquidacion-historial" element={<LiquidacionHistorial/>}/>
            </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;