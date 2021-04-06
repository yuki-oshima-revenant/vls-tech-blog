const SectionHeader: React.FunctionComponent = ({ children }) => {
    return (
        <h2 className="text-center text-2xl md:text-3xl font-bold my-4 md:my-8 border-0">{children}</h2>
    )
};

export default SectionHeader;