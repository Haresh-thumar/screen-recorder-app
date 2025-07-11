import { Component, inject } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-product-list-2',
  imports: [],
  templateUrl: './product-list-2.component.html',
  styleUrl: './product-list-2.component.scss',
})
export class ProductList2Component {
  protected http = inject(HttpClient);
  protected router = inject(Router);

  products: Product[] = [];
  isLoading = true;
  currentRoute: string = '';

  ngOnInit() {
    this.loadProducts();
    this.currentRoute = this.router.url;
    // Track router navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // If coming back to this component's route, refresh data
        if (event.url === this.currentRoute) {
          this.loadProducts();
        }
      });
  }

  protected loadProducts() {
    this.isLoading = true;
    this.http.get<Product[]>('https://fakestoreapi.com/products').subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      },
    });
  }

  viewDetails(product: Product) {
    const currentRouteSegments = this.router.url.split('/');
    const listType = currentRouteSegments[2]; // Get 'product-list', 'product-list-2', etc.

    this.router.navigate([`/cart/${listType}/product`], {
      queryParams: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
      },
    });
  }
}
