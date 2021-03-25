import router from 'next/router';

const Layout: React.FunctionComponent = ({ children }) => {
    return (
        <div className="bg-gray-100">
            <header className="h-16 bg-gray-100">
                <div className="max-w-7xl flex mx-auto h-full px-4">
                    <img alt="logo" src="/logo.png" className="h-8 my-auto cursor-pointer" onClick={() => { router.push('/') }} />
                    <div className="flex-grow" />
                </div>
            </header>
            <div className="min-h-screen pt-4">
                <div className="max-w-7xl mx-auto px-4">
                    {children}
                </div>
            </div>
            <footer className="h-16 flex ">
                <div className="h-auto m-auto">
                    © VALUES, Inc.
                </div>
            </footer>
        </div>
    )
};

export default Layout;
