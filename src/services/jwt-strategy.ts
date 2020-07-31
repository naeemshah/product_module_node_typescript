// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors, Request} from '@loopback/rest';
import axios, {AxiosResponse} from 'axios';
import {authUrl} from '../helper';

export type User = {
  email: string;
  id: string;
  name: string;
  accounts?: {id: string}[];
  parentId?: string;
  userDevice: Array<User>;
};

export class JwtService {
  async authenticate(request: Request): Promise<User> {
    try {
      const token: string = this.extractCredentials(request);
      const response: AxiosResponse = await axios.get(
        authUrl + '/v1/users/checkAuth',
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      );
      const user: User = response.data;
      // this.tokenService.verifyToken(token);
      return user;
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.statusCode === 401
      ) {
        const error = new HttpErrors.Unauthorized('You are unauthorized');
        throw error;
      } else {
        throw new HttpErrors.Unauthorized(`Authorization failed.`);
      }
    }
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];

    return token;
  }
}
