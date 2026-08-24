import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeroesService } from '../../data-access/heroes.service';
import { Hero } from '../../models/hero.model';

@Component({
  selector: 'app-heroes-edit',
  imports: [],
  templateUrl: './heroes-edit.html',
  styleUrl: './heroes-edit.scss',
})
export class HeroesEdit implements OnInit {

  private readonly router = inject(ActivatedRoute)
  private readonly heroesService = inject(HeroesService)

  hero = signal<Hero | null>(null)

  ngOnInit() {
    const id = Number(this.router.snapshot.paramMap.get('id'));

    if (!id) return;

    this.heroesService.getById(id).subscribe({
      next: hero => {
        this.hero.set(hero)
        console.log(this.hero())
      }
    });
  }

}
