import mongoose from 'mongoose';

const ArticleSchema=new mongoose.Schema(
  {
    title:{type:String,required:true},
    url:{type:String,required:true,unique:true},
    excerpt:String,
    content:String,
    publishedAt:Date
  },
  {timestamps:true}
);

export default mongoose.model('Article',ArticleSchema);
