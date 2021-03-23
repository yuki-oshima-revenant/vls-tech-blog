import axios from 'axios';
import { ArticleInfo, MemberInfo } from './types';

type CommonSysInfo = {
    type: string,
    id: string
};

type ItemSysInfo = {
    createdAt: string,
    updatedAt: string,
} & CommonSysInfo;

type AuthorInfo = {
    sys: ItemSysInfo,
    fields: {
        name: string,
        avatar?: {
            sys: CommonSysInfo
        },
        profile?: string,
        feed?: {
            sys: CommonSysInfo
        }[],
        job?: string,
        slug: string,
    }
};

type AvatarInfo = {
    sys: ItemSysInfo,
    fields: {
        title: string,
        file: {
            url: string,
            contentType: string,
        }
    }
};

export type Authors = {
    items: AuthorInfo[],
    includes: {
        Entry: {
            sys: ItemSysInfo,
            contentType: {
                sys: CommonSysInfo
            }
            fields: {
                title: string,
                feedUrl: string,
            }
        }[],
        Asset: AvatarInfo[]
    }
};

export type Articles = {
    items: {
        sys: ItemSysInfo,
        fields: {
            title: string,
            body: string,
            author: {
                sys: CommonSysInfo
            },
            slug: string,
        }
    }[],
    includes: {
        Entry: AuthorInfo[],
        Asset: AvatarInfo[]
    }
}

export const getEntries = async <T>(contentType: string, entryId?: string) => {
    const params = new URLSearchParams();
    params.append('access_token', process.env.CONTENT_DELIBVERY_API_TOKEN || '');
    params.append('content_type', contentType);
    params.append('limit', '100');
    const entryIdPath = entryId ? `/${entryId}` : '';
    const res = await axios.get<T>(
        `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries${entryIdPath}?${params.toString()}`
    );
    return res.data;
}

export const getAuthors = async () => {
    const authors = await getEntries<Authors>('author');

    const formattedAuthors: MemberInfo[] = authors.items.map((item) => {
        const imageUrl = authors.includes.Asset.find((asset) => (asset.sys.id === item.fields.avatar?.sys.id))?.fields.file.url;
        const feedIds = item.fields.feed?.map((f) => f.sys.id);
        const feedUrls = authors.includes.Entry.filter((entry) => (feedIds?.includes(entry.sys.id))).map((f) => f.fields.feedUrl);
        return {
            name: item.fields.name,
            profile: item.fields.profile || null,
            avaterImage: `https:${imageUrl}` || null,
            feedUrls: feedUrls || null,
            job: item.fields.job || null,
            slug: item.fields.slug,
        };
    });

    return formattedAuthors;
}

const convertArticles = (articles: Articles) => {
    const formattedArticles: ArticleInfo[] = articles.items.map((article) => {
        const authorInfo = articles.includes.Entry.find((entry) => (entry.sys.id === article.fields.author.sys.id));
        const avatarInfo = articles.includes.Asset.find((asset) => asset.sys.id === authorInfo?.fields.avatar?.sys.id);
        return {
            domain: null,
            author: {
                name: authorInfo?.fields.name || null,
                avaterImage: avatarInfo?.fields.file.url || null,
                profile: authorInfo?.fields.profile || null,
                feedUrls: null,
                job: authorInfo?.fields.job || null,
                slug: authorInfo?.fields.slug || '',
            },
            title: article.fields.title,
            link: null,
            body: article.fields.body,
            pubishDate: article.sys.createdAt,
            lastModifiedDate: article.sys.updatedAt,
            id: article.sys.id,
            slug: article.fields.slug,
        }
    });
    return formattedArticles;
}

export const getArticles = async () => {
    const articles = await getEntries<Articles>('post');
    return convertArticles(articles)
};

export const getOneArticle = async (id: string) => {
    const article = await getEntries<Articles>('post', id);
    return convertArticles(article)
};
