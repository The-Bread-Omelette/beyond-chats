import { Grid } from '@mui/material';
import ArticleCard from './ArticleCard';

const ArticleList = ({ articles, onView, onEnhance, onLocalEnhance, onRevert }) => {
  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid item xs={12} sm={6} md={4} key={article._id}>
          <ArticleCard
            article={article}
            onView={onView}
            onEnhance={onEnhance}
            onLocalEnhance={onLocalEnhance}
            onRevert={onRevert}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ArticleList;