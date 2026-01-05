import { Component, effect, ElementRef, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { ProductsTableComponent } from "../../../products/components/products-table/products-table.component";
import { ProductsService } from '@products/services/products.service';
import { rxResource} from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductsTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent { 
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  paginationService =inject(PaginationService);
  router = inject(Router);
  productsPerPage = linkedSignal(this.paginationService.showPerPage);
  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.pageQueryParam(),
      limit: this.productsPerPage()
    }),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page-1,
        limit: request.limit
      })
    }
  })
  onLimitChange = (value: number) => {
    // this.productsPerPage.set(value);
    this.paginationService.showPerPage.set(value)
    this.router.navigate(['/admin/products'],{
      queryParams: {
        page: 1
      }
    })
  }

  keepPagesNumber = effect(() => {
    if (this.productsResource.hasValue()){
      this.paginationService.pages.set(this.productsResource.value().pages);
    }
  })
}
