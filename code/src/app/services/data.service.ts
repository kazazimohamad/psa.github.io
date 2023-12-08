import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Question} from "../core/interfaces/question";
import {map} from "rxjs";
interface ResponseData {
  questions : Question[]
}
@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get<ResponseData>('assets/data/data.json')
  }
}
