import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators,AbstractControl } from '@angular/forms';
import { Router} from '@angular/router';
import * as CONSTANT from '../services/constants';
import {UserRegistrationComponentService} from './user-registration.service';
import { AdminService } from '../services/admin.service';


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  form:FormGroup;
  submitted = false;

  constructor(
    private admin:AdminService,
    private router: Router,
    private fb: FormBuilder,
    private sp: UserRegistrationComponentService,

  ) { }
  ngOnInit() {
    this.clearDatabase();
 
    this.form = new FormGroup({
      'name' : new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(45)]),
      'noOfBlock' : new FormControl('',[Validators.required,,Validators.min(1)]),
      'noOfTower' : new FormControl('',[Validators.required,Validators.min(1)] ),
      'noOfFloor' : new FormControl('',[Validators.required,,Validators.min(1)]),
      'noOfUnit' : new FormControl('',[Validators.required,Validators.min(1)] ),
    })
  }
  get formCheck() { return this.form.controls;}
  userRegistation(){
    this.submitted=true;
    if (this.form.invalid){
      return;  
    }else{
      let url = 'http://localhost:3000/create';
      let data = {};
      data['appartmentName'] = this.form.value.name;
      data['noOfBlock'] = this.form.value.noOfBlock;
      data['noOfTower'] = this.form.value.noOfTower;
      data['noOfFloor'] = this.form.value.noOfFloor;
      data['noOfUnit'] = this.form.value.noOfUnit;
      this.sp.post(data,url).subscribe(
        success=>{
          this.admin.showAlert('Sucess','Appartment details has been sucessfully added.')
          setTimeout(() => {
            this.router.navigate(['/units']);
        }, 2000);
        }
      );
    }

  }

  clearDatabase(){
      let url = 'http://localhost:3000/clearDatabase';
      let data = {};
      this.sp.get(data,url).subscribe(
        success=>{
        }
      );
    }

  

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
      return true;
  }
}
