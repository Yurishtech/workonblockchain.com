import { Component, OnInit ,ElementRef, Input,AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
declare var $:any;
import { Router, ActivatedRoute } from '@angular/router';
import {UserService} from '../../user.service';
import {User} from '../../Model/user';
import {NgForm} from '@angular/forms';
import { FormBuilder, FormControl, FormArray, FormGroup,Validators } from '@angular/forms';
import { DataService } from "../../data.service";
import {environment} from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import {constants} from '../../../constants/constants';

@Component({
  selector: 'app-admin-update-candidate-profile',
  templateUrl: './admin-update-candidate-profile.component.html',
  styleUrls: ['./admin-update-candidate-profile.component.css']
})
export class AdminUpdateCandidateProfileComponent implements OnInit,AfterViewInit {

  user_id;
  currentUser: User;
  info: any = {}; log;
  selectedValue = [];
  selectedcountry = [];
  jobselected=[];
  salary;
  expected_salaryyy;
  availability_day;
  base_currency;
  experimented_platform = [];
  commercially_worked = [];
  platform=[];
  expYear_db=[];
  referringData;
  value;
  why_work;
  commercial_expYear=[];
  db_valye=[];
  db_lang;
  platforms=[];
  EducationForm: FormGroup;
  ExperienceForm: FormGroup;
  language=[];
  currentdate;
  currentyear;
  expYearRole=[];
  start_month;
  start_year;
  companyname;
  positionname;
  locationname;
  description;
  startdate;
  startyear;
  enddate;
  endyear;
  currentwork;
  uniname;
  degreename;
  fieldname;
  edudate;
  eduyear;
  eduData;
  jobData;
  Intro;
  current_currency;
  LangexpYear=[];
  lang_expYear_db=[];
  lang_db_valye=[];
  img_src;
  lang_log;
  exp_lang_log;
  intro_log;
  uni_name_log;
  degree_log;
  field_log;
  eduYear_log;
  company_log;
  position_log;
  location_log;
  start_date_log;
  end_date_log;
  exp_count=0;
  edu_count=0;
  why_work_log;
  country_log;
  roles_log;
  currency_log;
  salary_log;
  interest_log;
  avail_log;
  current_currency_logg;
  first_name_log;
  last_name_log;
  contact_name_log;
  nationality_log;
  error_msg;
  start_date_year_log;
  end_date_year_log;
  startmonthIndex;
  endmonthIndex;
  start_date_format;
  end_date_format;
  educationjson;
  education_json_array=[];
  commercial_log;
  base_country_log;
  city_log;
  commercial_skill_log;
  current_sal_log;
  count;
  submit;
  validatedLocation=[];
  country_input_log;
  selectedValueArray=[];
  countriesModel;
  error;
  selectedLocations;
  cities;
  emptyInput;

  nationality = constants.nationalities;
  current_work_check=[];
  current_work = constants.current_work;
  countries = constants.countries;
  description_commercial_platforms;
  description_experimented_platforms;
  description_commercial_skills;

  constructor(private dataservice: DataService,private datePipe: DatePipe,private _fb: FormBuilder,private http: HttpClient,private route: ActivatedRoute,private router: Router,private authenticationService: UserService, private el: ElementRef)
  {
    this.route.queryParams.subscribe(params => {
      this.user_id = params['user'];
    });
  }

  private education_data(): FormGroup[]
  {
    return this.eduData
      .map(i => this._fb.group({ uniname: i.uniname , degreename : i.degreename,fieldname:i.fieldname,eduyear:i.eduyear} ));
  }

  private history_data(): FormGroup[]
  {
    return this.jobData
      .map(i => this._fb.group({ companyname: i.companyname , positionname : i.positionname, locationname:i.locationname, description:i.description,startdate:i.startdate, start_date:this.monthNumToName(this.datePipe.transform(i.startdate, 'MM') )/*this.datePipe.transform(i.startdate, 'MM') */, startyear: this.datePipe.transform(i.startdate, 'yyyy') , enddate :i.enddate , end_date:this.monthNumToName(this.datePipe.transform(i.enddate, 'MM')) , endyear:this.datePipe.transform(i.enddate, 'yyyy') , currentwork: i.currentwork} ));
  }

  monthNumToName(monthnum) {
    return this.calen_month[monthnum-1] || '';
  }


  otherSkills = constants.otherSkills;
  skillDbArray=[];
  skillDb;
  skill_expYear_db=[];
  admin_log;
  ngOnInit()
  {
    this.currentyear = this.datePipe.transform(Date.now(), 'yyyy');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.admin_log = JSON.parse(localStorage.getItem('admin_log'));

    this.EducationForm = this._fb.group({
      itemRows: this._fb.array([this.initItemRows()])
    });

    this.ExperienceForm = this._fb.group({
      ExpItems: this._fb.array([this.initExpRows()])
    });
    if(this.currentUser && this.admin_log)
    {
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

      this.commercially.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.experimented.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })

      this.language_opt.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      })
      this.authenticationService.getById(this.user_id)
        .subscribe(data =>
          {
            if(data)
            {
              this.info.email = data['email'];
              if(data['contact_number']  || data['nationality'] || data['first_name'] || data['last_name'] || data['candidate'])
              {

                this.info.contact_number = data['contact_number'];
                if(data['candidate'].github_account) this.info.github_account = data['candidate'].github_account;
                if(data['candidate'].stackexchange_account) this.info.exchange_account = data['candidate'].stackexchange_account;
                if(data['candidate'].linkedin_account) this.info.linkedin_account = data['candidate'].linkedin_account;
                if(data['candidate'].medium_account) this.info.medium_account = data['candidate'].medium_account;
                this.info.nationality = data['nationality'];
                this.info.first_name =data['first_name'];
                this.info.last_name =data['last_name'];

                if(data['image'] != null )
                {
                  this.info.image_src =  data['image'] ;
                  let x = this.info.image_src.split("/");

                  let last:any = x[x.length-1];

                  this.img_src = last;
                }

                if(data['candidate'] && data['candidate'].base_country)
                {
                  this.info.base_country = data['candidate'].base_country;
                }
                if(data['candidate'] && data['candidate'].base_city){
                  this.info.city = data['candidate'].base_city;
                }


              }
              this.why_work=data['candidate'].why_work;
              if(data['candidate'] && data['candidate'].blockchain)
              {
                if(data['candidate'].blockchain.commercial_skills )
                {
                  this.commercialSkillsExperienceYear = data['candidate'].blockchain.commercial_skills;
                  for (let key of data['candidate'].blockchain.commercial_skills)
                  {
                    for(var i in key)
                    {

                      for(let option of this.otherSkills)
                      {

                        if(option.value === key[i])
                        {
                          option.checked=true;
                          this.skillDbArray.push(key[i]);
                          this.skillDb= ({value: key[i]});
                          this.commercialSkills.push(this.skillDb);

                        }
                        else
                        {

                        }

                      }

                      for(let option of this.exp_year)
                      {

                        if(option.value === key[i])
                        {
                          option.checked=true;
                          this.skill_expYear_db.push(key[i]);

                        }

                      }

                    }
                  }
                }

                if(data['candidate'].blockchain.description_commercial_skills)
                {
                  this.description_commercial_skills = data['candidate'].blockchain.description_commercial_skills;
                }

                if(data['candidate'].blockchain.commercial_platforms)
                {
                  this.commercial_expYear = data['candidate'].blockchain.commercial_platforms;
                  for (let key of data['candidate'].blockchain.commercial_platforms)
                  {
                    for(var i in key)
                    {


                      for(let option of this.commercially)
                      {

                        if(option.value == key[i])
                        {
                          option.checked=true;
                          this.db_valye.push(key[i]);
                          this.db_lang= ({value: key[i]});
                          this.commercially_worked.push(this.db_lang);

                        }
                        else
                        {

                        }

                      }

                      for(let option of this.exp_year)
                      {

                        if(option.value == key[i])
                        {
                          option.checked=true;
                          this.expYear_db.push(key[i]);

                        }

                      }

                    }
                  }

                }

                if(data['candidate'].blockchain.description_commercial_platforms)
                {
                  this.description_commercial_platforms = data['candidate'].blockchain.description_commercial_platforms;
                }

                if(data['candidate'].blockchain.experimented_platforms)
                {
                  for (let plat of data['candidate'].blockchain.experimented_platforms)
                  {

                    for(let option of this.experimented)
                    {

                      if(option.value === plat)
                      {
                        option.checked=true;
                        this.experimented_platform.push(plat);

                      }

                    }

                  }
                }

                if(data['candidate'].blockchain.description_experimented_platforms)
                {
                  this.description_experimented_platforms = data['candidate'].blockchain.description_experimented_platforms;
                }
              }

              if(data['candidate'].locations && data['candidate'].roles && data['candidate'].interest_areas &&  data['candidate'].expected_salary && data['candidate'].availability_day && data['candidate'].expected_salary_currency)
              {

                if(data['candidate'].locations)
                {
                  for (let country1 of data['candidate'].locations)
                  {
                    if (country1['remote'] === true) {
                      this.selectedValueArray.push({name: 'Remote' , visa_needed : country1['visa_needed']});

                    }

                    if (country1['country']) {
                      let country = country1['country'] + ' (country)'
                      this.selectedValueArray.push({name:  country , visa_needed : country1['visa_needed']});
                    }
                    if (country1['city']) {
                      let city = country1['city'].city + ", " + country1['city'].country + ' (city)';
                      this.selectedValueArray.push({_id:country1['city']._id ,name: city , visa_needed : country1['visa_needed']});
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

                for(let interest of data['candidate'].interest_areas)
                {

                  for(let option of this.area_interested)
                  {

                    if(option.value === interest)
                    {
                      option.checked = true;
                      this.selectedValue.push(interest);

                    }

                  }

                }

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

                this.expected_salaryyy = data['candidate'].expected_salary;

                this.availability_day = data['candidate'].availability_day;
                if(data['candidate'].expected_salary_currency)
                  this.base_currency = data['candidate'].expected_salary_currency;
              }


              if(data['candidate'].current_currency ){
                this.current_currency =data['candidate'].current_currency;
              }
              if(data['candidate'].current_salary) {
                this.salary = data['candidate'].current_salary;
              }
              this.Intro =data['candidate'].description;
              if(data['candidate'].programming_languages && data['candidate'].programming_languages.length > 0)
              {
                this.LangexpYear = data['candidate'].programming_languages;
                for (let key of data['candidate'].programming_languages)
                {
                  for(var i in key)
                  {


                    for(let option of this.language_opt)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.lang_db_valye.push(key[i]);
                        this.db_lang= ({value: key[i]});
                        this.language.push(this.db_lang);
                      }
                      else
                      {

                      }

                    }

                    for(let option of this.exp_year)
                    {

                      if(option.value == key[i])
                      {
                        option.checked=true;
                        this.lang_expYear_db.push(key[i]);

                      }

                    }

                  }
                }
              }
              if(data['candidate'].work_history) {
                this.jobData = data['candidate'].work_history;

                for(let data1 of data['candidate'].work_history)
                {
                  this.current_work_check.push(data1.currentwork);

                }

                this.ExperienceForm = this._fb.group({
                  ExpItems: this._fb.array(
                    this.history_data()
                  )
                });
              }

              if(data['candidate'].education_history)
              {

                this.eduData = data['candidate'].education_history;
                this.EducationForm = this._fb.group({
                  itemRows: this._fb.array(
                    this.education_data()
                  )
                });
                setTimeout(() => {
                  $('.selectpicker').selectpicker();
                }, 300);

                setTimeout(() => {
                  $('.selectpicker').selectpicker('refresh');
                }, 900);
              }
            }

          },
          error =>
          {
            if(error.message === 500 || error.message === 401)
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

  ngAfterViewInit(): void
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 300);

    setTimeout(() => {
      $('.selectpicker').selectpicker('refresh');
    }, 900);
  }

  currency = constants.currencies;
  experience = constants.experienceYears;
  dropdown_options = constants.workRoles;
  area_interested = constants.workBlockchainInterests;
  graduation_year = constants.year;
  year = constants.year;
  availability = constants.workAvailability;
  commercially = constants.blockchainPlatforms;
  experimented = constants.experimented;
  exp_year = constants.experienceYears;

  onExpOptions(e)
  {

    if(e.target.checked)
    {
      this.experimented_platform.push(e.target.value);
    }
    else{
      let updateItem = this.experimented_platform.find(this.findIndexToUpdateExperimented, e.target.value);

      let index = this.experimented_platform.indexOf(updateItem);

      this.experimented_platform.splice(index, 1);
    }

  }

  findIndexToUpdateExperimented(type) {
    return type == this;
  }

  oncommerciallyOptions(obj)
  {

    let updateItem = this.commercially_worked.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.commercially_worked.indexOf(updateItem);
    if(index > -1)
    {
      this.commercially_worked.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercial_expYear, 'name', obj.value);
      let index2 = this.commercial_expYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercial_expYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercially_worked.push(obj);
    }

  }

  onComExpYearOptions(e, value)
  {


    let updateItem = this.findObjectByKey(this.commercial_expYear, 'name', value);

    let index = this.commercial_expYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercial_expYear.splice(index, 1);
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { name :this.value, exp_year: e.target.value};
      this.commercial_expYear.push(this.referringData);

    }
    this.commercial_expYear.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
  }

  findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }

    }
    return null;
  }

  calen_month = constants.calen_month;
  language_opt = constants.programmingLanguages;

  onLangExpOptions(obj)
  {
    let updateItem = this.language.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.language.indexOf(updateItem);
    if(index > -1)
    {
      this.language.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.LangexpYear, 'language', obj.value);
      let index2 = this.LangexpYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.LangexpYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.language.push(obj);
    }
    this.LangexpYear.sort(function(a, b){
      if(a.language < b.language) { return -1; }
      if(a.language > b.language) { return 1; }
      return 0;
    })

  }


  findIndexToUpdate(obj)
  {
    return obj.value === this;
  }

  findIndexToUpdate_funct(obj)
  {
    return obj.value === this;
  }



  onJobSelected(e)
  {
    //this.yearselected= event.target.value;
    if(e.target.checked)
    {
      this.jobselected.push(e.target.value);
    }
    else{

      let updateItem = this.jobselected.find(this.findIndexToUpdateCheck, e.target.value);

      let index = this.jobselected.indexOf(updateItem);

      this.jobselected.splice(index, 1);
    }
    //this.position = event.target.value;
  }

  initItemRows()
  {
    return this._fb.group({
      uniname: [''],
      degreename:[''],
      fieldname:[''],
      eduyear:[]
    });

  }
  initItemRows_db()
  {
    return this._fb.group({
      uniname: [this.uniname],
      degreename:[this.degreename],
      fieldname:[this.fieldname],
      edudate:[this.edudate],
      eduyear:[this.eduyear]
    });


  }

  initExpRows_db()
  {
    return this._fb.group({
      companyname: [this.companyname],
      positionname:[this.positionname],
      locationname: [this.locationname],
      description: [this.description] ,
      startdate:[this.startdate],
      startyear:[this.startyear],
      enddate:[this.enddate],
      endyear:[this.endyear],
      currentwork:[this.currentwork],
      currentenddate:[this.currentdate],
      currentendyear:[this.currentyear]
    });
  }


  initExpRows()
  {
    return this._fb.group({
      companyname:[''],
      positionname:[''],
      locationname: [''],
      description: [''] ,
      startdate:[],
      startyear:[],
      end_date:[],
      endyear:[],
      start_date:[],
      enddate:[],
      currentwork:[false],

    });
  }

  currentWork(){
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 200);
  }
  addNewExpRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 200);
    // control refers to your formarray
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    // add new formgroup
    control.push(this.initExpRows());
  }

  deleteExpRow(index: number)
  {
    // control refers to your formarray
    const control = <FormArray>this.ExperienceForm.controls['ExpItems'];
    // remove the chosen row
    control.removeAt(index);
  }

  get DynamicWorkFormControls()
  {

    return <FormArray>this.ExperienceForm.get('ExpItems');
  }
  addNewRow()
  {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
    }, 100);
    // control refers to your formarray
    //this.EducationForm.value.itemRows = "";
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    // add new formgroup
    control.push(this.initItemRows());
  }


  deleteRow(index: number)
  {

    // control refers to your formarray
    const control = <FormArray>this.EducationForm.controls['itemRows'];
    // remove the chosen row
    control.removeAt(index);
  }

  get DynamicEduFormControls() {

    return <FormArray>this.EducationForm.get('itemRows');
  }

  onLangExpYearOptions(e, value)
  {

    let updateItem = this.findObjectByKey(this.LangexpYear, 'language', value);
    let index = this.LangexpYear.indexOf(updateItem);

    if(index > -1)
    {

      this.LangexpYear.splice(index, 1);
      this.value=value;
      this.referringData = { language:this.value, exp_year: e.target.value};
      this.LangexpYear.push(this.referringData);
    }
    else
    {
      this.value=value;
      this.referringData = { language:this.value, exp_year: e.target.value};
      this.LangexpYear.push(this.referringData);

    }


  }
  onRoleYearOptions(e, value)
  {
    this.value=value;
    this.referringData = { name:this.value, exp_year: e.target.value};
    this.expYearRole.push(this.referringData);
  }

  work_start_data(e)
  {
    this.start_month = e.target.value ;
  }
  work_start_year(e)
  {
    this.start_year= e.target.value;
  }

  onAreaSelected(e)
  {
    //this.jobselected= e.target.value;

    if(e.target.checked)
    {
      this.selectedValue.push(e.target.value);
    }
    else{
      let updateItem = this.selectedValue.find(this.findIndexToUpdateCheck, e.target.value);

      let index = this.selectedValue.indexOf(updateItem);

      this.selectedValue.splice(index, 1);
    }

  }

  updateCheckedOptions(e)
  {
    if(e.target.checked)
    {
      this.selectedcountry.push(e.target.value);
    }
    else{
      let updateItem = this.selectedcountry.find(this.findIndexToUpdateCheck, e.target.value);

      let index = this.selectedcountry.indexOf(updateItem);

      this.selectedcountry.splice(index, 1);
    }


  }

  findIndexToUpdateCheck(type) {
    return type == this;
  }
  ////////////////////////save edit profile data//////////////////////////////////
  start_monthh;
  experiencearray=[];
  experiencejson;
  monthNameToNum(monthname) {
    this.start_monthh = this.calen_month.indexOf(monthname);
    this.start_monthh = "0"  + (this.start_monthh);
    return this.start_monthh ?  this.start_monthh : 0;
  }

  candidate_profile(profileForm: NgForm)
  {
    this.error_msg = "";
    this.count = 0;
    this.submit = "click";
    this.validatedLocation = [];
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.info.first_name)
    {
      this.first_name_log="Please enter first name";

    }
    if(!this.info.last_name)
    {
      this.last_name_log="Please enter last name";

    }
    if(!this.info.contact_number)
    {
      this.contact_name_log ="Please enter contact number";
    }

    if(!this.info.nationality )
    {
      this.nationality_log ="Please choose nationality";
    }

    if(!this.info.base_country )
    {
      this.base_country_log ="Please choose base country";
    }

    if(!this.info.city)
    {
      this.city_log ="Please enter base city";
    }
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
        if(location.name.includes('city')){
          this.validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
        }
        if(location.name.includes('country')){
          this.validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
        }
        if(location.name === 'Remote') {
          this.validatedLocation.push({remote: true, visa_needed : location.visa_needed });
        }
      }
      profileForm.value.country = this.validatedLocation;

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

    if(!this.expected_salaryyy)
    {
      this.salary_log = "Please enter expected yearly salary";
    }

    if(this.selectedValue.length <= 0)
    {
      this.interest_log = "Please select at least one area of interest";
    }

    if(!this.availability_day)
    {
      this.avail_log = "Please select employment availability";
    }

    if(!this.why_work)
    {
      this.why_work_log = "Please fill why do you want to work on blockchain?";
    }

    if(this.commercially_worked.length !== this.commercial_expYear.length )
    {
      this.commercial_log = "Please fill year of experience";
    }

    if(this.LangexpYear.length !==  this.language.length)
    {

      this.exp_lang_log="Please fill year of experience";
    }
    if(!this.Intro)
    {

      this.intro_log="Please fill 2-5 sentence bio"
    }

    if(this.commercialSkills.length !== this.commercialSkillsExperienceYear.length)
    {
      this.commercial_skill_log = "Please fill year of experience";
    }

    if(this.EducationForm.value.itemRows.length >= 1)
    {

      for (var key in this.EducationForm.value.itemRows)
      {
        if(!this.EducationForm.value.itemRows[key].uniname)
        {
          this.uni_name_log = "Please fill university";
        }

        if(!this.EducationForm.value.itemRows[key].degreename)
        {
          this.degree_log = "Please fill degree";
        }

        if(!this.EducationForm.value.itemRows[key].fieldname)
        {
          this.field_log = "Please fill field of study";
        }

        if(!this.EducationForm.value.itemRows[key].eduyear)
        {
          this.eduYear_log = "Please fill graduation year";
        }



        if(this.EducationForm.value.itemRows[key].uniname && this.EducationForm.value.itemRows[key].degreename &&
          this.EducationForm.value.itemRows[key].fieldname && this.EducationForm.value.itemRows[key].eduyear)
        {

          this.edu_count = parseInt(key) + 1;
        }

      }

    }
    if(this.ExperienceForm.value.ExpItems.length >=1)
    {
      this.exp_count =0;
      for (var key in this.ExperienceForm.value.ExpItems)
      {
        this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
        this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
        this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
        if(this.ExperienceForm.value.ExpItems[key].currentwork === true)
        {
          this.end_date_format = Date.now();
        }
        else
        {
          this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);

        }
        if(!this.ExperienceForm.value.ExpItems[key].companyname)
        {
          this.company_log = "Please fill company";
        }

        if(!this.ExperienceForm.value.ExpItems[key].positionname)
        {
          this.position_log = "Please fill position";
        }


        if(!this.ExperienceForm.value.ExpItems[key].locationname)
        {
          this.location_log = "Please fill location";

        }

        if(!this.ExperienceForm.value.ExpItems[key].startdate )
        {
          this.start_date_log = "Please fill month";
        }

        if( !this.ExperienceForm.value.ExpItems[key].startyear)
        {
          this.start_date_year_log = "Please fill year";
        }

        if(!this.ExperienceForm.value.ExpItems[key].end_date && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_log = "Please fill month";
        }

        if(!this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork === false)
        {
          this.end_date_year_log = "Please fill year ";
        }

        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear && this.ExperienceForm.value.ExpItems[key].end_date &&
          this.ExperienceForm.value.ExpItems[key].endyear && this.ExperienceForm.value.ExpItems[key].currentwork==false)
        {

          let verified=0;
          if(this.compareDates(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear,this.ExperienceForm.value.ExpItems[key].end_date , this.ExperienceForm.value.ExpItems[key].endyear , this.ExperienceForm.value.ExpItems[key].currentwork)) {
            this.dateValidation = 'Date must be greater than previous date';
            verified=1;
          }

          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].end_date , this.ExperienceForm.value.ExpItems[key].endyear)) {
            verified=1;
          }
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            verified=1;
          }
          if(verified === 0) {
            this.exp_count = this.exp_count + 1;
          }

        }


        if(this.ExperienceForm.value.ExpItems[key].companyname && this.ExperienceForm.value.ExpItems[key].positionname &&
          this.ExperienceForm.value.ExpItems[key].locationname && this.ExperienceForm.value.ExpItems[key].start_date &&
          this.ExperienceForm.value.ExpItems[key].startyear &&  this.ExperienceForm.value.ExpItems[key].currentwork==true)
        {
          let dverified=0;
          if(this.checkDateVerification(this.ExperienceForm.value.ExpItems[key].start_date , this.ExperienceForm.value.ExpItems[key].startyear)) {
            dverified=1;
          }
          if(dverified === 0) {
            this.exp_count = parseInt(key) + 1;
          }

          this.ExperienceForm.value.ExpItems[key].enddate = new Date();

        }

      }

    }

    if((this.salary && !this.current_currency) || (this.salary && this.current_currency === -1)) {
      this.current_currency_logg = "Please choose currency";
      this.count++;
    }


    if(!this.salary && this.current_currency !== '-1') {
      this.current_sal_log = "Please enter current base salary";
      this.count++;
    }

    if((!this.salary && !this.current_currency) || (!this.salary && this.current_currency === "-1")){
      this.count = 0;
    }

    if(this.count === 0 && this.info.first_name && this.info.last_name && this.info.contact_number && this.info.nationality &&
      this.info.city && this.info.base_country  && this.expected_salaryyy && this.selectedLocations && this.selectedLocations.length > 0
      && this.selectedLocations.length <= 10 && this.selectedLocations.filter(i => i.visa_needed === true).length < this.selectedLocations.length && this.jobselected.length>0 && this.base_currency && this.selectedValue.length > 0 && this.availability_day &&
      this.why_work && this.commercially_worked.length === this.commercial_expYear.length
      && this.language &&this.LangexpYear.length ===  this.language.length && this.Intro && this.edu_count === this.EducationForm.value.itemRows.length && this.exp_count === this.ExperienceForm.value.ExpItems.length
      && this.commercialSkills.length === this.commercialSkillsExperienceYear.length
    )
    {
      this.verify = true;
    }
    else {
      this.verify = false;
    }
    if(this.verify === true ) {
      if(typeof(this.expected_salaryyy) === 'string' )
        profileForm.value.expected_salary = parseInt(this.expected_salaryyy);
      if(this.salary && typeof (this.salary) === 'string') {
        profileForm.value.salary = parseInt(this.salary);

      }

      this.updateProfileData(profileForm.value);
    }
    else {
      this.error_msg = "One or more fields need to be completed. Please scroll up to see which ones.";
    }

  }


  file_size=1048576;
  image_log;

  updateProfileData(profileForm)
  {
    profileForm.selectedlocations = this.validatedLocation;
    this.experiencearray=[];
    this.education_json_array=[];
    for (var key in this.ExperienceForm.value.ExpItems)
    {
      this.startmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].start_date);
      this.endmonthIndex = this.monthNameToNum(this.ExperienceForm.value.ExpItems[key].end_date);
      this.start_date_format  = new Date(this.ExperienceForm.value.ExpItems[key].startyear, this.startmonthIndex);
      this.end_date_format = new Date(this.ExperienceForm.value.ExpItems[key].endyear, this.endmonthIndex);
      if(this.ExperienceForm.value.ExpItems[key].currentwork == true )
      {
        this.end_date_format = new Date();
      }
      this.experiencejson = {companyname : this.ExperienceForm.value.ExpItems[key].companyname , positionname : this.ExperienceForm.value.ExpItems[key].positionname,locationname : this.ExperienceForm.value.ExpItems[key].locationname,description : this.ExperienceForm.value.ExpItems[key].description,startdate : this.start_date_format,enddate : this.end_date_format , currentwork : this.ExperienceForm.value.ExpItems[key].currentwork};
      this.experiencearray.push(this.experiencejson);
    }

    for ( var key in this.EducationForm.value.itemRows)
    {
      this.EducationForm.value.itemRows[key].eduyear =  parseInt(this.EducationForm.value.itemRows[key].eduyear);
      this.educationjson = {uniname : this.EducationForm.value.itemRows[key].uniname , degreename :  this.EducationForm.value.itemRows[key].degreename
        ,fieldname : this.EducationForm.value.itemRows[key].fieldname , eduyear : this.EducationForm.value.itemRows[key].eduyear  };
      this.education_json_array.push(this.educationjson) ;
    }
    if(this.commercially_worked.length === 0) {
      profileForm.commercial_platforms = [];
    }
    else {
      profileForm.commercial_platforms = this.commercial_expYear;
    }

    if(this.commercialSkills.length === 0) {
      profileForm.commercial_skills = [];
    }
    else {
      profileForm.commercial_skills = this.commercialSkillsExperienceYear;
    }

    profileForm.description_commercial_platforms = '';
    if(this.description_commercial_platforms){
      profileForm.description_commercial_platforms = this.description_commercial_platforms;
    }

    profileForm.description_experimented_platforms = '';
    if(this.description_experimented_platforms){
      profileForm.description_experimented_platforms = this.description_experimented_platforms;
    }

    profileForm.description_commercial_skills = '';
    if(this.description_commercial_skills){
      profileForm.description_commercial_skills = this.description_commercial_skills;
    }

    if(this.language.length === 0) {
      profileForm.language = [];
    }
    else {
      profileForm.language_experience_year = this.LangexpYear;
    }

    if(this.jobselected){
      profileForm.roles = this.jobselected;
    }

    if(this.selectedValue){
      profileForm.interest_area = this.selectedValue;
    }

    let inputQuery:any ={};

    if(this.info.first_name) inputQuery.first_name = this.info.first_name;
    if(this.info.last_name) inputQuery.last_name = this.info.last_name;
    if(this.info.contact_number) inputQuery.contact_number = this.info.contact_number;
    if(this.info.github_account) inputQuery.github_account = this.info.github_account;
    if(this.info.exchange_account) inputQuery.exchange_account = this.info.exchange_account;
    if(this.info.linkedin_account) inputQuery.linkedin_account = this.info.linkedin_account;
    if(this.info.medium_account) inputQuery.medium_account = this.info.medium_account;
    if(this.info.nationality) inputQuery.nationality = this.info.nationality;
    if(this.info.Intro) inputQuery.description = this.info.Intro;
    if(this.info.base_country) inputQuery.base_country = this.info.base_country;
    if(this.info.city) inputQuery.base_city = this.info.city;
    if(this.validatedLocation) inputQuery.locations = this.validatedLocation;
    if(this.jobselected) inputQuery.roles = this.jobselected;
    if(this.expected_salaryyy) inputQuery.expected_salary = this.expected_salaryyy;
    if(this.base_currency) inputQuery.expected_salary_currency = this.base_currency;
    if(this.current_currency) inputQuery.current_currency = this.current_currency;
    if(this.salary) inputQuery.current_salary = this.salary;
    if(this.selectedValue) inputQuery.interest_areas = this.selectedValue;
    if(this.availability_day) inputQuery.availability_day = this.availability_day;
    if(this.why_work) inputQuery.why_work = this.why_work;
    if(profileForm.commercial_platforms) inputQuery.commercial_platforms = profileForm.commercial_platforms;
    if(profileForm.description_commercial_platforms) inputQuery.description_commercial_platforms = profileForm.description_commercial_platforms;
    if(this.experimented_platform) inputQuery.experimented_platforms = this.experimented_platform;
    if(profileForm.description_experimented_platforms) inputQuery.description_experimented_platforms = profileForm.description_experimented_platforms;
    if(profileForm.commercial_skills) inputQuery.commercial_skills = profileForm.commercial_skills;
    if(profileForm.description_commercial_skills) inputQuery.description_commercial_skills = profileForm.description_commercial_skills;
    if(profileForm.language_experience_year) inputQuery.programming_languages = profileForm.language_experience_year;
    if(this.education_json_array) inputQuery.education_history = this.education_json_array;
    if(this.experiencearray) inputQuery.work_history = this.experiencearray;

    this.authenticationService.edit_candidate_profile(this.user_id, inputQuery , true)
      .subscribe(
        data => {
          if(data && this.currentUser)
          {
            this.router.navigate(['/admin-candidate-detail'], { queryParams: { user: this.user_id } });

          }

        },
        error => {
          this.dataservice.changeMessage(error);
          this.log = 'Something getting wrong';
          if(error.message === 500)
          {
            localStorage.setItem('jwt_not_found', 'Jwt token not found');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('googleUser');
            localStorage.removeItem('close_notify');
            localStorage.removeItem('linkedinUser');
            localStorage.removeItem('admin_log');
            window.location.href = '/login';
          }

        });


  }

  commercialSkills=[];
  commercialSkillsExperienceYear=[];

  oncommercialSkillsOptions(obj)
  {

    let updateItem = this.commercialSkills.find(this.findIndexToUpdate_funct, obj.value);
    let index = this.commercialSkills.indexOf(updateItem);
    if(index > -1)
    {
      this.commercialSkills.splice(index, 1);
      let updateItem2 = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill',  obj.value);
      let index2 = this.commercialSkillsExperienceYear.indexOf(updateItem2);

      if(index2 > -1)
      {

        this.commercialSkillsExperienceYear.splice(index2, 1);
      }
    }
    else
    {
      obj.checked =true;
      this.commercialSkills.push(obj);
    }


  }

  onComSkillExpYearOptions(e, value)
  {
    let updateItem = this.findObjectByKey(this.commercialSkillsExperienceYear, 'skill', value);
    let index = this.commercialSkillsExperienceYear.indexOf(updateItem);

    if(index > -1)
    {

      this.commercialSkillsExperienceYear.splice(index, 1);
      this.value = value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    else
    {
      this.value=value;
      this.referringData = { skill : this.value, exp_year: e.target.value};
      this.commercialSkillsExperienceYear.push(this.referringData);

    }
    this.commercialSkillsExperienceYear.sort(function(a, b){
      if(a.skill < b.skill) { return -1; }
      if(a.skill > b.skill) { return 1; }
      return 0;
    })
  }

  verify;
  dateValidation;
  checkDateVerification(month,year) {
    if(month && year) {
      this.startmonthIndex = this.monthNameToNum(month);
      this.start_date_format  = new Date(year, this.startmonthIndex);
      if(this.start_date_format > new Date()) {
        this.verify= false;
        return true;
      }
      else {
        this.verify= true;
        return false;
      }
    }
    else {
      return false;
    }
  }

  compareDates(startmonth , startyear , endmonth, endyear, current) {
    let startMonth = this.monthNameToNum(startmonth);
    let startDateFormat  = new Date(startyear, startMonth);

    let endMonth = this.monthNameToNum(endmonth);
    let endDateFormat  = new Date(endyear, endMonth);

    if(current  === true) {
      return false;
    }
    else {
      if(startDateFormat > endDateFormat && this.submit === 'click') {
        this.dateValidation = 'Date must be greater than previous date';
        this.verify = false;
        return true;
      }
      else {
        this.verify = true;
        return false;
      }
    }
  }

  endDateYear() {
    this.dateValidation = "";
  }

  checkValidation(value) {
    if(value.filter(i => i.visa_needed === true).length === this.selectedLocations.length) return true;
    else return false;
  }


  suggestedOptions() {
    // this.cities = ['Afghanistan (city)', 'Albania (country)', 'Algeria (city)', 'Andorra (country)', 'Angola (city)', 'Antigua & Deps (city)', 'Argentina (city)', 'Armenia (city)', 'Australia (city)', 'Austria (city)', 'Azerbaijan (city)', 'Bahamas (city)', 'Bahrain (city)', 'Bangladesh (city)', 'Barbados (city)', 'Belarus (city)', 'Belgium (city)', 'Belize (city)', 'Benin (city)', 'Bhutan (city)', 'Bolivia', 'Bosnia Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Rep', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Congo {Democratic Rep}', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland {Republic}', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea North', 'Korea South', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar, {Burma}', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'St Kitts & Nevis', 'St Lucia', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino', 'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
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
