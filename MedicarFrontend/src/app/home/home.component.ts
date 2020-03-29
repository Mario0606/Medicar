import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Appointment } from '../appointment.service'
import { MatDialog } from '@angular/material/dialog';
import { RegisterappointmentComponent } from '../registerappointment/registerappointment.component';
import { User } from '../shared/user.model';
import { Router } from '@angular/router';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SpecialtyService } from '../specialty.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ Appointment, SpecialtyService, Map ]
})
export class HomeComponent implements OnInit {
  faPlus = faPlus
  faTimes = faTimes
  public appointments: Array<any>
  public user: User
    constructor(
      private auth: AuthService,
      private appointment: Appointment,
      private specialty: SpecialtyService,
      private route: Router,
      public dialog: MatDialog,
      public specialties: Map<string,string>
  ){}

  ngOnInit(): void {
    this.user = this.auth.getUser()
    this.specialty.getSpecialties()
    .subscribe(
      (response: any) => {
        response.forEach(element => {
          this.specialties.set(element.id, element.nome)
        });
        this.appointments = response
      },
      (error: any) => console.log('deu errado')
    )
    this.appointment.getAppointments()
    .subscribe(
      (response: any) => {
        this.appointments = response
      },
      (error: any) => console.log('deu errado')
    )
    // this.user.
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterappointmentComponent,{
      width: '480px', height: '420px', disableClose: true 
  });
  }
  logout(): void {
    this.auth.setLoggedIn(false)
    localStorage.removeItem('userid');
    localStorage.removeItem('token')
    this.route.navigate(['login'])
  }
  Delete(id, td_index){
    this.appointment.deleteAppointment(id)
    .subscribe(
      () => {
        this.appointments.splice(td_index)
      },
      (error: any) => console.log('deu errado'))
  }
}
