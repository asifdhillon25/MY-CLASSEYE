const Counter = require("../../models/counter.model");

async function generatePrefixedId(counterKey, prefix) {
  const counter = await Counter.findOneAndUpdate(
    { key: counterKey },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `${prefix}${String(counter.value).padStart(5, "0")}`;
}

module.exports = generatePrefixedId;
