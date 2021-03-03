import { DrawingsDatabaseService } from '@app/services/drawings-database.service';
import { TYPES } from '@app/types';
import { testingContainer } from '../../test/test-utils';

describe('Index service', () => {
    let databaseService: DrawingsDatabaseService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        databaseService = container.get<DrawingsDatabaseService>(TYPES.DateService);
    });
});
