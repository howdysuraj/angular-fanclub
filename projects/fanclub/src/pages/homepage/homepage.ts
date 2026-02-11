import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Vision } from '../../components/vision/vision';
import { JoinCommunity } from '../../components/join-community/join-community';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'fanclub-homepage',
  imports: [
    Hero,
    Vision,
    JoinCommunity,
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export default class Homepage {

}
