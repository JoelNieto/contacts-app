import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Add this import
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component';
import { Contact } from '../models/contact';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    RouterLink,
    TableModule,
    ButtonModule,
    CardModule,
    ConfirmDialogModule,
  ], // Add ConfirmDialogModule to the imports array
  providers: [DynamicDialogRef, DialogService, ConfirmationService],
  template: `
    <p-confirmDialog />
    <div class="flex justify-center h-svh items-center">
      <p-card class="p-4 w-5/6  flex flex-col" header="Contacts">
        <div class="flex justify-end items-center">
          <p-button
            label="New Contact"
            icon="pi pi-plus-circle"
            size="small"
            (onClick)="editContact()"
          />
        </div>

        <p-table class="table-auto" [value]="contacts()">
          <ng-template pTemplate="header">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Notes</th>
              <th>Birthday</th>
              <th></th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-contact>
            <tr>
              <td>{{ contact.firstName }} {{ contact.lastName }}</td>
              <td>{{ contact.email }}</td>
              <td>{{ contact.address }}</td>
              <td>{{ contact.notes }}</td>
              <td>{{ contact.birthDay }}</td>
              <td class="flex gap-2">
                <p-button
                  size="small"
                  icon="pi pi-pencil"
                  text
                  severity="success"
                  (onClick)="editContact(contact)"
                />
                <p-button
                  size="small"
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  (onClick)="deleteContact(contact.id)"
                />
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: ``,
})
export class ContactListComponent implements OnInit {
  private contactService = inject(ContactsService);
  public contacts = signal<Contact[]>([]);
  private dialog = inject(DialogService);
  private confirmDialog = inject(ConfirmationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.fetchContacts();
  }

  editContact(contact?: Contact) {
    this.dialog
      .open(ContactsFormComponent, {
        header: 'Contact details',
        data: contact,
      })
      .onClose.subscribe({ next: () => this.fetchContacts() });
  }

  fetchContacts() {
    this.contactService.fetchContacts().subscribe({
      next: (value) => {
        this.contacts.set(value);
      },
    });
  }

  deleteContact(id: number) {
    this.confirmDialog.confirm({
      message: 'Are you sure that you want to delete this contact?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () =>
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Contact deleted successfully',
            });
            this.contacts.update((current) =>
              current.filter((c) => c.id !== id)
            );
          },
          error: (err) => {
            console.error(err);
            this.messageService.add({
              detail: 'Failed to delete contact',
              summary: 'Error',
              severity: 'error',
            });
          },
        }),
    });
  }
}
