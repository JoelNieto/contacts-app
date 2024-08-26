import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private http = inject(HttpClient);

  public fetchContacts = () =>
    this.http.get<Contact[]>('http://localhost:5143/api/contacts');

  public createContact = (contact: Contact) =>
    this.http.post<Contact>('http://localhost:5143/api/contacts', contact);

  public updateContact = (id: number, contact: Contact) =>
    this.http.put<Contact>(`http://localhost:5143/api/contacts/${id}`, contact);

  public deleteContact = (id: number) =>
    this.http.delete(`http://localhost:5143/api/contacts/${id}`);
}
