import ArticleCard from '@/lib/components/ArticleCard';
import { ArticleInfo } from '@/lib/types';

const ArticleGridContainer: React.FunctionComponent<{
    articles?: ArticleInfo[],
    hideAuthor?: boolean,
}> = ({
    articles,
    hideAuthor
}) => {
        return (
            <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {articles?.map((article, i) => (
                    <ArticleCard article={article} key={`article_${i}`} hideAuthor={hideAuthor} />
                ))}
            </div>
        )

    };
export default ArticleGridContainer;
