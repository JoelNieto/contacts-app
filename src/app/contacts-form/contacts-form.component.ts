import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { Contact, PhoneNumber } from '../models/contact';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-contacts-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
  ],
  template: `
    <form [formGroup]="contactForm" (ngSubmit)="submitForm()">
      <div class="grid grid-cols-4 gap-4">
        <div class="flex flex-col gap-1">
          <label>First name</label>
          <input id="first_name" pInputText formControlName="firstName" />
        </div>
        <div class="flex flex-col gap-1">
          <label>Last name</label>
          <input id="last_name" pInputText formControlName="lastName" />
        </div>
        <div class="flex flex-col gap-1">
          <label>Address</label>
          <input id="address" pInputText formControlName="address" />
        </div>
        <div class="flex flex-col gap-1">
          <label>Email</label>
          <input id="email" pInputText formControlName="email" />
        </div>
        <div class="flex flex-col gap-1">
          <label>PhoneNumber</label>
          <input
            id="phoneNumber"
            pInputText
            type="tel"
            formControlName="phoneNumber"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label>Notes</label>
          <input id="email" pInputText formControlName="notes" />
        </div>
        <div class="flex flex-col gap-1">
          <label>BirthDay</label>
          <p-calendar
            id="email"
            type="date"
            formControlName="birthDay"
            appendTo="body"
          />
        </div>
      </div>
      <div formArrayName="phoneNumbers">
        <p class="font-semibold mt-3">Phones</p>
        @for(phone of phoneNumbers.controls; track phone; let i = $index) {
        <form class="flex gap-2 mb-2" [formGroupName]="i">
          <div class="flex flex-col gap-1 w-60">
            <label for="number-{{ i }}">Number</label>
            <input id="number-{{ i }}" pInputText formControlName="number" />
          </div>
          <div class="flex flex-col gap-1 w-60">
            <label for="type-{{ i }}">Type</label>
            <p-dropdown
              id="type-{{ i }}"
              [options]="['home', 'work', 'mobile']"
              placeholder="Select a type"
              formControlName="type"
              appendTo="body"
            />
          </div>
        </form>
        }
        <p-button
          icon="pi pi-plus"
          label="Add another phone"
          (click)="addPhoneNumber()"
          size="small"
        />
      </div>
      <div class="flex justify-end gap-2">
        <p-button
          label="Cancel"
          type="button"
          icon="pi pi-times"
          class="mr-2"
          outlined
          severity="secondary"
          (onClick)="dialogRef.close()"
        />
        <p-button type="submit" icon="pi pi-save" label="Submit" />
      </div>
    </form>
  `,
  styles: `
    label {
      @apply text-sm;
    }
  `,
})
export class ContactsFormComponent implements OnInit {
  contactForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    address: new FormControl('', {
      nonNullable: true,
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true,
    }),
    notes: new FormControl('', {
      nonNullable: true,
    }),
    phoneNumbers: new FormArray([]),
    birthDay: new FormControl(new Date(), { nonNullable: true }),
  });

  private dialogConfig = inject(DynamicDialogConfig);
  private contactService = inject(ContactsService);
  private messageService = inject(MessageService);
  protected dialogRef = inject(DynamicDialogRef);

  ngOnInit() {
    if (this.dialogConfig.data) {
      this.contactForm.patchValue(this.dialogConfig.data);
      if (this.dialogConfig.data.phoneNumbers) {
        this.dialogConfig.data.phoneNumbers.forEach((phone: PhoneNumber) => {
          this.phoneNumbers.push(
            new FormGroup({
              number: new FormControl(phone.number),
              type: new FormControl(phone.type),
            })
          );
        });
      }
    }
  }

  submitForm() {
    const contact = {
      ...this.contactForm.value,
      birthDay: this.contactForm
        .get('birthDay')
        ?.value.toISOString()
        .substring(0, 10),
    } as Contact;
    console.log({ contact });
    if (this.dialogConfig.data) {
      this.contactService.updateContact(this.dialogConfig.data.id, contact);
    } else {
      this.contactService.createContact(contact).subscribe({
        next: (value) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${value.firstName}'s contact  created successfully`,
          });
          this.dialogRef.close();
        },
        error: (error) => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create contact',
          });
        },
      });
    }
  }

  get phoneNumbers() {
    return this.contactForm.get('phoneNumbers') as FormArray;
  }

  addPhoneNumber() {
    this.phoneNumbers.push(
      new FormGroup({ number: new FormControl(''), type: new FormControl('') })
    );
  }
}
