import React from 'react'
import * as ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ErrorPage from './components/error-page'
import SignIn from './components/AuthComponents/Login'
import Register from './components/AuthComponents/Register'
import BasicGrid from './components/MainView'
import { AuthProvider } from './context/AuthProvider'
import RequireAuth from './components/AuthComponents/RequireAuth'
import AfterLogin from './components/AfterLogin'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AccessTokenFetcher from './components/GithubComponents/GithubCallback'
import PublicProjectList from './components/PublicProjects'
import { GitProvider } from './context/GitProvider'
import EmailConfirmation from './components/EmailConfirmationPage'
import ForgotPassword from './components/AuthComponents/ForgotPassword'
// import PersistLogin from './components/AuthComponentsPersistLogin'
const queryClient = new QueryClient()
const router = createBrowserRouter([
  
  {
      path: "/", 
      element: <LandingPage/> ,
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
    { path: "/project/:id",
      element: <RequireAuth/>,
      children:[
        {
          path: "/project/:id",
          element: <BasicGrid/>,
        }
      ],
    },
    //loader: async ({params}) => {
     // const response = await axios.get(`https://localhost:8443/api/getProject/${params.id}`, {
     //   headers: {
      //    'Content-Type': 'application/json'
     //   }
     // })
      //return response.data 
    
   // errorElement: <ErrorPage/>,
          //  ]
     // },    
    //  {
      //  path: "/user",
       // element: <RequireAuth/>,
       // children:[
         // {
           // path: "/user",
           // element: <User/>,
            //errorElement: <ErrorPage/>,
          //},
        //]
      //},  
   // ]
  //},
  {
    path: "/confirmEmail",
    element: <EmailConfirmation/>,
  },
  {
    path: "/main",
    element: <RequireAuth/>,
    children: [
      {
        path: "/main",
        element: <AfterLogin/>,
      },
    ]
  },
  {
    path: "/public",
    element: <PublicProjectList />
  },
  {
    path: "/github/callback",
    element: <AccessTokenFetcher />,
  },
  {
    path: "/forgotPassword",
    element: <ForgotPassword  />,
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