const {
  hashPassword,
  comparePassword,
  createToken,
} = require("../utils/authUtils");
const { userDAO } = require("../models/model");

const userService = {
  async postSignUpInfo(email, password, userName) {
    const hashedPassword = await hashPassword(password);
    const toPost = { email, password: hashedPassword, userName };
    const user = await userDAO.create(toPost);
    return user;
  },

  async postSignInInfo(email, originPassword) {
    const { password, isAdmin } = await userDAO.findOneByEmail({ email });
    if (!(await comparePassword(originPassword, password))) {
      return null;
    }
    const token = createToken(email, isAdmin);
    return token;
  },

  async getUser(userId) {
    const user = await userDAO.findOne(userId);
    return user;
  },

  async getUsers() {
    const users = await userDAO.findAll();
    return users;
  },

  async getUsersByUserName(userName) {
    const users = await userDAO.findAllByUserName(userName);
    return users;
  },

  async patchUser(userId, toUpdate) {
    const { oldPassword, newPassword } = toUpdate;
    if (oldPassword) {
      const { password } = await userDAO.findOne(userId);
      if (await comparePassword(oldPassword, password)) {
        const hashedPassword = await hashPassword(newPassword);
        await userDAO.updateOne(userId, { password: hashedPassword });
        return true;
      } else {
        return false;
      }
    } else {
      const user = await userDAO.updateOne(userId, toUpdate);
      return user;
    }
  },

  async deleteUser(userId, originPassword) {
    const { password } = await userDAO.findOne(userId);
    if (!(await comparePassword(originPassword, password))) {
      return null;
    }

    const user = await userDAO.deleteOne(userId);
    return user;
  },
};

module.exports = userService;