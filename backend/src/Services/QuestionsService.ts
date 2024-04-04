import { ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "../Services/DatabaseService";
import { Question } from "src/Entities/question";

export class QuestionService {
    private connection;

    constructor() {
        this.connection = DatabaseService.getInstance().getConnection();
    }

    async getAllQuestions(): Promise<Question[]> {
        const [rows] = await this.connection.query('SELECT * FROM Questions');
        return rows as Question[];
    }

    async getQuestionById(id: number): Promise<Question> {
        const [rows] = await this.connection.query('SELECT * FROM Questions WHERE id = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            return rows[0] as Question;
        } else {
            throw new Error('Pitanje nije pronađeno.');
        }
    }

    async createQuestion(text: string, tripId: number, userId: number): Promise<Question> {
        const [result] = await this.connection.query(
            'INSERT INTO Questions (text, trip_id, user_id) VALUES (?, ?, ?)',
            [text, tripId, userId]
        );
        return this.getQuestionById((result as ResultSetHeader).insertId);
    }

    async updateQuestion(id: number, text: string, tripId: number, userId: number): Promise<void> {
        await this.connection.query(
            'UPDATE Questions SET text = ?, trip_id = ?, user_id = ? WHERE id = ?',
            [text, tripId, userId, id]
        );
    }

    async deleteQuestion(id: number): Promise<void> {
        await this.connection.query('DELETE FROM Questions WHERE id = ?', [id]);
    }
}
