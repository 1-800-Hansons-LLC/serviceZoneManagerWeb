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

 apiURL =  'https://localhost:8081/api/serviceZoneManager/';

  constructor(private http: HttpClient) {}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders(
    {
      'client_secret': '383d3ab5-25c1-490b-af9c-5e1a7bbf3a0c',
      'client_id': '40829494-9c4d-4d22-8a26-8cd3970895e8',
      'proj':'serviceZoneManager'
    })
  };

  httpOptionsContent = {
  headers: new HttpHeaders(
  {
    'client_secret': '383d3ab5-25c1-490b-af9c-5e1a7bbf3a0c',
    'client_id': '40829494-9c4d-4d22-8a26-8cd3970895e8',
    'content-type': 'application/json',
    'proj':'serviceZoneManager'
  })
};

  getDivisionNZipcodeList(): Observable<any>
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
    debugger;
    return this.http
      .post<any>(this.apiURL + 'addZone', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  deletenEditZone(body: any): Observable<any>
  {
    debugger;
    return this.http
      .put<any>(this.apiURL + 'removeZone', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  postZip(body: any): Observable<any>
  {
    debugger;
    return this.http
      .post<any>(this.apiURL + 'addZip', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteZip(body: any): Observable<any>
  {
    debugger;
    return this.http
      .put<any>(this.apiURL + 'removeZip', JSON.stringify(body), this.httpOptionsContent)
      .pipe(
        catchError(this.handleError)
      );
  }
  moveZip(body: any): Observable<any>
  {
    debugger;
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
