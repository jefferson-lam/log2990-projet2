import { TYPES } from '@app/types';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { DateService } from './date.service';
import { IndexService } from './index.service';

describe('Local Drawings Service', () => {
    let indexService: IndexService;
    let dateService: Stubbed<DateService>;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(TYPES.DateService).toConstantValue({
            currentTime: sandbox.stub().resolves({
                title: 'Time',
                body: new Date(2020, 0, 10).toString(),
            }),
        });
        dateService = container.get(TYPES.DateService);
        indexService = container.get<IndexService>(TYPES.IndexService);
    });
});
