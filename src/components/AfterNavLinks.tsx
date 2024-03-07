import React from 'react';
import { NavLink } from 'react-router-dom';

// As this is the demo project, we import our dependencies from the `src` directory.
import Chevron from 'payload/dist/admin/components/icons/Chevron';
import { useConfig } from 'payload/dist/admin/components/utilities/Config';

// In your projects, you can import as follows:
// import { Chevron } from 'payload/components';
// import { useConfig } from 'payload/components/utilities';


const baseClass = 'after-nav-links';

const AfterNavLinks: React.FC = () => {
  const { routes: { admin: adminRoute } } = useConfig();

  return (
    <div className={baseClass}>
      {/* <span className="nav__label">Custom Routes</span> */}
      <nav>
        <NavLink
          className="nav__link"
          activeClassName="active"
          to={`${adminRoute}/createbatch`}
        >
          <Chevron />
        Create Batch Flow
        </NavLink>
        <NavLink
          className="nav__link"
          activeClassName="active"
          to={`${adminRoute}/createtemplate`}
        >
          <Chevron />
        Create Template Flow
        </NavLink>
        
      </nav>
    </div>
  );
};

export default AfterNavLinks;