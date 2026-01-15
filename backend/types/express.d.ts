// ------ Type Express Request avec utilisateur ------//

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string; // ID MongoDB
        email: string;
        username: string;
        avatar?: string;
      };
    }
  }
}