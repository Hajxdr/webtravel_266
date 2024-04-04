import { DatabaseService } from "./DatabaseService";

export class AuthService {
    private connection;
  
    constructor() {
        this.connection = DatabaseService.getInstance().getConnection();
    }
  
    async loginUser(email: string, password: string): Promise<any> {
        const [rows] = await this.connection.query('SELECT * FROM Users WHERE email = ? AND password = ?', [email, password]);
        if (Array.isArray(rows) && rows.length > 0) {
          return rows[0];
        } else {
          return null;
        }
      }
    }
  