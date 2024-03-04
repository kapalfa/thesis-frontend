import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ErrorPage from './components/ErrorPage'
import SignIn from './components/AuthComponents/Login'
import Register from './components/AuthComponents/Register'
import BasicGrid from './components/MainView'
import { AuthProvider } from './context/AuthProvider'
import RequireAuth from './components/AuthComponents/RequireAuth'
import AfterLogin from './components/AfterLogin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AccessTokenFetcher from './components/GithubComponents/GithubCallback'
import PublicProjectList from './components/PublicProjects.jsx'
import { GitProvider } from './context/GitProvider'
import EmailConfirmation from './components/EmailConfirmationPage'
import ForgotPassword from './components/AuthComponents/ForgotPassword'
import SetNewPassword from './components/AuthComponents/SetNewPassword'
import PersistLogin from './components/AuthComponents/PersistLogin'
const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: "/", 
    element: <LandingPage/> ,
  },
  {
    path: "/auth",
    children: [
      { path: "login", element: <SignIn/> },
      { path: "register", element: <Register/> },
      { path: "forgotPassword", element: <ForgotPassword/> },
      { path: "setNewPassword", element: <SetNewPassword/> }
    ]
  },
  {
    path: "/confirmEmail",
    element: <EmailConfirmation/>,
  },
  {
    path: "/github/callback",
    element: <AccessTokenFetcher />,
  },
  {
    element: <RequireAuth/>, 
    children: [
      { 
        element: <PersistLogin />,
        children: [
          {
            path: "/project/:id", element: <BasicGrid/>,  
            path: "/main", element: <AfterLogin/>,      
            path: "/public", element: <PublicProjectList/> 
          }
        ]
      },
    ]
  },
  {
    path: "*",
    element: <ErrorPage/>,
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GitProvider>
        <RouterProvider router={router}/>
      </GitProvider>
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
  </QueryClientProvider>
);