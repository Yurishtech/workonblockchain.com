import { Component, OnInit,AfterViewInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
declare var $:any;
import {constants} from '../../../constants/constants';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit,AfterViewInit {

  constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService) { }
  info: any = {};
  country ='';
  roles='';
  interest_area='';
  expected_salary='';
  selectedValue = [];
  expYear=[];
  jobselected=[];
  position='';
  experience_year='';
  currentUser: User;exp_class;
  log; salary;link;class;
  availability_day;
  active_class;
  job_active_class;
  exp_active_class;resume_active_class;resume_class;base_currency;
  about_active_class;
  term_active_class;
  term_link;
  resume_disable;
  exp_disable;
  current_currency;
  current_salary;
  error_msg;
  expected_validation;
  selectedValueArray=[];
  countriesModel;
  error;
  selectedLocations;
  cities;
  country_log;
  roles_log;
  currency_log;
  salary_log;
  interest_log;
  avail_log;
  current_sal_log;
  current_currency_log;
  count;
  emptyInput;
  ngAfterViewInit(): void
  {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
  }
  ngOnInit()
  {
    this.resume_disable = "disabled";
    this.exp_disable = "disabled";
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser)
    {
      this.router.navigate(['/signup']);
    }
    if(this.currentUser && this.currentUser.type === 'candidate')
    {
      this.options.sort(function(a, b){
        if(b.name === 'Remote' || a.name === 'Remote') {
        }
        else {
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        }
      })

      this.dropdown_options.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.area_interested.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.class="btn disabled";
      this.exp_class="btn disabled";
      this.authenticationService.getById(this.currentUser._id)
        .subscribe(
          data => {
            if(data['contact_number']  && data['nationality'])
            {
              this.about_active_class = 'fa fa-check-circle text-success';
            }
            if(data['candidate'].terms_id)
            {
              this.term_active_class='fa fa-check-circle text-success';
              this.term_link = '/terms-and-condition';
            }

            if(data['candidate'].locations || data['candidate'].roles || data['candidate'].interest_areas ||  data['candidate'].expected_salary || data['candidate'].availability_day || data['candidate'].expected_salary_currency)
            {
              if(data['candidate'].locations)
              {
                for (let country1 of data['candidate'].locations)
                {
                  if (country1['remote'] === true) {
                    this.selectedValueArray.push({name: 'Remote' , visa_needed : country1.visa_needed});

                  }

                  if (country1['country']) {
                    let country = country1['country'] + ' (country)'
                    this.selectedValueArray.push({name:  country , visa_needed : country1.visa_needed});
                  }
                  if (country1['city']) {
                    let city = country1['city'].city + ", " + country1['city'].country + " (city)";
                    this.selectedValueArray.push({_id:country1['city']._id ,name: city , visa_needed : country1.visa_needed});
                  }
                }

                this.selectedValueArray.sort();
                if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
                  let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
                  this.selectedValueArray.splice(0, 0, remoteValue);
                  this.selectedValueArray = this.filter_array(this.selectedValueArray);

                }
                this.selectedLocations = this.selectedValueArray;
              }


              if(data['candidate'].interest_areas)
              {
                for (let interest of data['candidate'].interest_areas)
                {

                  for(let option of this.area_interested)
                  {

                    if(option.value === interest)
                    {
                      option.checked=true;
                      this.selectedValue.push(interest);

                    }

                  }

                }
              }
              if(data['candidate'].roles)
              {
                for (let area of data['candidate'].roles)
                {

                  for(let option of this.dropdown_options)
                  {
                    if(option.value === area)
                    {
                      option.checked=true;
                      this.jobselected.push(area);

                    }

                  }

                }
              }

              this.salary = data['candidate'].expected_salary;
              this.availability_day = data['candidate'].availability_day;
              if(data['candidate'].expected_salary_currency)
                this.base_currency = data['candidate'].expected_salary_currency;
              if(data['candidate'].current_currency && data['candidate'].current_salary)
                this.current_currency =data['candidate'].current_currency;
              this.current_salary = data['candidate'].current_salary;


              if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas && data['candidate'].expected_salary && data['candidate'].availability_day)
              {
                this.active_class = 'fa fa-check-circle text-success';
                this.class = "btn";
                this.job_active_class = 'fa fa-check-circle text-success';
                this.resume_disable ='';
                this.resume_class="/resume";

              }

              if(data['candidate'].why_work)
              {
                this.exp_disable ='';
                this.resume_active_class='fa fa-check-circle text-success';
                this.exp_class = "/experience";
              }



              if(data['candidate'].description )
              {
                this.exp_class = "/experience";
                this.exp_active_class = 'fa fa-check-circle text-success';
              }

            }



          },
          error => {
            if(error['message'] === 500 || error['message'] === 401)
            {
              localStorage.setItem('jwt_not_found', 'Jwt token not found');
              localStorage.removeItem('currentUser');
              localStorage.removeItem('googleUser');
              localStorage.removeItem('close_notify');
              localStorage.removeItem('linkedinUser');
              localStorage.removeItem('admin_log');
              window.location.href = '/login';
            }

            if(error['message'] === 403)
            {
              this.router.navigate(['/not_found']);
            }

          });
    }
    else
    {
      this.router.navigate(['/not_found']);
    }


  }

  currency = constants.currency;
  experience = constants.exp_year;
  options = constants.options;
  dropdown_options = constants.dropdown_options;
  area_interested = constants.area_interested;
  year = constants.year;
  availability = constants.availability;

  onAreaSelected(e)
  {
    if(e.target.checked)
    {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(this.findIndexToUpdate, e.target.value);
      let index = this.selectedValue.indexOf(updateItem);
      this.selectedValue.splice(index, 1);
    }

  }

  onJobSelected(e)
  {
    if(e.target.checked)
    {
      this.jobselected.push(e.target.value);
    }
    else{
      let updateItem = this.jobselected.find(this.findIndexToUpdate, e.target.value);
      let index = this.jobselected.indexOf(updateItem);
      this.jobselected.splice(index, 1);
    }

  }



  findIndexToUpdate(type) {
    return type == this;
  }

  onExperienceChange(event)
  {
    this.experience_year=event.target.value;
    this.expYear.push(event.target.value);
  }



  checkValidation(value) {
    if(value.filter(i => i.visa_needed === true).length === this.selectedLocations.length) return true;
    else return false;
  }

  validatedLocation=[];
  country_input_log;
  onSubmit(f: NgForm)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.error_msg = "";
    this.count = 0;
    this.validatedLocation = [];
    if(!this.selectedValueArray || this.selectedValueArray.length <= 0) {
      this.country_input_log = "Please select at least one location";
    }
    if(!this.selectedLocations) {
      this.country_log = "Please select at least one location which you can work in without needing a visa";
    }

    if(this.selectedLocations && this.selectedLocations.length > 0) {
      if(this.selectedLocations.filter(i => i.visa_needed === true).length === this.selectedLocations.length)
        this.country_log = "Please select at least one location which you can work in without needing a visa";
      for(let location of this.selectedLocations) {
        if(location.name.includes('city')) {
          this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
        }
        if(location.name.includes('country')) {
          this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
        }
        if(location.name === 'Remote') {
          this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
        }

      }
    }

    if(this.selectedLocations && this.selectedLocations.length > 10) {
      this.country_log = "Please select maximum 10 locations";
    }

    if(this.jobselected.length<=0)
    {
      this.roles_log = "Please select at least one role";
    }

    if(!this.base_currency)
    {
      this.currency_log = "Please choose currency";
    }

    if(!this.salary)
    {
      this.salary_log = "Please enter expected yearly salary";
    }

    if(this.selectedValue.length<=0)
    {
      this.interest_log = "Please select at least one area of interest";
    }

    if(!this.availability_day)
    {
      this.avail_log = "Please select employment availability";
    }

    if(this.current_salary && !this.current_currency ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(this.current_salary && this.current_currency === "-1" ) {
      this.current_currency_log = "Please choose currency";
      this.count++;
    }

    if(!this.current_salary && this.current_currency !== "-1") {
      this.current_sal_log = "Please enter current base salary";
      this.count++;
    }
    if((!this.current_salary && !this.current_currency) || (!this.current_salary && this.current_currency === "-1")){
      this.count = 0;
    }


    if( this.count === 0 && this.selectedLocations && this.selectedLocations.length > 0 && this.selectedLocations.length <= 10 && this.selectedLocations.filter(i => i.visa_needed === true).length < this.selectedLocations.length && this.jobselected.length > 0 && this.base_currency && this.salary && this.selectedValue.length > 0 && this.availability_day)
    {
      if(typeof(f.value.expected_salary) === 'string' )
        f.value.expected_salary = parseInt(f.value.expected_salary);
      if(f.value.current_salary && typeof (f.value.current_salary) === 'string') {
        f.value.current_salary = parseInt(f.value.current_salary);

      }
      if(f.value.current_salary === '') {
        f.value.current_salary = 0;
      }
      f.value.current_salary = parseInt(f.value.current_salary);
      f.value.expected_salary = parseInt(f.value.expected_salary);
      f.value.country = this.validatedLocation;
      this.authenticationService.job(this.currentUser._creator, f.value)
        .subscribe(
          data => {
            if(data && this.currentUser)
            {
              this.router.navigate(['/resume']);
            }

            if(data['error'] )
            {
              this.log= data['error'];
            }

          },
          error => {
            if(error['status'] === 404 && error['error']['message'] && error['error']['requestID'] && error['error']['success'] === false) {
              this.router.navigate(['/not_found']);
            }


          });

    }
    else{
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }
  }


  suggestedOptions() {
    if(this.countriesModel !== '') {
        this.error='';
        this.authenticationService.autoSuggestOptions(this.countriesModel , true)
          .subscribe(
            data => {
              if(data) {
                let citiesInput = data;
                let citiesOptions=[];
                for(let cities of citiesInput['locations']) {
                  if(cities['remote'] === true) {
                    citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: 'Remote'});
                  }
                  if(cities['city']) {
                    let cityString = cities['city'].city + ", " + cities['city'].country + " (city)";
                    citiesOptions.push({_id : cities['city']._id , name : cityString});
                  }
                  if(cities['country'] ) {
                    let countryString = cities['country']  + " (country)";
                    if(citiesOptions.findIndex((obj => obj.name === countryString)) === -1)
                      citiesOptions.push({_id:Math.floor((Math.random() * 100000) + 1), name: countryString});
                  }
                }
                this.cities = this.filter_array(citiesOptions);
              }

            },
            error=>
            {
              if(error['message'] === 500 || error['message'] === 401)
              {
                localStorage.setItem('jwt_not_found', 'Jwt token not found');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('googleUser');
                localStorage.removeItem('close_notify');
                localStorage.removeItem('linkedinUser');
                localStorage.removeItem('admin_log');
                window.location.href = '/login';
              }

              if(error.message === 403)
              {
                this.router.navigate(['/not_found']);
              }

            });
    }
  }

  selectedValueFunction(e) {

    if(this.cities) {
      if(this.cities.find(x => x.name === e)) {
        var value2send=document.querySelector("#countryList option[value='"+this.countriesModel+"']")['dataset'].value;

        this.countriesModel = '';
        this.cities = [];
        if(this.selectedValueArray.length > 9) {
          this.error = 'You can select maximum 10 locations';
          setInterval(() => {
            this.error = "" ;
          }, 5000);
        }
        else {
          if(this.selectedValueArray.find(x => x.name === e)) {
            this.error = 'This location has already been selected';
            setInterval(() => {
              this.error = "" ;
            }, 4000);
          }

          else {
            if(value2send) this.selectedValueArray.push({_id:value2send ,  name: e, visa_needed:false});
            else this.selectedValueArray.push({ name: e, visa_needed:false});
          }


        }


      }
      if(this.selectedValueArray.length > 0) {
        this.selectedValueArray.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
        })
        if(this.selectedValueArray.find((obj => obj.name === 'Remote'))) {
          let remoteValue = this.selectedValueArray.find((obj => obj.name === 'Remote'));
          this.selectedValueArray.splice(0, 0, remoteValue);
          this.selectedValueArray = this.filter_array(this.selectedValueArray);

        }
        this.selectedLocations = this.selectedValueArray;
      }
    }

  }

  updateCitiesOptions(e) {
    let objIndex = this.selectedValueArray.findIndex((obj => obj.name === e.target.value));
    this.selectedValueArray[objIndex].visa_needed = e.target.checked;
    this.selectedLocations = this.selectedValueArray;

  }

  deleteLocationRow(i){
    this.selectedValueArray.splice(i, 1);
  }

  filter_array(arr) {
    var hashTable = {};

    return arr.filter(function (el) {
      var key = JSON.stringify(el);
      var match = Boolean(hashTable[key]);

      return (match ? false : hashTable[key] = true);
    });
  }

}

