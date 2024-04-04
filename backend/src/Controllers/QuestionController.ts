import { Request, Response, Router } from 'express';
import { checkAuth } from '../Middleware/AuthMiddleware';
import { QuestionService } from '../Services/QuestionsService';

const questionController = Router();
const questionService = new QuestionService();

questionController.get('/questions', checkAuth("admin", "user", "guest"), async (req: Request, res: Response) => {
    const questions = await questionService.getAllQuestions();
    res.json(questions);
});

questionController.get('/questions/:id', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const question = await questionService.getQuestionById(id);
        res.json(question);
    } catch (error:any) {
        res.status(404).json({ message: error.message });
    }
});

questionController.post('/questions', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    const { text, tripId, userId } = req.body;
    try {
        const newQuestion = await questionService.createQuestion(text, tripId, userId);
        res.status(201).json(newQuestion);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

questionController.put('/questions/:id', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { text, tripId, userId } = req.body;
    try {
        await questionService.updateQuestion(id, text, tripId, userId);
        res.sendStatus(204);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

questionController.delete('/questions/:id', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await questionService.deleteQuestion(id);
        res.sendStatus(204);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
});

export default questionController;
