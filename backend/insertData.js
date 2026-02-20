const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/movies.db');

const movies = [
{
id: 1,
name: "Inception",
image: "https://www.kroger.com/product/images/xlarge/front/0088392910612",
year: 2010,
genres: "Sci-Fi,Thriller,Action",
embed: "https://youtu.be/YoHD9XEInc0?si=HFcym_D1dTfH4asu",
director: "Christopher Nolan",
cast: "Leonardo DiCaprio,Joseph Gordon-Levitt,Elliot Page",
language: "English",
rating: 8.8,
synopsis: "A skilled thief enters dreams to steal secrets but is assigned the impossible task of planting an idea into a target’s subconscious."
},
{
id: 2,
name: "Interstellar",
image: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
year: 2014,
genres: "Sci-Fi,Drama,Adventure",
embed: "https://www.youtube.com/embed/zSWdZVtXT7E",
director: "Christopher Nolan",
cast: "Matthew McConaughey,Anne Hathaway,Jessica Chastain",
language: "English",
rating: 8.7,
synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity’s survival."
},
{
id: 3,
name: "The Dark Knight",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStSrkl4OLvST4y_f-fz56oL5olr-DCvJ2cWQ&s",
year: 2008,
genres: "Action,Crime,Drama",
embed: "https://www.youtube.com/embed/EXeTwQWrcwY",
director: "Christopher Nolan",
cast: "Christian Bale,Heath Ledger,Aaron Eckhart",
language: "English",
rating: 9.0,
synopsis: "Batman faces the Joker, a criminal mastermind who plunges Gotham into chaos."
},
{
id: 4,
name: "3 Idiots",
image: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg",
year: 2009,
genres: "Comedy,Drama",
embed: "https://youtu.be/DKzBmRRdPXo?si=xZpWjLONm7x6vAKm",
director: "Rajkumar Hirani",
cast: "Aamir Khan,R. Madhavan,Sharman Joshi,Kareena Kapoor",
language: "Hindi",
rating: 8.4,
synopsis: "Three engineering students challenge academic pressure and redefine success."
},
{
id: 5,
name: "Dangal",
image: "https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg",
year: 2016,
genres: "Biography,Sports,Drama",
embed: "https://www.youtube.com/embed/x_7YlGv9u1g",
director: "Nitesh Tiwari",
cast: "Aamir Khan,Fatima Sana Shaikh,Sanya Malhotra",
language: "Hindi",
rating: 8.3,
synopsis: "A former wrestler trains his daughters to become world-class champions."
},
{
id: 6,
name: "RRR",
image: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
year: 2022,
genres: "Action,Drama,Historical",
embed: "https://www.youtube.com/embed/f_vbAtFSEc0",
director: "S. S. Rajamouli",
cast: "N. T. Rama Rao Jr.,Ram Charan,Alia Bhatt",
language: "Telugu",
rating: 7.8,
synopsis: "A fictional story of two Indian revolutionaries fighting British colonial rule."
},
{
id: 7,
name: "Baahubali: The Beginning",
image: "https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg",
year: 2015,
genres: "Action,Fantasy,Epic",
embed: "https://www.youtube.com/embed/3NQRhE772b0",
director: "S. S. Rajamouli",
cast: "Prabhas,Rana Daggubati,Anushka Shetty,Tamannaah",
language: "Telugu",
rating: 8.0,
synopsis: "A young man discovers his royal heritage and rises to reclaim his kingdom."
},
{
id: 8,
name: "Arjun Reddy",
image: "https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Arjun_Reddy.jpg/250px-Arjun_Reddy.jpg",
year: 2017,
genres: "Romance,Drama",
embed: "https://youtu.be/aozErj9NqeE?si=5rPXV_mfoEKttxYr",
director: "Sandeep Reddy Vanga",
cast: "Vijay Deverakonda,Shalini Pandey",
language: "Telugu",
rating: 8.1,
synopsis: "A brilliant but self-destructive surgeon spirals after heartbreak."
},
{
id: 9,
name: "The Shawshank Redemption",
image: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
year: 1994,
genres: "Drama",
embed: "https://www.youtube.com/embed/6hB3S9bIaco",
director: "Frank Darabont",
cast: "Tim Robbins,Morgan Freeman",
language: "English",
rating: 9.3,
synopsis: "Two imprisoned men bond over years and find redemption through hope."
},
{
id: 10,
name: "Oppenheimer",
image: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg",
year: 2023,
genres: "Biography,Drama,History",
embed: "https://www.youtube.com/embed/uYPbbksJxIg",
director: "Christopher Nolan",
cast: "Cillian Murphy,Emily Blunt,Robert Downey Jr.",
language: "English",
rating: 8.4,
synopsis: "The story of J. Robert Oppenheimer and the creation of the atomic bomb."
},
{
id: 11,
name: "Avatar",
image: "https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg",
year: 2009,
genres: "Sci-Fi,Adventure,Fantasy",
embed: "https://www.youtube.com/embed/5PSNL1qE6VY",
director: "James Cameron",
cast: "Sam Worthington,Zoe Saldana,Sigourney Weaver",
language: "English",
rating: 7.9,
synopsis: "A paraplegic Marine becomes torn between following military orders and protecting the alien world of Pandora."
},
{
id: 12,
name: "Titanic",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMzsZYpklmQ-dGmLsdqTfiqRTqSA2YRbHPSQ&s",
year: 1997,
genres: "Romance,Drama,Disaster",
embed: "https://www.youtube.com/embed/kVrqfYjkTdQ",
director: "James Cameron",
cast: "Leonardo DiCaprio,Kate Winslet",
language: "English",
rating: 7.9,
synopsis: "A young aristocrat falls in love with a poor artist aboard the ill-fated RMS Titanic."
},
{
id: 13,
name: "Gladiator",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-rAnpCrP0jqKWBWf12oa1_P2lADNinE3Ug&s",
year: 2000,
genres: "Action,Drama,Historical",
embed: "https://www.youtube.com/embed/owK1qxDselE",
director: "Ridley Scott",
cast: "Russell Crowe,Joaquin Phoenix",
language: "English",
rating: 8.5,
synopsis: "A betrayed Roman general seeks revenge against the corrupt emperor who murdered his family."
},
{
id: 14,
name: "Joker",
image: "https://upload.wikimedia.org/wikipedia/en/e/e1/Joker_%282019_film%29_poster.jpg",
year: 2019,
genres: "Crime,Drama,Thriller,Horror",
embed: "https://www.youtube.com/embed/zAGVQLHvwOY",
director: "Todd Phillips",
cast: "Joaquin Phoenix,Robert De Niro",
language: "English",
rating: 8.4,
synopsis: "A failed comedian descends into madness and becomes the infamous Joker."
},
{
id: 15,
name: "Andhadhun",
image: "https://upload.wikimedia.org/wikipedia/en/4/47/Andhadhun_poster.jpg",
year: 2018,
genres: "Crime,Thriller,Dark Comedy,Horror",
embed: "https://www.youtube.com/embed/2iVYI99VGaw",
director: "Sriram Raghavan",
cast: "Ayushmann Khurrana,Tabu,Radhika Apte",
language: "Hindi",
rating: 8.2,
synopsis: "A blind pianist becomes entangled in a web of crime after witnessing a murder."
},
{
id: 16,
name: "Gully Boy",
image: "https://upload.wikimedia.org/wikipedia/en/0/07/Gully_Boy_poster.jpg",
year: 2019,
genres: "Drama,Music",
embed: "https://www.youtube.com/embed/JfbxcD6biOk",
director: "Zoya Akhtar",
cast: "Ranveer Singh,Alia Bhatt",
language: "Hindi",
rating: 7.9,
synopsis: "An aspiring street rapper from Mumbai rises from poverty to pursue his dream."
},
{
id: 17,
name: "War",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5uX2Pmt7AK1ev7UHeUzU6xRUjnfmQ28ZwNA&s",
year: 2019,
genres: "Action,Spy,Thriller,Horror",
embed: "https://www.youtube.com/embed/tQ0mzXRk-oM",
director: "Siddharth Anand",
cast: "Hrithik Roshan,Tiger Shroff,Vaani Kapoor",
language: "Hindi",
rating: 6.5,
synopsis: "An Indian soldier is assigned to eliminate his former mentor who has gone rogue."
},
{
id: 18,
name: "The Conjuring",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLqF2yeYJuKk3KqYNAt2WvPQRvUTD4g1cuVQ&s",
year: 2013,
genres: "Horror,Thriller",
embed: "https://www.youtube.com/embed/k10ETZ41q5o",
director: "James Wan",
cast: "Patrick Wilson,Vera Farmiga",
language: "English",
rating: 7.5,
synopsis: "Paranormal investigators help a family terrorized by a dark presence."
},
{
id: 19,
name: "Spider-Man: No Way Home",
image: "https://upload.wikimedia.org/wikipedia/en/0/00/Spider-Man_No_Way_Home_poster.jpg",
year: 2021,
genres: "Action,Adventure,Sci-Fi,Superhero",
embed: "https://www.youtube.com/embed/JfVOs4VSpmA",
director: "Jon Watts",
cast: "Tom Holland,Zendaya,Benedict Cumberbatch",
language: "English",
rating: 8.2,
synopsis: "Peter Parker seeks help from Doctor Strange when the multiverse opens dangerous doors."
},
{
id: 20,
name: "Lagaan",
image: "https://upload.wikimedia.org/wikipedia/en/b/b6/Lagaan.jpg",
year: 2001,
genres: "Drama,Sports,Historical",
embed: "https://www.youtube.com/embed/oSIGQ0YkFxs",
director: "Ashutosh Gowariker",
cast: "Aamir Khan,Gracy Singh",
language: "Hindi",
rating: 8.1,
synopsis: "Indian villagers challenge British rulers to a cricket match to escape colonial taxation."
},
{
id: 21,
name: "The Martian",
image: "https://upload.wikimedia.org/wikipedia/en/c/cd/The_Martian_film_poster.jpg",
year: 2015,
genres: "Sci-Fi,Adventure,Drama",
embed: "https://www.youtube.com/embed/ej3ioOneTy8",
director: "Ridley Scott",
cast: "Matt Damon,Jessica Chastain",
language: "English",
rating: 8.0,
synopsis: "An astronaut stranded on Mars must use science and ingenuity to survive while NASA works to bring him home."
},
{
id: 22,
name: "Everything Everywhere All at Once",
image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Everything_Everywhere_All_at_Once.jpg",
year: 2022,
genres: "Sci-Fi,Adventure,Comedy,Drama",
embed: "https://www.youtube.com/embed/wxN1T1uxQ2g",
director: "Daniel Kwan,Daniel Scheinert",
cast: "Michelle Yeoh,Ke Huy Quan,Stephanie Hsu",
language: "English",
rating: 7.8,
synopsis: "A woman discovers she must connect with alternate universe versions of herself to stop a multiversal collapse."
},
{
id: 23,
name: "Parasite",
image: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png",
year: 2019,
genres: "Thriller,Drama,Dark Comedy",
embed: "https://www.youtube.com/embed/5xH0HfJHsaY",
director: "Bong Joon-ho",
cast: "Song Kang-ho,Lee Sun-kyun",
language: "English",
rating: 8.5,
synopsis: "A poor family schemes to infiltrate a wealthy household, leading to shocking consequences."
},
{
id: 24,
name: "Zindagi Na Milegi Dobara",
image: "https://upload.wikimedia.org/wikipedia/en/1/17/Zindagi_Na_Milegi_Dobara.jpg",
year: 2011,
genres: "Drama,Comedy,Adventure",
embed: "https://www.youtube.com/embed/FJrpcDgC3zU",
director: "Zoya Akhtar",
cast: "Hrithik Roshan,Farhan Akhtar,Abhay Deol,Katrina Kaif",
language: "Hindi",
rating: 8.2,
synopsis: "Three friends embark on a life-changing road trip across Spain."
},
{
id: 25,
name: "Tumbbad",
image: "https://upload.wikimedia.org/wikipedia/en/4/41/Tumbbad_poster.jpg",
year: 2018,
genres: "Horror,Fantasy,Thriller",
embed: "https://youtu.be/O9CaB4J4VEI?si=M3g1bIV0e8fVMTrl",
director: "Rahi Anil Barve",
cast: "Sohum Shah,Anita Date",
language: "Hindi",
rating: 8.2,
synopsis: "A man's greed leads him to uncover a hidden ancestral treasure guarded by a mythological entity."
},
{
id: 26,
name: "Kahaani",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx_iv5WEJfB-79Tf0LY_-4Avb08B3e0blmfA&s",
year: 2012,
genres: "Mystery,Thriller,Horror",
embed: "https://www.youtube.com/embed/rsjamVgPoI8",
director: "Sujoy Ghosh",
cast: "Vidya Balan,Nawazuddin Siddiqui",
language: "Hindi",
rating: 8.1,
synopsis: "A pregnant woman searches Kolkata for her missing husband, uncovering hidden truths."
},
{
id: 27,
name: "Shershaah",
image: "https://upload.wikimedia.org/wikipedia/en/9/91/Shershaah_film_poster.jpg",
year: 2021,
genres: "Biography,War,Drama",
embed: "https://www.youtube.com/embed/Q0FTXnefVBA",
director: "Vishnuvardhan",
cast: "Sidharth Malhotra,Kiara Advani",
language: "Hindi",
rating: 8.4,
synopsis: "Based on the life of Captain Vikram Batra and his bravery in the Kargil War."
},
{
id: 28,
name: "Manamey",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdt3dBB62XBk3cZkEhSzlybGNLaYv0gNgm1g&s",
year: 2024,
genres: "Romance,Comedy,Drama",
embed: "https://www.youtube.com/embed/3zOCInbXzy8",
director: "Sriram Adittya",
cast: "Sharwanand,Krithi Shetty",
language: "Telugu",
rating: 7.2,
synopsis: "A carefree man must step into responsibility when a child unexpectedly enters his life."
},
{
id: 29,
name: "Premalu",
image: "https://i.pinimg.com/564x/18/3e/9d/183e9d1a8b3204a628a01a98756d0b57.jpg",
year: 2024,
genres: "Romantic Comedy",
embed: "https://www.youtube.com/embed/tQyEDwnwwsA",
director: "Girish A.D.",
cast: "Naslen,Mamitha Baiju",
language: "Telugu",
rating: 8.3,
synopsis: "A young man relocates to Hyderabad and unexpectedly finds love while chasing career dreams."
},
{
id: 30,
name: "Kubera",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsWlfYbxVRsD0vnAAXVejJebkaOzcceEJA4w&s",
year: 2025,
genres: "Fantasy,Drama",
embed: "https://www.youtube.com/embed/i2UTXe4M97Q",
director: "Sekhar Kammula",
cast: "Dhanush,Rashmika Mandanna,Jim Sarbh",
language: "Telugu",
rating: 7.5,
synopsis: "A socio-fantasy drama exploring wealth, morality, and the true cost of power."
},
{
id: 31,
name: "Kannappa",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9ghOcfwSX1cP6DDNkl1do9rnD0klPxdAlAA&s",
year: 2025,
genres: "Mythology,Drama,Fantasy",
embed: "https://www.youtube.com/embed/VnPFQ7nNu0U",
director: "Mukesh Kumar Singh",
cast: "Vishnu Manchu,Prabhas,Mohanlal",
language: "Telugu",
rating: 7.6,
synopsis: "A mythological epic based on the legendary devotee Kannappa and his unwavering devotion to Lord Shiva."
},
{
id: 32,
name: "Amaran",
image: "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Amaran_2024_poster.jpg/250px-Amaran_2024_poster.jpg",
year: 2024,
genres: "Biography,Action,Drama",
embed: "https://www.youtube.com/embed/U3aPapvUihg",
director: "Rajkumar Periasamy",
cast: "Sivakarthikeyan,Sai Pallavi",
language: "Telugu",
rating: 8.1,
synopsis: "The story of Major Mukund Varadarajan and his bravery during anti-terror operations."
},
{
id: 33,
name: "Salaar",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0p7b7LjUZPic6uzQpOSXOVH1w2bVEXwJWsw&s",
year: 2023,
genres: "Action,Thriller,Drama",
embed: "https://www.youtube.com/embed/b0fPciW_uco",
director: "Prashanth Neel",
cast: "Prabhas,Shruti Haasan,Jagapathi Babu",
language: "Telugu",
rating: 6.6,
synopsis: "A violent gang leader returns to reshape the power structure of a brutal kingdom."
},
{
id: 34,
name: "Hi Nanna",
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgjZPXViCooAO0LpoifJ5spfer51tzoHAn3A&s",
year: 2023,
genres: "Family,Drama,Romance",
embed: "https://www.youtube.com/embed/Iz97_kxHaSc",
director: "Shouryuv",
cast: "Nani,Mrunal Thakur,Kiara Khanna",
language: "Telugu",
rating: 8.2,
synopsis: "A father and daughter navigate love, memory, and second chances."
},

{
id: 37,
name: "Queen",
image: "https://upload.wikimedia.org/wikipedia/en/4/45/QueenMoviePoster7thMarch.jpg",
year: 2014,
genres: "Comedy,Drama",
embed: "https://youtu.be/eLUHD-DUpnk?si=gwDd5GyCZQLgl80q",
director: "Vikas Bahl",
cast: "Kangana Ranaut,Rajkummar Rao",
language: "Hindi",
rating: 8.2,
synopsis: "After her wedding is called off, a young woman embarks on a solo honeymoon that changes her life."
}




];


db.serialize(() => {
  // Insert all movies
  const stmt = db.prepare(`
    INSERT INTO movies 
    (name, image, year, genres, embed, director, cast, synopsis, language, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  movies.forEach(movie => {
    stmt.run(
      movie.name,
      movie.image,
      movie.year,
      movie.genres,
      movie.embed,
      movie.director,
      movie.cast,
      movie.synopsis,
      movie.language,
      movie.rating
    );
  });

  stmt.finalize();

  // After inserts, populate trending table with top 10 rated movies
  db.all("SELECT id FROM movies ORDER BY rating DESC LIMIT 10", (err, rows) => {
    if (err) {
      console.error(err);
      db.close();
      return;
    }

    const trendingStmt = db.prepare("INSERT INTO trending (movie_id, rank) VALUES (?, ?)");
    rows.forEach((row, index) => {
      trendingStmt.run(row.id, index + 1);
    });

    trendingStmt.finalize(() => {
      console.log("Seed data inserted!");
      db.close(); // Close only after trending insertion is finalized
    });
  });
});