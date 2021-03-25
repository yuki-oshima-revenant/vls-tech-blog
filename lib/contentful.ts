import axios from 'axios';
import { ArticleInfo, MemberInfo } from './types';

type ResponseBase = {
    total: number,
    limit: number,
}

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
} & ResponseBase;

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
} & ResponseBase;

export const getEntries = async <T>(contentType: string, extraParams?: { [k: string]: string }) => {
    const params = new URLSearchParams();
    params.append('access_token', process.env.CONTENT_DELIBVERY_API_TOKEN || '');
    params.append('content_type', contentType);
    if (extraParams) {
        Object.keys(extraParams).forEach((key) => {
            if (key !== 'limit') {
                params.append(key, extraParams[key]);
            }
        });
    }
    params.append('limit', extraParams?.limit || '100');
    const res = await axios.get<T>(
        `https://cdn.contentful.com/spaces/${process.env.SPACE_ID}/environments/master/entries?${params.toString()}`
    );
    return res.data;
}

const convertAuthor = (authors: Authors) => {
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
};


export const getAuthors = async () => {
    const authors = await getEntries<Authors>('author');
    return convertAuthor(authors);
}

export const getOneAuthor = async (slug: string) => {
    const author = await getEntries<Authors>('author', { 'fields.slug': slug });
    const convertedAuthors = convertAuthor(author);
    return convertedAuthors.length > 0 ? convertedAuthors[0] : null
};

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

export const getArticles = async (extraParams?: { [k: string]: string }) => {
    const articles = await getEntries<Articles>('post', extraParams);
    return convertArticles(articles)
};

export const getOneArticle = async (slug: string) => {
    const article = await getEntries<Articles>('post', { 'fields.slug': slug });
    const convertedArticles = convertArticles(article);
    return convertedArticles.length > 0 ? convertedArticles[0] : null;
};

export const getArticlesTotalCount = async () => {
    const article = await getEntries<Articles>('post');
    return article.total;
};
