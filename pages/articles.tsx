import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getArticles, getAuthors } from '@/lib/contentful';
import { ArticleInfo } from '@/lib/types';
import { getFeedArticles } from '@/lib/feed';
import { getArticleList } from '@/lib/util';
import Layout from '@/lib/components/Layout';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Pagenation from '@/lib/components/Pagenation';
import SectionHeader from '@/lib/components/SectionHeader';
import ArticleGridContainer from '@/lib/components/ArticleGridContainer';

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
            <SectionHeader>Articles</SectionHeader>
            <ArticleGridContainer
                articles={displayArticles}
            />
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
    const [feedArticles, articles] = await Promise.all([
        getFeedArticles(authors),
        getArticles({ limit: '1000' })
    ]);
    return {
        props: {
            articles: getArticleList([...feedArticles, ...articles])
        },
        revalidate: 60
    }
};

export default Articles;
