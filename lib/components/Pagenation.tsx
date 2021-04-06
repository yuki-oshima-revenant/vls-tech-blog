import { useRouter } from "next/router";
import React from "react";

type Query = {
    page: number,
    slug?: string
}

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
            <div className="flex mt-2 md:text-lg font-medium">
                <a
                    style={pageNumber > 1 ? {} : { visibility: 'hidden' }}
                    onClick={() => {
                        let query: Query = { page: pageNumber - 1 }
                        if (slug) {
                            query = { page: pageNumber - 1, slug }
                        }
                        router.push({
                            pathname: router.pathname,
                            query
                        }).then(() => {
                            window.scrollTo(0, 0);

                        });
                    }}
                >{'<- Prev'}</a>
                <div className="flex-grow" />
                <a
                    style={(pageNumber * pageOffset < contentTotalLength) ? {} : { visibility: 'hidden' }}
                    onClick={() => {
                        let query: Query = { page: pageNumber + 1 }
                        if (slug) {
                            query = { page: pageNumber + 1, slug }
                        }
                        router.push({
                            pathname: router.pathname,
                            query
                        }).then(() => {
                            window.scrollTo(0, 0);
                        });
                    }}
                >{'Next ->'}</a>
            </div>

        )
    };
export default Pagenation;
