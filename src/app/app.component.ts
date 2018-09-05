import { Component, OnInit } from '@angular/core';
import API_KEY from './api-key';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

const API_URL = 'https://www.googleapis.com/youtube/v3/search';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myAngularApp';

  searchForm: FormGroup;
  results: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.search();
  }

  search() {
    this.results = this.searchForm.controls.search.valueChanges.pipe(
      debounceTime(500),
      filter(value => value.length > 3),
      distinctUntilChanged(),
      switchMap(searchTerm => this.http.get<any>(`${API_URL}?q=${searchTerm}&key=${API_KEY}&part=snippet`)),
      map(response => response.items)
    );
  }

}
