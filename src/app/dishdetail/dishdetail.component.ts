import { Component, OnInit, Input, ViewChild ,Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { DishService } from '../services/dish.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { visibility, flyInOut,expand } from '../animations/app.animation';
import {Comment} from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style':  'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),
    expand()
    ]
})
export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;
  @ViewChild('slider')slider;
    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    dishcopy: Dish;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
     }
     visibility = 'shown';
  ngOnInit() {this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }
  goBack(): void {
    this.location.back();
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  formErrors = {
    'name': '',
    'comment': '',
  };
  validationMessages = {
    'name': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Last Name must be at least 5 characters long.',
      'maxlength':     'Last Name cannot be more than 150 characters long.'
    },
};
createForm() {
  this.commentForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    rating:'5',
    comment:['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)] ]
  });

  this.commentForm.valueChanges
  .subscribe(data => this.onValueChanged(data));
  this.onValueChanged();
}


onSubmit() {
  this.comment = this.commentForm.value;
  var today = new Date();
  this.comment.date=today.toISOString();
  this.dishcopy.comments.push(this.comment);
  this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
  console.log(this.comment);
  this.commentForm.reset({
    name: '',
    rating:'5',
    comment: ''
  });
  this.slider.value="5"

  
  
  this.commentFormDirective.resetForm();
}
onValueChanged(data?: any) {
  if (!this.commentForm) { return; }
  const form = this.commentForm;
  for (const field in this.formErrors) {
    if (this.formErrors.hasOwnProperty(field)) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }
    }
  }
}



}

