export default interface TripType {
    id?: number;
    name?: string;
    description?: string;
    image_path?: string;
    start_date?: Date;
    end_date?: Date;
    categoryId?: number;
    category_name?: string;
    authorId?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: string;
    status?: string;
}