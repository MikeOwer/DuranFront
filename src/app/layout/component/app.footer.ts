import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <a href="https://gant.mx" target="_blank" rel="noopener noreferrer" class="text-contrast font-bold hover:underline">Gant soluciones empresariales</a>
    </div>`
})
export class AppFooter { }