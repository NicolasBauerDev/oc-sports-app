import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Placeholder from './pages/Placeholder/Placeholder'

/**
 * Point d'entrée de l'application : déclare le routeur et les écrans.
 *
 * La route `/user/:id` est prête pour l'étape API (US#4 à US#10) : elle rendra
 * le même tableau de bord, mais alimenté par les données de l'utilisateur ciblé.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/user/:id" element={<Dashboard />} />
          <Route path="/profil" element={<Placeholder title="Profil" />} />
          <Route path="/reglage" element={<Placeholder title="Réglage" />} />
          <Route
            path="/communaute"
            element={<Placeholder title="Communauté" />}
          />
          <Route
            path="*"
            element={
              <Placeholder
                title="Page introuvable"
                message="Cette page n'existe pas ou a été déplacée."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
