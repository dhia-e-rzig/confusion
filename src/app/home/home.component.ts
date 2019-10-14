import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { from } from 'rxjs';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animation';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':  'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader:Leader;
  errMessD: string;
  errMessP: string;
  errMessL: string;
  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,
    private LeaderService:LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
   this.dishservice.getFeaturedDish()
   .subscribe((dish)=>(this.dish=dish) , errmess => this.errMessD = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
    .subscribe((promotion) => (this.promotion= promotion), errmess => this.errMessP = <any>errmess) ;
    this.LeaderService.getFeaturedLeader()
    .subscribe(leader => this.leader=leader , errmess => this.errMessL = <any>errmess);
  }
  

}
