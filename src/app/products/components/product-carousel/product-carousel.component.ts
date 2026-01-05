import { AfterViewInit, Component, effect, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import Swiper from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation'

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.component.html',
  styles:`

    .swiper-slide-thumb-active{
      border-color: #2162a1 !important
    }
  `
})
export class ProductCarouselComponent implements AfterViewInit, OnChanges{
  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');
  swiperThumbDiv = viewChild.required<ElementRef>('swiperThumbDiv');
  swiper : Swiper | undefined = undefined;
  swiperThumb : Swiper | undefined = undefined;
  ngAfterViewInit() {
    this.swiperInit();
    this.swiper?.update();
    this.swiperThumb?.update()
  }
  swiperInit = () => {
    const element = this.swiperDiv().nativeElement;
    const thumbElement = this.swiperThumbDiv().nativeElement;
    if (!element||!thumbElement) return;
    this.swiperThumb = new Swiper(thumbElement, {
      // Optional parameters
      direction: 'horizontal',
      slidesPerView: 4,
      freeMode: true,
      breakpoints: {
        640:{
          direction: 'vertical'
        }
      }
    });
    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: false,
      thumbs: {
        swiper: this.swiperThumb
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      modules: [Navigation, Thumbs]
    });
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes['images'].firstChange) return;
    setTimeout(()=>{
      // this.swiper?.destroy(true,true)
      // this.swiperThumb?.destroy(true, true)
      // this.swiperInit()
      this.swiper?.update();
      this.swiperThumb?.update()
    },100);
  }
  
}
