const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "127.0.0.1",
  database: "sample",
  user: "root",
  password: "root",
  connectionLimit: 15,
});

exports.getConnection = () => {
  return pool.getConnection();
};
