import { ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";

export class TripService {
    private connection;

    constructor() {
        this.connection = DatabaseService.getInstance().getConnection();
    }

    async getAllTrips() {
        try {
            const query = `
            SELECT Trips.id, Trips.name, Trips.description, Trips.image_path, Trips.start_date, Trips.end_date, 
            Categories.id AS category_id, Categories.name AS category_name, 
            Users.id AS author_id, Users.first_name, Users.last_name, Users.email, Users.role, Users.status
            FROM Trips
            INNER JOIN Categories ON Trips.category_id = Categories.id
            INNER JOIN Users ON Trips.author_id = Users.id
            `;
            const [rows] = await this.connection.query(query);
            return rows;
        } catch (error) {
            console.error('Greška prilikom izvršavanja upita:', error);
            throw error; // Bacite grešku kako bi aplikacija mogla reagovati na ovu grešku
        }
    }
    

    async getTripById(id: number) {
        const [rows] = await this.connection.query('SELECT * FROM Trips WHERE id = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            return rows[0];
        } else {
            throw new Error('Putovanje nije pronađeno.');
        }
    }

    async createTrip(name: string, description: string, startDate: Date, endDate: Date, categoryId: number, authorId: number, imagePath: string) {
        const [result] = await this.connection.query(
            'INSERT INTO Trips (name, description, start_date, end_date, category_id, author_id, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, startDate, endDate, categoryId, authorId, imagePath]
        );
        return this.getTripById((result as ResultSetHeader).insertId);
    }

    async updateTrip(id: number, name: string, description: string, startDate: Date, endDate: Date, categoryId: number, authorId: number) {
        await this.connection.query(
            'UPDATE Trips SET name = ?, description = ?, start_date = ?, end_date = ?, category_id = ?, author_id = ? WHERE id = ?',
            [name, description, startDate, endDate, categoryId, authorId, id]
        );
    }

    async deleteTrip(id: number) {
        await this.connection.query('DELETE FROM Trips WHERE id = ?', [id]);
    }
}
