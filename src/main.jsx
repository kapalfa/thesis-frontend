import React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import ProductHero from './components/Landing'
import ErrorPage from './components/error-page'
import SignIn from './components/AuthComponents/Login'
import Register from './components/AuthComponents/Register'
import BasicGrid from './components/MainView'
import { AuthProvider } from './context/AuthProvider'
import RequireAuth from './components/AuthComponents/RequireAuth'
import User from './components/User'
import AfterLogin from './components/AfterLogin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import PersistLogin from './components/AuthComponentsPersistLogin'
const queryClient = new QueryClient()
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
  //{
   // element: <PersistLogin/>, 
   // children: [
    {     //   path: "/home",
      //  element: <RequireAuth/>,
      //  errorElement: <ErrorPage/>,
      ////  children:[
      ///    {
    path: "/project/:id",
    element: <BasicGrid/>,
    //loader: async ({params}) => {
     // const response = await axios.get(`https://localhost:8443/api/getProject/${params.id}`, {
     //   headers: {
      //    'Content-Type': 'application/json'
     //   }
     // })
      //return response.data 
    //},
    errorElement: <ErrorPage/>,
  },
      //  ]
     // },    
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
   // ]
  //},
  {
    path: "/main",
    element: <AfterLogin/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "*",
    element: <ErrorPage/>,
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right'/>
    </QueryClientProvider>
  </React.StrictMode>,
);