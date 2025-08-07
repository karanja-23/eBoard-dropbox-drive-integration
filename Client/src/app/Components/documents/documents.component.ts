import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DocumentsService } from '../../Services/documents.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import { DropboxService } from '../../Services/dropbox-service.service';


interface Document {
  id: number;
  name: string;
  description: string;
  type: string;
  document: string;
  date_created: string;
  size: number;
  user_id: number;
}

@Component({
  selector: 'app-documents',
  imports: [
    TableModule, 
    CommonModule, 
    RouterModule, 
    DialogModule, 
    ButtonModule, 
    FileUploadModule, 
    FormsModule,
    ToastModule
  ],
  providers: [
    MessageService], 
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  currentView: 'list' | 'grid' = 'list';
  documents: Document[] = [];
  
  
  showAddDocumentDialog: boolean = false;
  modalClass: string = 'modal';
  isSubmitting: boolean = false;
  selectedFile: File | null = null;

  dropboxSync: boolean = false;
  driveSync: boolean = false;

  dropboxDocuments: any[] = [];
  dropBoxSynced: any[] = [];

  constructor(
    private documentsService: DocumentsService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient,
    private dropboxService: DropboxService
  ) {
    
  }
  async ngOnInit() {
    await this.getUser(1); // Replace with actual user ID
    await this.getDropboxDocuments();
    await this.updateCombinedDocuments();
  }

  setView(view: 'list' | 'grid') {
    this.currentView = view;
  }
  async updateCombinedDocuments(): Promise<void> {
  const dropboxDocs = this.dropboxDocuments || [];
  const localDocs = this.documents || [];
  this.dropBoxSynced = [...dropboxDocs, ...localDocs];
  console.log('Combined documents:', this.dropBoxSynced);
}

  onDocumentClick(documentId: number) {
    this.router.navigate(['/documents', documentId]);
  }
  async getDropboxDocuments(): Promise<void> {
  try {
    this.dropboxDocuments = await this.dropboxService.listFiles();
    console.log('Dropbox documents:', this.dropboxDocuments);
  } catch (error) {
    console.log('Error fetching Dropbox documents:', error);
    this.dropboxDocuments = []; // Set to empty array on error
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to fetch Dropbox documents'
    });
  }
}
  onFileUpload(event:any){
    const file = event.files[0];
    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('user_id', '1'); // Replace with actual user ID
    formData.append('document', file);
    formData.append('type', file.type);
    formData.append('size', file.size.toString());   
    
    this.documentsService.addDocument(formData).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Document uploaded successfully'
      });
      this.getUser(1); 
      this.showAddDocumentDialog = false;
    }).catch(error => {
      console.error('Error uploading document:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload document'
      });
    });
  }

  async getUser(userId: number): Promise<any> {
    try {
      const user = await this.documentsService.getUser(userId);
      console.log('User data loaded:', user);
      
      this.documents = user.documents || [];
      this.dropboxSync = user.dropbox_sync || false;
      this.driveSync = user.drive_sync || false;
      
      console.log('Documents set:', this.documents);
      console.log('Dropbox sync enabled:', this.dropboxSync);
      
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      this.documents = [];
      throw error;
    }
  }
  toggleDropboxSync() {
  this.dropboxSync = !this.dropboxSync;
  // Add actual sync logic here
}

toggleDriveSync() {
  this.driveSync = !this.driveSync;
  // Add actual sync logic here
}


}