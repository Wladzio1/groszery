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
