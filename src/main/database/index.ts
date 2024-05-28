import { app } from 'electron';
import path from 'path';
import Sqlite from 'better-sqlite3';
import { map } from 'extra-promise';
import { migrate } from '@blackglory/better-sqlite3-migrations';
import { findMigrationFilenames, readMigrationFile } from 'migration-files';

let db: Sqlite.Database;

export default function connect() {
  const conn = new Sqlite(
    path.join(app.getPath('userData'), 'tclinic-lis.db'),
    { verbose: console.log },
  );
  return conn;
}

export async function initDatabase() {
  db = connect();

  const filenames = await findMigrationFilenames(
    path.join(__dirname, '../../../migrations'),
  );
  const migrations = await map(filenames, readMigrationFile);

  migrate(db, migrations);
}
