export type Contact = {
  id?: number;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  notes: string;
  birthDay: string;
  phoneNumbers: PhoneNumber[];
};

export type PhoneNumber = {
  id: number;
  number: string;
  type: string;
  contactId: number;
  contact: any;
};
