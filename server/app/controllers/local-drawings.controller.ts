import { LocalDrawingsService } from '@app/services/local-drawings.service';
import { TYPES } from '@app/types';
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
         *       image:
         *         type: string
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
            // const drawing: ServerDrawing | undefined = this.localDrawingsService.getDrawing(req.query.id);
            this.localDrawingsService.getDrawing(req.query.id).then((message) => {
                res.json(message);
            });
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
        this.router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
            this.localDrawingsService.getAllDrawings().then((message) => {
                res.json(message);
            });
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
            this.localDrawingsService.saveDrawing(drawing).then((message) => {
                res.json(message);
                // res.sendStatus(HttpRequestCodes.HTTP_STATUS_CREATED);
            });
        });

        /**
         * @swagger
         *
         * /api/drawings/delete:
         *   get:
         *     description: Delete drawing with corresponding id
         *     tags:
         *       - LocalDrawings
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *          description: Ok
         */
        this.router.delete('/delete', (req: Request, res: Response, next: NextFunction) => {
            this.localDrawingsService.deleteDrawing(req.query.id).then((message) => {
                res.json(message);
            });
        });
    }
}
