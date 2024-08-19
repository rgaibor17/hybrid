import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonButton, IonItem, IonDatetime, IonInput, IonTextarea } from '@ionic/angular/standalone'; /* Card */
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonLabel, IonButton, IonItem, IonDatetime, IonInput, IonTextarea], /* 2.1, 2.2 Registro de componente Card y sus asociados */
})
export class Tab3Page {
  appointment = {
    petName: '',
    ownerName: '',
    dateTime: '',
    notes: ''
  };

  constructor(private alertController: AlertController) {}

  async onSubmit() {
    // Perform your submission logic here, e.g., send data to a server
    const alert = await this.alertController.create({
      header: 'Appointment Booked',
      message: `Appointment for ${this.appointment.petName} has been booked.`,
      buttons: ['OK']
    });

    await alert.present();
  }
}
