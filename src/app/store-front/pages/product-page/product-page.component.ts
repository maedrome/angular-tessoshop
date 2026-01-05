import { Component, inject, linkedSignal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map, of, tap } from 'rxjs';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent, CurrencyPipe],
  templateUrl: './product-page.component.html',
})
export default class ProductPageComponent {
  productsService = inject(ProductsService); 
  activatedRoute = inject(ActivatedRoute);
  idSlugParam = this.activatedRoute.snapshot.params['idSlug'];
  productIdSlug = linkedSignal(() => this.idSlugParam ?? '');
  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug() }),
    loader:({ request }) => {
      return this.productsService.getProduct(request.idSlug)
    }
  })
}
