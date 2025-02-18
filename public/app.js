// Global variables
let currentBooks = [];
let currentPage = 1;
const booksPerPage = 6;

document.getElementById('preferenceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.querySelector('#preferenceForm button');
  const loadingSpinner = document.getElementById('loadingSpinner');

  submitBtn.disabled = true;
  loadingSpinner.style.display = 'block';
  
  const genresInput = document.getElementById('genres').value;
  const authorsInput = document.getElementById('authors').value;
  const minRating = document.getElementById('minRating').value;
  
  const genres = genresInput.split(',').map(g => g.trim()).filter(g => g);
  const authors = authorsInput.split(',').map(a => a.trim()).filter(a => a);
  
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  
  try {
    const response = await fetch('/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        genres, 
        authors,
        minRating: parseInt(minRating) || 0
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      currentBooks = data;
      currentPage = 1;
      
      if (currentBooks.length > 0) {
        displayBooks();
        setupPagination();
      } else {
        resultsDiv.innerHTML = `
          <div class="alert alert-info" role="alert">
            No recommendations found. Try different preferences.
          </div>`;
        document.getElementById('pagination').innerHTML = '';
      }
    } else {
      resultsDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
          ${data.message || data.error || 'Something went wrong.'}
        </div>`;
      document.getElementById('pagination').innerHTML = '';
    }
  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = `
      <div class="alert alert-danger" role="alert">
        An error occurred. Please try again later.
      </div>`;
    document.getElementById('pagination').innerHTML = '';
  } finally {

    submitBtn.disabled = false;
    loadingSpinner.style.display = 'none';
  }
});

function displayBooks() {
  const resultsDiv = document.getElementById('results');
  

  const start = (currentPage - 1) * booksPerPage;
  const end = Math.min(start + booksPerPage, currentBooks.length);
  const booksToDisplay = currentBooks.slice(start, end);
  
  let html = `<h2 class="mb-3">Recommendations (${currentBooks.length} books found):</h2>`;
  html += `<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">`;
  
  booksToDisplay.forEach(book => {
    html += `
      <div class="col">
        <div class="card book-card h-100">
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${book.author || 'Unknown Author'}</h6>
            <p class="card-text">Genre: ${book.genre || 'Unspecified'}</p>
            <div class="star-rating mb-2" data-book-id="${book._id}">
              ${generateStarRating(book.rating || 0)}
            </div>
            <p class="small text-muted">${book.reviews?.length || 0} reviews</p>
          </div>
        </div>
      </div>`;
  });
  
  html += `</div>`;
  resultsDiv.innerHTML = html;
  
  document.querySelectorAll('.star-rating').forEach(ratingElement => {
    const stars = ratingElement.querySelectorAll('.fa-star')
    stars.forEach((star, index) => {
      star.addEventListener('mouseover', () => {
        highlightStars(stars, index);
      });
      
      ratingElement.addEventListener('mouseout', () => {
        const currentRating = parseInt(ratingElement.getAttribute('data-rating') || '0');
        highlightStars(stars, currentRating - 1)
      });
    });
  });
}

function generateStarRating(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star checked"></i>';
    } else {
      stars += '<i class="fas fa-star"></i>';
    }
  }
  return stars;
}

function highlightStars(stars, activeIndex) {
  stars.forEach((star, index) => {
    if (index <= activeIndex) {
      star.classList.add('checked');
    } else {
      star.classList.remove('checked');
    }
  });
}

function setupPagination() {
  const paginationElement = document.getElementById('pagination');
  const totalPages = Math.ceil(currentBooks.length / booksPerPage);
  
  if (totalPages <= 1) {
    paginationElement.innerHTML = '';
    return;
  }
  
  let html = '';
  
  
  html += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>`;
  
  
  for (let i = 1; i <= totalPages; i++) {
    html += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" data-page="${i}">${i}</a>
      </li>`;
  }
  
 
  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>`;
  
  paginationElement.innerHTML = html;
  
  
  paginationElement.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageNumber = parseInt(e.currentTarget.getAttribute('data-page') || '1');
      
      if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
        currentPage = pageNumber;
        displayBooks();
        setupPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    });
  });
}
