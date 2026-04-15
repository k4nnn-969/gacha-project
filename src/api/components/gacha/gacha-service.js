const gachaRepository = require('./gacha-repository');

const PRIZES = [
  { name: 'Emas 10 gram', quota: 1 },
  { name: 'Smartphone X', quota: 5 },
  { name: 'Smartwatch Y', quota: 10 },
  { name: 'Voucher Rp100.000', quota: 100 },
  { name: 'Pulsa Rp50.000', quota: 500 },
];

const MAX_GACHA_PER_DAY = 5;

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

async function checkUserQuota(userId) {
  const today = getTodayString();
  const count = await gachaRepository.countUserGachaToday(userId, today);
  return count < MAX_GACHA_PER_DAY;
}

async function performGacha(userId, userName) {
  const today = getTodayString();

  const userCount = await gachaRepository.countUserGachaToday(userId, today);
  if (userCount >= MAX_GACHA_PER_DAY) {
    return {
      success: false,
      error: `Kuota gacha harian sudah habis. Maksimal ${MAX_GACHA_PER_DAY} kali per hari.`,
    };
  }

  const availablePrizes = [];
  for (const prize of PRIZES) {
    const winnersCount = await gachaRepository.countPrizeWinners(prize.name);
    if (winnersCount < prize.quota) {
      availablePrizes.push(prize);
    }
  }

  let wonPrize = null;

  if (availablePrizes.length > 0) {
    const totalSlotsRemaining = availablePrizes.reduce(
      async (sumPromise, p) => {
        const sum = await sumPromise;
        const winners = await gachaRepository.countPrizeWinners(p.name);
        return sum + (p.quota - winners);
      },
      Promise.resolve(0)
    );

    const totalSlots = await totalSlotsRemaining;

    const totalTickets = totalSlots * 10;
    const roll = Math.floor(Math.random() * totalTickets);

    if (roll < totalSlots) {
      let cumulativeSlots = 0;
      for (const prize of availablePrizes) {
        const winners = await gachaRepository.countPrizeWinners(prize.name);
        const remaining = prize.quota - winners;
        cumulativeSlots += remaining;
        if (roll < cumulativeSlots) {
          wonPrize = prize.name;
          break;
        }
      }
    }
  }

  const record = await gachaRepository.createGachaRecord(
    userId,
    userName,
    wonPrize,
    today
  );

  return {
    success: true,
    prize: wonPrize,
    message: wonPrize
      ? `Selamat! Anda memenangkan: ${wonPrize}`
      : 'Maaf, Anda tidak memenangkan hadiah kali ini. Coba lagi!',
    gacha_id: record._id,
    attempts_today: userCount + 1,
    remaining_attempts: MAX_GACHA_PER_DAY - (userCount + 1),
  };
}

async function getGachaHistory(userId) {
  return gachaRepository.getGachaHistory(userId);
}

async function getPrizesInfo() {
  const prizesInfo = [];
  for (const prize of PRIZES) {
    const winnersCount = await gachaRepository.countPrizeWinners(prize.name);
    prizesInfo.push({
      prize: prize.name,
      total_quota: prize.quota,
      winners_count: winnersCount,
      remaining_quota: prize.quota - winnersCount,
    });
  }
  return prizesInfo;
}

function maskName(name) {
  const parts = name.split(' ');
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      const chars = part.split('');
      const keepFirst = Math.random() > 0.5;
      const keepLast = Math.random() > 0.5;
      return chars
        .map((char, idx) => {
          if (idx === 0 && keepFirst) return char;
          if (idx === chars.length - 1 && keepLast) return char;
          return '*';
        })
        .join('');
    })
    .join(' ');
}

async function getWinnersPerPrize() {
  const result = [];
  for (const prize of PRIZES) {
    const winners = await gachaRepository.getWinnersByPrize(prize.name);
    result.push({
      prize: prize.name,
      total_quota: prize.quota,
      winners: winners.map((w) => ({
        masked_name: maskName(w.user_name),
        won_at: w.createdAt,
      })),
    });
  }
  return result;
}

module.exports = {
  performGacha,
  getGachaHistory,
  getPrizesInfo,
  getWinnersPerPrize,
};
