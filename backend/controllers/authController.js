
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models/index.js"; 
import { UniqueConstraintError, Op } from "sequelize"; 


const { User, LoginHistory } = models; 


const DEFAULT_PROFILE_IMAGE_URL = "/uploads/without_image.webp";


export const register = async (req, res) => {
  
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  try {
    const existingUserByEmail = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUserByEmail) {
      return res.status(409).json({ message: `Email already exists.` });
    }

    const existingUserByUsername = await User.findOne({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return res.status(409).json({ message: `Username already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profile_image_url: DEFAULT_PROFILE_IMAGE_URL,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        profile_image_url: newUser.profile_image_url,
      },
    });
  } catch (error) {
    console.error("Error en register:", error);
    if (error instanceof UniqueConstraintError) {
      const field = error.fields && Object.keys(error.fields)[0];
      const message = field
        ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`
        : "Email or Username already exists.";
      return res.status(409).json({ message: message });
    }
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};


export const login = async (req, res) => {
  const user = req.user;
  const payload = {
    user_id: user.user_id,
    username: user.username,
  };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined.");
    return res.status(500).json({ message: "Internal server error." });
  }
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  try {
    
    await LoginHistory.create({
        user_id: user.user_id,
        login_timestamp: new Date() 
    });
    console.log(`Login recorded for user ${user.user_id}`);
   

    
    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        profile_image_url: user.profile_image_url,
      },
    });
  } catch (error) {
    
      console.error(`Failed to record login for user ${user.user_id}:`, error);
     
       res.json({
        message: "Login successful (but history record failed)", 
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          profile_image_url: user.profile_image_url,
        },
      });
  }
};


export const getLoginHistory = async (req, res) => {
    const userId = req.user.user_id; 

    if (!userId) {
        return res.status(401).json({ message: "User ID not found in token." });
    }

    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); 

        const history = await LoginHistory.findAll({
            where: {
                user_id: userId,
                login_timestamp: {
                    [Op.gte]: sevenDaysAgo 
                }
            },
            attributes: ['login_timestamp'], 
            order: [['login_timestamp', 'ASC']] 
        });

       
        const uniqueDates = [...new Set(history.map(record =>
            record.login_timestamp.toISOString().split('T')[0] 
        ))];

        res.json(uniqueDates); 

    } catch (error) {
        console.error(`Error fetching login history for user ${userId}:`, error);
        res.status(500).json({ message: 'Error fetching login history', error: error.message });
    }
};
