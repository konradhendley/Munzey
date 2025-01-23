module.exports = {
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => element,
    useNavigate: jest.fn(),
    useLocation: jest.fn().mockReturnValue({ pathname: '/' }),
    Link: ({ children }) => <div>{children}</div>,
  };