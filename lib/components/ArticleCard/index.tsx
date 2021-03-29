import { ArticleInfo } from "@/lib/types";
import { useRouter } from "next/router";
import dayjs from 'dayjs';
import styles from './index.module.css';

const ArticleCard: React.FunctionComponent<{
    article: ArticleInfo,
    hideAuthor?: boolean,
}> = ({
    article,
    hideAuthor
}) => {
        const router = useRouter();
        return (
            <div
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
                {!hideAuthor && (
                    <div className="flex mb-2">
                        <img className="h-8 mr-4 rounded-full" alt="avater" src={article.author.avaterImage || ''} />
                        <div>{article.author.name}</div>
                    </div>
                )}
                <div className={`text-lg font-bold mb-2 h-20 ${styles.title}`}>{article.title}</div>
                <div className="mb-2">{article.pubishDate && dayjs(article.pubishDate).format('YYYY.MM.DD')}</div>
                {/* <div className="text-gray-700 text-sm mb-2">{article.contentSnippet}</div> */}
                <div className="flex">
                    <img className="w-4 h-4 my-auto mr-2" alt="favicon" src={`http://www.google.com/s2/favicons?domain=${article.domain}`} />
                    <div>{article.domain || 'VALUES TECH BLOG'}</div>
                </div>
            </div>
        )
    };

export default ArticleCard;
