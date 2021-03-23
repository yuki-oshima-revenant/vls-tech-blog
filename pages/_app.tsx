import 'tailwindcss/tailwind.css';
import '../styles/global.css'
import type { AppProps /*, AppContext */ } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Component {...pageProps} />
    )
}

export default App