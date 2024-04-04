import { ResultSetHeader } from 'mysql2/promise';
import { DatabaseService } from './DatabaseService';

export class UserService {
  private connection;

  constructor() {
    this.connection = DatabaseService.getInstance().getConnection();
  }

  async getUsers() {
    const [rows] = await this.connection.query('SELECT * FROM Users');
    return rows;
  }

  async getUserById(id: number) {
    const [row] = await this.connection.query('SELECT * FROM Users WHERE id = ?', [id]);
    return row;
  }

  async createUser(user: any): Promise<any> {
    const [result] = await this.connection.query('INSERT INTO Users (first_name, last_name, email, password, role, status) VALUES (?, ?, ?, ?, ?, ?)', [user.firstName, user.lastName, user.email, user.password, user.role, user.status]);
    return this.getUserById((result as ResultSetHeader).insertId);
  }    

  async updateUser(id: number, user: any): Promise<boolean> {
    const [result] = await this.connection.query('UPDATE Users SET first_name = ?, last_name = ?, email = ?, password = ?, role = ?, status = ? WHERE id = ?', [user.firstName, user.lastName, user.email, user.password, user.role, user.status, id]);
    return (result as ResultSetHeader).affectedRows > 0;
  }  

  async deleteUser(id: number): Promise<boolean> {
    const [result] = await this.connection.query('DELETE FROM Users WHERE id = ?', [id]);
    return (result as ResultSetHeader).affectedRows > 0;
  }  
}
