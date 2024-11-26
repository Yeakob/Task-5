const languageSelector = document.getElementById("language");
const seedInput = document.getElementById("seed");
const generateSeedButton = document.getElementById("generate-seed");
const submitButton = document.getElementById("submit");
const likesSlider = document.getElementById("likes");
const likesValue = document.getElementById("likes-value");
const reviewsInput = document.getElementById("reviews");
const booksTableBody = document.getElementById("books-tbody");
const loadingIndicator = document.getElementById("loading");

let currentPage = 1;
let isLoading = false;

// Update likes display value
likesSlider.addEventListener("input", () => {
    likesValue.textContent = likesSlider.value;
});

// Generate a random seed
generateSeedButton.addEventListener("click", () => {
    const randomSeed = Math.floor(Math.random() * 100000);
    seedInput.value = randomSeed;
});

// Handle Submit button click
submitButton.addEventListener("click", () => {
    resetAndFetchBooks();
});

// Reset and fetch books
const resetAndFetchBooks = () => {
    currentPage = 1;
    booksTableBody.innerHTML = "";
    fetchBooks();
};

// Fetch books from API
const fetchBooks = async () => {
    if (isLoading) return;
    isLoading = true;
    loadingIndicator.style.display = "block";

    const seed = seedInput.value;
    const language = languageSelector.value;
    const likes = likesSlider.value;
    const reviews = reviewsInput.value;

    try {
        const response = await fetch(
            `/api/books?seed=${seed}&page=${currentPage}&language=${language}&likes=${likes}&reviews=${reviews}`
        );
        if (!response.ok) throw new Error("Failed to fetch books.");

        const books = await response.json();
        renderBooks(books);
        currentPage++;
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = "none";
    }
};

// Render books
const renderBooks = (books) => {
    books.forEach((book) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.index}</td>
            <td>${book.isbn}</td>
            <td>${book.title}</td>
            <td>${book.authors}</td>
            <td>${book.publisher}</td>
            <td><button class="toggle-details">Show</button></td>
        `;

        const detailsRow = document.createElement("tr");
        detailsRow.style.display = "none";
        detailsRow.innerHTML = `
            <td colspan="6">
                <strong>Title:</strong> ${book.title}<br>
                <strong>Author:</strong> ${book.authors}<br>
                <strong>Publisher:</strong> ${book.publisher}<br>
                <strong>Likes:</strong> ${book.likes} | <strong>Reviews:</strong> ${book.reviews}
            </td>
        `;

        row.querySelector(".toggle-details").addEventListener("click", (e) => {
            detailsRow.style.display =
                detailsRow.style.display === "none" ? "table-row" : "none";
            e.target.textContent = e.target.textContent === "Show" ? "Hide" : "Show";
        });

        booksTableBody.appendChild(row);
        booksTableBody.appendChild(detailsRow);
    });
};

// Infinite scrolling
window.addEventListener("scroll", () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
    ) {
        fetchBooks();
    }
});

// Initial fetch
resetAndFetchBooks();
