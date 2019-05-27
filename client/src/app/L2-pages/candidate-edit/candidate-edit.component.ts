import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { constants} from '../../../constants/constants';
import { unCheckCheckboxes } from '../../../services/object';
import { EmailAddressComponent } from '../../L1-items/users/email-address/email-address.component';
import { FirstNameComponent } from '../../L1-items/users/first-name/first-name.component';
import { LastNameComponent } from '../../L1-items/users/last-name/last-name.component';
import { ContactNumberComponent } from '../../L1-items/users/contact-number/contact-number.component';
import { GithubUrlComponent } from '../../L1-items/candidate/github-url/github-url.component';
import { StackexchangeUrlComponent } from '../../L1-items/candidate/stackexchange-url/stackexchange-url.component';
import { LinkedinUrlComponent } from '../../L1-items/candidate/linkedin-url/linkedin-url.component';
import { MediumUrlComponent } from '../../L1-items/candidate/medium-url/medium-url.component';
import { StackoverflowUrlComponent } from '../../L1-items/candidate/stackoverflow-url/stackoverflow-url.component';
import { PersonalWebsiteUrlComponent } from '../../L1-items/candidate/personal-website-url/personal-website-url.component';
import { NationalityComponent } from '../../L1-items/users/nationality/nationality.component';
import { ProfilePicComponent } from '../../L1-items/users/profile-pic/profile-pic.component';
import { BioComponent } from '../../L1-items/users/bio/bio.component';
import { CountryComponent } from '../../L1-items/users/country/country.component';
import { CityComponent} from '../../L1-items/users/city/city.component';
import { CurrentSalaryComponent } from '../../L1-items/candidate/current-salary/current-salary.component';
import { WorkTypesComponent } from '../../L1-items/candidate/work-types/work-types.component';
import {ContractorComponent} from '../../L1-items/candidate/contractor/contractor.component';
import { VolunteerComponent } from '../../L1-items/candidate/volunteer/volunteer.component';
import {EmployeeComponent} from '../../L1-items/candidate/employee/employee.component';
import { WorkHistoryComponent } from '../../L1-items/work-history/work-history.component';
@Component({
  selector: 'app-p-candidate-edit',
  templateUrl: './candidate-edit.component.html',
  styleUrls: ['./candidate-edit.component.css']
})
export class CandidateEditComponent implements OnInit {
  @ViewChild(EmailAddressComponent) emailAddress: EmailAddressComponent;
  @ViewChild(FirstNameComponent) firstName: FirstNameComponent;
  @ViewChild(LastNameComponent) lastName: LastNameComponent;
  @ViewChild(ContactNumberComponent) contactNumber: ContactNumberComponent;
  @ViewChild(GithubUrlComponent) githubUrl: GithubUrlComponent;
  @ViewChild(StackexchangeUrlComponent) stackexchangeUrl: StackexchangeUrlComponent;
  @ViewChild(LinkedinUrlComponent) linkedinUrl: LinkedinUrlComponent;
  @ViewChild(MediumUrlComponent) mediumUrl: MediumUrlComponent;
  @ViewChild(StackoverflowUrlComponent) stackoverflowUrl: StackoverflowUrlComponent;
  @ViewChild(PersonalWebsiteUrlComponent) personalWebsiteUrl: PersonalWebsiteUrlComponent;
  @ViewChild(NationalityComponent) nationalities: NationalityComponent;
  @ViewChild(ProfilePicComponent) profileImage: ProfilePicComponent;
  @ViewChild(BioComponent) bioDescription: BioComponent;
  @ViewChild(CountryComponent) baseCountry: CountryComponent;
  @ViewChild(CityComponent) baseCity: CityComponent;
  @ViewChild(CurrentSalaryComponent) currentSalary: CurrentSalaryComponent;
  @ViewChild(WorkTypesComponent) workTypes: WorkTypesComponent;
  @ViewChild(VolunteerComponent) volunteerType: VolunteerComponent;
  @ViewChild(ContractorComponent) contractorType: ContractorComponent;
  @ViewChild(EmployeeComponent) employeeType: EmployeeComponent;
  @Input() userDoc: object;
  @Input() viewBy: string; // "admin", "candidate"
  email_address;
  first_name;
  last_name;
  contact_number;
  github_account;
  stackexchange_account;
  linkedin_account;
  medium_account;
  stackoverflow_url;
  personal_website_url;
  nationality;
  image;
  field_description = '<ul><li> 2-5 sentences </li><li> Quick overview of your current role and responsibilities and your principal development stack and skills </li><li> What value do you add to a project? </li></ul>';
  description;
  country;
  city;
  current_salary;
  current_currency;
  work_types = [];
  employeeCheck;
  contractorCheck;
  volunteerCheck;
  contractor: any = {};
  volunteer: any = {};
  employee: any = {};
  work_history;
  constructor() { }

  ngOnInit() {
    console.log(this.userDoc);
    this.email_address = this.userDoc['email'];
    this.first_name = this.userDoc['first_name'];
    this.last_name = this.userDoc['last_name'];
    this.contact_number = this.userDoc['contact_number'];
    if(this.userDoc['candidate'].github_account) this.github_account = this.userDoc['candidate'].github_account;
    if(this.userDoc['candidate'].stackexchange_account) this.stackexchange_account = this.userDoc['candidate'].stackexchange_account;
    if(this.userDoc['candidate'].linkedin_account) this.linkedin_account = this.userDoc['candidate'].linkedin_account;
    if(this.userDoc['candidate'].medium_account) this.medium_account = this.userDoc['candidate'].medium_account;
    if(this.userDoc['candidate'].stackoverflow_url) this.stackoverflow_url = this.userDoc['candidate'].stackoverflow_url;
    if(this.userDoc['candidate'].personal_website_url)  this.personal_website_url = this.userDoc['candidate'].personal_website_url;
    this.nationality = this.userDoc['nationality'];
    if(this.userDoc['image']) this.image = this.userDoc['image'];
    this.description = this.userDoc['candidate'].description;
    this.country = this.userDoc['candidate'].base_country;
    this.city = this.userDoc['candidate'].base_city;
    this.current_salary = this.userDoc['candidate'].current_salary;
    this.current_currency = this.userDoc['candidate'].current_currency;
    if(this.userDoc['candidate'].employee) {
      this.employeeCheck = true;
      this.work_types.push('employee');
    }
    if(this.userDoc['candidate'].contractor) {
      this.contractorCheck = true;
      this.work_types.push('contractor');
      this.contractor = this.userDoc['candidate'].contractor;
    }
    if(this.userDoc['candidate'].volunteer) {
      this.volunteerCheck = true;
      this.work_types.push('volunteer');
      this.volunteer = this.userDoc['candidate'].volunteer;
    }
    this.work_history = this.userDoc['candidate'].work_history;
  }

  update_candidate_profile(){
    console.log("submit");
    let errorCount = 0;
    let queryBody : any = {};
    if(this.firstName.selfValidate()) queryBody.first_name = this.firstName.first_name;
    else errorCount++;

    if(this.lastName.selfValidate()) queryBody.last_name = this.lastName.last_name;
    else errorCount++;

    if(this.contactNumber.selfValidateCode() && this.contactNumber.selfValidateNumber()) queryBody.contact_number = this.contactNumber.contact_number;
    else errorCount++;

    if(this.githubUrl.selfValidate()) {
      if(this.githubUrl.github_account) queryBody.github_account = this.githubUrl.github_account;
    }
    else errorCount++;

    if(this.stackexchangeUrl.selfValidate()) {
      if(this.stackexchangeUrl.stackexchange_account) queryBody.stackexchange_account = this.stackexchangeUrl.stackexchange_account;
    }
    else errorCount++;

    if(this.linkedinUrl.selfValidate()) {
      if(this.linkedinUrl.linkedin_account) queryBody.linkedin_account = this.linkedinUrl.linkedin_account;
    }
    else errorCount++;

    if(this.mediumUrl.selfValidate()) {
      if(this.mediumUrl.medium_account) queryBody.medium_account = this.mediumUrl.medium_account;
    }
    else errorCount++;

    if(this.stackoverflowUrl.selfValidate()) {
      if(this.stackoverflowUrl.stackoverflow_url) queryBody.stackoverflow_url = this.stackoverflowUrl.stackoverflow_url;
    }
    else errorCount++;

    if(this.personalWebsiteUrl.selfValidate()) {
      if(this.personalWebsiteUrl.personal_website_url) queryBody.personal_website_url = this.personalWebsiteUrl.personal_website_url;
    }
    else errorCount++;

    if(this.nationalities.selfValidate()) queryBody.nationality = this.nationalities.nationality;
    else errorCount++;

    if(this.bioDescription.selfValidate()) queryBody.description = this.bioDescription.description;
    else errorCount++;

    if(this.baseCountry.selfValidate()) queryBody.base_country = this.baseCountry.country;
    else errorCount++;

    if(this.baseCity.selfValidate()) queryBody.base_city = this.baseCity.city;
    else errorCount++;

    if(this.currentSalary.selfValidate() && this.currentSalary.current_salary && this.currentSalary.current_currency) {
      queryBody.current_currency = this.currentSalary.current_currency;
      queryBody.current_salary = this.currentSalary.current_salary;
    }
    else errorCount++;

    if(this.workTypes.selfValidate()) this.checkWorkType();
    else errorCount++;

    if(this.volunteerCheck) {
      if(this.volunteerType.selfValidate()) {
        // let validatedLocation=[];
        // for(let location of this.volunteer.selectedLocation) {
        //   if(location.name.includes('city')) {
        //     validatedLocation.push({city: location._id, visa_needed : location.visa_needed });
        //   }
        //   if(location.name.includes('country')) {
        //     validatedLocation.push({country: location.name.split(" (")[0], visa_needed : location.visa_needed });
        //   }
        //   if(location.name === 'Remote') {
        //     validatedLocation.push({remote: true, visa_needed : location.visa_needed });
        //   }
        //
        // }
        // this.volunteer.locations = validatedLocation;
        console.log("ifffffffffffff")
        queryBody.vounteer = this.volunteerType.volunteer;
      }
      else errorCount++;
    }


    if( this.contractorCheck) {
      if(this.contractorType.selfValidate()) {
        queryBody.contractor = this.contractorType.contractor;
      }
      else errorCount++;
    }

    if(this.employeeCheck) {
      if(this.employeeType.selfValidate()) {
        queryBody.employee = this.employeeType.employee;
      }
      else errorCount++;
    }


    console.log(errorCount);
    console.log(queryBody);


  }

  checkWorkType() {
    let value = this.workTypes.selectedWorkType
    const employee = value.find(x => x === 'employee');
    if(employee) this.employeeCheck = true;
    else this.employeeCheck = false;

    const contractor = value.find(x => x === 'contractor');
    if(contractor) this.contractorCheck = true;
    else this.contractorCheck = false;

    const volunteer = value.find(x => x === 'volunteer');
    if(volunteer) this.volunteerCheck = true;
    else this.volunteerCheck = false;

  }

}
