import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.page.html',
  styleUrls: ['./appointments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel, IonAvatar]
})
export class AppointmentsPage implements OnInit {
  appointments = [
    { id: 1, name: 'Fluffy', description: 'Annual check-up', selected: false },
    { id: 2, name: 'Sparky', description: 'Vaccination', selected: false },
    { id: 3, name: 'Whiskers', description: 'Dental cleaning', selected: false }
  ];

  constructor(private router: Router) {
    addIcons({ addOutline, trashOutline });
  }

  addAppointment() {
    this.router.navigate(['/tabs/tab3']);
  }

  hasSelectedAppointments() {
    return this.appointments.some(app => app.selected);
  }

  deleteSelectedAppointments() {
    this.appointments = this.appointments.filter(app => !app.selected);
  }

  ngOnInit() {
  }

}
