import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';

export default function handler(req, res) {
    try {
        const { seed = 42, page = 1, language = 'en', likes = 5, reviews = 4.7 } = req.query;

        // Initialize the RNG with the combined seed and page
        const rng = seedrandom(`${seed}-${page}`);

        // Set Faker.js locale
        faker.setLocale(language);

        const books = Array.from({ length: 20 }, (_, i) => ({
            index: i + 1 + (page - 1) * 20,
            isbn: faker.string.uuid(),
            title: faker.lorem.words(Math.ceil(rng() * 5 + 1)),
            authors: `${faker.person.firstName()} ${faker.person.lastName()}`,
            publisher: faker.company.name(),
            likes: Math.round(rng() * likes),
            reviews: rng() < reviews % 1 ? Math.floor(reviews) + 1 : Math.floor(reviews),
        }));

        res.status(200).json(books);
    } catch (error) {
        console.error('Error generating books:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
