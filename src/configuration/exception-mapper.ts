import { IExceptionMapper } from '../exception-mapper.interface';
import { ConfigFileNotFoundException } from './exceptions/config-file-not-found.exception';
import { ConfigUnknownException } from './exceptions/config-unknown.exception';
import { YAMLSemanticError } from 'yaml/util';
import { ConfigParseException } from './exceptions/config-parse.exception';

/***
 * Maps exceptions which are understandable within application
 */
export class ConfigurationExceptionMapper implements IExceptionMapper {
  map(err: any): void {
    if (err.code === 'ENOENT') {
      throw new ConfigFileNotFoundException(err);
    }
    if (err instanceof YAMLSemanticError) {
      throw new ConfigParseException(err);
    }

    console.log('Error:', err);
    throw new ConfigUnknownException(err);
  }
}
