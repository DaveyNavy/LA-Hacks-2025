import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './app.jsx';
import Profile from './Profile.jsx';

<Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Router>
