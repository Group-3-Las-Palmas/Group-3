import models from "../models/index.js";

const { Reward, Exercise } = models;

//Get all rewards
export const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.findAll({
      attributes: ["id", "name", "badge", "earned_at", "exercise_id"],
      include: [
        {
          model: Exercise,
          attributes: ["title"], // Exercise title
        },
      ],
      order: [["earned_at", "DESC"]],
    });
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get reward by id
export const getRewardById = async (req, res) => {
  const { id } = req.params;

  try {
    const reward = await Reward.findByPk(id, {
      attributes: ["id", "name", "badge", "earned_at", "exercise_id"],
      include: [
        {
          model: Exercise,
          attributes: ["title"],
        },
      ],
    });

    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    res.json(reward);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving reward" });
  }
};

// Create a new reward
export const createReward = async (req, res) => {
  const { name, badge, exercise_id } = req.body;

  if (!name || !badge || !exercise_id) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    //Validate if exercise exists
    const exerciseExists = await Exercise.findByPk(exercise_id);
    if (!exerciseExists) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const newReward = await Reward.create({
      name: name.trim(),
      badge: badge.trim(),
      exercise_id,
      earned_at: new Date(),
    });

    res.status(201).json(newReward);
  } catch (error) {
    res.status(500).json({ error: "Error creating reward" });
  }
};

//Update reward
export const updateReward = async (req, res) => {
  const { id } = req.params;
  const { name, badge } = req.body;

  if (!name && !badge) {
    return res.status(400).json({ error: "At least one field is required to update." });
  }

  try {
    const reward = await Reward.findByPk(id);

    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    const updatedReward = await reward.update({
      name: name ? name.trim() : reward.name,
      badge: badge ? badge.trim() : reward.badge,
    });

    res.status(200).json(updatedReward);
  } catch (error) {
    res.status(500).json({ error: "Error updating reward." });
  }
};

//Remove a reward
export const deleteReward = async (req, res) => {
  const { id } = req.params;

  try {
    const reward = await Reward.findByPk(id);

    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    await Reward.destroy({ where: { id } });

    res.status(200).json({ message: `Reward with ID ${id} successfully deleted.` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting reward" });
  }
};
