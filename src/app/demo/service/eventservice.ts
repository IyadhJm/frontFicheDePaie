import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FicheDePaie } from 'src/app/FicheDePaie';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private url = "http://localhost:8082/commands/fdp";
  private url1= "http://localhost:8082/query";
  constructor(private http: HttpClient) { }

  getAllFdp(){
    return this.http.get<any>(`${this.url1}/AllFdp`);
  }
  getFDPById(id: string){
    return this.http.get<FicheDePaie>(`${this.url1}/Fdp/${id}`)
  }

  addFdp(fdp:FicheDePaie ){
    return this.http.post<FicheDePaie>(`${this.url}/create`, fdp)
  }

  updateFdp(fdp:FicheDePaie){
    return this.http.put<FicheDePaie>(`${this.url}/update`, fdp);
  }


}
