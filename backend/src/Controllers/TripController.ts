import express, { Request, Response } from 'express';
import { TripService } from '../Services/TripService';
import { checkAuth } from '../Middleware/AuthMiddleware';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import { StorageConfig } from '../../config/storage.config';
import path from 'path';

const tripController = express.Router();
const tripService = new TripService();



// GET /trips
tripController.get('/trips', checkAuth("admin", "user", "guest"), async (req: Request, res: Response) => {
    try {
        const trips = await tripService.getAllTrips();
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom dohvatanja putovanja.' });
    }
});

// GET /trips/:id
tripController.get('/trips/:id', checkAuth("admin", "user", "guest"), async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const trip = await tripService.getTripById(id);
        res.json(trip);
    } catch (error) {
        res.status(404).json({ message: 'Putovanje nije pronađeno.' });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, StorageConfig.photo.destination)
    },
    filename: function (req, file, cb) {
        const original: string = file.originalname;
        let normalized = original.replace(/\s+/g, '-');
        normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
        const sada = new Date();
        let datePart = '';
        datePart += sada.getFullYear().toString();
        datePart += (sada.getMonth() + 1).toString();
        datePart += sada.getDate().toString();

        const randomPart: string = new Array(10)
            .fill(0)
            .map((e) => (Math.random() * 9).toFixed(0).toString())
            .join('');

        let fileName = datePart + '-' + randomPart + '-' + normalized;
        fileName = fileName.toLowerCase();

        const fileExt = path.extname(original);
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// POST /trips
tripController.post('/trips', checkAuth("admin"), upload.single('photo'), async (req: Request, res: Response) => {
    const { name, description, startDate, endDate, categoryId, authorId } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    try {
        if (imagePath) {
            // Resize za thumb
            await createResizedImage(StorageConfig.photo.destination + imagePath, 'thumb', 100, 100);

            // Resize za small
            await createResizedImage(StorageConfig.photo.destination + imagePath, 'small', 300, 200);
        }

        const newTripId = await tripService.createTrip(name, description, startDate, endDate, categoryId, authorId, imagePath || '');

        res.status(201).json({ message: 'Putovanje uspješno kreirano.', id: newTripId });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom kreiranja putovanja.' });
    }
});

async function createResizedImage(originalPath: string, type: string, width: number, height: number): Promise<void> {
    const fileName = path.basename(originalPath);
    const directory = path.dirname(originalPath);

    const resizedFilePath = path.join(directory, `${type}_${fileName}`);

    await sharp(originalPath)
        .resize({ width, height, fit: 'cover' })
        .toFile(resizedFilePath);
}

// PUT /trips/:id
tripController.put('/trips/:id', checkAuth("admin"),async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { name, description, startDate, endDate, categoryId, authorId } = req.body;
    try {
        await tripService.updateTrip(id, name, description, startDate, endDate, categoryId, authorId);
        res.json({ message: 'Putovanje uspješno izmijenjeno.' });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom izmjene putovanja.' });
    }
});

// DELETE /trips/:id
tripController.delete('/trips/:id', checkAuth("admin"),async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await tripService.deleteTrip(id);
        res.json({ message: 'Putovanje uspješno obrisano.' });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom brisanja putovanja.' });
    }
});

export default tripController;
