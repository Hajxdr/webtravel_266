import { checkAuth } from '../Middleware/AuthMiddleware';
import { UserService } from '../Services/userService';
import express, { Request, Response } from 'express';


const userController = express.Router();
const userService = new UserService();

userController.get('/users', checkAuth("admin", "user"), async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
});

userController.get('/users/:id', checkAuth("admin", "user"), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userService.getUserById(id);
  res.json(user);
});

userController.post('/users', checkAuth("admin", "user", "guest"), async (req: Request, res: Response) => {
  const user = req.body;
  const userId = await userService.createUser(user);
  res.json({ id: userId });
});

userController.put('/users/:id', checkAuth("admin", "user"), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = req.body;
  const updated = await userService.updateUser(id, user);
  res.json({ updated });
});

userController.delete('/users/:id', checkAuth("admin"), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = await userService.deleteUser(id);
  res.json({ deleted });
});

export default userController;
