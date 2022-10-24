import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RestApiService
{
  // Base URI

 apiURL =  'https://dev.servermule.hansons.com:8081/api/serviceZoneManager/';

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders(
    {
      'client_secret': '7c5597ac-ee80-464b-87de-286bcb0d45e3',
      'client_id': 'd34c7b65-9e64-4412-acff-ec8e42eebfc6',
      'proj':'serviceZoneManager'
    })
  };

  httpOptionsContent = {
  headers: new HttpHeaders(
  {
    'client_secret': '7c5597ac-ee80-464b-87de-286bcb0d45e3',
    'client_id': 'd34c7b65-9e64-4412-acff-ec8e42eebfc6',
    'content-type': 'application/json',
    'proj':'serviceZoneManager'
  })
};

  getDivisionZipcodeList(): Observable<any>
  {
    return this.http
      .get<any>(this.apiURL+ 'divisions' , this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
  getZipcodeList(queryParam: number): Observable<any>
  {
    let param = '';
    if(queryParam != 0)
    {
      param = '?zoneId='+ queryParam;
      return this.http
        .get<any>(this.apiURL+ 'zip' + param , this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }
    else
    {
      return this.http
        .get<any>(this.apiURL+ 'zip' , this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }
  }
  getZipcodeListByZoneId(queryParam: number): Observable<any>
  {
      return this.http
        .get<any>(this.apiURL+ 'zipCodeByZone/'+  queryParam, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
  }
  getZoneList(queryParam: number): Observable<any>
  {
    let param = '';
    if(queryParam != 0)
    {
      param = '?branchId='+ queryParam;
      return this.http
        .get<any>(this.apiURL+ 'zone' + param, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }
    else
    {
      return this.http
        .get<any>(this.apiURL+ 'zone' , this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.handleError)
        );
    }
  }
  postZone(body: any): Observable<any>
  {

    return this.http
      .post<any>(this.apiURL + 'addZone', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  deletenEditZone(body: any): Observable<any>
  {

    return this.http
      .put<any>(this.apiURL + 'removeZone', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  postZip(body: any): Observable<any>
  {

    return this.http
      .post<any>(this.apiURL + 'addZip', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteZip(body: any): Observable<any>
  {

    return this.http
      .put<any>(this.apiURL + 'removeZip', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  moveZip(body: any): Observable<any>
  {

    return this.http
      .put<any>(this.apiURL + 'moveZip', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: any)
 {
   let errorMessage = '';
   if (error.error instanceof ErrorEvent)
   {
     // Get client-side error
     errorMessage = error.error.message;
   }
   else
   {
     // Get server-side error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   window.alert(errorMessage);
   return throwError(() =>
   {
     return errorMessage;
   });
 }
}
