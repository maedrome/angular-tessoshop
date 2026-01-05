import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { I18nSelectPipe, TitleCasePipe } from '@angular/common';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, I18nSelectPipe, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export default class GenderPageComponent {
  headerMap = {
    men: 'Style That Defines: Fashion for Him',
    women: 'Express Your Essence: Fashion for Her',
    kid: 'Fun and Style: Fashion for the Little Ones'
  };
  titleMap = {
    men: 'Men',
    women: 'Women',
    kid: 'Kids'
  } 
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  paginationService = inject(PaginationService);
  genderParam = this.activatedRoute.params.pipe(map(({ gender }) => gender))
  gender = toSignal(this.genderParam);
  productsResource = rxResource({
    request: () => ({ 
      gender:this.gender(),
      offset:this.paginationService.pageQueryParam()-1 
    }),
    loader: ( {request} ) => {
      return this.productsService.getProducts(request)
    }
  })


}
