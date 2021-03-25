import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getArticles, getAuthors } from '@/lib/contentful';
import { ArticleInfo } from '@/lib/types';
import { getFeedArticles } from '@/lib/feed';
import { getArticleList } from '@/lib/util';
import ArticleCard from '@/lib/components/ArticleCard';
import Layout from '@/lib/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Pagenation from '@/lib/components/Pagenation';

const Articles = ({ articles }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (typeof router.query.page === 'string') {
            setPageNumber(parseInt(router.query.page, 10))
        }
    }, [router.query]);

    const displayArticles = useMemo(() => {
        const offset = 100;
        return articles?.slice((pageNumber - 1) * offset, pageNumber * offset);
    }, [articles, pageNumber]);

    return (
        <Layout>
            <h2 className="text-center text-3xl font-bold my-8 border-0">Articles</h2>
            <div className="container grid grid-cols-4 gap-6">
                {displayArticles?.map((article, i) => (
                    <ArticleCard article={article} key={`${i}`} />
                ))}
            </div>
            <Pagenation
                pageNumber={pageNumber}
                contentTotalLength={articles?.length || 0}
                pageOffset={100}
            />
        </Layout>
    )
};


export const getStaticProps: GetStaticProps<{ articles: ArticleInfo[] | null }> = async () => {
    const authors = await getAuthors();
    const feedArticles = await getFeedArticles(authors);
    const articles = await getArticles({ limit: '1000' });
    return {
        props: {
            articles: getArticleList([...feedArticles, ...articles])
        }
    }
};

export default Articles;
