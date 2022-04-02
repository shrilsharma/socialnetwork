const express = require('express')
const User = require('../models/User');
const Post = require('../models/Post');
const PostLike = require('../models/PostLike');
const commentRoute = require('./commentRoute')

const router = express.Router();

router.use('/comment', commentRoute);

router.get('/', async (req, res) => {
  const posts = await Post.findAll();
  if (posts.length == 0) return res.json('No Post found!!');
  res.send(posts);
})

router.get('/:id', async (req, res) => {
  const post = await Post.findAll({ where: { id: req.params.id } });
  if (post.length == 0) return res.json('No Post found!!');
  res.send(post);
})

router.post('/create', async (req, res) => {
  //validate params
  if (!req.body.title) {
    return res.status(400).json('Title is mandatory');
  }
  if (!req.body.content) {
    return res.status(400).json('Content is mandatory');
  }
  if (!req.body.userId) {
    return res.status(400).json('User Id is mandatory');
  }
  if (req.body.title.length > 20) {
    return res.status(400).json('Title length should be less than 20');
  }
  if (req.body.title.length > 100) {
    return res.status(400).json('Title length should be less than 20');
  }
  if (!/^([0-9])/.test(req.body.userId)) {
    return res.status(400).json('UserId should be integer');
  }

  //create post
  const newPost = await Post.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.body.userId
  }).catch(err => {
    console.log('error ', err)
  })

  //response
  res.send(newPost);

})

router.put('/update/:id', async (req, res) => {
  //validation
  if (!req.body.userId) {
    return res.status(400).json('Please pass user id');
  }
  if (!/^([0-9])/.test(req.body.userId)) {
    return res.status(400).json('UserId should be integer');
  }
  if (req.body.title && req.body.title.length === 0) {
    return res.status(400).json('Pass something in title');
  }
  if (req.body.content && req.body.content.length === 0) {
    return res.status(400).json('Pass something in content');
  }
  if (req.body.title && req.body.title.length > 20) {
    return res.status(400).json('Title length should be less than 20');
  }
  if (req.body.content && req.body.content.length > 100) {
    return res.status(400).json('Content length should be less than 100');
  }
  try {
    //check user
    const post = await Post.findAll({ where: { id: req.params.id } });
    if (post.length === 0) return res.status(400).json('Post not Exist!!');

    if (req.body.userId && post.length !== 0 && post[0].dataValues.userId !== parseInt(req.body.userId))
      return res.status(400).json('User id mismatch');

    //update
    const updatedpost = await Post.update(
      { ...req.body },
      { where: { id: req.params.id } }
    )

    //response
    res.json('Post updated successfully');
  } catch (error) {
    return res.status(500).json(error);
  }

})

router.delete('/remove/:id', async (req, res) => {
  try {
    //validation
    if (!req.body.userId) {
      return res.status(400).json('Please pass user id');
    }
    if (!/^([0-9])/.test(req.body.userId)) {
      return res.status(400).json('UserId should be integer');
    }

    const post = await Post.findAll({ where: { id: req.params.id } });
    if (post.length === 0) return res.status(400).json('Post not Exist!!');

    if (req.body.userId && post.length !== 0 && post[0].dataValues.userId !== parseInt(req.body.userId))
      return res.status(400).json('User id mismatch');

    //delete
    const deletePost = await Post.destroy({ where: { id: req.params.id } });

    //response
    res.json("Post Deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
})

router.post('/like/:id', async (req, res) => {
  try {
    //validation
    if (!req.body.userId) {
      return res.status(400).json('Please pass user id');
    }
    if (!/^([0-9])/.test(req.body.userId)) {
      return res.status(400).json('UserId should be integer');
    }
    if (!/^([0-9])/.test(req.params.id)) {
      return res.status(400).json('Post id should be integer');
    }
    // if (!req.body.action) {
    //   return res.status(400).json('Please pass like action');
    // }
    if (!(req.body.action === true || req.body.action === false)) {
      return res.status(400).json('Please pass correct action value');
    }

    //check user
    const user = await User.findAll({ where: { id: req.body.userId } });
    if (user.length === 0) return res.status(400).json('User not Exist!!');

    //finding post
    const post = await Post.findAll({ where: { id: req.params.id } });
    if (post.length === 0) return res.status(400).json('Post not Exist!!');

    //adding like/unlike
    if (req.body.action) {
      await PostLike.create({
        userId: req.body.userId,
        postId: req.params.id
      });
    } else {
      await PostLike.destroy({
        where:
        {
          postId: req.params.id,
          userId: req.body.userId
        }
      });
    }

    //response
    res.json(`Post ${req.body.action ? 'Liked' : 'Unliked'} successfully`);
  } catch (error) {
    return res.status(500).json(error);
  }

})

router.get('/like/users/:postId', async (req, res) => {
  //validation
  if (!/^([0-9])/.test(req.params.postId)) {
    return res.status(400).json('Post id should be integer');
  }

  const post = await Post.findAll({ where: { id: req.params.postId } });
  if (post.length == 0) return res.json('No Post found!!');

  User.hasMany(PostLike)
  PostLike.belongsTo(User)

  const users = await PostLike.findAll({
    where: { postId: req.params.postId },
    include: [{
      model: User,
      attributes: ['firstname', 'lastname']
    }]
  })

  //response
  res.send(users);
})

module.exports = router;
