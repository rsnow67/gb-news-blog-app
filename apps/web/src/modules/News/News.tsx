import { useContext } from 'react';
import { NewsContext } from '../../app/app';
import { API_STATIC } from '../../app/constants';
import MainLayout from '../../app/MainLayout/MainLayout';

export interface NewsEntity {
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
  const news = useContext(NewsContext);

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
