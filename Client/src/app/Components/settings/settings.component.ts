import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropboxService } from '../../Services/dropbox-service.service';
import { DocumentsService } from '../../Services/documents.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    TableModule,
    ToastModule,
    CardModule,
    DividerModule
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  dropboxSync: boolean = false;
  driveSync: boolean = false;
  dropboxAuthenticated: boolean = false;
  dropboxDocuments: any[] = [];
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dropboxService: DropboxService,
    private documentsService: DocumentsService
  ) {}

  async ngOnInit() {
    // Wait for Dropbox service to initialize
    await this.waitForDropboxInitialization();
    
    // Handle OAuth callback if present
    await this.handleDropboxCallback();
    
    // Check authentication status
    this.dropboxAuthenticated = this.dropboxService.isAuthenticated();
    
    // Load user settings
    await this.loadUserSettings();
    
    // Load Dropbox documents if authenticated
    if (this.dropboxAuthenticated) {
      this.getDropboxDocuments();
    }
  }

  private async waitForDropboxInitialization(): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkState = () => {
        attempts++;
        const state = this.dropboxService.getState();
        
        if (state.isInitialized || attempts >= maxAttempts) {
          if (!state.isInitialized && state.error) {
            console.warn('Dropbox initialization failed:', state.error);
          }
          resolve();
        } else {
          setTimeout(checkState, 100);
        }
      };
      
      checkState();
    });
  }

  private async handleDropboxCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      try {
        const success = await this.dropboxService.handleAuthCallback();
        if (success) {
          this.dropboxAuthenticated = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Dropbox authentication successful'
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Dropbox authentication failed'
          });
        }
      } catch (error) {
        console.error('Error handling Dropbox callback:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to complete Dropbox authentication'
        });
      }
    }
  }

  async loadUserSettings() {
    try {
      const user = await this.documentsService.getUser(1); // Replace with actual user ID
      this.dropboxSync = user.dropbox_sync || false;
      this.driveSync = user.drive_sync || false;
    } catch (error) {
      console.error('Error loading user settings:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load user settings'
      });
    }
  }

  async authenticateDropbox() {
    try {
      const state = this.dropboxService.getState();
      
      if (!state.isInitialized) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Initializing',
          detail: 'Dropbox SDK is loading, please wait...'
        });
        
        // Try to reinitialize
        await this.dropboxService.reinitialize();
      }

      await this.dropboxService.authenticate();
      
    } catch (error) {
      console.error('Authentication failed:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Failed',
        detail: 'Unable to start Dropbox authentication. Please try again.'
      });
    }
  }

  signOutDropbox() {
    this.dropboxService.signOut();
    this.dropboxAuthenticated = false;
    this.dropboxDocuments = [];
    this.dropboxSync = false;
    this.messageService.add({
      severity: 'info',
      summary: 'Signed Out',
      detail: 'Dropbox account disconnected'
    });
  }

  getDropboxDocuments() {
    if (!this.dropboxService.isAuthenticated()) {
      this.dropboxAuthenticated = false;
      return;
    }

    this.dropboxService.listFiles().then((documents: any[]) => {
      this.dropboxDocuments = documents;
      console.log('Dropbox documents:', this.dropboxDocuments);
    }).catch(error => {
      
      
      if (error.message === 'Not authenticated') {
        this.dropboxAuthenticated = false;
        this.dropboxService.signOut();
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch Dropbox documents'
      });
    });
  }

  async toggleDropboxSync() {
    if (!this.dropboxService.isAuthenticated()) {
      this.authenticateDropbox();
      return;
    }
    
    this.dropboxSync = !this.dropboxSync;
    
    try {
      // Save sync preference to backend
      await this.saveUserSettings();
      
      if (this.dropboxSync) {
        this.getDropboxDocuments();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Dropbox sync enabled'
        });
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Dropbox sync disabled'
        });
      }
    } catch (error) {
      this.dropboxSync = !this.dropboxSync; // Revert on error
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update sync settings'
      });
    }
  }

  async toggleDriveSync() {
    this.driveSync = !this.driveSync;
    
    try {
      await this.saveUserSettings();
      this.messageService.add({
        severity: this.driveSync ? 'success' : 'info',
        summary: this.driveSync ? 'Success' : 'Info',
        detail: `Google Drive sync ${this.driveSync ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      this.driveSync = !this.driveSync; // Revert on error
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update sync settings'
      });
    }
  }

  async saveUserSettings() {
    // Implement this method to save settings to your backend
    const settings = {
      dropbox_sync: this.dropboxSync,
      drive_sync: this.driveSync
    };
    
    // Example API call - adjust according to your backend
    // await this.documentsService.updateUserSettings(1, settings);
    console.log('Saving settings:', settings);
  }

  async downloadFromDropbox(dropboxFile: any) {
    try {
      const blob = await this.dropboxService.downloadFile(dropboxFile.path_lower);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = dropboxFile.name;
      link.click();
      
      window.URL.revokeObjectURL(url);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Downloaded ${dropboxFile.name}`
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download file'
      });
    }
  }

  async syncFromDropbox(dropboxFile: any) {
    try {
      const blob = await this.dropboxService.downloadFile(dropboxFile.path_lower);
      const file = new File([blob], dropboxFile.name, { 
        type: blob.type || 'application/octet-stream' 
      });
      
      const formData = new FormData();
      formData.append('name', file.name);
      formData.append('user_id', '1'); // Replace with actual user ID
      formData.append('document', file);
      formData.append('type', file.type);
      formData.append('size', file.size.toString());

      await this.documentsService.addDocument(formData);
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Synced ${dropboxFile.name} to your documents`
      });
    } catch (error) {
      console.error('Error syncing file:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to sync file'
      });
    }
  }

  navigateToDocuments() {
    this.router.navigate(['/documents']);
  }
}