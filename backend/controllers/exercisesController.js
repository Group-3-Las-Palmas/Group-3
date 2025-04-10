import models from "../models/index.js";
import sequelize from "../db.js";

const { Exercise } = models;

// Get all exercises
export const getExercises = async (req, res) => {
  const userId = req.user?.user_id; // Obtener userId si el usuario está autenticado

  try {
    const queryOptions = {
      attributes: [
          "exercise_id",
          "title",
          "description",
          "time",
          "category",
          "goal",
          ...(userId ? [
              [
                  sequelize.literal(`(
                      SELECT is_favourite
                      FROM user_exercises AS ue
                      WHERE ue.exercise_id = Exercise.exercise_id
                      AND ue.user_id = ${sequelize.escape(userId)}
                  )`),
                  'is_favourite_for_user'
              ]
          ] : [])
      ],
    };

    const exercises = await Exercise.findAll(queryOptions);

    const processedExercises = exercises.map(ex => {
        const plainEx = ex.get({ plain: true });
        plainEx.is_favourite = !!plainEx.is_favourite_for_user;
        delete plainEx.is_favourite_for_user;
        return plainEx;
    });


    res.json(processedExercises);
  } catch (error) {
    console.error("Error fetching exercises with favourite status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get exercise by id
export const getExerciseById = async (req, res) => {
  const { id } = req.params;

  try {
    const exercise = await Exercise.findByPk(id, {
      attributes: ["exercise_id", "title", "description", "time", "category", "goal"],
    });

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving exercise" });
  }
};

// Create new exercise
export const createExercise = async (req, res) => {
  const { title, description, time, category, goal } = req.body;

  if (!title || !description || !time || !category || !goal) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newExercise = await Exercise.create({
      title: title.trim(),
      description: description.trim(),
      time,
      category: category.trim(),
      goal: goal,
    });

    res.status(201).json(newExercise);
  } catch (error) {
    res.status(500).json({ error: "Error creating exercise" });
  }
};

// Update exercise
export const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { title, description, time, category, goal } = req.body;

  try {
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    const updatedExercise = await exercise.update({
      title: title ? title.trim() : exercise.title,
      description: description ? description.trim() : exercise.description,
      time: time !== undefined ? time : exercise.time,
      category: category ? category.trim() : exercise.category,
      goal: goal ? goal : exercise.goal,
    });

    res.status(200).json(updatedExercise);
  } catch (error) {
    res.status(500).json({ error: "Error updating exercise." });
  }
};

// Remove exercise
export const deleteExercise = async (req, res) => {
  const { id } = req.params;

  try {
    const exercise = await Exercise.findByPk(id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    await Exercise.destroy({ where: { exercise_id: id } });

    res.status(200).json({ message: `Exercise with ID ${id} successfully deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting exercise" });
  }
};