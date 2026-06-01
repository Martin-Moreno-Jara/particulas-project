// Punto de entrada de la aplicación. Sin StrictMode para evitar el doble montaje
// de canvas WebGL (Three.js) y p5.js, que duplicaría contextos gráficos.
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
