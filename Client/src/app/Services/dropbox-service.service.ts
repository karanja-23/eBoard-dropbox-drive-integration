import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environment';

import { Dropbox } from 'dropbox';

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
      if (Dropbox) {
        this.accessToken = localStorage.getItem('dropbox_access_token') || null;
        this.dbx = new Dropbox({
          clientId: environment.dropbox.clientId,
          fetch: window.fetch.bind(window),
          accessToken: this.accessToken || undefined,
        });
      } else {
        throw new Error('Dropbox.Dropbox constructor not found');
      }
      this.isInitialized = true;
      this.lastError = null;
    } catch (error) {
      this.lastError = `Failed to initialize Dropbox SDK: ${error}`;
      this.isInitialized = false;
      throw error;
    }
  }

  private async setAccessToken(token: string): Promise<void> {
    if (!this.dbx) {
      throw new Error('Dropbox instance not initialized');
    }

    try {
      if (typeof this.dbx.setAccessToken === 'function') {
        this.dbx.setAccessToken(token);
      } else if (typeof this.dbx.auth === 'object' && typeof this.dbx.auth.setAccessToken === 'function') {
        this.dbx.auth.setAccessToken(token);
      } else {
        this.dbx = new Dropbox({
          clientId: environment.dropbox.clientId,
          accessToken: token,
          fetch: fetch
        });
      }
      this.accessToken = token;
    } catch (error) {
      throw error;
    }
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

  getState(): DropboxServiceState {
    return {
      isInitialized: this.isInitialized,
      isAuthenticated: this.isAuthenticated(),
      error: this.lastError || undefined,
    };
  }

  isAuthenticated(): boolean {
    return !!(this.accessToken && this.isInitialized);
  }

  async authenticate(): Promise<void> {
    try {
      await this.ensureInitialized();
      const clientId = environment.dropbox.clientId;
      const redirectUri = encodeURIComponent(environment.dropbox.redirectUri);
      const state = this.generateState();
      sessionStorage.setItem('dropbox_oauth_state', state);
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}`;
      window.location.href = authUrl;
    } catch (error) {
      this.lastError = `Authentication initiation failed: ${error}`;
      throw new Error('Failed to start Dropbox authentication');
    }
  }

  async handleAuthCallback(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      if (error) {
        this.lastError = `OAuth error: ${error}`;
        return false;
      }
      if (!code) {
        return false;
      }
      const storedState = sessionStorage.getItem('dropbox_oauth_state');
      if (state !== storedState) {
        this.lastError = 'Invalid state parameter - possible CSRF attack';
        return false;
      }
      const tokenData = await this.exchangeCodeForToken(code);
      if (tokenData?.access_token) {
        await this.setAccessToken(tokenData.access_token);
        localStorage.setItem('dropbox_access_token', tokenData.access_token);
        sessionStorage.removeItem('dropbox_oauth_state');
        window.history.replaceState({}, document.title, window.location.pathname);
        return true;
      } else {
        this.lastError = 'Failed to obtain access token';
        return false;
      }
    } catch (error) {
      this.lastError = `Authentication callback failed: ${error}`;
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
      console.error('Dropbox token exchange error:', errorText);
      throw new Error(`Token exchange failed (${response.status}): ${errorText}`);
    }
    return await response.json();
  }

  private generateState(): string {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return array.join('');
  }

  signOut(): void {
    this.accessToken = null;
    localStorage.removeItem('dropbox_access_token');
    sessionStorage.removeItem('dropbox_oauth_state');
  }

  async listFiles(path: string = ''): Promise<DropboxFile[]> {
    await this.ensureInitialized();
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    try {
      const normalizedPath = path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);
      const response = await this.dbx.filesListFolder({
        path: normalizedPath,
        recursive: false,
        include_media_info: false,
        include_deleted: false,
        include_has_explicit_shared_members: false
      });
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
      return files;
    } catch (error: any) {
      if (this.isAuthenticationError(error)) {
        this.signOut();
        throw new Error('Not authenticated');
      }
      throw error;
    }
  }

  async uploadFile(file: Blob, path?: string): Promise<any> {
    await this.ensureInitialized();
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Dropbox');
    }
    let uploadPath = path || '/uploaded-file.pdf';
    if (!uploadPath.startsWith('/')) {
      uploadPath = '/' + uploadPath;
    }
    uploadPath = uploadPath
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
      .trim();
    if (!uploadPath || uploadPath === '/') {
      uploadPath = '/uploaded-file.pdf';
    }
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
      throw new Error(error.message || 'Upload failed');
    }
  }

  async downloadFile(path: string): Promise<Blob> {
    await this.ensureInitialized();
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    try {
      let accessToken: string;
      if (this.dbx.auth && typeof this.dbx.auth.getAccessToken === 'function') {
        accessToken = await this.dbx.auth.getAccessToken();
      } else if (this.dbx.getAccessToken && typeof this.dbx.getAccessToken === 'function') {
        accessToken = this.dbx.getAccessToken();
      } else {
        throw new Error('Cannot get access token');
      }
      const response = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path: path }),
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      return blob;
    } catch (error) {
      if (this.isAuthenticationError(error)) {
        this.signOut();
        throw new Error('Not authenticated');
      }
      throw error;
    }
  }

  async downloadFileDirectAPI(path: string): Promise<Blob> {
    await this.ensureInitialized();
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    try {
      let accessToken: string;
      if (this.dbx.auth && typeof this.dbx.auth.getAccessToken === 'function') {
        accessToken = await this.dbx.auth.getAccessToken();
      } else if (this.dbx.getAccessToken && typeof this.dbx.getAccessToken === 'function') {
        accessToken = this.dbx.getAccessToken();
      } else {
        throw new Error('Cannot get access token');
      }
      const response = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path: path }),
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      return blob;
    } catch (error) {
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

  async deleteFile(path: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    try {
      await this.dbx.filesDeleteV2({ path: path });
    } catch (error) {
      if (this.isAuthenticationError(error)) {
        this.signOut();
        throw new Error('Not authenticated');
      }
      throw error;
    }
  }

  async getFileContent(path: string): Promise<string> {
    try {
      const blob = await this.downloadFile(path);
      return await blob.text();
    } catch (error) {
      throw error;
    }
  }

  async createTextFile(name: string, content: string, path?: string): Promise<any> {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], name, { type: 'text/plain' });
    return this.uploadFile(file, path);
  }

  async reinitialize(): Promise<void> {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.dbx = null;
    this.lastError = null;
    await this.initializeDropbox();
  }
}