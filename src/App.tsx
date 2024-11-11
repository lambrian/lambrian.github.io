import './App.css'
import { Home } from './Home'
import { Routes, Route } from 'react-router-dom'
import { Queens } from './Queens'
import { QueensBoard } from './QueensBoard'
import { PhotoEssay } from './PhotoEssay'
import { StatusPage } from './Status'

export const App = () => {
    return (
        <Routes>
            <Route path="" element={<Home />} />
            <Route path="/photos/:name" element={<PhotoEssay />} />
            <Route path="/queens" element={<Queens />} />
            <Route path="/queens/:date" element={<QueensBoard />} />
            <Route path="/status" element={<StatusPage />} />
        </Routes>
    )
}

export default App
