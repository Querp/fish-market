import { Document } from './document.js';
import { Game } from './game.js';
import { Graph } from './graph.js';

// A static list of fishes and their definitions
export class Fish {
    static fishes = {};
    static spawnCounter = 0;

    constructor(type, img, priceMin, priceMax, priceVectorMax, priceVectorAccMax, color) {
        this.type = type;
        this.img = img;
        this.imgSrc = `img/fish/${type.toLowerCase()}.webp`;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.price = parseFloat((priceMin + (priceMax - priceMin) * Math.random()).toFixed(2)); // let

        this.priceVector = 0; // let        // describes how fast the price is going up/down each day    
        this.priceVectorMax = priceVectorMax;            // How much can this fish' value rise/drop per day
        this.priceVectorAccMax = priceVectorAccMax;   // How much can this value change each day 

        this.priceVolitility = priceVectorAccMax / this.priceVectorMax;

        this.color = color;

        this.drawToGraph = true;


        Fish.fishes[this.type] = this;
    }

    static init() {
        new Fish('Abelone', '🐠', 5, 35, 5, 0.4, '#ff6f00ff');
        new Fish('Blowfish', '🐡', 25, 65, 6, 0.8, '#8b3f0dff');
        new Fish('Bluefin', '🐟', 0.3, 12, 4, 2.1, '#009dffff');
        new Fish('Starfish', '⭐', 38, 75, 7, 2.4, '#fcffe4ff');
        new Fish('Snapper', '🦈', 7, 35, 1, 1000, '#5d675dff');
        new Fish('Sunfish', '🌞', 45, 55, 8, 0.15, '#ffaa00ff');

        // this.log();
    }

    spawnNew() {
        const weight = Math.random() * 500 + 10
        return {
            id: Fish.spawnCounter++,
            type: this.type,
            img: this.img,
            color: this.color,

            // unique stats
            weight: weight,
            price: this.price + (weight / 100),
            name: getRandomFishName(),

            // price dynamics
            priceMin: this.priceMin,
            priceMax: this.priceMax,
            priceVector: this.priceVector,
            priceVectorMax: this.priceVectorMax,
            priceVectorAccMax: this.priceVectorAccMax,
            priceVolitility: this.priceVolitility,
        };
    }

    static log() {
        const fishKeys = Object.keys(this.fishes);
        Document.message(`\n ${fishKeys.length} Fishes in memory:`)
        for (let i = 0; i < fishKeys.length; i++) {
            const f = this.fishes[fishKeys[i]];
            Document.message(`${f.type} ${f.img} ${f.price.toFixed(2)} (${f.priceMin}/${f.priceMax}) (${f.priceVectorAccMax}/${f.priceVectorMax})`)
        }
    }

    static update() {
        const e = document.getElementById('inventory-table');
        const fishes = Game.inventory;
        for (let i = 0; i < fishes.length; i++) {
            const f = fishes[i];
            // e.innerHTML += f.type;
            // FISH NEEDS TO BE UNIQUE, NOT OBJECT REFERENCE
        }
    }

    static toggleFish(f) {
        console.log(f.type);
        // resizeCanvas();
        // Graph.draw();
    }
}




function updateInventory() {
    const tableE = document.getElementById('inventory-table');

    const header = `<div class="row"><div>Type</div><div>Price</div><div> </div></div>`;
    let rows = "";

    if (this.game.inventory.length === 0) {
        tableE.innerHTML = `<div class="empty">Your inventory is empty</div>`;
        return
    }

    for (let f of this.game.inventory) {
        rows += `
            <div class="row">
                <div>${f.type} ${f.img}</div>
                <div>${f.price.toFixed(2)}</div>
                <div class="sell-button" data-type="${f.type}">Sell</div>
            </div>
        `;
    }

    tableE.innerHTML = header + rows;
}


function getRandomFishName() {
    const randomNumber = Math.random();
    const name = fishNames[randomNumber]
    const id = Math.floor(randomNumber * fishNames.length)
    // console.log(fishNames[id] );
    // console.log(fishNames.length);
    return fishNames[id];
}


const fishNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Dorothy", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna",
    "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah",
    "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia",
    "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen",
    "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Frank", "Samantha", "Benjamin", "Katherine", "Gregory", "Christine", "Samuel", "Debra", "Raymond", "Rachel",
    "Patrick", "Catherine", "Alexander", "Carolyn", "Jack", "Janet", "Dennis", "Ruth", "Jerry", "Maria",
    "Tyler", "Heather", "Aaron", "Diane", "Jose", "Virginia", "Adam", "Julie", "Nathan", "Joyce",
    "Henry", "Victoria", "Douglas", "Olivia", "Zachary", "Kelly", "Peter", "Christina", "Kyle", "Lauren",
    "Walter", "Joan", "Ethan", "Evelyn", "Jeremy", "Judith", "Harold", "Megan", "Keith", "Cheryl",
    "Christian", "Andrea", "Roger", "Hannah", "Noah", "Martha", "Gerald", "Jacqueline", "Carl", "Frances",
    "Terry", "Gloria", "Sean", "Ann", "Austin", "Teresa", "Arthur", "Kathryn", "Lawrence", "Sara",
    "Jesse", "Janice", "Dylan", "Jean", "Bryan", "Alice", "Joe", "Madison", "Jordan", "Doris",
    "Billy", "Abigail", "Bruce", "Julia", "Albert", "Judy", "Willie", "Grace", "Gabriel", "Denise",
    "Logan", "Amber", "Alan", "Marilyn", "Juan", "Beverly", "Wayne", "Danielle", "Roy", "Theresa",
    "Ralph", "Sophia", "Randy", "Marie", "Eugene", "Diana", "Vincent", "Brittany", "Russell", "Natalie",
    "Elijah", "Isabella", "Louis", "Charlotte", "Bobby", "Rose", "Philip", "Alexis", "Johnny", "Lori",
    "Victor", "Kayla", "Clarence", "Anne", "Ernest", "Jaclyn", "Martin", "Leah", "Roger", "Paige",
    "Stanley", "Sierra", "Leonard", "Molly", "Bernard", "Alyssa", "Caleb", "Brooke", "Mason", "Faith",
    "Ray", "Kylie", "Curtis", "Gabriella", "Norman", "Bailey", "Allen", "Savannah", "Oscar", "Aubrey",
    "Shawn", "Ariana", "Phillip", "Isabel", "Earl", "Naomi", "Danny", "Stella", "Todd", "Elena",
    "Howard", "Mariah", "Travis", "Melanie", "Evan", "Claire", "Jeff", "Lydia", "Calvin", "Eva",
    "Colton", "Hadley", "Harrison", "Willow", "Troy", "Valerie", "Connor", "Cora", "Jake", "Allison",
    "Lucas", "Ellie", "Marc", "Nora", "Mitchell", "Piper", "Leon", "Hazel", "Jared", "Adeline",
    "Grant", "Jasmine", "Spencer", "Summer", "Wesley", "Callie", "Gavin", "Rebecca", "Frederick", "Ivy",
    "Damian", "Aria", "Erik", "Nova", "Derek", "Quinn", "Joel", "Elise", "Max", "Delilah",
    "Seth", "Clara", "Shane", "Vivian", "Hector", "Liliana", "Ruben", "Camila", "Eduardo", "Serenity",
    "Edwin", "Luna", "Miles", "Athena", "Xavier", "Maeve", "Colin", "Adriana", "Dominic", "Jade",
    "Pauline", "Jaxon", "Olive", "Matteo", "Daphne", "Jonah", "Nina", "Cody", "Maya", "Jayden",
    "Lila", "Ricardo", "Phoebe", "Andy", "Eden", "Mario", "Skylar", "Casey", "Juniper", "Ricky",
    "Annie", "Andre", "Ava", "Kurt", "Mila", "Dean", "Zoe", "Douglas", "Ember", "Marshall",
    "Riley", "Warren", "Violet", "Lance", "Lena", "Roman", "Tessa", "Reed", "Georgia", "Franklin",
    "Harvey", "Hope", "Marshall", "Iris", "Tanner", "Norah", "Brett", "Lucia", "Damon", "Romi",
    "Quentin", "Eliana", "Clinton", "Amelia", "Jay", "Isla", "Harley", "Maddie", "Will", "Harper",
    "Tony", "Adele", "Clayton", "Fiona", "Brayden", "Daisy", "Aiden", "Lilah", "Tristan", "Brooklyn",
    "Miranda", "Elsie", "Joanna", "Adeline", "Talia", "Marina", "Celeste", "Raquel", "Rosa", "Alison",
    "Jamie", "Helena", "Caroline", "Miracle", "Sylvia", "Juliana", "Esme", "Greta", "Adrianna", "Holly",
    "Raelyn", "Marisol", "Tatum", "Emerson", "Fern", "Colette", "Elowen", "Keira", "Selena", "Hattie",
    "Regina", "Mabel", "Esther", "Amara", "Daniella", "Bianca", "Jolene", "Sabrina", "Kendall", "Leighton",
    "Paisley", "Lana", "Mikayla", "Autumn", "Aspen", "Mckenzie", "Reagan", "Camille", "Ayla", "Ryan",
    "Paris", "Tanya", "Hallie", "Joy", "Carmen", "Kara", "Lexi", "Kelsey", "Esmeralda", "Hana",
    "Jenna", "Kendra", "Harriet", "Raven", "Marley", "Tatiana", "Blair", "Mira", "Bethany", "Anika",
    "Lorelai", "Wendy", "Lola", "Ivory", "Della", "Nancy", "Kayleigh", "Emelia", "Charley", "Zora",
    "Henley", "Raina", "Eloise", "Emmy", "Alina", "Aya", "Ariella", "Gemma", "Kinsley", "Meadow",
    "Demi", "Kiana", "Amira", "Priscilla", "Jimena", "Annalise", "Doris", "Adelynn", "Holland", "Fernanda",
    "Lancelyn", "Aubrielle", "Marigold", "Aubri", "Aileen", "Avah", "Averie", "Rosie", "Whitney", "Mara",
    "Briella", "Sarai", "June", "Nalani", "Alayah", "Bria", "Remi", "Emberly", "Kaitlyn", "Gianna",
    "Teresa", "Amiya", "Lillie", "Lauryn", "Melody", "Kenzie", "Anya", "Cecelia", "Millie", "Sally",
    "Leyla", "Ainhoa", "Annika", "Kairi", "Rory", "Alondra", "Amiyah", "Denisse", "Royalty", "Kylee",
    "Linda", "Reyna", "Iliana", "Emmaline", "Mara", "Siena", "Marissa", "Ayana", "Bridget", "Averi",
    "Eileen", "Paloma", "Kimora", "Zelda", "Vera", "Irene", "Ariana", "Maribel", "Elliana", "Giuliana",
    "Macy", "Ivanna", "Jemma", "Maren", "Jayda", "Lucille", "Kassidy", "Loretta", "Charleigh", "Hadassah",
    "Libby", "Vada", "Kai", "Rhea", "Ansley", "Zariyah", "Zaniyah", "Leia", "Aviana", "Dior",
    "Rayna", "Saoirse", "Amalia", "Oakley", "Nylah", "Lyanna", "Laurel", "Vienna", "Brynn", "Lennon",
    "Brinley", "Belen", "Ariyah", "Emmeline", "Harmoni", "Keilani", "Liv", "Celia", "Kaydence", "Marleigh",
    "Anahi", "Skyla", "Ariyanna", "Cassidy", "Alessia", "Henrietta", "Camila", "Livia", "Brinlee", "Miya",
    "Fallon", "Monica", "Briar", "Kori", "Jaycee", "Ellis", "Violeta", "Elliot", "Anya", "Lux",
    "Marina", "Aliza", "Arden", "Greer", "Estella", "Calliope", "Bellamy", "Avayah", "Vanna", "Jolie",
    "Judy", "Clarissa", "Raya", "Myla", "Annabelle", "Kensley", "Aubree", "Callie", "Rosalee", "Saylor",
    "Veronica", "Harley", "Kaylin", "Flora", "Rebekah", "Marley", "Salma", "Elyse", "Malia", "Hayley",
    "Melina", "Zainab", "Anita", "Katelynn", "Elina", "Azalea", "Thalia", "Kaitlin", "Braelynn", "Amani",
    "Emiliana", "Larissa", "Amiyah", "Cara", "Pearl", "Karis", "Aurelia", "Francesca", "Noemi", "Maia",
    "Kennedi", "Aubriana", "Aliana", "Melissa", "Malani", "Aila", "Katalina", "Indie", "Aubry", "Yamileth",
    "Livia", "Etta", "Naya", "Nellie", "Kenna", "Arlette", "Jayleen", "Kallie", "Meghan", "Sariyah",
    "Elianna", "Kairi", "Helena", "Leona", "Ari", "Zola", "Emerie", "Florence", "Waverly", "Promise",
    "Sylvie", "Jaylani", "Brylee", "Laney", "Davina", "Mylah", "Annaliese", "Hana", "Emani", "Winnie",
    "Judith", "Clare", "Marie", "Winona", "Royal", "Mika", "Hadley", "Nori", "Baylee", "Alora",
    "Arianna", "Murphy", "Maren", "Sylvia", "Annabella", "Mariam", "Cleo", "Marceline", "Zoya", "Briar",
    "Aria", "Oaklyn", "Clover", "Adele", "Nadia", "Rosa", "Celia", "Aya", "Lennox", "Lottie",
    "Sloan", "Alaia", "Rowan", "Sutton", "Elodie", "Alani", "Evangeline", "Reina", "Lyra", "Rylan",
    "Jovie", "Della", "Ophelia", "Noa", "Elle", "Romina", "Azariah", "Emelia", "Anora", "Halo",
    "Samara", "Aubriella", "Eve", "Ezra", "Kehlani", "Jazlyn", "Belladonna", "Remy", "Zaniyah", "Aubriel",
    "Linnea", "Isidora", "Susan", "Neve", "Ellie", "Valentina", "Estelle", "Kiersten", "Harleigh", "Avalon",
    "Liviana", "Kaelyn", "Ava", "Matilda", "Claire", "Aliah", "Sienna", "Adelaide", "Magnolia", "Catalina",
    "Juniper", "Summer", "Karla", "Amelie", "Gemma", "Meghan", "Kairi", "Serena", "Rosa", "Zelda",
    'Eleanor', 'Elena', 'Eliana', 'Elin', 'Elisa', 'Elisabeth', 'Elise', 'Eliza', 'Elizabeth', 'Ella',
    'Elliot', 'Ellis', 'Ellison', 'Ellsworth', 'Elmer', 'Eloise', 'Elsa', 'Ember', 'Emerson', 'Emery',
    'Emil', 'Emile', 'Emilia', 'Emiliano', 'Emilio', 'Emily', 'Emma', 'Emmanuel', 'Emmett', 'Enid',
    'Enoch', 'Enrique', 'Enzo', 'Eric', 'Erica', 'Erick', 'Erik', 'Erika', 'Erin', 'Ernest', 'Ernesto',
    'Esme', 'Esperanza', 'Esteban', 'Estelle', 'Esther', 'Ethan', 'Ethel', 'Etta', 'Eugene', 'Eva',
    'Evan', 'Eve', 'Evelyn', 'Everett', 'Everly', 'Ezekiel', 'Ezra', 'Fabian', 'Faith', 'Faye', 'Felicia',
    'Felipe', 'Felix', 'Fergus', 'Fern', 'Fernando', 'Fiona', 'Floyd', 'Ford', 'Forest', 'Forrest', 'Frances',
    'Francesca', 'Francine', 'Francis', 'Francisco', 'Frank', 'Frankie', 'Frida', 'Gage', 'Gail', 'Galvin',
    'Garrett', 'Garry', 'Garth', 'Gary', 'Gavin', 'Gayle', 'Gemma', 'Gene', 'Genesis', 'Geneva', 'Geoffrey',
    'George', 'Georgia', 'Georgina', 'Gerald', 'Geraldine', 'Gerard', 'Gideon', 'Gilbert', 'Gina', 'Ginger',
    'Giovanni', 'Giselle', 'Gladys', 'Glenda', 'Glenna', 'Gloria', 'Gordon', 'Grace', 'Gracie', 'Graham',
    'Grant', 'Grayson', 'Greg', 'Gregg', 'Gregory', 'Greta', 'Griffin', 'Guillermo', 'Gus', 'Gustavo',
    'Gwen', 'Gwendolyn', 'Hannah', 'Harley', 'Harold', 'Harper', 'Harrison', 'Harry', 'Harvey', 'Hattie',
    'Hayden', 'Hazel', 'Heath', 'Heather', 'Hector', 'Heidi', 'Helen', 'Helena', 'Henry', 'Herbert', 'Herman',
    'Holly', 'Hope', 'Horace', 'Howard', 'Hudson', 'Hugh', 'Hugo', 'Hunter', 'Ian', 'Ida', 'Ignacio',
    'Imani', 'Imogen', 'India', 'Inez', 'Ingrid', 'Ira', 'Irene', 'Iris', 'Irma', 'Irvin', 'Irving',
    'Isaac', 'Isabel', 'Isabella', 'Isabelle', 'Isaiah', 'Isla', 'Israel', 'Ivy', 'Jace', 'Jack', 'Jackie',
    'Jackson', 'Jacob', 'Jacqueline', 'Jade', 'Jaime', 'Jake', 'Jalen', 'Jamal', 'James', 'Jameson', 'Jamie',
    'Jan', 'Jane', 'Janelle', 'Janet', 'Janice', 'Jared', 'Jasmine', 'Jason', 'Jasper', 'Javier',
    'Jay', 'Jayce', 'Jayden', 'Jayla', 'Jean', 'Jeanette', 'Jeanne', 'Jeff', 'Jefferson', 'Jeffrey', 'Jenna',
    'Jennifer', 'Jenny', 'Jeremiah', 'Jeremy', 'Jermaine', 'Jerome',
    'Jerry', 'Jesse', 'Jessica', 'Jill', 'Jillian', 'Jim',
    'Jimmy', 'Joan', 'Joanna', 'Joanne', 'Joaquin', 'Jocelyn',
    'Jodi', 'Jodie', 'Jody', 'Joe', 'Joel', 'Joey',
    'Johan', 'John', 'Johnathan', 'Johnny', 'Jolene', 'Jon',
    'Jonah', 'Jonathan', 'Jonas', 'Jonathon', 'Jordan', 'Jordyn',
    'Jorge', 'Jose', 'Joseph', 'Josephine', 'Josh', 'Joshua',
    'Josiah', 'Josie', 'Joy', 'Joyce', 'Juan', 'Juanita',
    'Judah', 'Jude', 'Judith', 'Judy', 'Julia', 'Julian',
    'Juliana', 'Julianna', 'Julianne', 'Julie', 'Julio', 'Julius',
    'June', 'Junior', 'Justine', 'Justin', 'Kacey', 'Kade',
    'Kaden', 'Kai', 'Kaia', 'Kaila', 'Kaitlin', 'Kaitlyn',
    'Kaleb', 'Kali', 'Kara', 'Karen', 'Kari', 'Karina',
    'Karl', 'Karson', 'Karyn', 'Kasey', 'Kassandra', 'Katarina',
    'Kate', 'Katelyn', 'Katherine', 'Kathleen', 'Kathryn', 'Kathy',
    'Katie', 'Katrina', 'Katy', 'Kay', 'Kaya', 'Kayden',
    'Kayla', 'Kaylee', 'Kayleigh', 'Kendall', 'Kendra', 'Kendrick',
    'Kennedy', 'Kenneth', 'Kenny', 'Kent', 'Kerry', 'Kevin',
    'Kiara', 'Kieran', 'Kierra', 'Kiley', 'Kim', 'Kimber',
    'Kimberly', 'King', 'Kingston', 'Kirk', 'Knox', 'Kobe',
    'Kody', 'Kolton', 'Kora', 'Kourtney', 'Kris', 'Krish',
    'Krista', 'Kristen', 'Kristi', 'Kristin', 'Kristina', 'Kristine',
    'Kristopher', 'Kurt', 'Kyla', 'Kyle', 'Kylee', 'Kylie',
    'Kyra', 'Lacey', 'Laci', 'Laila', 'Lamar', 'Lamont',
    'Lana', 'Lance', 'Landon', 'Lane', 'Laney', 'Lara',
    'Larry', 'Laura', 'Laurel', 'Lauren', 'Laurence', 'Laurie',
    'Lawrence', 'Lawson', 'Layla', 'Lea', 'Leah', 'Leandro',
    'Leann', 'Leanna', 'Lee', 'Leighton', 'Leland', 'Lena',
    'Leo', 'Leon', 'Leonard', 'Leonardo', 'Leona', 'Leslie',
    'Lester', 'Leticia', 'Levi', 'Lewis', 'Liam', 'Liana',
    'Lila', 'Lilian', 'Liliana', 'Lillian', 'Lillie', 'Lily',
    'Linda', 'Lindsey', 'Lisa', 'Logan',
    'Mya', 'Myla', 'Myles', 'Nadia', 'Nala', 'Nancy', 'Naomi', 'Natalia', 'Natalie', 'Nathan', 'Nathaniel', 'Nayeli', 'Nevaeh', 'Nicholas', 'Nick', 'Nicole', 'Nicolette', 'Nikita', 'Noah', 'Noelle', 'Nolan',
    'Nora', 'Norah', 'Nya', 'Nyla', 'Oakley', 'Odette', 'Olivia', 'Olive', 'Oliver', 'Omar', 'Ophelia', 'Orlando', 'Oscar', 'Owen', 'Paige', 'Paisley', 'Paloma', 'Parker', 'Patience', 'Patrick', 'Paul', 'Paula',
    'Paxton', 'Payton', 'Pedro', 'Penelope', 'Percy', 'Perry', 'Peter', 'Philip', 'Phillip', 'Phoenix', 'Piper', 'Presley', 'Preston', 'Priscilla', 'Quentin', 'Quinn', 'Rafael', 'Raelynn', 'Ramon', 'Randy', 'Raphael',
    'Ray', 'Raymond', 'Reagan', 'Rebecca', 'Reed', 'Reese', 'Regan', 'Reginald', 'Remington', 'Renee', 'Reuben', 'Rhett', 'Riley', 'River', 'Robbie', 'Robert', 'Roberta', 'Roberto', 'Robin', 'Rochelle', 'Roderick', 'Rodney',
    'Rafael', 'Rogelio', 'Roger', 'Roland', 'Roman', 'Romeo', 'Ronald', 'Ronnie', 'Rory', 'Rose', 'Rosalie', 'Rosanna', 'Rosemary', 'Rosa', 'Roselyn', 'Ross', 'Rowan', 'Roy', 'Ruby', 'Rudy', 'Russell', 'Ruth',
    'Ryan', 'Ryder', 'Sabrina', 'Sage', 'Samantha', 'Samara', 'Sammy', 'Samuel', 'Sandra', 'Sandy', 'Santiago', 'Sara', 'Sarah', 'Sarai', 'Sasha', 'Sawyer', 'Scarlett', 'Sean', 'Sebastian', 'Selena', 'Serena', 'Seth',
    'Shane', 'Shannon', 'Sharon', 'Shaun', 'Shawn', 'Shea', 'Sheldon', 'Shelby', 'Shelby', 'Sherri', 'Sheryl', 'Shiloh', 'Sidney', 'Sierra', 'Silas', 'Simon', 'Skylar', 'Skyler', 'Sofia', 'Sofie', 'Solomon', 'Sophia',
    'Sophie', 'Spencer', 'Stacy', 'Stanley', 'Stefan', 'Stephanie', 'Stephen', 'Sterling', 'Steve', 'Steven', 'Stevie', 'Stella', 'Stone', 'Stuart', 'Summer', 'Susan', 'Susanna', 'Sutton', 'Sydney', 'Sylvia', 'Sylvie',
    'Sylvester', 'Talia', 'Tanner', 'Tara', 'Tate', 'Tatiana', 'Taylor', 'Tayler', 'Teagan', 'Tegan', 'Teresa', 'Terrance', 'Terrence', 'Terry', 'Thaddeus', 'Thea', 'Theodore', 'Theresa', 'Thomas', 'Tiara', 'Tiffany', 'Timothy',
    'Tobias', 'Todd', 'Tom', 'Tomas', 'Toni', 'Tony', 'Tracy', 'Travis', 'Trent', 'Trenton', 'Trevor', 'Trey', 'Tristan', 'Tristen', 'Trinity', 'Troy', 'Truman', 'Tucker', 'Tyler', 'Tiffany', 'Tyree', 'Tyrell',
    'Tyrone', 'Tyson', 'Ulysses', 'Valentina', 'Valeria', 'Valerie', 'Vanessa', 'Vera', 'Veronica', 'Victor', 'Victoria', 'Vincent', 'Violet', 'Viola', 'Virginia', 'Vivian', 'Vivienne', 'Wade', 'Walker', 'Wallace', 'Walter',
    'Wanda', 'Waylon', 'Wayne', 'Wesley', 'Weston', 'Whitney', 'Will', 'William', 'Willie', 'Willow', 'Winston', 'Winter', 'Wyatt', 'Xander', 'Xavier', 'Yahir', 'Yasmine', 'Yolanda', 'Yosef', 'Yvette', 'Yvonne',
    'Zachariah', 'Zachary', 'Zaid', 'Zane', 'Zaria', 'Zayden', 'Zion', 'Zoey', 'Zoe', 'Zoie',
    'Abel', 'Abigail', 'Abraham', 'Ada', 'Adalyn', 'Adam', 'Addison', 'Adela', 'Adelaide', 'Adele', 'Adeline', 'Adelyn', 'Aditya', 'Adriana', 'Adrianna', 'Adriel', 'Agnes', 'Aidan', 'Aiden', 'Ainsley', 'Aisha', 'Aiyana',
    'Alan', 'Alana', 'Alanis', 'Albert', 'Alberta', 'Alec', 'Alejandra', 'Alejandro', 'Alessandra', 'Alex', 'Alexa', 'Alexander', 'Alexandra', 'Alexandria', 'Alexia', 'Alexis', 'Alfred', 'Alfredo', 'Ali', 'Alice', 'Alicia',
    'Alina', 'Alisa', 'Alisha', 'Alison', 'Alistair', 'Alivia', 'Aliyah', 'Alma', 'Alonzo', 'Althea', 'Alvin', 'Alyson', 'Alyssa', 'Amalia', 'Amanda', 'Amani', 'Amara', 'Amari', 'Amaya', 'Amber', 'Amelia', 'Amelie',
    'Amira', 'Amiya', 'Amos', 'Amy', 'Ana', 'Anabel', 'Anabella', 'Anabelle', 'Anahi', 'Anais', 'Anastasia', 'Anderson', 'Andre', 'Andrea', 'Andres', 'Andrew', 'Andy', 'Angel', 'Angela', 'Angelica', 'Angelina',
    'Angelo', 'Anika', 'Anisa', 'Anita', 'Aniyah', 'Ann', 'Anna', 'Annabel', 'Annabella', 'Annabelle', 'Anne', 'Annette', 'Annie', 'Anthony', 'Antonio', 'April', 'Ariana', 'Arianna', 'Ariel', 'Ariella', 'Arielle',
    'Arjun', 'Arlene', 'Armando', 'Armani', 'Arnav', 'Arthur', 'Arturo', 'Arya', 'Asher', 'Ashley', 'Ashton', 'Aubree', 'Aubrey', 'Audrey', 'August', 'Augustus', 'Aura', 'Aurora', 'Austin', 'Autumn', 'Ava', 'Avery',
    'Axel', 'Ayden', 'Ayla', 'Aylin', 'Azaria', 'Azariah',
    'Bailey', 'Barbara', 'Barrett', 'Beatrice', 'Beatrix', 'Beau', 'Beckett', 'Belinda', 'Bennett', 'Benjamin', 'Benton', 'Bernadette', 'Bernard', 'Beth', 'Bethany', 'Betsy', 'Bettina', 'Betty', 'Beverly', 'Bianca', 'Bill',
    'Billy', 'Blair', 'Blake', 'Blanca', 'Bo', 'Bonnie', 'Boston', 'Braelyn', 'Brad', 'Braden', 'Bradford', 'Bradley', 'Bradyn', 'Brady', 'Braxton', 'Brayden', 'Braylen', 'Brayan', 'Braylon', 'Braylyn', 'Brenda',
    'Brendan', 'Brenna', 'Bret', 'Brett', 'Brian', 'Brianna', 'Brianne', 'Bridget', 'Bridgette', 'Briana', 'Brie', 'Briella', 'Briley', 'Brinley', 'Britney', 'Brittany', 'Brody', 'Brooke', 'Brooklyn', 'Bruce', 'Bryan',
    'Bryant', 'Bryce', 'Brylee', 'Brynn', 'Bryson',
    'Caden', 'Caiden', 'Caitlin', 'Caleb', 'Callie', 'Calvin', 'Camden', 'Cameron', 'Camila', 'Camille', 'Camron', 'Candace', 'Cara', 'Carina', 'Carissa', 'Carl', 'Carla', 'Carlos', 'Carmen', 'Carol', 'Carole',
    'Carolina', 'Caroline', 'Carrie', 'Carter', 'Carys', 'Cary', 'Casey', 'Cash', 'Cassandra', 'Cassidy', 'Cassie', 'Catherine', 'Cathy', 'Cayden', 'Cecelia', 'Cecilia', 'Cedric', 'Celeste', 'Celina', 'Cesar', 'Chad',
    'Chaim', 'Chandler', 'Charles', 'Charley', 'Charlie', 'Charlotte', 'Chase', 'Chelsea', 'Cher', 'Chester', 'Chet', 'Chris', 'Christian', 'Christiana', 'Christina', 'Christine', 'Christopher', 'Christy', 'Ciaran', 'Cindy', 'Claire',
    'Clara', 'Clarence', 'Claudia', 'Clay', 'Clayton', 'Clement', 'Cleo', 'Clifford', 'Clint', 'Clinton', 'Clive', 'Cody', 'Colby', 'Cole', 'Coleman', 'Colin', 'Colleen', 'Collin', 'Conner', 'Connor', 'Constance',
    'Cooper', 'Cora', 'Corbin', 'Corey', 'Cornelius', 'Cory', 'Courtney', 'Cristian', 'Cristina', 'Cruz', 'Crystal', 'Curtis', 'Cynthia', 'Cyril', 'Cyrus',
    'Daxton', 'Dahlia', 'Daisy', 'Dakota', 'Dale', 'Dallas', 'Dalton', 'Damian', 'Damien', 'Damon', 'Dan', 'Dana', 'Daniel', 'Daniela', 'Danielle', 'Danna', 'Danny', 'Daphne', 'Darius', 'Darla', 'Darlene',
    'Darren', 'Darrin', 'Darryl', 'Dave', 'David', 'Davina', 'Dawn', 'Dean', 'Deanna', 'Deandre', 'Deangelo', 'Deborah', 'Declan', 'Delaney', 'Delilah', 'Dennis', 'Derek', 'Derrick', 'Desiree', 'Destiny', 'Devin',
    'Devon', 'Diana', 'Diane', 'Diego', 'Dillon', 'Dominic', 'Dominick', 'Don', 'Donald', 'Donna', 'Dora', 'Dorian', 'Doris', 'Dorothy', 'Douglas', 'Drew', 'Duane', 'Dustin', 'Dwayne', 'Dylan'
];



