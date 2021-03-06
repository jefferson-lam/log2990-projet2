import { DateController } from '@app/controllers/date.controller';
import { DrawingsDatabaseController } from '@app/controllers/drawings-database.controller';
import { IndexController } from '@app/controllers/index.controller';
import { DateService } from '@app/services/date.service';
import { DrawingsDatabaseService } from '@app/services/drawings-database.service';
import { IndexService } from '@app/services/index.service';
import { Container } from 'inversify';
import { Application } from './app';
import { LocalDrawingsController } from './controllers/local-drawings.controller';
import { Server } from './server';
import { LocalDrawingsService } from './services/local-drawings.service';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind(TYPES.IndexController).to(IndexController);
    container.bind(TYPES.IndexService).to(IndexService);

    container.bind(TYPES.DateController).to(DateController);
    container.bind(TYPES.DateService).to(DateService);

<<<<<<< HEAD
    container.bind(TYPES.DrawingsDatabaseController).to(DrawingsDatabaseController);
    container.bind(TYPES.DrawingsDatabaseService).to(DrawingsDatabaseService);
=======
    container.bind(TYPES.LocalDrawingsController).to(LocalDrawingsController);
    container.bind(TYPES.LocalDrawingsService).to(LocalDrawingsService);
>>>>>>> feature/database

    return container;
};
