import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';

const MainLayout = () => {
  const themeProps = useContext(ThemeContext);

  return (
    <div className="main-layout">
      <div className="layout-navbar">
        <NavLink to={'/'}>Star Wars</NavLink>
        <NavLink to={'/about'}>About</NavLink>
        {themeProps && (
          <span onClick={themeProps?.toggleTheme} style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              checked={themeProps?.theme === 'light'}
              onChange={() => {}}
              style={{ marginRight: 8 }}
            />
            {themeProps?.theme}
          </span>
        )}
      </div>
      <div className="layout-body">
        <Outlet />
      </div>
      <div className="footer">
        @Copyright - Jahongir Hayitov - RS School React 2025 Q3
      </div>
    </div>
  );
};

export default MainLayout;
