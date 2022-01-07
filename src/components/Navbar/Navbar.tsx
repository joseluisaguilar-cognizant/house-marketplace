import { FunctionComponent, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { ReactComponent as OfferIcon } from '../../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../../assets/svg/personOutlineIcon.svg';

interface INavbarElem {
  component: ReactNode;
  text: string;
  urlToNavigate: string;
  id: number;
}

const Navbar: FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route: string): boolean =>
    route === location.pathname ? true : false;

  const setParamBaseOnRoute = (
    route: string,
    param1: string,
    param2: string
  ): string => (pathMatchRoute(route) ? param1 : param2);

  const LIST_ITEMS: Array<INavbarElem> = [
    {
      component: (
        <ExploreIcon
          fill={setParamBaseOnRoute('/', '#2c2c2c', '#8f8f8f')}
          width="36px"
          height="36px"
        />
      ),
      text: 'Explore',
      urlToNavigate: '/',
      id: 1,
    },
    {
      component: (
        <OfferIcon
          fill={setParamBaseOnRoute('/offers', '#2c2c2c', '#8f8f8f')}
          width="36px"
          height="36px"
        />
      ),
      text: 'Offer',
      urlToNavigate: '/offers',
      id: 2,
    },
    {
      component: (
        <PersonOutlineIcon
          fill={setParamBaseOnRoute('/profile', '#2c2c2c', '#8f8f8f')}
          width="36px"
          height="36px"
        />
      ),
      text: 'Profile',
      urlToNavigate: '/profile',
      id: 3,
    },
  ];

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          {LIST_ITEMS.map((elem: INavbarElem) => {
            return (
              <li
                className="navbarListItem"
                onClick={() => navigate(elem.urlToNavigate)}
                key={elem.id}
              >
                {elem.component}
                <p
                  className={setParamBaseOnRoute(
                    elem.urlToNavigate,
                    'navbarListItemNameActive',
                    'navbarListItemName'
                  )}
                >
                  {elem.text}
                </p>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
};

// --- Necesito que se renderice de nuevo y cambie su "color" en cada cambio de navegacion ---
// const pathMatchRoute = (route: string) => {
//   console.log('route', route, window.location.pathname);
//   if (route === window.location.pathname) {
//     return true;
//   }
// };

// const LIST_ITEMS: Array<INavbarElem> = [
//   {
//     component: (
//       <ExploreIcon
//         fill={pathMatchRoute('/') ? '2c2c2c' : '8f8f8f'}
//         width="36px"
//         height="36px"
//       />
//     ),
//     text: 'Explore',
//     urlToNavigate: '/',
//     id: 1,
//   },
//   {
//     component: (
//       <OfferIcon
//         fill={pathMatchRoute('/offers') ? '2c2c2c' : '8f8f8f'}
//         width="36px"
//         height="36px"
//       />
//     ),
//     text: 'Offer',
//     urlToNavigate: '/offers',
//     id: 2,
//   },
//   {
//     component: (
//       <PersonOutlineIcon
//         fill={pathMatchRoute('/profile') ? '2c2c2c' : '8f8f8f'}
//         width="36px"
//         height="36px"
//       />
//     ),
//     text: 'Profile',
//     urlToNavigate: '/profile',
//     id: 3,
//   },
// ];

export default Navbar;
