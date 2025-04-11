import {Component, inject, signal} from '@angular/core';
import {CustomContainerDialogComponent} from "@ui/components/custom-container-dialog/custom-container-dialog.component";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ListContactsUseCase} from "@domain/use-cases/whatsapp/list-contacts.use-case";


@Component({
  selector: 'app-whatsapp-chat',
  imports: [
    CustomContainerDialogComponent,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './whatsapp-chat.component.html',
  styleUrl: './whatsapp-chat.component.scss'
})
export class WhatsappChatComponent {
  readonly dialogRef = inject(MatDialogRef<WhatsappChatComponent>);
  readonly params = inject<any>(MAT_DIALOG_DATA);

  //api green
  private $listContactsUseCase = inject(ListContactsUseCase)

  loading = signal(false)

  ngOnInit(){
    this.$listContactsUseCase.execute().subscribe(contacts => {
      console.log(contacts);
    })
  }

  send(){

  }

  close(){
    this.dialogRef.close()
  }
}
