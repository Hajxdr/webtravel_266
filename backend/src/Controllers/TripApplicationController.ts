import express, { Request, Response } from 'express';
import { checkAuth } from '../Middleware/AuthMiddleware';
import { TripApplicationService } from '../Services/TripApplicationService';

const tripApplicationController = express.Router();
const tripApplicationService = new TripApplicationService();

// GET /tripApplications
tripApplicationController.get('/tripApplications', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    try {
        const tripApplications = await tripApplicationService.getAllTripApplications();
        res.json(tripApplications);
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom dohvatanja prijava za putovanja.' });
    }
});

// GET /tripApplications/:id
tripApplicationController.get('/tripApplications/:id', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const tripApplication = await tripApplicationService.getTripApplicationById(id);
        res.json(tripApplication);
    } catch (error) {
        res.status(404).json({ message: 'Prijava za putovanje nije pronađena.' });
    }
});

// POST /tripApplications
tripApplicationController.post('/tripApplications', checkAuth("admin", "user"), async (req: Request, res: Response) => {
    const { tripId, userId } = req.body;
    try {
        const newTripApplicationId = await tripApplicationService.createTripApplication(tripId, userId);
        res.status(201).json({ message: 'Prijava za putovanje uspješno kreirana.', id: newTripApplicationId });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom kreiranja prijave za putovanje.' });
    }
});

// DELETE /tripApplications/:id
tripApplicationController.delete('/tripApplications/:id', checkAuth("admin"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await tripApplicationService.deleteTripApplication(id);
        res.json({ message: 'Prijava za putovanje uspješno obrisana.' });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom brisanja prijave za putovanje.' });
    }
});

export default tripApplicationController;
