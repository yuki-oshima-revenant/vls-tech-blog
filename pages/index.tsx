import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import dayjs from 'dayjs';
import { getAuthors, getArticles } from '@/lib/contentful';
import { ArticleInfo, MemberInfo } from '@/lib/types';
import { getFeedArticles } from '@/lib/feed';
import Layout from '@/lib/components/Layout';
import router from 'next/router';
import Link from 'next/link';

const Index = ({ articles, members }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-center text-5xl font-bold my-8">VALUES TECH BLOG</h1>
                <h2 className="text-center text-3xl font-bold my-8">New Articles</h2>
                <div className="container grid grid-cols-4 gap-6">
                    {articles.slice(0, 8).map((article, i) => (
                        <div
                            key={i}
                            className="bg-white p-4 hover:shadow-lg duration-100 cursor-pointer rounded-lg"
                            onClick={() => {
                                if (!article.slug) {
                                    if (article.link) {
                                        window.location.href = article.link;
                                    }
                                } else {
                                    router.push(`/article/${article.slug}`)
                                }
                            }}
                        >
                            <div className="flex mb-2">
                                <img className="w-8 h-8 mr-4 rounded-full" alt="avater" src={article.author.avaterImage || ''} />
                                <div>{article.author.name}</div>
                            </div>
                            <div className="text-lg font-bold mb-2">{article.title}</div>
                            <div className="mb-2">{article.pubishDate && dayjs(article.pubishDate).format('YYYY.MM.DD')}</div>
                            {/* <div className="text-gray-700 text-sm mb-2">{article.contentSnippet}</div> */}
                            <div className="flex">
                                <img className="w-4 h-4 my-auto mr-2" alt="favicon" src={`http://www.google.com/s2/favicons?domain=${article.domain}`} />
                                <div>{article.domain || 'VALUES TECH BLOG'}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-right mt-2">
                    <Link href={'/articles'}>{'More Articles ->'}</Link>
                </div>
                <h2 className="text-center text-3xl font-bold my-8">Members</h2>
                <div className="container grid grid-cols-8 gap-6">
                    {members.map((member) => (
                        <div
                            className="mb-2 text-center cursor-pointer"
                            onClick={() => {
                                router.push(`/member/${member.slug}`)
                            }}
                        >
                            <div className="text-center">
                                <img className="w-16 h-16 mx-auto rounded-full" alt="member" src={member.avaterImage || ''} />
                            </div>
                            <div className="font-semibold">{member.name}</div>
                            <div className="text-xs">{member.job}</div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<{ articles: ArticleInfo[], members: MemberInfo[] }> = async () => {
    const authors = await getAuthors();
    const feedArticles = await getFeedArticles(authors);
    const articles = await getArticles();
    const allArticles = [...feedArticles, ...articles].sort((a, b) => (dayjs(b.pubishDate || '').diff(dayjs(a.pubishDate || ''))));
    return {
        props: {
            articles: allArticles,
            members: authors
        }
    }
};
export default Index;
