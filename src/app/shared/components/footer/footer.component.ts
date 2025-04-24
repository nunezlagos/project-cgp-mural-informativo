import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthComponent } from '../../../features/auth/auth.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
constructor(public dialog: MatDialog) {}

openLoginModal() {
  this.dialog.open(AuthComponent, {
    width: '800px'
  });
}
}

