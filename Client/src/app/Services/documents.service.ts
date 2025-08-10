import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor() { }
  url = `http://127.0.0.1:5050`;
  async getDocuments() {
    const response = await fetch(`${this.url}/documents`);
    const data = await response.json();
    return data;
  }
  async getDocumentById(id: string) {
    const response = await fetch(`https://docs-backend-9wiv.onrender.com/document/${id}`);
    const data = await response.json();
    return data;
  }
   async addDocument(formData: FormData) {
    const response = await fetch(`${this.url}/documents`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) {
      throw new Error('Failed to add document');
    }
    
    return await response.json();
    
  }
  async getUser(userId: number) {
    const response = await fetch(`${this.url}/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  }
}
