import { Component, inject, OnInit } from '@angular/core';
import { HeroesService } from '../../data-access/heroes.service';

@Component({
  selector: 'app-heroes-list',
  imports: [],
  templateUrl: './heroes-list.html',
  styleUrl: './heroes-list.scss',
})
export class HeroesList implements OnInit{
  private readonly heroesService = inject(HeroesService)

  ngOnInit(): void{
    this.heroesService.getAll().subscribe(
     { next: (heroes) => {
      console.log(heroes)
     },
     error: (err) => {
      console.log(err)
     }
    })
  }
}
