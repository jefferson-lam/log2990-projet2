import { LocalDrawingsService } from '@app/services/local-drawings.service';
import { TYPES } from '@app/types';
import * as HttpRequestCodes from '@common/communication/http-code-constants';
import { ServerDrawing } from '@common/communication/server-drawing';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class LocalDrawingsController {
    router: Router;

    constructor(@inject(TYPES.LocalDrawingsService) private localDrawingsService: LocalDrawingsService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * definitions:
         *   ServerDrawings:
         *     type: object
         *     properties:
         *       id:
         *         type: string
         *       pixels:
         *         type: number[]
         *       height:
         *         type: number
         *       width:
         *         type: number
         */

        /**
         * @swagger
         * tags:
         *   - name: LocalDrawings
         *     description: Drawings endpoint
         */

        /**
         * @swagger
         *
         * /api/drawings/get:
         *   get:
         *     description: Return drawing with corresponding id
         *     tags:
         *       - LocalDrawings
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/ServerDrawings'
         *
         */
        this.router.get('/get', async (req: Request, res: Response, next: NextFunction) => {
            const drawing: ServerDrawing | undefined = this.localDrawingsService.getDrawing(req.query.id);
            res.json(drawing);
        });

        /**
         * @swagger
         *
         * /api/drawings/all:
         *   get:
         *     description: Return all drawings
         *     tags:
         *       - LocalDrawings
         *     produces:
         *      - application/json
         *     responses:
         *       200:
         *         description: drawings
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/ServerDrawings'
         */
        this.router.get('/all', (req: Request, res: Response, next: NextFunction) => {
            res.json(this.localDrawingsService.getAllDrawings());
        });

        /**
         * @swagger
         *
         * /api/drawings/send:
         *   post:
         *     description: Locally saves drawing and id
         *     tags:
         *       - LocalDrawings
         *     requestBody:
         *         description: id and drawing (rgba pixels, height, width)
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/ServerDrawings'
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/send', (req: Request, res: Response, next: NextFunction) => {
            const drawing: ServerDrawing = req.body;
            this.localDrawingsService.saveDrawing(drawing);
            res.sendStatus(HttpRequestCodes.HTTP_STATUS_CREATED);
        });
    }
}
