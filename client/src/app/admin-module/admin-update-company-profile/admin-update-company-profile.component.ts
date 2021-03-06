import { Component, OnInit, ElementRef , Input , ViewChild, Inject, PLATFORM_ID} from '@angular/core';
import {UserService} from '../../user.service';
import { DataService } from '../../data.service';
import {NgForm , FormBuilder} from '@angular/forms';
import { Router , ActivatedRoute} from '@angular/router';
import { DatePipe,isPlatformBrowser } from '@angular/common';
import {constants} from '../../../constants/constants';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { HowHearAboutWobComponent } from '../../L1-items/users/how-hear-about-wob/how-hear-about-wob.component';
import { HearAboutWobOtherInfoComponent } from '../../L1-items/users/hear-about-wob-other-info/hear-about-wob-other-info.component';
declare var $:any;

@Component({
  selector: 'app-admin-update-company-profile',
  templateUrl: './admin-update-company-profile.component.html',
  styleUrls: ['./admin-update-company-profile.component.css']
})
export class AdminUpdateCompanyProfileComponent implements OnInit {
  @ViewChild(HowHearAboutWobComponent) howHearAboutWob: HowHearAboutWobComponent;
  @ViewChild(HearAboutWobOtherInfoComponent) otherInfo : HearAboutWobOtherInfoComponent;

  @Input() name: string;
  cropperSettings: CropperSettings;
  imageCropData:any;
  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;
  info : any;currentUser: any;log;founded_log;
  employee_log;funded_log;
  des_log;image_src;company_founded;no_of_employees;company_funded;
  company_description;last_name;first_name;job_title;company_website;company_name;
  company_phone;company_country;company_city;company_postcode;image;email;
  company_postcode_log;first_name_log;last_name_log;job_title_log;
  company_website_log;company_phone_log;company_city_log;email_notification_log;
  error_msg;about_active_class;companyMsgTitle;current_salary;index;
  other_technologies;expected_validation;currentyear;yearValidation;cities;error;
  when_receive_email_notitfications;email_notificaiton = constants.email_notificaiton;
  company_id;admin_log;yearVerification;country_code;
  country_code_log;contact_number_log;imagePreviewLink;prefil_image;
  hear_about_wob;otherReasons;discount;country_codes = constants.country_codes;
  usa_privacy_shield;us_privacy_shield_error;
  canadian_commercial_company;commercial_canada_error;

  constructor(private _fb: FormBuilder ,private datePipe: DatePipe,
              private router: Router ,private route: ActivatedRoute,
              private authenticationService: UserService,
              private dataservice: DataService,
              private el: ElementRef,@Inject(PLATFORM_ID) private platformId: Object) {
    this.route.queryParams.subscribe(params => {
      this.company_id = params['company'];
    });
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.minWidth = 180;
    this.cropperSettings.minHeight = 180;
    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
    this.cropperSettings.cropperDrawSettings.strokeColor = 'black';
    this.imageCropData = {};
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        $('.selectpicker').selectpicker();
      }, 500);

      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      }, 900);
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) $('.selectpicker').selectpicker('refresh');
    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser) this.router.navigate(['/login']);
    else if(this.currentUser && this.admin_log) {
      this.authenticationService.getCurrentCompany(this.company_id, true)
        .subscribe(
          data =>
          {
            if(data)
            {
              if(data['_creator'].hear_about_wob) this.hear_about_wob = data['_creator'].hear_about_wob;
              if(data['_creator'].hear_about_wob && data['_creator'].hear_about_wob === 'Other' && data['_creator'].hear_about_wob_other_info) this.otherReasons = data['_creator'].hear_about_wob_other_info;
              this.email = data['_creator'].email;
              this.when_receive_email_notitfications = data['when_receive_email_notitfications'];
            }
            if(data['company_founded'] && data['no_of_employees'] && data['company_funded'] && data['company_description'])
            {
              this.company_founded = data['company_founded'];
              this.no_of_employees = data['no_of_employees'];
              this.company_funded = data['company_funded'];
              this.company_description = data['company_description'];
              if(data['company_logo'] != null) {
                this.imagePreviewLink = data['company_logo'];
              }
            }

            if(data['discount']) this.discount = data['discount'];

            if(data['first_name'] && data['last_name'] && data['job_title'] && data['company_name'] && data['company_website'] &&
              data['company_phone'] && data['company_postcode'])
            {
              this.first_name= data['first_name'];
              this.last_name=data['last_name'];
              this.job_title =data['job_title'];
              this.company_name=data['company_name'];
              this.company_website=data['company_website'];

              this.company_phone = '';
              let contact_number = data['company_phone'];
              contact_number = contact_number.replace(/^00/, '+');
              contact_number = contact_number.split(" ");
              if(contact_number.length>1) {
                for (let i = 0; i < contact_number.length; i++) {
                  if (i === 0) this.country_code = contact_number[i];
                  else this.company_phone = this.company_phone+''+contact_number[i];
                }
              }
              else this.company_phone = contact_number[0];

              this.company_country=data['company_country'];
              this.company_city =data['company_city'];
              this.company_postcode = data['company_postcode'];

            }

            if(data['saved_searches'] && data['saved_searches'].length > 0) {
              if (isPlatformBrowser(this.platformId)) {
                setTimeout(() => {
                  $('.selectpicker').selectpicker();
                  $('.selectpicker').selectpicker('refresh');
                }, 500);
              }
            }

            if(data['usa_privacy_shield'] === true) this.usa_privacy_shield = 'yes';
            if(data['usa_privacy_shield'] === false) this.usa_privacy_shield = 'no';

            if(data['canadian_commercial_company'] === true) this.canadian_commercial_company = 'yes';
            if(data['canadian_commercial_company'] === false) this.canadian_commercial_company = 'no';
          },
          error =>
          {
            if(error['message'] === 500 || error['message'] === 401) {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error['message'] === 403) this.router.navigate(['/not_found']);
          });
    }
    else this.router.navigate(['/not_found']);
  }

  company_profile(profileForm: NgForm) {
    let count = 0;
    this.error_msg = "";
    this.contact_number_log = '';

    if(this.company_founded){
      this.company_founded = parseInt(this.company_founded);
    }
    if(!this.first_name) {
      this.first_name_log="Please enter first name";
    }
    if(!this.last_name) {
      this.last_name_log="Please enter last name";
    }
    if(!this.job_title) {
      this.job_title_log="Please enter job title";
    }
    if(!this.company_website) {
      this.company_website_log="Please enter company website url";
    }
    if(!this.company_phone) {
      this.company_phone_log="Please enter phone number";
    }
    if (this.company_phone) {
      if(this.company_phone.length < 4 || this.company_phone.length > 15){
        this.contact_number_log = "Please enter minimum 4 and maximum 15 digits";
        count = 1;
      }
      if(!this.checkNumber(this.company_phone)) {
        count = 1;
      }
    }

    if(this.discount && !this.checkNumber(this.discount)) count = 1;
    if(this.discount && !this.discountRange(this.discount)) count = 1;

    if(!this.country_code){
      this.country_code_log = 'Please select country code';
    }
    if(!this.company_city) {
      this.company_city_log="Please enter city name";
    }
    if(!this.company_postcode) {
      this.company_postcode_log="Please enter post code";
    }
    if(!this.company_founded) {
      this.founded_log = 'Please fill when was the company founded';
    }
    if(this.company_founded >  this.currentyear ) {
      this.yearValidation = "Date must be in the past"
    }

    if(this.company_founded < 1800) {
      this.yearValidation = "Please enter value greater than 1800";
    }

    if(!this.no_of_employees) {
      this.employee_log = 'Please fill no. of employees';
    }
    if(!this.company_funded) {
      this.funded_log = 'Please fill how is the company funded';
    }
    if(!this.company_description) {
      this.des_log = 'Please fill Company Description';
    }

    if(!this.when_receive_email_notitfications) {
      this.email_notification_log = "Please select when you want to receive email notification";
    }

    if(count === 0 && this.company_founded && this.company_founded > 1800 && this.company_founded <=  this.currentyear && this.no_of_employees
      && this.company_funded && this.company_description && this.when_receive_email_notitfications &&
      this.first_name && this.last_name && this.job_title && this.company_website &&
      this.company_phone && this.country_code && this.company_city && this.company_postcode )  {
      profileForm.value.company_founded = parseInt(profileForm.value.company_founded);
      if(this.howHearAboutWob.howHearAboutWOB) profileForm.value.hear_about_wob = this.howHearAboutWob.howHearAboutWOB;
      if(this.howHearAboutWob.howHearAboutWOB && this.howHearAboutWob.howHearAboutWOB === 'Other' && this.otherInfo.otherInfo) profileForm.value.hear_about_wob_other_info = this.otherInfo.otherInfo;
      else profileForm.value.unset_hear_about_wob_other_info = true;

      if(this.imageCropData.image) {
        const file = this.dataURLtoFile(this.imageCropData.image, this.imageName);
        const formData = new FormData();
        formData.append('company_logo', file);
        this.authenticationService.edit_company_profile(this.company_id ,formData , true)
          .subscribe(
            data => {
              if (data) {
              }
            },
            error => {
              if (error['status'] === 401 && error['error']['message'] === 'Jwt token not found' && error['error']['requestID'] && error['error']['success'] === false) {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }
            }
          );
      }

      profileForm.value.company_phone = this.country_code +' '+ this.company_phone;

      if(profileForm.value.usa_privacy_shield || profileForm.value.canadian_commercial_company) profileForm.value.gdpr_compliance = true;
      if(profileForm.value.usa_privacy_shield === 'yes') profileForm.value.usa_privacy_shield = 'true';
      if(profileForm.value.usa_privacy_shield === 'no') profileForm.value.usa_privacy_shield = 'false';

      if(profileForm.value.canadian_commercial_company === 'yes') profileForm.value.canadian_commercial_company = 'true';
      if(profileForm.value.canadian_commercial_company === 'no') profileForm.value.canadian_commercial_company = 'false';

      if(this.discount) profileForm.value.discount = parseInt(this.discount);
      this.authenticationService.edit_company_profile(this.company_id, profileForm.value, true)
        .subscribe(
          data => {
            if(data && this.currentUser)
              this.router.navigate(['/admins/company/'+ this.company_id]);
          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.dataservice.changeMessage(error['error']['message']);
            }
            else if(error['status'] === 400 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.dataservice.changeMessage(error['error']['message']);
            }
            else {
              this.dataservice.changeMessage("Something went wrong");
            }
          });
    }
    else
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
  }

  checkNumber(salary) {
    return /^[0-9]*$/.test(salary);
  }

  imageName;
  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    this.imageName = file.name;
    myReader.readAsDataURL(file);
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type:mime});
  }

  imageCropped(key) {
    if(key === 'cancel') {
      this.imageCropData = {};
    }
    if (isPlatformBrowser(this.platformId)) $('#imageModal').modal('hide');
  }

  discountRange(number){
    if(number > -1 && number < 100)
      return true;
    else return false;
  }
}
