import { Request, Response, Router } from 'express';
import { checkAuth } from '../Middleware/AuthMiddleware';
import { CategoryService } from '../Services/CategoryService';

const categoryController = Router();
const categoryService = new CategoryService();

categoryController.get('/categories', checkAuth("admin", "user", "guest"), async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
});

categoryController.get('/categories/:id', checkAuth("admin", "user", "guest"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const category = await categoryService.getCategoryById(id);
        res.json(category);
    } catch (error:any) {
        res.status(404).json({ message: error.message });
    }
});

categoryController.post('/categories', checkAuth("admin"), async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const newCategory = await categoryService.createCategory(name);
        res.status(201).json(newCategory);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

categoryController.put('/categories/:id', checkAuth("admin"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    try {
        await categoryService.updateCategory(id, name);
        res.sendStatus(204);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

categoryController.delete('/categories/:id', checkAuth("admin"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await categoryService.deleteCategory(id);
        res.sendStatus(204);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

export default categoryController;
