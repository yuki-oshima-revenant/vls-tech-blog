import { ArticleInfo, MemberInfo } from '@/lib/types';
import Parser from 'rss-parser';
import dayjs from 'dayjs';

export const getFeedArticles = async (members: MemberInfo[]) => {
    const articles: ArticleInfo[] = [];
    for (const member of members) {
        if (!member.feedUrls) continue;
        for (const [i, rssFeedUrl] of member.feedUrls.entries()) {
            const parser = new Parser({});
            const feed = await parser.parseURL(rssFeedUrl);
            feed.items.forEach((item) => {
                articles.push(
                    {
                        domain: feed.link?.replace(/https?:\/\//, '') || null,
                        author: member,
                        title: item.title || null,
                        link: item.link || null,
                        body: item.contentSnippet || null,
                        pubishDate: item.pubDate || null,
                        lastModifiedDate: item.isoDate || null,
                        id: null,
                        slug: null
                    }
                )
            });
        }
    }
    return articles;
}