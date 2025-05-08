import User from "../../../DB/model/User.model.js";

// Utility to initialize missing fields
const addLoginFieldsToAllUsers = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      let updateNeeded = false;

      if (!user.lastLogin) {
        user.lastLogin = user.createdAt; // Or use user.createdAt
        updateNeeded = true;
      }

      if (user.isOnline === undefined) {
        user.isOnline = false;
        updateNeeded = true;
      }

      if (updateNeeded) {
        await user.save();
        console.log(`Updated: ${user.email}`);
      }
    }

    console.log("Done updating all users.");
  } catch (err) {
    console.error("Error updating users:", err);
  }
};

export default addLoginFieldsToAllUsers;
