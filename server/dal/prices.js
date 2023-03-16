const db = require('../models');
const Prices = db.Prices;

exports.create = async (price) => {
    return await Prices.create(price);
}
exports.findAll = async () => {
    return await Prices.findAll();
}
exports.findAll = async (condition) => {
    return await Prices.findAll(condition);
}
exports.findOne = async (condition) => {
    return await Prices.findOne(condition);
}
exports.update = async (price, id) => {
    return await Prices.update(price, { where: { id: id } });
}
exports.delete = async (id) => {
    return await Prices.destroy({ where: { id: id } });
}