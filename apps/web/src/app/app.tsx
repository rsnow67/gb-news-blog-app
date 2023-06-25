import { createContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { API } from './constants';
import CreateNews from '../modules/CreateNews/CreateNews';
import Login from '../modules/Login/Login';
import News, { NewsEntity } from '../modules/News/News';

export const NewsContext = createContext([] as NewsEntity[]);

export function App() {
  const [news, setNews] = useState([] as NewsEntity[]);

  useEffect(() => {
    fetch(`${API}/news/all`)
      .then((response) => response.json())
      .then((news) => setNews(news));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="news" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/news"
        element={
          <NewsContext.Provider value={news}>
            <News />
          </NewsContext.Provider>
        }
      />
      <Route path="/news/create" element={<CreateNews />} />
    </Routes>
  );
}

export default App;
