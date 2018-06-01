// const db = require("../database/connection");

// const Quote = {};

// Quote.all = () => {
//   return db.any("SELECT * FROM quotes");
// };

// Quote.findById = id => {
//   return db.one("SELECT * FROM quotes WHERE id = ${id}", { id: id });
// };

// Quote.create = newQuote => {
//   return db.one(
//     "INSERT INTO quotes (author, content, category_id) VALUES (${author}, ${content}, ${category_id}) RETURNING *", newQuote
//     )
// };

// Quote.updateById = updatedQuote => {
//   return db.none("UPDATE quotes SET author = ${author}, content = ${content}, category_id = ${category_id} WHERE id = ${id}", updatedQuote)
// }

// Quote.delete = id => {
//   return db.result("DELETE FROM quotes WHERE id = ${id}", { id: id });
// };

// Quote.allByCategoryId = category_id => {
//   return db.any("SELECT * FROM quotes WHERE category_id = ${category_id}", {category_id: category_id});
// };

// module.exports = Quote;
