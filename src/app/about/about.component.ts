import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import {LeaderService} from '../services/leader.service'

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  leaders:Leader[]
  constructor(private LeaderService: LeaderService) { }

  ngOnInit() {
    this.LeaderService.getLeaders()
    .then(leaders => this.leaders=leaders);
  }

}
