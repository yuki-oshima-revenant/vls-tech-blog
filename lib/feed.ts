import { ArticleInfo, MemberInfo } from '@/lib/types';
import Parser from 'rss-parser';

export const getFeedArticles = async (members: MemberInfo[]) => {
    const articles: ArticleInfo[] = [];
    const feeds: {
        member: MemberInfo,
        feedParser: Promise<{
            items: {
                title?: string,
                link?: string,
                contentSnippet?: string,
                pubDate?: string,
                isoDate?: string
            }[], link?: string
        }>
    }[] = [];
    for (const member of members) {
        if (!member.feedUrls) continue;
        for (const [i, rssFeedUrl] of member.feedUrls.entries()) {
            const parser = new Parser({});
            feeds.push({
                member,
                feedParser: parser.parseURL(rssFeedUrl)
            })
        }
    }
    const feedContents = await Promise.all(feeds.map((feed) => feed.feedParser));
    feedContents.forEach((feed, i) => {
        feed.items.forEach((item) => {
            articles.push(
                {
                    domain: feed.link?.replace(/https?:\/\//, '') || null,
                    author: feeds[i].member,
                    title: item.title || null,
                    link: item.link || null,
                    body: item.contentSnippet || null,
                    pubishDate: item.pubDate || null,
                    lastModifiedDate: item.isoDate || null,
                    id: null,
                    slug: null
                }
            )
        })
    })
    return articles;
}