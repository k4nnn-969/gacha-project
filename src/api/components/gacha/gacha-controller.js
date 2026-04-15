const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function doGacha(request, response, next) {
  try {
    const { user_id, user_name } = request.body;

    if (!user_id) {
      throw errorResponder(errorTypes.VALIDATION, 'user_id wajib diisi');
    }

    if (!user_name) {
      throw errorResponder(errorTypes.VALIDATION, 'user_name wajib diisi');
    }

    const result = await gachaService.performGacha(user_id, user_name);

    if (!result.success) {
      throw errorResponder(errorTypes.FORBIDDEN, result.error);
    }

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const { user_id } = request.params;

    if (!user_id) {
      throw errorResponder(errorTypes.VALIDATION, 'user_id wajib diisi');
    }

    const history = await gachaService.getGachaHistory(user_id);

    return response.status(200).json({
      user_id,
      total_attempts: history.length,
      history: history.map((h) => ({
        gacha_id: h._id,
        date: h.gacha_date,
        prize: h.prize || 'Tidak menang hadiah',
        created_at: h.createdAt,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

async function getPrizes(request, response, next) {
  try {
    const prizes = await gachaService.getPrizesInfo();

    return response.status(200).json({
      prizes,
    });
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinnersPerPrize();

    return response.status(200).json({
      winners,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  doGacha,
  getHistory,
  getPrizes,
  getWinners,
};
