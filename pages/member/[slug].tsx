import { getAuthors, getOneAuthor, getArticles } from '@/lib/contentful';
import { ArticleInfo, MemberInfo } from '@/lib/types';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getFeedArticles } from '@/lib/feed';
import { getArticleList } from '@/lib/util';
import ArticleCard from '@/lib/components/ArticleCard';
import Layout from '@/lib/components/Layout';
import Pagenation from '@/lib/components/Pagenation';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

const Member = ({ member, articles }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const router = useRouter();
    const [pageNumber, setPageNumber] = useState(1);
    useEffect(() => {
        if (typeof router.query.page === 'string') {
            setPageNumber(parseInt(router.query.page, 10));
        }
    }, [router.query]);

    const displayArticles = useMemo(() => {
        const offset = 100;
        return articles?.slice((pageNumber - 1) * offset, pageNumber * offset);
    }, [articles, pageNumber]);

    return (
        <Layout>
            <div className="flex justify-center my-8">
                <img className="h-32 mr-12 rounded-full" alt="avater" src={member?.avaterImage || ''} />
                <div className="flex">
                    <div className="mb-4 mr-12 w-80">
                        <div className="text-3xl font-bold mb-2">{member?.name}</div>
                        <div className="text-lg mb-2">{member?.job}</div>
                        <div className="text-lg">{member?.profile}</div>
                    </div>
                    {/* <div>
                        <div className="text-xl font-bold">{articles?.length.toLocaleString()}</div>
                        <div className="text-sm">Posts</div>
                    </div> */}
                </div>
            </div>
            <h2 className="text-center text-3xl font-bold my-8 border-0">Articles</h2>
            <div className="container grid grid-cols-4 gap-6">
                {displayArticles?.map((article, i) => (
                    <ArticleCard
                        article={article}
                        key={`${i}`}
                        hideAuthor
                    />
                ))}
            </div>
            <Pagenation
                pageNumber={pageNumber}
                contentTotalLength={articles?.length || 0}
                pageOffset={100}
                slug={member?.slug || ''}
            />
        </Layout>
    )
};


export const getStaticPaths: GetStaticPaths = async () => {
    const authors = await getAuthors();

    const paths = authors.map((author) => ({
        params: {
            slug: author.slug || undefined,
        }
    }));
    return { paths, fallback: false }
};

export const getStaticProps: GetStaticProps<{ member: MemberInfo | null, articles: ArticleInfo[] | null }> = async ({ params }) => {
    if (!params?.slug || Array.isArray(params.slug)) {
        return {
            props: {
                member: null,
                articles: null
            }
        }
    }
    const member = await getOneAuthor(params.slug);
    let articles = null;
    if (member) {
        const cmsArtticles = await getArticles({ 'fields.author.sys.contentType.sys.id': 'author', 'fields.author.fields.slug': member.slug });
        const feedArticles = await getFeedArticles([member]);
        articles = getArticleList([...cmsArtticles, ...feedArticles])
    }
    return {
        props: {
            member,
            articles
        }
    }

};

export default Member;
