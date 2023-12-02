import './App.css';
import router from './router'
import { RouterProvider } from 'react-router-dom';

function App() {
    return (
        <div className='App'>
            <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>}></RouterProvider>
        </div>
    );
}

export default App;


