import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { catchError, map, of, tap } from 'rxjs';
import { ProductDetailsComponent } from "./product-details/product-details.component";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent { 
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  router = inject(Router);
  idParam = toSignal(this.activatedRoute.params.pipe(map(({id})=>id)));
  productResource = rxResource({
    request: () => ({id: this.idParam()}),
    loader: ({request}) => {
      return this.productsService.getProductById(request.id)
    }
  })

  redirectToProducts = effect(() => {
    if(this.productResource.error()){
      this.router.navigateByUrl('admin/products')
    }
  })
}
