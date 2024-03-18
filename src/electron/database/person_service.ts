import connect from "./index";

const db = connect();

const readAllPerson = () => {
  try {
    const query = `SELECT * FROM person`;
    const readQuery = db.prepare(query);
    const rowList = readQuery.all();
    return rowList;
  } catch (err) {
    console.error("err", err);
    throw err;
  }
};

const insertPerson = (name: string, age: any) => {
  try {
    const insertQuery = db.prepare(`INSERT INTO person (name, age) VALUES ('${name}' , ${age})`);

    const transaction = db.transaction(() => {
      const info = insertQuery.run();
      console.log(
        `Inserted ${info.changes} rows with last ID 
               ${info.lastInsertRowid} into person`
      );
    });
    transaction();
  } catch (err) {
    console.error("err", err);
    throw err;
  }
};

export { readAllPerson, insertPerson };
