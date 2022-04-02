const express = require('express')
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const CommentLike = require('../models/CommentLike');

const router = express.Router();

router.get('/:postId', async (req, res) => {

  //check post
  const post = await Post.findAll({ where: { id: req.params.postId } });
  if (post.length === 0) return res.status(400).json('Post not Exist!!');

  //find comments
  const comments = await Comment.findAll({ where: { postId: req.params.postId } });
  if (comments.length == 0) return res.json('No Comments found!!');
  res.send(comments);
})

router.get('/details/:postId/:commentId', async (req, res) => {
  //check post
  const post = await Post.findAll({ where: { id: req.params.postId } });
  if (post.length === 0) return res.status(400).json('Post not Exist!!');

  //find comments
  const comment = await Comment.findAll({
    where:
    {
      id: req.params.commentId,
      postId: req.params.postId
    }
  });
  if (comment.length == 0) return res.json('No Comment found!!');
  res.send(comment);
})

router.post('/create', async (req, res) => {
  //validate params
  if (!req.body.content) {
    return res.status(400).json('Content is mandatory');
  }
  if (!req.body.userId) {
    return res.status(400).json('User Id is mandatory');
  }
  if (!req.body.postId) {
    return res.status(400).json('Post Id is mandatory');
  }
  if (req.body.content.length > 100) {
    return res.status(400).json('Content length should be less than 100');
  }
  if (!/^([0-9])/.test(req.body.userId)) {
    return res.status(400).json('UserId should be integer');
  }
  if (!/^([0-9])/.test(req.body.postId)) {
    return res.status(400).json('Post ID should be integer');
  }

  //check post
  const post = await Post.findAll({ where: { id: req.body.postId } });
  if (post.length === 0) return res.status(400).json('Post not Exist!!');

  //create comment
  const newComment = await Comment.create({
    content: req.body.content,
    userId: req.body.userId,
    postId: req.body.postId
  }).catch(err => {
    console.log('error ', err)
  })

  //response
  res.send(newComment);
})

router.put('/update/:commentId', async (req, res) => {
  //validation
  if (!req.body.userId) {
    return res.status(400).json('Please pass user id');
  }
  if (!/^([0-9])/.test(req.body.userId)) {
    return res.status(400).json('UserId should be integer');
  }
  if (req.body.content && req.body.content.length === 0) {
    return res.status(400).json('Pass something in content');
  }
  if (req.body.content && req.body.content.length > 100) {
    return res.status(400).json('Content length should be less than 100');
  }

  try {
    //check comment
    const comment = await Comment.findAll({ where: { id: req.params.commentId } });
    if (comment.length == 0) return res.json('No Comment found!!');

    //check user
    if (req.body.userId && comment.length !== 0 && comment[0].dataValues.userId !== parseInt(req.body.userId))
      return res.status(400).json('User id mismatch');

    let toUpdate = {}
    if (req.body.content) toUpdate.content = req.body.content;

    //update
    const updatedComment = await Comment.update(
      { ...toUpdate },
      { where: { id: req.params.commentId } }
    )

    //response
    res.json('Comment updated successfully');
  } catch (error) {
    return res.status(500).json(error);
  }

})

router.delete('/remove/:commentId', async (req, res) => {
  try {
    //validation
    if (!req.body.userId) {
      return res.status(400).json('Please pass user id');
    }
    if (!/^([0-9])/.test(req.body.userId)) {
      return res.status(400).json('UserId should be integer');
    }

    //check comment
    const comment = await Comment.findAll({ where: { id: req.params.commentId } });
    if (comment.length == 0) return res.json('No Comment found!!');

    if (req.body.userId && comment.length !== 0 && comment[0].dataValues.userId !== parseInt(req.body.userId))
      return res.status(400).json('User id mismatch');

    //delete
    const deleteComment = await Comment.destroy({ where: { id: req.params.commentId } });

    //response
    res.json("Comment Deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
})

router.post('/like/:commentId', async (req, res) => {
  try {
    //validation
    if (!req.body.userId) {
      return res.status(400).json('Please pass user id');
    }
    if (!/^([0-9])/.test(req.body.userId)) {
      return res.status(400).json('UserId should be integer');
    }
    if (!(req.body.action === true || req.body.action === false)) {
      return res.status(400).json('Please pass correct action value');
    }

    //check user
    const user = await User.findAll({ where: { id: req.body.userId } });
    if (user.length === 0) return res.status(400).json('User not Exist!!');

    //check comment
    const comment = await Comment.findAll({ where: { id: req.params.commentId } });
    if (comment.length == 0) return res.json('No Comment found!!');

    //adding like/unlike
    if (req.body.action) {
      await CommentLike.create({
        userId: req.body.userId,
        commentId: req.params.commentId
      });
    } else {
      await CommentLike.destroy({
        where:
        {
          commentId: req.params.commentId,
          userId: req.body.userId
        }
      });
    }

    //response
    res.json(`Comment ${req.body.action ? 'Liked' : 'Unliked'} successfully`);
  } catch (error) {
    return res.status(500).json(error);
  }

})

router.get('/like/users/:commentId', async (req, res) => {
  //validation
  if (!/^([0-9])/.test(req.params.commentId)) {
    return res.status(400).json('Comment id should be integer');
  }

  //check comment
  const comment = await Comment.findAll({ where: { id: req.params.commentId } });
  if (comment.length == 0) return res.json('No Comment found!!');

  User.hasMany(CommentLike)
  CommentLike.belongsTo(User)

  const users = await CommentLike.findAll({
    where: { commentId: req.params.commentId },
    include: [{
      model: User,
      attributes: ['firstname', 'lastname']
    }]
  })

  //response
  res.send(users);
})

router.get('/users/:postId', async (req, res) => {
  //validation
  if (!/^([0-9])/.test(req.params.postId)) {
    return res.status(400).json('Post id should be integer');
  }

  //check post
  const post = await Post.findAll({ where: { id: req.params.postId } });
  if (post.length == 0) return res.json('No Post found!!');

  Post.hasMany(Comment)
  Comment.belongsTo(Post)

  User.hasMany(Comment)
  Comment.belongsTo(User)

  const users = await Post.findAll({
    where: { id: req.params.postId },
    include: [{
      model: Comment,
      attributes: ['userID'],
      include: [{
        model: User,
        attributes: ['firstname', 'lastname'],

      }]
    }]
  })

  //response
  res.send(users);
})

module.exports = router;
