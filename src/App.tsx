
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./pages/RootLayout.tsx";
import HomePage from "./pages/HomePage/HomePage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import {checkAuthLoader, getUserInfo} from "./utils/auth.ts";
import {RecoilRoot} from "recoil";


const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout/>,
        id: "root",
        loader:getUserInfo,
        children: [
            {index: true, element: <HomePage/>, loader: checkAuthLoader},
            {path: 'auth/login', element:<LoginPage/>},
            {path: 'auth/register', element: <RegisterPage/>}
        ]

    }
])

function App() {

    return (
        <RecoilRoot>
            <RouterProvider router={router}/>
        </RecoilRoot>
    )
}

export default App
