import models from "../models/index.js";

const { Post, User } = models;

// Get all posts (with author username)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["post_id", "content", "create_at", "user_id"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["create_at", "DESC"]],
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new post
export const createPost = async (req, res) => {

  const { content } = req.body;
  const userId = req.user.user_id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Post content is required." });
  }

  try {
    const newPost = await Post.create({
      user_id: userId,
      content: content.trim(),
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
};

// Update post
export const updatePost = async (req, res) => {

  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.user_id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Post content cannot be empty." });
  }

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only update your own posts." });
    }

    const updatedPost = await post.update({ content: content.trim() });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Error updating post." });
  }
};

// Delete post
export const deletePost = async (req, res) => {

  const { postId } = req.params;
  const userId = req.user.user_id;

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    
    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own posts." });
    }

    const result = await Post.destroy({ where: { post_id: postId } });

    if (result === 0) {
      
      return res
        .status(404)
        .json({ message: "Post not found during deletion" });
    }

    res
      .status(200)
      .json({ message: `Post with ID ${postId} successfully deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
};

export const getPostById = async (req, res) => {
  
  const { postId } = req.params;

  console.log("Intentando encontrar post con postId:", postId);
  console.log("Tipo de postId:", typeof postId);

  try {
    const post = await Post.findByPk(postId, {
      attributes: ["post_id", "content", "create_at", "user_id"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
};
