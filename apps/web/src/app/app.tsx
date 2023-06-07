import { Route, Routes, Navigate } from 'react-router-dom';
import CreateNews from '../modules/CreateNews/CreateNews';
import Login from '../modules/Login/Login';
import News from '../modules/News/News';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="news" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/create" element={<CreateNews />} />
    </Routes>
  );
}

export default App;
