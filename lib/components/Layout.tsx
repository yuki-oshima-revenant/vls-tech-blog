import router from 'next/router';
import React from 'react';

const LinkDiv: React.FunctionComponent<{
    href: string,
}> = ({
    href,
    children
}) => {
        return (
            <div className="inline md:block p-2 text-sm">
                <a className="text-gray-600" target="_blank" href={href}>{children}</a>
            </div>
        )
    };

const LinkHeader: React.FunctionComponent = ({
    children
}) => {
    return (
        <div className="font-bold mb-2">{children}</div>

    )
};

const LinkContainer: React.FunctionComponent = ({
    children
}) => {
    return (
        <div className="w-full md:w-64 mb-4 md:mb-0">{children}</div>
    )
};


const Layout: React.FunctionComponent = ({ children }) => {
    return (
        <div className="bg-gray-100">
            <header className="h-12 md:h-16 bg-gray-100">
                <div className="max-w-7xl flex mx-auto h-full px-4">
                    <img alt="logo" src="/logo.png" className="h-6 md:h-8 my-auto cursor-pointer" onClick={() => { router.push('/') }} />
                    <div className="flex-grow" />
                </div>
            </header>
            <div className="min-h-screen pt-4 pb-24">
                <div className="max-w-7xl mx-auto px-4">
                    {children}
                </div>
            </div>
            <footer className="bg-gray-200">
                <div className="max-w-4xl p-8 mx-auto h-full md:flex justify-between">
                    <div className="mb-8 md:mb-0 md:flex">
                        <LinkContainer>
                            <LinkHeader>About</LinkHeader>
                            <LinkDiv href="https://www.valuesccg.com/">運営会社</LinkDiv>
                            <LinkDiv href="https://www.valuesccg.com/news/">NEWS</LinkDiv>
                            <LinkDiv href="https://www.valuesccg.com/seminar/">SEMINAR</LinkDiv>
                            <LinkDiv href="https://recruit.valuesccg.com/">RECRUIT</LinkDiv>
                        </LinkContainer>
                        <LinkContainer>
                            <LinkHeader>Link</LinkHeader>
                            <LinkDiv href="https://www.valuesccg.com/dockpit/">Dockpit</LinkDiv>
                            <LinkDiv href="https://manamina.valuesccg.com/">マナミナ</LinkDiv>
                        </LinkContainer>
                    </div>
                    <div className="text-center h-auto">
                        <img alt="logo_bottom" src="/logo.png" className="h-6 md:h-8 m-auto" />
                        <div className="mt-6 text-gray-600 text-sm">© VALUES, Inc.</div>
                    </div>
                </div>
            </footer>
        </div>
    )
};

export default Layout;
