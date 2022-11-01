/**
 * Holds all posts routing logic
 */

const Post = require("../models/post");

/**
 * Create new post and add to db
 */
exports.createPost = (req, res, next) => {
  //get url of incoming request
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    //save to database
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
        //beware of the spread operator! it converts a mongoose object to a
        //complex mongoose object wrapped in _doc property (only this is displayed in real world).
        //https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/learn/lecture/10523234#questions/4851476
        ...createdPost, //spread operator: used to copy attributes of createdPost to post
        id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
}

/**
 * Update / edit a post
 * Get imagepath from request, and if a file is a sent construct imagepath to save
 * Create a new post, then update to database.
 */
exports.updatePost = (req,res,next) => {
  let imagePath = req.body.imagePath;

  if(req.file){ //if a new file is received, update imagePath
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  //patch in database only if creator id is same with authorized user id.
  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post)
  .then(result => {
    //get modifiedCount from the result returned by mongoose updateOne.
    if(result.matchedCount > 0) {
      res.status(200).json({ message: 'Update successful!' });
    } else {
      res.status(401).json({ message: 'Not authorized!' });
    }
  })
  //catch technical errors: eg. unable to connect to database
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
}

/**
 * Get all posts.
 * find() gets all posts
 * Get query parameters for pagination
 * query.any-name-you-specify-as-parameter
 * '+' to convert string to int due to receiving string from req
 */
exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize; //number of pages to display at a time
  const currentPage = +req.query.page; //current page index
  const postQuery = Post.find();
  let fetchedPosts;

  //this method checks for all entries so okay to use for small database, inefficient in large databases.
  //if you're on page 2, you skip 1 page.
  //limit amount of pages we return.
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  //Return number of posts, then send a response.
  //Chaining then(), share variable fetchedPosts between them
  //In response return the maxPosts (current number of posts)
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
}

/**
 * Get a single post
 */
exports.getPost = (req,res,next) => {
  Post.findById(req.params.id).then(post => {
    if(post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    });
  });
}

/**
 * Delete a post
 */
exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.deletedCount > 0) {
      res.status(200).json({ message: 'Deletion successful!' });
    } else {
      res.status(401).json({ message: 'Not authorized!' });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Delete post failed!"
    });
  });
}
