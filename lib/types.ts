type Nullable<T> = T | null;

export type ArticleInfo = {
    domain: Nullable<string>,
    author: MemberInfo,
    title: Nullable<string>,
    link: Nullable<string>,
    body: Nullable<string>,
    pubishDate: Nullable<string>,
    lastModifiedDate: Nullable<string>,
    id: Nullable<string>,
    slug: Nullable<string>,
};

export type MemberInfo = {
    name: Nullable<string>,
    avaterImage: Nullable<string>,
    profile: Nullable<string>,
    feedUrls: Nullable<string[]>,
    job: Nullable<string>,
    slug:string
};
