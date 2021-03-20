import { Drawing } from '@app/classes/drawing';
import { TYPES } from '@app/types';
import { Message } from '@common/communication/message';
import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DrawingsDatabaseService } from '../services/database/drawings-database.service';

@injectable()
export class DrawingsDatabaseController {
    router: Router;

    constructor(@inject(TYPES.DrawingsDatabaseService) private databaseService: DrawingsDatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * definitions:
         *   Drawing:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       tags:
         *         type: array
         *         items:
         *           type: string
         *
         *   Message:
         *      type: object
         *      properties:
         *        title:
         *          type: string
         *        body:
         *          type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Database
         *     description: Database endpoint
         */

        /**
         * @swagger
         *
         * /api/database:
         *   get:
         *     description: Return all drawings currently in database
         *     tags:
         *       - Database
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Returns an array of all drawings in the stringified json form.
         *         schema:
         *           type: array
         *           items:
         *             $ref: '#/definitions/Message'
         */
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            this.databaseService.getDrawings().then((result: Message) => {
                res.json(result);
            });
        });

        /**
         * @swagger
         *
         * /api/database/send:
         *   post:
         *     description: Send a message
         *     tags:
         *       - Database
         *       - Drawing
         *     requestBody:
         *         description: Drawing object
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Drawing'
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *         description: Drawing has been successfully created.
         */
        this.router.post('/send', (req: Request, res: Response, next: NextFunction) => {
            const newDrawing: Drawing = req.body;
            const title = newDrawing.title;
            const tags = newDrawing.tags;
            this.databaseService.saveDrawing(title, tags).then((result) => {
                res.json(result);
            });
        });

        /**
         * @swagger
         *
         * /api/database/getId:
         *   get:
         *     description: Return drawing with specific id.
         *     tags:
         *       - Database
         *     parameters:
         *       - in: query
         *         name: _id
         *         required: true
         *         schema:
         *           type: string
         *         example: 203eafa03d85ca65c0f91770
         *         description: Drawing object id to fetch
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Returns drawing with a specific id.
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/getId', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            const drawingID: string = req.query._id;
            this.databaseService.getDrawing(drawingID).then((result: Message) => {
                res.json(result);
            });
        });

        /**
         * @swagger
         *
         * /api/database/getTags:
         *   get:
         *     description: Return drawing with specific tags.
         *     tags:
         *       - Database
         *     parameters:
         *       - in: query
         *         name: tags
         *         required: true
         *         schema:
         *           type: array
         *           items:
         *             type: string
         *         explode: false
         *         style: matrix
         *         description: Tags attached to drawings.
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Returns drawings with all tags.
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.get('/getTags', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            // Turn single string or array of strings into array of strings
            const tagsString: string = req.query.tags as string;
            const tags: string[] = tagsString.split(',');
            this.databaseService.getDrawingsByTags(tags).then((result: Message) => {
                res.json(result);
            });
        });

        /**
         * @swagger
         *
         * /api/database/drop:
         *   delete:
         *     description: delete drawing with specific id.
         *     tags:
         *       - Database
         *     parameters:
         *       - in: query
         *         name: _id
         *         required: true
         *         schema:
         *           type: string
         *         example: 203eafa03d85ca65c0f91770
         *         description: Drawing object id to delete
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Returns amount of drawings deleted. If equal to 0, drawing was not found. If equal to 1, drawing was properly deleted.
         *         schema:
         *           $ref: '#/definitions/Message'
         */
        this.router.delete('/drop', async (req: Request, res: Response, next: NextFunction) => {
            // Send the request to the service and send the response
            const drawingID: string = req.query._id;
            console.log('Drawing to delete ID: ' + drawingID);
            this.databaseService.dropDrawing(drawingID).then((result: Message) => {
                res.json(result);
            });
        });
    }
}
