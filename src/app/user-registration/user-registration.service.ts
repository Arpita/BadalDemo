import {Injectable} from '@angular/core';
import {AdminService} from '../services/admin.service';


@Injectable({
    providedIn: 'root'
})
export class UserRegistrationComponentService {
    constructor(public api: AdminService) {
    }

    post(data, url) {
        return this.api.postData(url, data);
    }

    get(data,url) {
        return this.api.getData(url,data);
    }

}
