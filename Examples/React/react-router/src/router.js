
import { createBrowserHistory } from "history";
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

const LocationContext = createContext({});
const NavigationContext = createContext({});

const useNavigation = () => useContext(NavigationContext).navigation;

const useLocation = () => useContext(LocationContext).location;

export const BrowserRouter = ({ children }) => {
  const historyRef = useRef();

  if (!historyRef.current) {
    // We use third-party library called history to create a BrowserHistory in this place
    // but This place doesn't need multiple times created
    historyRef.current = createBrowserHistory();
  }
  const history = historyRef.current;

  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      location={state.location}
      children={children}
      navigator={history}
      navigationType={history.action}
    />
  );
};

// Here, we mainly use Consumer and Provider, and implement router components in the form of injection
export const Router = ({ children, location, navigator, navigationType }) => {
  const locationContext = useMemo(
    () => ({ location, navigationType }),
    [location, navigationType]
  );

  const navigationContext = useMemo(() => ({ navigator }), [navigator]);

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider
        value={locationContext}
        children={children}
      ></LocationContext.Provider>
    </NavigationContext.Provider>
  );
};

// Obtain the current ele
const useRoutes = (routes) => {
  const location = useLocation();
  // Obtain the current pathname
  const currentPathname = location?.pathname || "/";
  // Obtain the current route object
  let currentRoute = null;
  routes.forEach(({ path, ...restChildren }) => {
    // Using regular matching pathname
    const isMatch = currentPathname.match(new RegExp(`^${path}`));
    if (isMatch) {
      currentRoute = { ...restChildren, path };
    }
  });

  return currentRoute?.element || null;
};

export const Routes = ({ children }) =>
  useRoutes(createRoutesFormChildren(children));

// dom Transforming Trees
const createRoutesFormChildren = (children) => {
  let routes = [];

  React.Children.forEach(children, (child) => {
    let routeChildren = {
      path: child.props.path,
      element: child.props.element,
    };

    // Check for the presence of Children
    if (routeChildren.props?.children) {
      // if have so, recursion execute
      routeChildren.props.children = createRoutesFormChildren(
        child.props.children
      );
    }

    routes.push(routeChildren);
  });

  return routes;
};

export const Route = () => {};
