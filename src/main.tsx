import { createRoot } from "react-dom/client";
import { StrictMode} from "react";
import router from "./components/Routing.tsx";
import {RouterProvider} from 'react-router-dom'
import './index.css'

const root = createRoot( document.querySelector('#root') as HTMLDivElement )
root.render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
)
