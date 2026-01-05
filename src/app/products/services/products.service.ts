import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl = environment.baseUrl;
interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private emptyProduct : Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Men,
    tags: [],
    images: [],
    user: {} as User
  } 
  private queryCacheProducts = new Map<string,ProductsResponse>();
  private queryCacheProduct = new Map<string, Product>();
  getProducts(options:Options) : Observable<ProductsResponse> {
    const { limit = 12, offset = 0, gender = '' } = options;
    const stringOptions = JSON.stringify(options);
    if(this.queryCacheProducts.has(stringOptions)){
      return of(this.queryCacheProducts.get(stringOptions)!)
    }
    return this.http.get<ProductsResponse>(`${baseUrl}/products`,{
      params: {
        limit: limit,
        offset: offset*limit,
        gender: gender
      }
    })
    .pipe(
      tap((resp) => {
        console.log(resp);
        this.queryCacheProducts.set(stringOptions,resp)
      })
    )
  }

  getProduct = (slug:string): Observable<Product> => {
    if (this.queryCacheProduct.has(slug)) return of(this.queryCacheProduct.get(slug)!)
    return this.http.get<Product>(`${baseUrl}/products/${slug}`)
    .pipe(
      tap((resp)=>this.queryCacheProduct.set(slug,resp))
    )
  }

  getProductById = (id:string): Observable<Product> => {
    if ( id == 'new') {
      return of(this.emptyProduct)
    }
    if (this.queryCacheProduct.has(id)) return of(this.queryCacheProduct.get(id)!)
    return this.http.get<Product>(`${baseUrl}/products/${id}`)
    .pipe(
      tap((resp)=>this.queryCacheProduct.set(id,resp))
    )
  }

  updateProduct = (id: string, productLike: Partial<Product>, imageFileList?: FileList) : Observable<Product> => {
    const currentImages = productLike.images ?? [];
    return this.uploadImages(imageFileList).pipe(
      map(imageNames => ({...productLike, images: [...currentImages, ...imageNames]})),
      tap(updatedProduct=> console.log(updatedProduct)),
      switchMap(updatedProduct => this.http.patch<Product>(`${baseUrl}/products/${id}`,updatedProduct)),
      tap(((product)=> this.updateProductCache(product)))
    )
    //return this.http.patch<Product>(`${baseUrl}/products/${id}`,productLike).pipe(tap((product)=> this.updateProductCache(product)))
  }

  createProduct = (productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> => {
    return this.uploadImages(imageFileList).pipe(
      map(imageNames => ({...productLike, images: imageNames})),
      switchMap(newProduct => this.http.post<Product>(`${baseUrl}/products/`,newProduct)),
      tap((product) => this.updateProductCache(product)))
    //return this.http.post<Product>(`${baseUrl}/products/`,productLike).pipe(tap((product) => this.updateProductCache(product)))
  }

  updateProductCache = (product: Product) => {
    this.queryCacheProduct.set(product.id, product);
    // this.queryCacheProducts.forEach(
    //   res => {
    //     res.products.forEach((cacheProduct,index) => {
    //       if(cacheProduct.id==product.id){
    //         res.products[index]=product
    //       } 
    //     })
    // })

    this.queryCacheProducts.forEach(res => {
      res.products = res.products.map(currentProduct => currentProduct.id==product.id ? product : currentProduct)
    })
  }

  uploadImages = (images?:FileList): Observable<string[]> => {
    if (!images) return of([]);
    const updloadObservables = Array.from(images).map(imageFile => this.uploadImage(imageFile))
    return forkJoin(updloadObservables)
  }

  uploadImage = (imageFile:File): Observable<string> => {
    const formData = new FormData();
    formData.append('file',imageFile);
    return this.http.post<{fileName : string}>(`${baseUrl}/files/product`,formData).pipe(map(resp => resp.fileName))
  }
}
