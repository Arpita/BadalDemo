import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators,AbstractControl } from '@angular/forms';
import { Router} from '@angular/router';
import * as CONSTANT from '../services/constants';
import {UnitComponentService} from './unit.service';
import { AdminService } from '../services/admin.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {
  typingTimer;
  allData: any = [];
  pagination = { 
    limit: 10, 
    maxSize: 3, 
    skip: 0, 
    totalItems: 0
};
  currentPage= 1;
  search='';
  constructor(
    private admin:AdminService,
    private router: Router,
    private fb: FormBuilder,
    private sp: UnitComponentService,

  ) { }

  ngOnInit() {
    this.getList();
  }
  getList() {
    let params = new HttpParams();
    let url = 'http://localhost:3000/units';
    params = params.append('page',this.currentPage.toString());
    params = params.append('limit',this.pagination.limit.toString());
    params = params.append('search',this.search.toString());
    
    this.sp.get(params,url)
        .subscribe(res => {
            this.pagination.totalItems = res.count;
            this.allData = res.list;
        },
    err => {
    });
}

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.getList();
  }

  hitSearchFun() {
    clearTimeout(this.typingTimer);
    if (this.search !='') {
        this.typingTimer = setTimeout(searchFun, 2000);
    }
    let scope=this
    function searchFun() {
        this.currentPage = 1; 
        scope.getList();
    }
  };

  searchFun() {
    this.currentPage = 1; 
    this.getList();
  }

  changeStatus(status,id){
    let url = 'http://localhost:3000/changeStatus';
      let data = {};
      data['id'] = id;
      data['status'] = status;
      
      this.sp.post(data,url).subscribe(
        success=>{
          this.admin.showAlert('Sucess','Status of Unit has been changed.')
          setTimeout(() => {
            this.getList();
        }, 2000);
        }
      );
  }

}
