// authController.ts

import { Request, Response, Router } from 'express';
import { AuthService } from '../Services/AuthService';

const AuthController = Router();
const authService = new AuthService();

AuthController.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
      const user = await authService.loginUser(email, password);
      if (user) {
          req.session.user = { role: user.role };
          res.status(200).json({ message: 'Uspješna prijava', user });
      } else {
          req.session.user = { role: 'guest' };
          res.status(401).json({ message: 'Neispravna e-pošta ili lozinka' });
      }
  } catch (error) {
      console.error('Greška prilikom prijave:', error);
      res.status(500).json({ message: 'Greška prilikom prijave. Pokušajte ponovo.' });
  }
});


  /* AuthController.post('/logout', async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    
        res.json({ message: 'Successfully logged out' });
    });    
  }) */

export default AuthController;
