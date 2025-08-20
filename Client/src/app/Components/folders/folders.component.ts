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
import { Router, RouterModule } from '@angular/router';
import { Folder } from '../../Interfaces/folder';
import { GoogleDriveService } from '../../Services/google-drive.service';
import e from 'express';

@Component({
  selector: 'app-folders',
  imports: [DialogModule, FormsModule, ToastModule, TableModule, CommonModule, RouterModule, PopoverModule],
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
  driveFolders: any[] = [];
  folders: any[] = []; 

  ngOnInit(): void {
    
    this.getallFolders();
  }
  constructor(
    private documentsService: DocumentsService,
    private messageService: MessageService,
    private dropboxService: DropboxService,
    private router: Router,
    private driveService: GoogleDriveService
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
      await this.getDriveFolders();
      this.folders = [...this.localfolders, ...this.dropoxFolders, ...this.driveFolders];
      console.log("All folders fetched successfully:", this.folders);
    } catch (error) {
      console.error("Error fetching all folders:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch all folders.' });
    }
  }
  async navigateToFolder(folder: Folder) {
    
    let source = await this.getSource(folder);
    let path = folder.path_lower || '';
    
    this.router.navigate(['/folders', folder.name], { 
    state: { id: folder.id,source:source, path: path } 
  
  });
  }
  async getSource(folder: Folder) : Promise<string> {
    
    if (folder.path_lower) {
      return 'dropbox';
    } else if (folder.date_created) {
      return 'local';
    } else if (folder.name && !folder.date_created) {
      return 'google-drive';
    }
    else {
      return 'unknown';
    }
  }
  async getDriveFolders() {
    
    try{
      this.driveFolders = await this.driveService.listFolders();
      console.log("Google Drive folders fetched successfully:", this.driveFolders);
    }
    catch (error) {
      this.driveFolders = [];
      console.error("Error fetching folders from Google Drive:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch folders from Google Drive.' });
    }
  }

}
