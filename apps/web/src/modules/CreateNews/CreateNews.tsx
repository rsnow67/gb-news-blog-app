import React, { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../app/constants';
import MainLayout from '../../app/MainLayout/MainLayout';

export type FormState = {
  title: string;
  description: string;
  cover: File | null;
};

type FormAction = {
  type: string;
  field: string;
  value: string | File | null;
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'CHANGE_FIELD': {
      return {
        ...state,
        [action.field]: action.value,
      };
    }

    default:
      return state;
  }
};

const initialState: FormState = {
  title: '',
  description: '',
  cover: null,
};

const CreateNews = () => {
  const [formState, setFormState] = useReducer(formReducer, initialState);

  const navigate = useNavigate();

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;

    if (name) {
      setFormState({
        type: 'CHANGE_FIELD',
        field: name,
        value: value,
      });
    }
  };

  const handleCoverUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { files } = event.target;

    if (files) {
      setFormState({
        type: 'CHANGE_FIELD',
        field: event.target.name,
        value: files[0],
      });
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();

    Object.entries(formState).forEach(([key, val]) => {
      if (val) {
        formData.append(key, val);
      }
    });

    const response = await fetch(`${API}/news`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (response.status === 200 || response.status === 201) {
      alert('Новость создана.');
      navigate('/news');
    } else {
      alert('Ошибка при создании новости.');
    }
  };

  return (
    <MainLayout>
      <main className="flex-shrink-0 py-4">
        <div className="container">
          <h1 className="mt-3">Создание новости</h1>
          <form id="create-news-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="titleInput" className="form-label">
                Заголовок
              </label>
              <input
                className="form-control"
                name="title"
                id="titleInput"
                required
                value={formState.title}
                onChange={handleTextChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descriptionInput" className="form-label">
                Описание
              </label>
              <textarea
                className="form-control"
                name="description"
                id="descriptionInput"
                required
                rows={3}
                value={formState.description}
                onChange={handleTextChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label className="mr-3" htmlFor="cover">
                Обложка
              </label>
              <input
                type="file"
                className="form-control-file"
                name="cover"
                required
                id="cover"
                onChange={handleCoverUpload}
              />
            </div>
            <button className="btn btn-primary mt-3" type="submit">
              Отправить
            </button>
          </form>
        </div>
      </main>
    </MainLayout>
  );
};

export default CreateNews;
