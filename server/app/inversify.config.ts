import { DateController } from '@app/controllers/date.controller';
import { DrawingsDatabaseController } from '@app/controllers/drawings-database.controller';
import { IndexController } from '@app/controllers/index.controller';
import { DrawingsDatabaseService } from '@app/services/database/drawings-database.service';
import { TagValidatorService } from '@app/services/database/tag-validator/tag-validator.service';
import { TitleValidatorService } from '@app/services/database/title-validator/title-validator.service';
import { DateService } from '@app/services/date.service';
import { IndexService } from '@app/services/index.service';
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    container.bind(TYPES.IndexController).to(IndexController);
    container.bind(TYPES.IndexService).to(IndexService);

    container.bind(TYPES.DateController).to(DateController);
    container.bind(TYPES.DateService).to(DateService);

    container.bind(TYPES.DrawingsDatabaseController).to(DrawingsDatabaseController);
    container.bind(TYPES.DrawingsDatabaseService).to(DrawingsDatabaseService);

    container.bind(TYPES.TagValidatorService).to(TagValidatorService);
    container.bind(TYPES.TitleValidatorService).to(TitleValidatorService);

    return container;
};
