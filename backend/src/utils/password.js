// why this is in different file? because this is a utility function that can be used in multiple places in the application, 
// such as during user registration and login. By keeping it in a separate file, we can easily import and use it wherever needed without duplicating code.
import bcrypt from 'bcrypt';
const WORK_FACTOR = 10; // The number of salt rounds for hashing the password. A higher number increases security but also increases computation time.

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, WORK_FACTOR);
};

export const comparePassword = async (password, passwordHash) => {
    return await bcrypt.compare(password, passwordHash);
};