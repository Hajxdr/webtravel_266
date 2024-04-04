import { ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "../Services/DatabaseService";
import { TripApplication } from "../Entities/tripApplications";

export class TripApplicationService {
    private connection;

    constructor() {
        this.connection = DatabaseService.getInstance().getConnection();
    }

    async getAllTripApplications(): Promise<TripApplication[]> {
        const [rows] = await this.connection.query('SELECT * FROM TripsApplications');
        return rows as TripApplication[];
    }

    async getTripApplicationById(id: number): Promise<TripApplication> {
        const [rows] = await this.connection.query('SELECT * FROM TripsApplications WHERE id = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            return rows[0] as TripApplication;
        } else {
            throw new Error('Zahtjev za putovanjem nije pronađen.');
        }
    }

    async createTripApplication(tripId: number, userId: number): Promise<TripApplication> {
        const [result] = await this.connection.query(
            'INSERT INTO TripsApplications (trip_id, user_id) VALUES (?, ?)',
            [tripId, userId]
        );
        return this.getTripApplicationById((result as ResultSetHeader).insertId);
    }

    async updateTripApplication(id: number, tripId: number, userId: number): Promise<void> {
        await this.connection.query(
            'UPDATE TripsApplications SET trip_id = ?, user_id = ? WHERE id = ?',
            [tripId, userId, id]
        );
    }

    async deleteTripApplication(id: number): Promise<void> {
        await this.connection.query('DELETE FROM TripsApplications WHERE id = ?', [id]);
    }
}
