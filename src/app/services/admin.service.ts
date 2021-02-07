import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private http:HttpClient, 
    private router:Router
  )
  {}

  getData(url,param){
    return this.http.get<any>(url,{params:param});
  }

  postData(url,value){
    return this.http.post<any>(url,value);
  }
  
  
  
  showAlert(title:string,text:string){
      swal({
        title:title,
        text:text,
        type:'success',
        showConfirmButton: false,
        timer: 1500
      })
  }
  
    errorAlert(text,status){
      swal({
        type: 'error',
        title: 'Oops...',
        text: text,
      }).then((result)=>
      {
        if(status){
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
      })
    }
  




  

 



}
