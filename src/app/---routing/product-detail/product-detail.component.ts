import { Component } from '@angular/core';
import { Product } from '../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [TitleCasePipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  product!: Product;
  listType: string = 'product-list';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Get the list type from route params
    this.route.paramMap.subscribe((params) => {
      this.listType = params.get('listType') || 'product-list';
    });

    // Get product details from query params
    this.route.queryParams.subscribe((params) => {
      this.product = {
        id: +params['id'],
        title: params['title'],
        price: +params['price'],
        description: params['description'],
        category: params['category'],
        image: params['image'],
        rating: {
          rate: 0,
          count: 0,
        },
      };
    });
  }

  goBack() {
    // Navigate back to the specific product list page
    this.router.navigate([`/cart/${this.listType}`]);
  }
}
