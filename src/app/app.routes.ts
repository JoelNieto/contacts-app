import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./contact-list/contact-list.component').then(
        (x) => x.ContactListComponent
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./contacts-form/contacts-form.component').then(
        (x) => x.ContactsFormComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./contacts-form/contacts-form.component').then(
        (x) => x.ContactsFormComponent
      ),
  },
];
