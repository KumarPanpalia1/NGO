import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Donations from './pages/Donations'
import Expenses from './pages/Expenses'
import Funds from './pages/Funds'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/donations" element={<Donations />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/funds" element={<Funds />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}

export default App
