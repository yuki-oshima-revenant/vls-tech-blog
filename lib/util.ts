import { ArticleInfo } from './types';
import dayjs from 'dayjs';

export const getArticleList = (articles: ArticleInfo[]) => {
    const orderedArticles = articles.sort((a, b) => (dayjs(b.pubishDate || '').diff(dayjs(a.pubishDate || ''))));
    return orderedArticles.map((article) => ({ ...article, body: null }))
};
