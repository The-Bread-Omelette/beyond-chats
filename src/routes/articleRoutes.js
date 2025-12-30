import express from 'express';
import Article from '../models/Article.js';

const router=express.Router();

router.post('/',async(req,res)=>{
  const article=await Article.create(req.body);
  res.status(201).json(article);
});

router.get('/',async(req,res)=>{
  const articles=await Article.find().sort({createdAt:1});
  res.json(articles);
});

router.get('/:id',async(req,res)=>{
  const article=await Article.findById(req.params.id);
  if(!article)return res.sendStatus(404);
  res.json(article);
});

router.put('/:id',async(req,res)=>{
  const article=await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  );
  res.json(article);
});

router.delete('/:id',async(req,res)=>{
  await Article.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
