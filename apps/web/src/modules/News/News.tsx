import { useEffect, useState } from 'react';
import { API, API_STATIC } from '../../app/constants';
import MainLayout from '../../app/MainLayout/MainLayout';

export interface News {
  id: string;
  cover: string;
  title: string;
  user: User;
  description: string;
}

export interface User {
  nickName: string;
}

const News = () => {
  const [news, setNews] = useState([] as News[]);

  useEffect(() => {
    const url = `${API}/news/all`;

    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(url);
        const json: News[] = await response.json();

        setNews(json);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <MainLayout>
      <main className="flex-shrink-0 py-4">
        <div className="container">
          <h1>Главные новости</h1>
          {news.length > 0 ? (
            <ul className="row mt-4" style={{ listStyleType: 'none' }}>
              {news.map((item) => {
                const {
                  id,
                  cover,
                  title,
                  user: { nickName },
                  description,
                } = item;

                return (
                  <li className="col-lg-6 mt-3" key={id}>
                    <div className="card">
                      <img
                        src={`${API_STATIC}/${cover}`}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                        alt="news"
                      />
                      <div className="card-body">
                        <h5 className="card-title">{title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Автор: {nickName}
                        </h6>
                        <p className="card-text">{description}</p>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                        <a href="#">Перейти к новости</a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Список новостей пуст!</p>
          )}
        </div>
      </main>
    </MainLayout>
  );
};

export default News;
