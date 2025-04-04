import models from "../models/index.js";

const { UserExercise } = models;

//Get all userExercises
export const getUserExercises = async (req, res) => {
  try {
    const userExercises = await UserExercise.findAll({
      attributes: ["id", "user_id", "exercise_id", "completed_times", "is_favourite"],
    });
    res.json(userExercises);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get userExercise by id
export const getUserExerciseById = async (req, res) => {
  const { id } = req.params;

  try {
    const userExercise = await UserExercise.findByPk(id, {
      attributes: ["id", "user_id", "exercise_id", "completed_times", "is_favourite"],
    });

    if (!userExercise) {
      return res.status(404).json({ message: "User exercise not found" });
    }

    res.json(userExercise);
  } catch (error) {
    res.status(500).json({ error: "Error getting user exercise" });
  }
};

//Create a new userExercise
export const createUserExercise = async (req, res) => {
    const { user_id, exercise_id, completed_times, is_favourite } = req.body;
  
    if (!user_id || !exercise_id) {
      return res.status(400).json({ error: "User ID and Exercise ID are required." });
    }
  
    try {
      //Validate user and exercise exists
      const userExists = await User.findByPk(user_id);
      const exerciseExists = await Exercise.findByPk(exercise_id);
  
      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (!exerciseExists) {
        return res.status(404).json({ error: "Exercise not found" });
      }
  
      const userExercise = await UserExercise.create({
        user_id,
        exercise_id,
        completed_times: completed_times || 1,
        is_favourite: is_favourite || false,
      });
  
      res.status(201).json(userExercise);
    } catch (error) {
      res.status(500).json({ error: "Error creating user exercise" });
    }
  };

//Update userExercise
export const updateUserExercise = async (req, res) => {
  const { id } = req.params;
  const { completed_times, is_favourite } = req.body;

  try {
    const userExercise = await UserExercise.findByPk(id);

    if (!userExercise) {
      return res.status(404).json({ message: "User exercise not found" });
    }

    const updateFields = {};
    if (completed_times !== undefined) updateFields.completed_times = completed_times;
    if (is_favourite !== undefined) updateFields.is_favourite = is_favourite;

    const updatedUserExercise = await userExercise.update(updateFields);

    res.status(200).json(updatedUserExercise);
  } catch (error) {
    res.status(500).json({ error: "Error updating user exercise" });
  }
};

//Remove a userExercise
export const deleteUserExercise = async (req, res) => {
  const { id } = req.params;

  try {
    const userExercise = await UserExercise.findByPk(id);

    if (!userExercise) {
      return res.status(404).json({ message: "User exercise not found" });
    }

    await UserExercise.destroy({ where: { id } });

    res.status(200).json({ message: `User exercise with ID ${id} correctly deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user exercise" });
  }
};
