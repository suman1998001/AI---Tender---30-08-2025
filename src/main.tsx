import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import mixpanel from 'mixpanel-browser';

mixpanel.init('b23ed5f0c563913c1822dc17a53e98d0');

createRoot(document.getElementById("root")!).render(<App />);
