import React from 'react';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { getAuthors, getArticles } from '@/lib/contentful';
import { ArticleInfo, MemberInfo } from '@/lib/types';
import { getFeedArticles } from '@/lib/feed';
import Layout from '@/lib/components/Layout';
import router from 'next/router';
import Link from 'next/link';
import { getArticleList } from '@/lib/util';
import ArticleGridContainer from '@/lib/components/ArticleGridContainer';
import SectionHeader from '@/lib/components/SectionHeader';

const Index = ({ articles, members }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <Layout>
            <h1 className="text-center text-3xl md:text-5xl font-bold my-8">VALUES TECH BLOG</h1>
            <SectionHeader>New Articles</SectionHeader>
            <ArticleGridContainer
                articles={articles}
            />
            <div className="text-right md:text-lg font-medium mt-2">
                <Link href={'/articles'}>{'More Articles ->'}</Link>
            </div>
            <SectionHeader>Members</SectionHeader>
            <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {members.map((member, i) => (
                    <div
                        className="mb-2 text-center cursor-pointer"
                        onClick={() => {
                            router.push(`/member/${member.slug}`)
                        }}
                        key={`member_${i}`}
                    >
                        <div className="text-center">
                            <img className="w-16 h-16 mx-auto mb-2 rounded-full" alt="member" src={member.avaterImage || ''} />
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
    const [feedArticles, articles] = await Promise.all([
        getFeedArticles(authors),
        getArticles(),
    ])
    return {
        props: {
            articles: getArticleList([...feedArticles, ...articles]).slice(0, 8),
            members: authors
        },
        revalidate: 60
    }
};
export default Index;
