import { Message } from '@common/communication/message';
import * as DatabaseConstants from '@common/validation/database-constants';
import { injectable } from 'inversify';

@injectable()
export class ValidatorService {
    protected isMessageError(message: Message): boolean {
        return message.title === DatabaseConstants.ERROR_MESSAGE;
    }
}
