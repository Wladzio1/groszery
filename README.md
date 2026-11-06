# Groszery: wdrożenie dla testerów (bez konta Claude)

Aplikacja to statyczna strona (jeden plik `index.html`). Plany układa program z przepisów i cen zapisanych w `engine.js`. Nie używa AI ani żadnych płatnych usług.

## 1. GitHub
1. Utwórz repozytorium (np. `groszery`), wrzuć wszystkie pliki z tego folderu.
## 2. Render
1. Render > New > **Static Site** > połącz repozytorium.
2. Build Command: zostaw puste. Publish Directory: `.` (kropka).
3. Po wdrożeniu dostaniesz adres `https://groszery.onrender.com`. Każdy `git push` aktualizuje stronę.
## 3. Pomiary (Arkusz Google)
1. Utwórz pusty Arkusz Google. Rozszerzenia > Apps Script > wklej `Code.gs`.
2. Wdróż > Nowe wdrożenie > Aplikacja internetowa > Wykonuj jako: Ja, Dostęp: Każdy. Skopiuj adres URL.
3. W `index.template.html` wpisz ten adres w `const ENDPOINT=''` i uruchom `python3 build.py` (albo poproś mnie o to). Wrzuć na GitHub.
4. Wyniki: zakładka z surowymi zdarzeniami + funkcja `summary` (Uruchom) tworzy zakładkę "Podsumowanie".
Zdarzenia: `plan`, `plan_again` (drugi i kolejne plany), `swap`, `cheaper`, `recipe_open`, `list_start`, `list_done`, `copy_list`, `share_list`, `rating`, `receipt` (szacunek kontra paragon), `comment`. Użytkownik ma anonimowy identyfikator z przeglądarki, bez danych osobowych.
## 4. Zanim zaprosisz ludzi
- Sprawdź ceny: `PRICES_CHECKLIST.csv` (uzupełnij Biedronkę i Lidla w sklepie).
- Ugotuj przepisy: `RECIPES_REVIEW.csv`.
- Zapytaj prawnika o politykę prywatności (RODO), jeśli ruszasz poza kilku znajomych.
## 5. Co mierzyć w teście (10 osób, 1 tydzień)
Wrócili po drugi plan? Zaczęli i skończyli odhaczać listę? Ile wynosi średni błąd ceny względem paragonu? Cel startowy: błąd poniżej 10% i co najmniej połowa osób z drugim planem.

## Zmiany 31.10.2026 (v0.2)
- Formularz działa jak kreator: jedno pytanie na ekranie (8 kroków: budżet, dni, posiłki dziennie, dieta, alergie, lubię, nie lubię, w domu). Wracający użytkownik widzi zapisane ustawienia i przycisk "Ułóż nowy plan".
- Nowa funkcja "Ratuj lodówkę": produkty, które się psują, zamieniane na przepisy (baza: 43 produkty, 32 przepisy; nieznane produkty są zgłaszane jako brakujące w bazie).
- Przepisy przepisane (więcej smaku: koncentrat, cytryna, curry, wędzona papryka, sos sojowy, śmietana, techniki smażenia). Zakładamy, że w domu jest sól, pieprz, oregano i słodka papryka; reszta przypraw jest liczona w koszcie.
- Nowe zdarzenia pomiarowe: step (wejście na krok), rescue_open, rescue, rescue_to_plan.

## Aktualizacja istniejącej wersji (bez zakładania nowego repo i nowej usługi)
1. Wejdź w to samo repozytorium na GitHubie. Wgraj nowe pliki na stare: Add file > Upload files, przeciągnij zawartość folderu `groszery` (w tym folder `icons`), zatwierdź (Commit changes). Albo w terminalu: skopiuj pliki do sklonowanego repo, potem `git add .`, `git commit -m "v0.2"`, `git push`.
2. Usuń z repo stare pliki, których nie ma w paczce (jeśli były).
3. Render sam wdroży zmianę po commicie (Auto-Deploy). Sprawdź w panelu Render zakładkę Events, czy wdrożenie przeszło. Adres strony się nie zmienia.
4. Jeśli stara usługa na Render nie jest typu Static Site (np. Web Service), załóż nową jako Static Site na tym samym repo (Publish Directory: `.`), a starą usuń.
5. Po wdrożeniu odśwież stronę na telefonie wymuszając przeładowanie (zamknij kartę i otwórz ponownie). Stare ustawienia z przeglądarki są wczytywane, a plany z poprzedniej wersji są ignorowane.

## Zmiany 02.11.2026 (v0.3)
- Rotacja posiłków: to samo danie ani ten sam „typ” dania (np. makaron) nie występuje dwa razy tego samego dnia, a w tym samym miejscu dnia (np. śniadanie) nie powtarza się dzień po dniu. Testy: 0 powtórzeń śniadania dzień po dniu, 0 dni z dwoma daniami z makaronem.
- „Zrób taniej” zawsze daje tańszy plan albo komunikat, że taniej się nie da (testy: 0 przypadków droższego planu).
- Nowy krok 4 w kreatorze: styl gotowania. „Meal prep” gotuje raz na 2-3 porcje (obiad i kolacja na zmianę), pokazuje kartę „Kiedy gotujesz”, przelicza składniki i oznacza resztki do odgrzania. Przechowywanie w lodówce: do 2-3 dni zależnie od dania.
- Silnik: plan.mode ('fresh' lub 'prep'), plan.sessions, meal.cook/k/from/until; wersja zapisu planu 2 (starsze plany są ignorowane).
- Minimalne koszty po zaostrzeniu rotacji (ceny szacunkowe): świeże gotowanie 3 dni ok. 88 zł, 5 dni ok. 120 zł, 7 dni ok. 155 zł; meal prep 3 dni ok. 70 zł, 5 dni ok. 88 zł, 7 dni ok. 113 zł. (Wartości zastąpione przez wersję 0.4 poniżej.)

## Zmiany 04.11.2026 (v0.4)
- Baza: 50 przepisów (12 śniadań, 30 obiadów i kolacji, 8 przekąsek) i 46 produktów. Nowe, polskie w stylu dania: pomidorowa z ryżem, kopytka, leniwe, kasza gryczana z pieczarkami, leczo, fasolka po bretońsku, zupa jarzynowa, kapusta duszona, zapiekanka ziemniaczana, omlety, kurczak w sosie śmietanowo-pieczarkowym, placki z cukinii, naleśniki wytrawne.
- Ceny porównane z publicznymi źródłami z 2026 r.: jajka (zakres GUS) bez zmian; masło 200 g obniżone z 8,50 na 5,50 zł (cena regularna w sieciach 4,99-5,99 zł); ser żółty 150 g 6,30 zł; olej 9,50 zł; pierś z kurczaka 20 zł/kg (widełki 14-25 zł/kg, niepewne). Pozostałe ok. 35 pozycji nadal wymaga sprawdzenia w sklepie.
- Minimalne koszty (ceny szacunkowe): świeże gotowanie 3 dni ok. 70 zł, 5 dni ok. 96 zł, 7 dni ok. 123 zł; meal prep 58, 72 i 98 zł. Domyślny budżet w aplikacji: 80 zł.
- Testy po zmianie: 0 powtórzeń dania w jednym dniu, 0 powtórzeń typu dania dzień po dniu, 0 przecieków alergenów/diet, Zrób taniej: 70 z 72 tańszych, 2 bez opcji, 0 droższych.
