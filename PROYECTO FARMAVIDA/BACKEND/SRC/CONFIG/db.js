import mysql from"mysql2";

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "farmavida",
  connectTimeout: 10000,
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos exitosa");
});

export default db;
