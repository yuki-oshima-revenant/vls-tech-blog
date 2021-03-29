import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAuthors, getArticles } from '@/lib/contentful';
import { ArticleInfo, MemberInfo } from '@/lib/types';
import { getFeedArticles } from '@/lib/feed';
import Layout from '@/lib/components/Layout';
import router from 'next/router';
import Link from 'next/link';
import { getArticleList } from '@/lib/util';
import ArticleCard from '@/lib/components/ArticleCard';

const Index = ({ articles, members }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            <h1 className="text-center text-5xl font-bold my-8">VALUES TECH BLOG</h1>
            <h2 className="text-center text-3xl font-bold my-8 border-0">New Articles</h2>
            <div className="container grid grid-cols-4 gap-6">
                {articles.map((article, i) => (
                    <ArticleCard article={article} key={`article_${i}`} />
                ))}
            </div>
            <div className="text-right text-lg font-medium mt-2">
                <Link href={'/articles'}>{'More Articles ->'}</Link>
            </div>
            <h2 className="text-center text-3xl font-bold my-8 border-0">Members</h2>
            <div className="container grid grid-cols-8 gap-6">
                {members.map((member, i) => (
                    <div
                        className="mb-2 text-center cursor-pointer"
                        onClick={() => {
                            router.push(`/member/${member.slug}`)
                        }}
                        key={`member_${i}`}
                    >
                        <div className="text-center">
                            <img className="w-16 h-16 mx-auto rounded-full" alt="member" src={member.avaterImage || ''} />
                        </div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-xs">{member.job}</div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps<{ articles: ArticleInfo[], members: MemberInfo[] }> = async () => {
    const authors = await getAuthors();
    const feedArticles = await getFeedArticles(authors);
    const articles = await getArticles();
    return {
        props: {
            articles: getArticleList([...feedArticles, ...articles]).slice(0, 8),
            members: authors
        },
        revalidate: 60
    }
};
export default Index;
