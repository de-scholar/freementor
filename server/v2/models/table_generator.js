import migrate_tables from './db/tables_migration';

(async () => {
  await migrate_tables();
})();