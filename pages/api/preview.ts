import { NextApiHandler } from 'next';
import {getPreviewArticle} from '@/lib/contentful';

const Preview: NextApiHandler = async (req, res) => {
    const {secret, slug} = req.query;
    if (secret !== process.env.PREVIEW_ACCESS_TOKEN) {
        return res.status(401).json({ message: 'Invalid token' })
    }
    if(!slug || typeof slug !== 'string'){
        return res.status(401).json({ message: 'Invalid slug' })
    }

    const post = await getPreviewArticle(slug);

    if (!post) {
        return res.status(401).json({ message: 'Invalid slug' });
    }

    res.setPreviewData({});
    res.redirect(`/article/${post.slug}`);
};

export default Preview;
