import { NavLink, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="layout-navbar">
        <NavLink to={'/'}>Star Wars</NavLink>
        <NavLink to={'/about'}>About</NavLink>
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
