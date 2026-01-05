import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private activatedRoute = inject(ActivatedRoute);
  pageQueryParam = toSignal(this.activatedRoute.queryParams.pipe(
    map(({page})=>page ?? 1),
    map((page)=>isNaN(page) ? 1 : Number(page))), 
    {
      initialValue: 1
    }
  )
  showPerPage = signal(10);
  pages = signal(6);

}
