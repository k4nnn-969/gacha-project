const gachaSchema = (mongoose) => {
  const schema = new mongoose.Schema(
    {
      user_id: {
        type: String,
        required: true,
      },
      user_name: {
        type: String,
        required: true,
      },
      prize: {
        type: String,
        default: null,
      },
      gacha_date: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );

  return mongoose.model('Gacha', schema);
};

module.exports = gachaSchema;
