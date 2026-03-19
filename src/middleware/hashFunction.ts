import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const hashPassword = async (
  password: string,
  rounds: number = 10
): Promise<string> => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

export{
    hashPassword
}