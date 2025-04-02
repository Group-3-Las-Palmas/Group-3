import models from "../models/index.js";

const { Comment, User, Exercise } = models;

//Get comments
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      attributes: ["id", "content", "create_at", "user_id", "exercise_id"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Exercise,
          attributes: ["title"],
        },
      ],
      order: [["create_at", "DESC"]],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get a comment by id
export const getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByPk(id, {
      attributes: ["id", "content", "create_at", "user_id", "exercise_id"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Exercise,
          attributes: ["title"],
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving comment" });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  if (!req.user || !req.user.user_id) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const { content, exercise_id } = req.body;
  const userId = req.user.user_id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content is required." });
  }

  try {
    // Validate if exercise exists
    const exerciseExists = await Exercise.findByPk(exercise_id);
    if (!exerciseExists) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const newComment = await Comment.create({
      user_id: userId,
      exercise_id,
      content: content.trim(),
    });

    res.status(201).json({
      id: newComment.id,
      user_id: newComment.user_id,
      exercise_id: newComment.exercise_id,
      content: newComment.content,
      create_at: newComment.create_at,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating comment" });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  if (!req.user || !req.user.user_id) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.user_id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment content cannot be empty." });
  }

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({
        message: "Forbidden: You can only update your own comments.",
      });
    }

    const updatedComment = await comment.update({ content: content.trim() });

    res.status(200).json({
      id: updatedComment.id,
      user_id: updatedComment.user_id,
      exercise_id: updatedComment.exercise_id,
      content: updatedComment.content,
      create_at: updatedComment.create_at,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating comment." });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  if (!req.user || !req.user.user_id) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const { id } = req.params;
  const userId = req.user.user_id;

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({
        message: "Forbidden: You can only delete your own comments.",
      });
    }

    await Comment.destroy({ where: { id } });

    res.status(200).json({ message: `Comment with ID ${id} successfully deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};
