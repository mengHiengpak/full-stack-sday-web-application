import { Sequelize } from 'sequelize';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL not set — database features disabled');
}

const sequelize = new Sequelize(dbUrl || 'postgresql://localhost:5432/postgres', {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
    statement_timeout: 30000,
    idle_in_transaction_session_timeout: 60000,
  },
  pool: {
    max: 20,
    min: 2,
    acquire: 30000,
    idle: 10000,
    evict: 1000,
  },
  retry: { max: 3 },
});

export default sequelize;
