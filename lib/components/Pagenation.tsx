import { useRouter } from "next/router";
import React from "react";

const Pagenation: React.FunctionComponent<{
    pageNumber: number,
    contentTotalLength: number,
    pageOffset: number,
    slug?: string,
}> = ({
    pageNumber,
    contentTotalLength,
    pageOffset,
    slug
}) => {
        const router = useRouter();
        return (
            <div className="flex mt-2 text-lg font-medium">
                <a
                    style={pageNumber > 1 ? {} : { visibility: 'hidden' }}
                    onClick={() => {
                        router.push({
                            pathname: router.pathname,
                            query: { page: pageNumber - 1, slug }
                        })
                    }}
                >{'<- Prev'}</a>
                <div className="flex-grow" />
                <a
                    style={(pageNumber * pageOffset < contentTotalLength) ? {} : { visibility: 'hidden' }}
                    onClick={() => {
                        router.push({
                            pathname: router.pathname,
                            query: { page: pageNumber + 1, slug }
                        })
                    }}
                >{'Next ->'}</a>
            </div>

        )
    };
export default Pagenation;
