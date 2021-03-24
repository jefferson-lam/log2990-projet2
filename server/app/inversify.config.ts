import { DrawingsDatabaseController } from '@app/controllers/drawings-database.controller';
import { DrawingsDatabaseService } from '@app/services/database/drawings-database.service';
import { TagValidatorService } from '@app/services/database/tag-validator/tag-validator.service';
import { TitleValidatorService } from '@app/services/database/title-validator/title-validator.service';
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

    container.bind(TYPES.DrawingsDatabaseController).to(DrawingsDatabaseController);
    container.bind(TYPES.DrawingsDatabaseService).to(DrawingsDatabaseService);
    container.bind(TYPES.LocalDrawingsController).to(LocalDrawingsController);
    container.bind(TYPES.LocalDrawingsService).to(LocalDrawingsService);

    container.bind(TYPES.TagValidatorService).to(TagValidatorService);
    container.bind(TYPES.TitleValidatorService).to(TitleValidatorService);

    return container;
};
