import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-c-formv-text-linked-icon',
  templateUrl: './text-linked-icon.component.html',
  styleUrls: ['./text-linked-icon.component.css']
})
export class TextLinkedIconComponent implements OnInit {
  @Input() iconClass: string;
  @Input() link: string;

  constructor() { }

  ngOnInit() {
  }

  website_url;
  websiteUrl(link) {
    let loc = link;
    let x = loc.split("/");
    if (x[0] === 'http:' || x[0] === 'https:') {
      this.website_url = link;
      return this.website_url;
    }
    else {
      this.website_url = 'http://' + link;
      return this.website_url;
    }
  }

}
