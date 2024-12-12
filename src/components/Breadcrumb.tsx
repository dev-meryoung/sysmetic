import React from 'react';
import { css } from '@emotion/react';
import { ChevronRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { COLOR } from '@/constants/color';
import { BREADCRUMB_MAP } from '@/constants/path';

const Breadcrumb: React.FC = () => {
  const { pathname } = useLocation();

  const breadcrumbData =
    BREADCRUMB_MAP[pathname] ||
    Object.entries(BREADCRUMB_MAP).find(([key]) => {
      const isDynamicRoute = key.includes(':');
      if (!isDynamicRoute) return false;
      const regex = new RegExp(`^${key.replace(/:\w+/g, '\\w+')}$`);
      return regex.test(pathname);
    })?.[1];

  if (!breadcrumbData) return null;

  return (
    <div css={breadcrumbStyle}>
      <div css={linksStyle}>
        {breadcrumbData.map(({ label, path }, idx) => (
          <React.Fragment key={`${label}-${idx}`}>
            {idx > 0 && <ChevronRight sx={{ fontSize: 24 }} />}
            {path ? <Link to={path}>{label}</Link> : <span>{label}</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const breadcrumbStyle = css`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR.GRAY100};

  a {
    color: ${COLOR.TEXT_BLACK};
    text-decoration: none;
  }
`;

const linksStyle = css`
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 4px;

  a {
    cursor: pointer;
  }
`;

export default Breadcrumb;
