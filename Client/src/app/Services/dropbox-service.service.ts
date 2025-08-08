import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environment';

declare var Dropbox: any;

export interface DropboxFile {
  id: string;
  name: string;
  path_lower: string;
  client_modified: string;
  size: number;
  content_hash?: string;
}

export interface DropboxServiceState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  error?: string;
  sdkLoaded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DropboxService {
  private dbx: any = null;
  private accessToken: string | null = null;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private lastError: string | null = null;

  constructor(private router: Router) {
    this.initialize();
  }

  private initialize(): void {
    if (this.initializationPromise) {
      return;
    }
    this.initializationPromise = this.initializeDropbox();
  }

  private async initializeDropbox(): Promise<void> {
  try {
    console.log('🔧 Initializing Dropbox SDK...');
    
    // Wait for Dropbox SDK to be available
    await this.waitForDropboxSDK();
    
    // Debug: Check what's available in the Dropbox object
    console.log('📦 Dropbox object:', typeof Dropbox, Dropbox);
    
    if (Dropbox && Dropbox.Dropbox) {
      // Restore access token from localStorage
      this.accessToken = localStorage.getItem('dropbox_access_token') || null;

      console.log('🎯 Creating Dropbox instance...');
      this.dbx = new Dropbox.Dropbox({
        clientId: environment.dropbox.clientId,
        fetch: window.fetch.bind(window),
        accessToken: this.accessToken || undefined,
      });
      
      console.log('📋 Dropbox instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.dbx)));
      
      if (this.accessToken) {
        console.log('🔑 Restored access token from localStorage');
      }
      
    } else {
      throw new Error('Dropbox.Dropbox constructor not found');
    }
    
    this.isInitialized = true;
    this.lastError = null;
    console.log('✅ Dropbox SDK initialized successfully');
    
  } catch (error) {
    this.lastError = `Failed to initialize Dropbox SDK: ${error}`;
    console.error('❌', this.lastError, error);
    this.isInitialized = false;
    throw error;
  }
}

  private async setAccessToken(token: string): Promise<void> {
    if (!this.dbx) {
      throw new Error('Dropbox instance not initialized');
    }

    try {
      // Try different methods to set the access token
      if (typeof this.dbx.setAccessToken === 'function') {
        this.dbx.setAccessToken(token);
        console.log('🔑 Access token set using setAccessToken()');
      } else if (typeof this.dbx.auth === 'object' && typeof this.dbx.auth.setAccessToken === 'function') {
        this.dbx.auth.setAccessToken(token);
        console.log('🔑 Access token set using auth.setAccessToken()');
      } else {
        // Manual approach - recreate the instance with the token
        this.dbx = new Dropbox.Dropbox({
          clientId: environment.dropbox.clientId,
          accessToken: token,
          fetch: fetch
        });
        console.log('🔑 Access token set via constructor');
      }
      
      this.accessToken = token;
    } catch (error) {
      console.error('❌ Failed to set access token:', error);
      throw error;
    }
  }

  private waitForDropboxSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof Dropbox !== 'undefined' && Dropbox?.Dropbox) {
        console.log('📦 Dropbox SDK already loaded');
        resolve();
        return;
      }

      console.log('⏳ Waiting for Dropbox SDK to load...');
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max wait time
      
      const checkForDropbox = () => {
        attempts++;
        
        if (typeof Dropbox !== 'undefined' && Dropbox?.Dropbox) {
          console.log(`✅ Dropbox SDK loaded after ${attempts} attempts`);
          resolve();
        } else if (attempts >= maxAttempts) {
          const error = `Dropbox SDK failed to load within ${maxAttempts * 100}ms`;
          console.error('❌', error);
          reject(new Error(error));
        } else {
          setTimeout(checkForDropbox, 100);
        }
      };
      
      setTimeout(checkForDropbox, 100);
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized && this.dbx) {
      return;
    }

    if (this.initializationPromise) {
      await this.initializationPromise;
    } else {
      await this.initializeDropbox();
    }
    
    if (!this.isInitialized || !this.dbx) {
      throw new Error('Dropbox SDK initialization failed');
    }
  }

  // Get current service state
  getState(): DropboxServiceState {
    return {
      isInitialized: this.isInitialized,
      isAuthenticated: this.isAuthenticated(),
      error: this.lastError || undefined,
      sdkLoaded: typeof Dropbox !== 'undefined' && !!Dropbox?.Dropbox
    };
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.isInitialized);
  }

  // Start OAuth flow
  async authenticate(): Promise<void> {
    try {
      await this.ensureInitialized();
      
      const clientId = environment.dropbox.clientId;
      const redirectUri = encodeURIComponent(environment.dropbox.redirectUri);
      const state = this.generateState();
      
      // Store state for verification
      sessionStorage.setItem('dropbox_oauth_state', state);
      
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
      
      console.log('🚀 Redirecting to Dropbox OAuth:', authUrl);
      window.location.href = authUrl;
      
    } catch (error) {
      this.lastError = `Authentication initiation failed: ${error}`;
      console.error('❌', this.lastError, error);
      throw new Error('Failed to start Dropbox authentication');
    }
  }

  // Handle OAuth callback
  async handleAuthCallback(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      
      if (error) {
        this.lastError = `OAuth error: ${error}`;
        console.error('❌', this.lastError);
        return false;
      }
      
      if (!code) {
        console.log('📭 No authorization code found in callback');
        return false;
      }

      // Verify state parameter
      const storedState = sessionStorage.getItem('dropbox_oauth_state');
      if (state !== storedState) {
        this.lastError = 'Invalid state parameter - possible CSRF attack';
        console.error('❌', this.lastError);
        return false;
      }

      console.log('🔄 Exchanging code for access token...');
      const tokenData = await this.exchangeCodeForToken(code);
      
      if (tokenData?.access_token) {
        await this.setAccessToken(tokenData.access_token);
        localStorage.setItem('dropbox_access_token', tokenData.access_token);
        
        // Clean up
        sessionStorage.removeItem('dropbox_oauth_state');
        window.history.replaceState({}, document.title, window.location.pathname);
        
        console.log('✅ Dropbox authentication successful');
        return true;
      } else {
        this.lastError = 'Failed to obtain access token';
        console.error('❌', this.lastError, tokenData);
        return false;
      }
      
    } catch (error) {
      this.lastError = `Authentication callback failed: ${error}`;
      console.error('❌', this.lastError, error);
      return false;
    }
  }

  private async exchangeCodeForToken(code: string): Promise<any> {
    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';
    
    const params = new URLSearchParams({
      code: code,
      grant_type: 'authorization_code',
      client_id: environment.dropbox.clientId,
      redirect_uri: environment.dropbox.redirectUri
    });
    
    if (environment.dropbox.clientSecret) {
      params.append('client_secret', environment.dropbox.clientSecret);
    }

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  private generateState(): string {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return array.join('');
  }

  // Sign out
  signOut(): void {
    this.accessToken = null;
    localStorage.removeItem('dropbox_access_token');
    sessionStorage.removeItem('dropbox_oauth_state');
    
    console.log('👋 Dropbox: Signed out successfully');
  }

  // List files in Dropbox
  async listFiles(path: string = ''): Promise<DropboxFile[]> {
  await this.ensureInitialized();
  
  if (!this.isAuthenticated()) {
    throw new Error('Not authenticated');
  }

  try {
    // Normalize path - empty string for root, otherwise ensure it starts with /
    const normalizedPath = path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);
    
    console.log(`📁 Listing files in path: "${normalizedPath}"`);
    
    const response = await this.dbx.filesListFolder({
      path: normalizedPath,
      recursive: false,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false
    });
    
    console.log('📦 Raw entries:', response.result.entries);

    const files = response.result.entries
      .filter((entry: any) => entry['.tag'] === 'file')
      .map((file: any) => ({
        id: file.id,
        name: file.name,
        path_lower: file.path_lower,
        client_modified: file.client_modified,
        size: file.size,
        content_hash: file.content_hash
      }));
    
    console.log(`📄 Found ${files.length} files`);
    return files;
    
  } catch (error: any) {
    // Enhanced error logging
    console.error('❌ List files error:', error);
    if (error.error) {
      console.error('❌ Error details:', error.error);
      if (error.error.error_summary) {
        console.error('📋 Dropbox error summary:', error.error.error_summary);
      }
    }
    
    if (this.isAuthenticationError(error)) {
      console.log('🔒 Authentication error detected, signing out');
      this.signOut();
      throw new Error('Not authenticated');
    }
    
    throw error;
  }
}

  // Upload file to Dropbox
  async uploadFile(file: Blob, path?: string): Promise<any> {
  await this.ensureInitialized();

  if (!this.isAuthenticated()) {
    throw new Error('Not authenticated with Dropbox');
  }

  // Format upload path
  let uploadPath = path || '/uploaded-file.pdf';
  if (!uploadPath.startsWith('/')) {
    uploadPath = '/' + uploadPath;
  }
  
  uploadPath = uploadPath
    .replace(/\/+/g, '/') // Remove duplicate slashes
    .replace(/\/$/, '') // Remove trailing slash
    .trim();

  if (!uploadPath || uploadPath === '/') {
    uploadPath = '/uploaded-file.pdf';
  }

  // Validate file
  if (!file || file.size === 0) {
    throw new Error('File is empty or invalid');
  }

  if (file.size > 350 * 1024 * 1024) {
    throw new Error('File too large (max 350MB)');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('File content is empty');
    }

    const response = await this.dbx.filesUpload({
      path: uploadPath,
      contents: arrayBuffer,
      mode: 'add',
      autorename: true,
      mute: false
    });

    return response.result;

  } catch (error: any) {
    // Handle specific Dropbox errors
    if (error.status === 400) {
      if (error.error?.error_summary) {
        const summary = error.error.error_summary.toLowerCase();
        
        if (summary.includes('malformed_path')) {
          throw new Error('Invalid file path or name');
        } else if (summary.includes('disallowed_name')) {
          throw new Error('File name not allowed by Dropbox');
        } else if (summary.includes('too_large')) {
          throw new Error('File is too large');
        } else if (summary.includes('insufficient_space')) {
          throw new Error('Insufficient Dropbox storage space');
        }
      }
      throw new Error('Upload failed - invalid request');
    } else if (error.status === 401) {
      throw new Error('Dropbox authentication expired');
    } else if (error.status === 403) {
      throw new Error('Access denied - check Dropbox permissions');
    } else if (error.status === 507) {
      throw new Error('Insufficient Dropbox storage space');
    }
    
    // Log full error for debugging, but throw user-friendly message
    console.error('Dropbox upload error:', error);
    throw new Error(error.message || 'Upload failed');
  }
}
  // Download file from Dropbox
  async downloadFile(path: string): Promise<Blob> {
    await this.ensureInitialized();
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      console.log(`📥 Downloading file: ${path}`);
      
      const response = await this.dbx.filesDownload({ path: path });
      
      console.log('✅ File downloaded successfully');
      return response.result.fileBinary;
      
    } catch (error) {
      console.error('❌ Download failed:', error);
      
      if (this.isAuthenticationError(error)) {
        this.signOut();
        throw new Error('Not authenticated');
      }
      
      throw error;
    }
  }

  private isAuthenticationError(error: any): boolean {
  return error?.status === 401 || 
         error?.error?.error?.['tag'] === 'invalid_access_token' ||
         error?.error?.error_summary?.includes('invalid_access_token');
}
  // Delete file from Dropbox
  async deleteFile(path: string): Promise<void> {
    await this.ensureInitialized();
    
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    try {
      await this.dbx.filesDeleteV2({ path: path });
      console.log(`🗑️ File deleted: ${path}`);
    } catch (error) {
      console.error('❌ Delete failed:', error);
      
      if (this.isAuthenticationError(error)) {
        this.signOut();
        throw new Error('Not authenticated');
      }
      
      throw error;
    }
  }

  // Get file content as text
  async getFileContent(path: string): Promise<string> {
    try {
      const blob = await this.downloadFile(path);
      return await blob.text();
    } catch (error) {
      console.error('❌ Error getting file content:', error);
      throw error;
    }
  }

  // Create a text file
  async createTextFile(name: string, content: string, path?: string): Promise<any> {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], name, { type: 'text/plain' });
    return this.uploadFile(file, path);
  }

  // Force re-initialization
  async reinitialize(): Promise<void> {
    console.log('🔄 Reinitializing Dropbox service...');
    this.isInitialized = false;
    this.initializationPromise = null;
    this.dbx = null;
    this.lastError = null;
    
    await this.initializeDropbox();
  }
}