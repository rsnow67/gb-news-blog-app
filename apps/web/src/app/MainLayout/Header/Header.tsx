import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div role="navigation">
          <ul>
            <li>
              <Link to="/news">Новости</Link>
            </li>
            <li>
              <Link to="/news/create">Создать новость</Link>
            </li>
          </ul>
        </div>
      </div>
      <hr />
    </header>
  );
};
export default Header;
