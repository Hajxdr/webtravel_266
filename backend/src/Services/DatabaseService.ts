import { DatabaseConfiguration } from '../../config/database.configuration';
import * as mysql from 'mysql2/promise';

export class DatabaseService {
  private static instance: DatabaseService;
  private connection;

  private constructor() {
    this.connection = mysql.createPool({
      host: DatabaseConfiguration.host,
      user: DatabaseConfiguration.user,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      port: DatabaseConfiguration.port,
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getConnection() {
    return this.connection;
  }
}
