import { Component } from '@angular/core';

@Component({
  selector: 'app-folders',
  imports: [],
  templateUrl: './folders.component.html',
  styleUrl: './folders.component.css'
})
export class FoldersComponent {

  addFolderDialogVisible: boolean = false;


  showAddFolderDialog() {
    this.addFolderDialogVisible = true;
  }
}
