import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    standalone: false,
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
    @Input() message = 'Yükleniyor...';
    @Input() size = 64; // px
    @Input() minHeight = 120; // px
    @Input() color = 'var(--primary, #2b6cb0)';
}
