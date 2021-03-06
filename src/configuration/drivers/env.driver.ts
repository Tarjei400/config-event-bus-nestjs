import { Injectable } from '@nestjs/common';
import { set } from 'lodash';
import 'dotenv/config';
import { BaseDriver } from './base.driver';

const APPLICATION_ENV_VARIABLE_PREFIX = 'app_';

/***
 * Driver to fetch configuration from environment variables
 *
 */
@Injectable()
export class EnvDriver extends BaseDriver {
  constructor() {
    super();
  }

  getEnv(): any {
    return process.env;
  }

  /***
   * Loads env driver and prepares it to use
   * Maps all environment variables to json object. It transforms _ to . in order to prepare path string understandable for lodash
   */
  async load(): Promise<void> {
    const env = this.getEnv();

    const variables = Object.keys(env)
      .map((variable) => ({ key: variable, value: env[variable] }))
      .filter(({ key }) => key.startsWith(APPLICATION_ENV_VARIABLE_PREFIX));

    for (const variable of variables) {
      const key = variable.key.replace(new RegExp('_', 'g'), '.');
      const path = key.slice(APPLICATION_ENV_VARIABLE_PREFIX.length);

      set(this._config, path, variable.value);
    }

    await super.load();
  }
}
