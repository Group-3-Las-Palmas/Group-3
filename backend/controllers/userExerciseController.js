import models from "../models/index.js";
import { Op } from "sequelize";

const { UserExercise, User, Exercise, Reward } = models;

//Get all userExercises
export const getUserExercises = async (req, res) => {
  try {
    const userExercises = await UserExercise.findAll({
      attributes: [
        "id",
        "user_id",
        "exercise_id",
        "completed_times",
        "is_favourite",
      ],
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
      attributes: [
        "id",
        "user_id",
        "exercise_id",
        "completed_times",
        "is_favourite",
      ],
    });

    if (!userExercise) {
      return res.status(404).json({ message: "User exercise not found" });
    }

    res.json(userExercise);
  } catch (error) {
    res.status(500).json({ error: "Error getting user exercise" });
  }
};

//Get favourites exercises by user id
export const getFavouritesByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const favourites = await UserExercise.findAll({
      where: {
        user_id: userId,
        is_favourite: true,
      },
      include: [
        {
          model: Exercise,
          attributes: [
            "exercise_id",
            "title",
            "description",
            "time",
            "category",
          ],
        },
      ],
    });

    res.json(favourites);
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({ error: "Error fetching favourite exercises" });
  }
};

//Create a new userExercise
export const createUserExercise = async (req, res) => {
  const { user_id, exercise_id, completed_times, is_favourite } = req.body;

  if (!user_id || !exercise_id) {
    return res
      .status(400)
      .json({ error: "User ID and Exercise ID are required." });
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
      completed_times: completed_times || 0,
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
    if (completed_times !== undefined)
      updateFields.completed_times = completed_times;
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

    res
      .status(200)
      .json({ message: `User exercise with ID ${id} correctly deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user exercise" });
  }
};

export const completeExercise = async (req, res) => {
  console.log("--- completeExercise Controller Hit ---"); // Log inicial
  const userId = req.user?.user_id;
  const { exerciseId } = req.body;

  console.log(`Received userId: ${userId}, exerciseId: ${exerciseId}`); // Log datos

  if (!userId) {
    console.error("User ID not found in request token.");
    return res
      .status(401)
      .json({ error: "Authentication error: User ID missing." });
  }
  if (!exerciseId) {
    console.error("Exercise ID not provided in request body.");
    return res.status(400).json({ error: "Exercise ID is required." });
  }

  try {
    console.log(`Finding exercise with ID: ${exerciseId}`);
    const exercise = await Exercise.findByPk(exerciseId, {
      attributes: ["exercise_id", "goal"],
    });

    if (!exercise) {
      console.error(`Exercise with ID ${exerciseId} not found.`);
      return res.status(404).json({ message: "Exercise not found" });
    }
    console.log(`Exercise ${exerciseId} found. Goal: ${exercise.goal}`);

    console.log(
      `Finding UserExercise for userId: ${userId}, exerciseId: ${exerciseId}`
    );
    let userExercise = await UserExercise.findOne({
      where: { user_id: userId, exercise_id: exerciseId },
    });

    let completedTimes = 0;
    if (userExercise) {
      console.log(
        `Found existing UserExercise. Current times: ${userExercise.completed_times}`
      );
      userExercise.completed_times += 1;
      console.log(
        `Attempting to save UserExercise with completed_times: ${userExercise.completed_times}`
      );
      await userExercise.save(); // Guardar UserExercise
      await userExercise.reload(); // Recargar UserExercise
      completedTimes = userExercise.completed_times;
      console.log(
        `UserExercise SAVED successfully. New completed_times: ${completedTimes}`
      );
    } else {
      console.log(`No UserExercise found. Attempting to create...`);
      userExercise = await UserExercise.create({
        // Crear UserExercise
        user_id: userId,
        exercise_id: exerciseId,
        completed_times: 1,
        is_favourite: false,
      });
      completedTimes = userExercise.completed_times;
      console.log(
        `UserExercise CREATED successfully. Completed_times: ${completedTimes}`
      );
    }

    let rewardEarned = false;
    if (exercise.goal && exercise.goal > 0 && completedTimes >= exercise.goal) {
      rewardEarned = true;
      // Log extra para confirmar entrada al bloque
      console.log(
        `---> Goal condition met! completedTimes (${completedTimes}) >= goal (${exercise.goal}) <---`
      );
      console.log(
        `User ${userId} reached goal for exercise ${exerciseId}! Checking for reward...`
      );

      // 1. Buscar el Reward asociado al Exercise
      const reward = await Reward.findOne({
        where: { exercise_id: exerciseId },
      });

      if (reward) {
        console.log(
          `Reward found (ID: ${reward.reward_id}). Attempting to update user ${userId}...`
        );
        // 2. Buscar al usuario
        const user = await User.findByPk(userId);
        if (user) {
          // Log antes de guardar
          console.log(`Updating user.last_reward_id to ${reward.reward_id}`);
          // 3. Actualizar la columna last_reward_id
          user.last_reward_id = reward.reward_id;
          // 4. Guardar explícitamente SOLO ese campo en el usuario
          await user.save({ fields: ["last_reward_id"] }); // <-- Guardado explícito del campo
          console.log(
            `User ${userId} save attempt finished for last_reward_id: ${reward.reward_id}. Reloading...`
          );
          // Recargar para verificar (opcional pero bueno para depurar)
          try {
            await user.reload();
            console.log(
              `User ${userId} updated and reloaded. Current last_reward_id in model: ${user.last_reward_id}`
            );
          } catch (reloadError) {
            console.error("Error reloading user after save:", reloadError);
          }
        } else {
          console.error(
            `User ${userId} not found when trying to update last_reward_id.`
          );
        }
      } else {
        console.log(
          `Goal reached for exercise ${exerciseId}, but no reward is associated with it.`
        );
      }
    }

    console.log("Sending success response to frontend.");
    res.status(200).json({
      message: "Exercise completion logged successfully.",
      completedTimes: completedTimes,
      goal: exercise.goal,
      rewardEarned: rewardEarned,
      userExercise: userExercise,
    });
  } catch (error) {
    console.error("!!! ERROR inside completeExercise controller:", error);
    res
      .status(500)
      .json({
        error:
          "Server error logging exercise completion or updating user reward",
      });
  }
};

export const toggleFavourite = async (req, res) => {
  const userId = req.user?.user_id;
  const { exerciseId } = req.body; // Espera exerciseId en el body

  console.log(`--- toggleFavourite Controller Hit --- User: ${userId}, Exercise: ${exerciseId}`);

  if (!userId) {
    console.error("User ID not found in token for toggleFavourite.");
    return res.status(401).json({ error: "Authentication error: User ID missing." });
  }
  if (!exerciseId) {
    console.error("Exercise ID not provided in body for toggleFavourite.");
    return res.status(400).json({ error: "Exercise ID is required." });
  }

  try {
    // Buscar si ya existe una entrada UserExercise
    let userExercise = await UserExercise.findOne({
      where: {
        user_id: userId,
        exercise_id: exerciseId,
      },
    });

    let newIsFavouriteStatus;

    if (userExercise) {
      // Si existe, invierte el valor de is_favourite
      userExercise.is_favourite = !userExercise.is_favourite;
      await userExercise.save();
      newIsFavouriteStatus = userExercise.is_favourite;
      console.log(`Toggled favourite for UserExercise ${userExercise.id} to ${newIsFavouriteStatus}`);
    } else {
      // Si no existe, crea una nueva entrada marcada como favorita
      // Nota: Asumimos que marcar como favorito no cuenta como completado.
      console.log(`Creating new UserExercise for favourite toggle. User: ${userId}, Exercise: ${exerciseId}`);
      userExercise = await UserExercise.create({
        user_id: userId,
        exercise_id: exerciseId,
        completed_times: 0, // O 1 si prefieres que cuente como completado
        is_favourite: true,   // Se crea como favorito
      });
      newIsFavouriteStatus = userExercise.is_favourite; // Será true
      console.log(`Created new UserExercise ${userExercise.id} as favourite.`);
    }

    res.status(200).json({
      message: "Favourite status toggled successfully.",
      is_favourite: newIsFavouriteStatus,
      userExercise: userExercise // Devuelve el registro actualizado/creado
    });

  } catch (error) {
    console.error("!!! ERROR inside toggleFavourite controller:", error);
    res.status(500).json({ error: "Server error toggling favourite status" });
  }
};