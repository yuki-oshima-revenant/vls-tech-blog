import React, { useEffect, useState } from 'react';
import { getArticles, getOneArticle } from '@/lib/contentful';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { ArticleInfo } from '@/lib/types';
import remark from 'remark';
import html from 'remark-html';
import Layout from '@/lib/components/Layout';
import dayjs from 'dayjs';
const highlight = require('remark-highlight.js');
const gfm = require('remark-gfm');

const Article = ({ article }: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [headings, setHeadings] = useState<string[]>();
    useEffect(() => {
        const tmpHeadings: string[] = [];
        const h2 = document.querySelectorAll('h2');
        if (h2) {
            h2.forEach((el, i) => {
                el.setAttribute('style', 'border-bottom:1px solid #ddd; padding-bottom: 0.25em');
                el.setAttribute('id', `${i + 1}`);
                tmpHeadings.push(el.innerText);
            });
        }
        setHeadings(tmpHeadings);
    }, [])
    return (
        <Layout>
            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 bg-white p-8 pt-12 rounded-lg">
                    <h1>{article?.title}</h1>
                    <div className="mb-2 text-md text-right">{`Last Modified: ${dayjs(article?.lastModifiedDate || undefined).format('YYYY.MM.DD')}`}</div>
                    <div dangerouslySetInnerHTML={{ __html: article?.body || '' }} />
                </div>
                <div className="col-span-1">
                    <div className="sticky top-8">
                        <div className="bg-white p-6 rounded-lg mb-4">
                            <div className="flex mx-auto">
                                <img alt="author" src={article?.author.avaterImage || ''} className="h-12 mr-4 rounded-full" />
                                <div>
                                    <div className="text-center text-xl font-bold">
                                        {article?.author.name}
                                    </div>
                                    <div className="text-center text-sm">
                                        {article?.author.job}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg">
                            <div className="mb-4 font-bold text-lg">Table of Contents</div>
                            {headings?.map((heading, i) => (
                                <div key={`heading_${i}`} className="mb-2">
                                    <a className="text-gray-500">{heading}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
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
    if (!params?.slug || Array.isArray(params.slug)) {
        return {
            props: {
                article: null
            }
        }
    }
    const article = await getOneArticle(params.slug);
    if (article) {
        const processedBody = await remark().use(gfm).use(html).use(highlight).process(article.body || '');

        return {
            props: {
                article: {
                    ...article,
                    body: processedBody.toString()
                }
            }
        }
    }
    return {
        props: {
            article: null
        }
    }
};


export default Article;
