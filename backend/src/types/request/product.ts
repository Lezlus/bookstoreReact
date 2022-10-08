
type SortRequest = "price:asc" | "price:desc" | "relevance:asc" | "relevance:desc" | "title:asc" | "title:desc" | "release_date:asc" | "release_date:desc";
type PriceFilter = '<5' | '5-10' | '10-25' | '25<'
type PublisherRequest = "KODANSHA COMICS" | "SEVEN SEAS" | "VIZ BOOKS" | "DENPA" | "VERTICAL" | "DARK HORSE MANGA" | 
"SQUARE ENIX MANGA" | "YEN PRESS" | "ONE PEACE" | "GHOST SHIP" | "SUBLIME" | "J-NOVEL CLUB" | "SHOJO BEAT" | 
"FAKKU"
type GenreRequest = "Fantasy" | "Romance" | "Action" | "Horror" | "Drama" | "Comedy" | "Science Fiction" | 
"Mystery" | "Documentary" | "Erotica"

export { SortRequest, GenreRequest, PublisherRequest, PriceFilter };