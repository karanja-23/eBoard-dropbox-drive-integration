import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DocumentsService } from '../../Services/documents.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';
import { DropboxService } from '../../Services/dropbox-service.service';
@Component({
  selector: 'app-folders',
  imports: [DialogModule, FormsModule, ToastModule, TableModule, CommonModule, PopoverModule],
  templateUrl: './folders.component.html',
  styleUrl: './folders.component.css',
  providers: [MessageService],
  standalone: true
})
export class FoldersComponent implements OnInit {

  addFolderDialogVisible: boolean = false;
  newFolderName: string = '';
  newFolderDescription: string = '';
  localfolders: any[] = [];
  dropoxFolders: any[] = [];
  folders: any[] = []; // This will hold the folders fetched from Dropbox

  ngOnInit(): void {
    this.getallFolders();
  }
  constructor(
    private documentsService: DocumentsService,
    private messageService: MessageService,
    private dropboxService: DropboxService
  ){ }

  showAddFolderDialog() {
    this.addFolderDialogVisible = true;
    console.log("Add Folder Dialog Opened");
  }

  async getFolders() {
    try {
      this.folders = await this.documentsService.getFolders();
     this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Folders fetched successfully!' });
    } catch (error) {
      console.error("Error fetching folders:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch folders.' });
    }
  }
  async addFolder() {
    if (!this.newFolderName.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Folder name is required.' });
      return;
    }
    const formData = new FormData();
    formData.append('name', this.newFolderName);
    formData.append('description', this.newFolderDescription);
    formData.append('user_id', '1'); // Replace with actual user ID
    

    try {
      const newFolder = await this.documentsService.addFolder(formData);
      this.getFolders(); 
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Folder added successfully!' });
      this.addFolderDialogVisible = false;
      this.newFolderName = '';
      this.newFolderDescription = '';
    } catch (error) {
      console.error("Error adding folder:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add folder.' });
    }
  }
  async getFoldersFromDropbox() {
    try {
      this.dropoxFolders = await this.dropboxService.listFolders();      
      
    } catch (error) {
      this.dropoxFolders = [];
      console.error("Error fetching folders from Dropbox:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch folders from Dropbox.' });
    }
  }
  async getallFolders() {
    try {
      this.localfolders = await this.documentsService.getFolders();
      this.dropoxFolders = await this.dropboxService.listFolders();
      this.folders = [...this.localfolders, ...this.dropoxFolders];
      console.log("All folders fetched successfully:", this.folders);
    } catch (error) {
      console.error("Error fetching all folders:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch all folders.' });
    }
  }
 
}
