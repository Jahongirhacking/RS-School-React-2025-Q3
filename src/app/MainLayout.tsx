'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const themeProps = useContext(ThemeContext);

  return (
    <div className="main-layout">
      <div className="layout-navbar">
        <Link href={'/'}>Star Wars</Link>
        <Link href={'/about'}>About</Link>
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
      <div className="layout-body">{children}</div>
      <div className="footer">
        @Copyright - Jahongir Hayitov - RS School React 2025 Q3
      </div>
    </div>
  );
};

export default MainLayout;
