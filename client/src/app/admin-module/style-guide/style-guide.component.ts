import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.css']
})
export class StyleGuideComponent implements OnInit ,AfterViewInit {

  @ViewChild("myckeditor") ckeditor: any;
  ckeConfig: any;
  ckeEditorConfig: any;
  email_notificaiton = ['Never' , 'Daily' , '3 days' , 'Weekly'];
  when_receive_email_notitfications;
  tweet;
  constructor() { }

  ngOnInit() {
    this.when_receive_email_notitfications = 'Daily';
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '10rem',
      removePlugins: 'resize,elementspath',
      removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Bold,Italic,Underline,Subscript,Superscript,Source,Save,Preview,Print,Templates,Find,Replace,SelectAll,NewPage,PasteFromWord,Form,Checkbox,Radio,TextField,Textarea,Button,ImageButton,HiddenField,RemoveFormat,TextColor,Maximize,ShowBlocks,About,Font,FontSize,Link,Unlink,Image,Flash,Table,Smiley,Iframe,Language,Indent,BulletedList,NumberedList,Outdent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,HorizontalRule,SpecialChar,PageBreak,Styles,Format,BGColor,PasteText,CopyFormatting,Strike,Select,Scayt'
    };

    this.ckeEditorConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true,
      height: '20rem',
      minHeight: '5rem',

    };
    this.tweet = 'http://localhost:4200/refer?code=f4ca5a5443';

  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 200);
    $("#startdate_datepicker").datepicker();

  }

}