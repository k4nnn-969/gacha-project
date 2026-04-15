const { Gacha } = require('../../../models');

async function countUserGachaToday(userId, today) {
  return Gacha.countDocuments({ user_id: userId, gacha_date: today });
}

async function countPrizeWinners(prize) {
  return Gacha.countDocuments({ prize });
}

async function createGachaRecord(userId, userName, prize, today) {
  return Gacha.create({
    user_id: userId,
    user_name: userName,
    prize: prize || null,
    gacha_date: today,
  });
}

async function getGachaHistory(userId) {
  return Gacha.find({ user_id: userId }).sort({ createdAt: -1 });
}

async function getWinnersByPrize(prize) {
  return Gacha.find({ prize }).select('user_name prize createdAt');
}

module.exports = {
  countUserGachaToday,
  countPrizeWinners,
  createGachaRecord,
  getGachaHistory,
  getWinnersByPrize,
};
