import { ResultSetHeader } from "mysql2/promise";
import { DatabaseService } from "./DatabaseService";
import { Category } from "../Entities/categories";

export class CategoryService {
    private connection;

    constructor() {
        this.connection = DatabaseService.getInstance().getConnection();
    }

    async getAllCategories(): Promise<Category[]> {
        const [rows] = await this.connection.query('SELECT * FROM Categories');
        return rows as Category[];
    }

    async getCategoryById(id: number): Promise<Category> {
        const [rows] = await this.connection.query('SELECT * FROM Categories WHERE id = ?', [id]);
        if (Array.isArray(rows) && rows.length > 0) {
            return rows[0] as Category;
        } else {
            throw new Error('Kategorija nije pronađena.');
        }
    }

    async createCategory(name: string): Promise<Category> {
        const [result] = await this.connection.query(
            'INSERT INTO Categories (name) VALUES (?)',
            [name]
        );
        return this.getCategoryById((result as ResultSetHeader).insertId);
    }

    async updateCategory(id: number, name: string): Promise<void> {
        await this.connection.query(
            'UPDATE Categories SET name = ? WHERE id = ?',
            [name, id]
        );
    }

    async deleteCategory(id: number): Promise<void> {
        await this.connection.query('DELETE FROM Categories WHERE id = ?', [id]);
    }
}
