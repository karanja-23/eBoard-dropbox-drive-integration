import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuModule,CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  menuIsOpen: boolean = true;
  left:string ="200px";
  menuIsLocked: boolean = true;
  toggleIcon: string = 'pi pi-circle-on';
  private justUnpinned: boolean = true;
  currentRoute: string = '/';
  isHovering: boolean = false;
  constructor(private router: Router) {
    console.log('AppComponent created, router injected');
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }

  toggleMenu() {
    if (this.menuIsLocked) {
      this.menuIsLocked = false;
      this.toggleIcon = 'pi pi-circle-off';
      this.menuIsOpen = false;
      this.left = '80px';
      this.justUnpinned = true;

      setTimeout(() => {
        this.justUnpinned = false;
      }, 100);
      
      return;
    }else{
      this.menuIsLocked = true;
      this.menuIsOpen = true;
      this.left = '220px';
      this.toggleIcon = 'pi pi-circle-on';
    }
  }
  closeMenu() {
    if (this.justUnpinned) {
      return;
    }
    if (this.menuIsLocked) {
      return;
    }
    this.menuIsLocked = false;
    this.menuIsOpen = false;
    this.left = '80px';
    this.toggleIcon = 'pi pi-circle-off';
  }
  mouseOver() {
    this.isHovering = true;
    if (!this.menuIsLocked && !this.justUnpinned) {
      this.menuIsOpen = true;
    
    }
  }

  mouseOut() {
    this.isHovering = false;
    if (!this.menuIsLocked) {
      this.menuIsOpen = false;
            
    }
  }

}
