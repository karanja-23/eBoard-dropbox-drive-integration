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
import { GoogleDriveService } from '../../Services/google-drive.service'; // Import Google Drive service
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
  
  driveAuthenticated: boolean = false; // Placeholder for Google Drive authentication status
  isAuthenticating: boolean = false; // Flag to show loading state during authentication

  isLoadingAllFiles: boolean = false; // Flag to show loading state for all files
  loadingProgress: number = 0; // Progress for loading all files
  files: any[] = []; // Array to hold all files from Google Drive

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private dropboxService: DropboxService,
    private documentsService: DocumentsService,
    private driveService: GoogleDriveService // Inject Google Drive service
    
  ) {}

  async ngOnInit() {
    // Wait for Dropbox service to initialize
    await this.waitForDropboxInitialization();
    
    // Handle OAuth callback if present
    await this.handleDropboxCallback();
    
    // Check dropbox authentication status
    this.dropboxAuthenticated = this.dropboxService.isAuthenticated();

    // Check Google Drive authentication status
    this.driveAuthenticated = this.driveService.isAuthenticated;
    
    // Load user settings
    await this.loadUserSettings();
    
    // Load Dropbox documents if authenticated
    if (this.dropboxAuthenticated) {
      this.getDropboxDocuments();
    }
    if (this.driveAuthenticated) {
      await this.getDriveDocuments();
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
  async authenticateDrive(): Promise<void> {
  this.isAuthenticating = true;
  this.driveAuthenticated = false;
  
  try {
    console.log('🔧 Starting Google Drive authentication...');
    
    // Check if service is ready
    if (!this.driveService) {
      throw new Error('Google Drive service not available');
    }

    if (!this.driveService.isReady) {
      console.log('⚠️ Google Drive service not ready, waiting...');
      
      this.messageService.add({
        severity: 'info',
        summary: 'Initializing Google Drive',
        detail: 'Loading Google services, please wait...',
        life: 3000
      });

      // Wait for service to be ready (with timeout)
      const timeout = 10000; // 10 seconds
      const startTime = Date.now();
      
      while (!this.driveService.isReady && (Date.now() - startTime) < timeout) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (!this.driveService.isReady) {
        throw new Error('Google Drive service failed to initialize within timeout period');
      }
    }

    console.log('🔐 Starting Google Drive authentication flow...');
    
    // Attempt authentication
    const success = await this.driveService.authenticate();
    
    if (success) {
      console.log('✅ Google Drive authentication successful');
      
      // Wait for authentication state to propagate through Google's systems
      // This is crucial - Google's auth state updates asynchronously
      await this.waitForAuthenticationState();
      
    } else {
      this.driveAuthenticated = false;
      throw new Error('Authentication was not successful');
    }
    
  } catch (error: any) {
    console.error('❌ Google Drive authentication failed:', error);
    this.driveAuthenticated = false;
    
    // Determine error type and show appropriate message
    let errorMessage = 'Authentication Failed';
    let errorDetail = 'Unable to connect to Google Drive. Please try again.';
    
    if (error.message) {
      if (error.message.includes('popup') || error.message.includes('blocked')) {
        errorMessage = 'Popup Blocked';
        errorDetail = 'Please enable popups for this site and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection Timeout';
        errorDetail = 'Google services took too long to load. Please check your connection and try again.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network Error';
        errorDetail = 'Please check your internet connection and try again.';
      } else if (error.error === 'idpiframe_initialization_failed') {
        errorMessage = 'Configuration Error';
        errorDetail = 'Google Drive authentication is not properly configured. Please contact support.';
      } else if (error.message.includes('not available')) {
        errorMessage = 'Service Unavailable';
        errorDetail = 'Google Drive service is not available. Please refresh the page and try again.';
      } else if (error.message.includes('Authentication completed but user authentication status could not be verified')) {
        errorMessage = 'Authentication Verification Failed';
        errorDetail = 'Authentication may have succeeded but status could not be verified. Please refresh and try again.';
      } else {
        errorDetail = error.message;
      }
    }

    this.messageService.add({
      severity: 'error',
      summary: errorMessage,
      detail: errorDetail,
      life: 5000
    });

    // Re-throw for component-level handling if needed
    throw error;
    
  } finally {
    // Always hide loading indicator
    this.isAuthenticating = false;
    console.log('🏁 Google Drive authentication process completed');
  }
}

/**
 * Wait for Google's authentication state to update with retries
 */
private async waitForAuthenticationState(): Promise<void> {
  const maxAttempts = 10;
  const delayMs = 800; // Increased delay between checks
  
  console.log('🔍 Waiting for authentication state to update...');
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`📋 Checking authentication status (attempt ${attempt}/${maxAttempts})`);
    
    // Wait before checking (important for first attempt too)
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    const isAuthenticated = this.driveService.isAuthenticated;
    console.log(`🔍 Authentication status check ${attempt}: ${isAuthenticated}`);
    
    if (isAuthenticated) {
      this.driveAuthenticated = true;
      console.log('✅ Authentication status verified - user is authenticated');
      
      this.messageService.add({
        severity: 'success',
        summary: 'Authentication Successful',
        detail: 'Successfully connected to Google Drive!',
        life: 3000
      });
      
      return; // Success!
    }
    
    // If this is not the last attempt, continue waiting
    if (attempt < maxAttempts) {
      console.log(`⏳ Authentication not ready yet, waiting ${delayMs}ms before next check...`);
    }
  }
  
  // If we get here, authentication status never became true
  console.error('❌ Authentication status verification failed after all attempts');
  this.driveAuthenticated = false;
  
  throw new Error('Authentication completed but user authentication status could not be verified after multiple attempts');
}

/**
 * Alternative method: Check authentication status on component init
 * Call this in ngOnInit or when component loads
 */
async checkExistingAuthentication(): Promise<void> {
  if (!this.driveService || !this.driveService.isReady) {
    return;
  }
  
  const isAuthenticated = this.driveService.isAuthenticated;
  if (isAuthenticated) {
    console.log('✅ Found existing Google Drive authentication');
    this.driveAuthenticated = true;
  } else {
    console.log('ℹ️ No existing Google Drive authentication found');
    this.driveAuthenticated = false;
  }
}

async getDriveDocuments(): Promise<void> {
    try {
      if (!this.driveService.isAuthenticated) {
        console.error('Not authenticated');
        return;
      }

      this.isLoadingAllFiles = true;
      this.loadingProgress = 0;
      this.files = [];

      console.log('Starting to load all files...');

      const result = await this.driveService.listAllFiles({
        progressCallback: (current: number) => {
          this.loadingProgress = current;
          console.log(`Progress: ${current} files loaded`);
        }
      });

      this.files = result.files;
      console.log(this.files);
      
      // Show success message
     

    } catch (error) {
      console.error('Failed to list all files:', error);
      
    } finally {
      this.isLoadingAllFiles = false;
    }
  }
async signOutDrive(): Promise<void> {
  try {
    this.isAuthenticating = true;
    console.log('🔓 Signing out from Google Drive...');
    
    await this.driveService.signOut();
    this.driveAuthenticated = false;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Signed Out',
      detail: 'Successfully disconnected from Google Drive.',
      life: 3000
    });
    
    console.log('✅ Successfully signed out from Google Drive');
    
  } catch (error) {
    console.error('❌ Sign out failed:', error);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Sign Out Failed',
      detail: 'Failed to disconnect from Google Drive.',
      life: 3000
    });
  } finally {
    this.isAuthenticating = false;
  }
}
}