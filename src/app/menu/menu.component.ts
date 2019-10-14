import { Component, OnInit, Inject } from '@angular/core';
import {Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import {flyInOut , expand} from '../animations/app.animation'
import { PromotionService } from '../services/promotion.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':  'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})

export class MenuComponent implements OnInit {
  dishes: Dish[] ;
  errMess: string;

  constructor(private promotionService:PromotionService, private dishService: DishService, @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = dishes,
      errmess => this.errMess = <any>errmess);
  }
 

}
