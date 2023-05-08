import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Weather } from './model';
import { lastValueFrom, map } from 'rxjs';

const WEATHER_API_KEY: string = '07bc967bac4014cc4fd3c3dc5341c06f';
const WEATHER_URL: string = 'https://api.openweathermap.org/data/2.5/weather'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  form!: FormGroup
  weather$!: Promise<Weather[]>

  constructor(private fb: FormBuilder, private http: HttpClient) {}


  ngOnInit(): void {
      this.form = this.createForm();
  }

  ngOnDestroy(): void {
      
  }

  createForm(): FormGroup {
    return this.fb.group({
      city: this.fb.control<string>('', [Validators.required])
    })
  }

  getWeather() {
    const city = this.form.value['city'];
    console.info(`City: ${city}`)
    const queryParams = new HttpParams()
                                .set('q', city)
                                .set('units', 'metric')
                                .set('appid', WEATHER_API_KEY);
    this.weather$ = lastValueFrom(this.http.get<Weather[]>(WEATHER_URL, { params: queryParams })
                                  .pipe(
                                    map((v: any) => {
                                      //assigning variables to collect the required data first
                                      const lon = v['coord']['lon'];
                                      const lat = v['coord']['lat'];
                                      const temp = v['main']['temp'];
                                      //to access the data in weather array
                                      const weather = v['weather'] as any[]
                                      return weather.map((w: any) => {
                                        return {
                                          //finally, assign the data to attributes in accordance to Weather class and return as Weather
                                          description: w['description'],
                                          latitude: lat,
                                          longitude: lon,
                                          temperature: temp,
                                          icon: w['icon']
                                        } as Weather
                                      }) 
                                    })
                                  )    
    )
  }

}
