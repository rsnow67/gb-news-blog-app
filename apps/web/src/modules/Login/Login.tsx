import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../app/constants';
import './login.scss';

interface FormDataType {
  username: string;
  password: string;
}

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: FormDataType = {
      username: login,
      password,
    };

    const response = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.text();

      if (data) {
        localStorage.setItem('accessToken', data);
      }

      setLogin('');
      setPassword('');
      navigate('/news');
    }
  };

  const handleInputChange = (
    setFunction: React.Dispatch<React.SetStateAction<string>>,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFunction(event.target.value);
  };

  return (
    <main className="app__main main">
      <section className="login">
        <form className="login-form login__form" onSubmit={handleSubmit}>
          <div className="login-form__inner">
            <h2 className="login-form__title title title_bordered">
              Авторизация
            </h2>
            <fieldset className="login-form__input fieldset">
              <label className="fieldset__legend" htmlFor="usernameInput">
                Логин
              </label>
              <input
                className="fieldset__input"
                id="usernameInput"
                required
                type="email"
                name="username"
                value={login}
                onChange={(event) => handleInputChange(setLogin, event)}
              />
            </fieldset>
            <fieldset className="login-form__input fieldset">
              <label className="fieldset__legend" htmlFor="passwordInput">
                Пароль
              </label>
              <input
                className="fieldset__input"
                id="passwordInput"
                required
                type="text"
                name="password"
                value={password}
                onChange={(event) => handleInputChange(setPassword, event)}
              />
            </fieldset>
            <button className="login-form__button form-button" type="submit">
              Войти
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
