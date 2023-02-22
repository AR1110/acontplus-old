import { HttpClient } from '@angular/common/http';
import { Inject, Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { AuthModel } from '../../domain/models/auth.model';
import { AuthEntity } from '../entities/auth.entity';
import { AuthMapper } from '../mappers/auth.mapper';
import { ApiService } from '@app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})

export class AuthApiService {

  authMapper = new AuthMapper();

  constructor(private apiSvc: ApiService) {}

    login(data: AuthModel): Observable<AuthModel>{
      return this.apiSvc.post<AuthEntity, AuthModel>('/Login/Login', this.authMapper.mapTo(data))
                        .pipe(map(this.authMapper.mapFrom))
    }



}
