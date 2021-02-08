import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'console';
import { AppService } from 'src/app/appservice.service';

@Component({
  selector: 'app-cliente-chat',
  templateUrl: './cliente-chat.component.html',
  styleUrls: ['./cliente-chat.component.css']
})
export class ClienteChatComponent implements OnInit, AfterViewInit {

  chatForm: any;
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, private appsevice: AppService) { }
  loading = false;

  @Input()
  admin;
  @Input()
  user;
  @Input()
  nome;
  @Input()
  dialog: any[];
  @Input()
  pedido;
  private scrollContainer: any;
  public scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;
  get f() { return this.chatForm.controls; }
  submit() {
    this.loading=true;
    this.appsevice.sendMessage(this.f.msgInput.value, this.pedido, (data) => {
      this.chatForm.get('msgInput').setValue(''); 
      this.dialog.push(data);
      this.loading=false;
    }, (erro) => { 
      alert(erro);
    },this.user);
  }
  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
    this.scrollToBottom();
  }
  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }
  ngOnInit(): void {
    this.chatForm = this.formBuilder.group({
      msgInput: ['']
    });

  }

}
