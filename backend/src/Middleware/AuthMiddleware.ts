import { Request, Response, NextFunction } from 'express';

interface SessionUser {
    role: string;
}

declare module 'express-session' {
    interface Session {
        user?: SessionUser;
    }
}

export function checkAuth(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        // Provjeri da li postoji korisnik u sesiji
        if (!req.session?.user) {
            return res.status(401).json({ message: 'Niste prijavljeni.' });
        }

        // Provjeri da li korisnik ima dozvolu za pristup ruti
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).json({ message: 'Nemate ovlasti za pristup ovoj ruti.' });
        }

        next();
    };
}
