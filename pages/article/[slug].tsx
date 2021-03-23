import React from 'React';
import { getArticles } from '@/lib/contentful';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ArticleInfo } from '@/lib/types';
import remark from 'remark';
import html from 'remark-html';
import Layout from '@/lib/components/Layout';

const highlight = require('remark-highlight.js');
const gfm = require('remark-gfm');

const Article = ({ article }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            <div className="grid grid-cols-4 gap-4 max-w-7xl mx-auto">
                <div className="col-span-3 bg-white p-4 rounded-lg">
                    <h1>{article?.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: article?.body || '' }} />
                </div>
                <div className="col-span-1">
                    <div className="sticky top-16">
                        <div className="bg-white p-4 rounded-lg">
                            <div className="flex mb-4 justify-center">
                                <img alt="author" src={article?.author.avaterImage || ''} className="h-12 mr-2 rounded-full" />
                                <div className="text-center h-auto my-auto">
                                    {article?.author.name}
                                </div>
                            </div>
                            <div className="text-center">
                                {article?.author.job}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
};


export const getStaticPaths: GetStaticPaths = async () => {
    const articles = await getArticles();

    const paths = articles.map((article) => ({
        params: {
            slug: article.slug || undefined,
        }
    }));
    return { paths, fallback: false }
};

export const getStaticProps: GetStaticProps<{ article: ArticleInfo | null }> = async ({ params }) => {
    const articles = await getArticles();
    const article = articles.find((article) => article.slug === params?.slug);
    if (!article) {
        return {
            props: {
                article: null
            }
        }
    }
    const processedBody = await remark().use(gfm).use(html).use(highlight).process(article.body || '');

    return {
        props: {
            article: {
                ...article,
                body: processedBody.toString()
            }
        }
    }

};


export default Article;
