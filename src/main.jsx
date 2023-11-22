import React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import ProductHero from './components/Landing'
import ErrorPage from './components/error-page'
import SignIn from './components/Login'
import Register from './components/Register'
import BasicGrid from './components/MainView'
import { AuthProvider } from './context/AuthProvider'
import RequireAuth from './components/RequireAuth'
import User from './components/User'
import PersistLogin from './components/PersistLogin'
const router = createBrowserRouter([
  {
    path: "/", // landing page
    element: <ProductHero/> ,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/login",
    element: <SignIn/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/register",
    element: <Register/>,
    errorElement: <ErrorPage/>,
  },
  {
    element: <PersistLogin/>, 
    children: [
      {
        path: "/home",
        element: <RequireAuth/>,
        errorElement: <ErrorPage/>,
        children:[
          {
           path: "/home",
            element: <BasicGrid/>,
            errorElement: <ErrorPage/>,
          },
        ]
      },    
      {
        path: "/user",
        element: <RequireAuth/>,
        children:[
          {
            path: "/user",
            element: <User/>,
            errorElement: <ErrorPage/>,
          },
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
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
);