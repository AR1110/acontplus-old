import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ActivatedRoute } from '@angular/router';
import { AuthRepository } from '@modules/auth/domain/repositories/auth.repository';
import { TokenRepository } from '@modules/auth/domain/repositories/token.repository';

// Converted to Jest: Jasmine matchers replaced with Jest equivalents

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent], // Standalone components go here
      providers: [
        { provide: ActivatedRoute, useValue: {} }, // Mock ActivatedRoute
        { provide: AuthRepository, useValue: {} }, // Mock AuthRepository
        { provide: TokenRepository, useValue: {} }, // Mock TokenRepository
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy(); // Jest supports toBeTruthy
  });

  it(`should have as title 'Acontplus'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Acontplus'); // Jest supports toEqual
  });
});
