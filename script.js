// Chave da API da The Dog API (substitua pela sua real)
const API_KEY = 'DEMO-API-KEY';

// Pegando elementos do HTML
const breedSelect = document.getElementById('breedSelect');
const dogImage = document.getElementById('dogImage');

let currentImageId = null; // Para guardar o ID da imagem atual

// Função para carregar as raças do endpoint da API
async function loadBreeds() {
  const res = await fetch('https://api.thedogapi.com/v1/breeds');
  const breeds = await res.json();

  // Preenche o select com as raças retornadas
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;         // ID da raça
    option.textContent = breed.name; // Nome da raça
    breedSelect.appendChild(option);
  });
}

// Função para carregar imagem do cachorro com base na raça selecionada
async function loadDogByBreed(breedId) {
  const res = await fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`, {
    headers: { 'x-api-key': API_KEY }
  });

  const data = await res.json();

  // Se houver imagem, exibe e salva o ID da imagem
  if (data.length > 0) {
    dogImage.src = data[0].url;
    currentImageId = data[0].id;
  }
}

// Função para favoritar a imagem atual
function favoriteDog() {
  if (!currentImageId) return;

  fetch('https://api.thedogapi.com/v1/favourites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      image_id: currentImageId, // ID da imagem favoritada
      sub_id: "meu_usuario"     // Identificador de usuário
    })
  }).then(() => alert("Favoritado!"));
}

// Função de dislike (apenas exemplo visual)
function dislikeDog() {
  alert("🐾 Talvez outro mais fofo?");
}

// Quando o usuário troca a raça no select, carrega nova imagem
breedSelect.addEventListener('change', () => {
  const breedId = breedSelect.value;
  loadDogByBreed(breedId);
});

// Carrega raças assim que a página é aberta
loadBreeds();

const favoritesGallery = document.getElementById('favoritesGallery');
const toggleFavoritesBtn = document.getElementById('toggleFavoritesBtn');

let favoriteImages = []; // Armazena URLs das imagens favoritas

// Função para favoritar a imagem atual
function favoriteDog() {
  if (!dogImage.src || favoriteImages.includes(dogImage.src)) return;

  favoriteImages.push(dogImage.src);
  updateFavoritesGallery();
  alert("Favoritado! 💖");
}

// Função de dislike (remove da galeria se estiver)
function dislikeDog() {
  const index = favoriteImages.indexOf(dogImage.src);
  if (index !== -1) {
    favoriteImages.splice(index, 1); // Remove da galeria
    updateFavoritesGallery();
    alert("Removido dos favoritos 💔");
  } else {
    alert("🐾 Talvez outro mais fofo?");
  }
}

// Atualiza a galeria de favoritos
function updateFavoritesGallery() {
  favoritesGallery.innerHTML = ''; // Limpa a galeria

  favoriteImages.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('favorite-img');
    favoritesGallery.appendChild(img);
  });
}

// Mostrar ou ocultar a galeria
toggleFavoritesBtn.addEventListener('click', () => {
  if (favoritesGallery.style.display === 'none') {
    favoritesGallery.style.display = 'grid';
    toggleFavoritesBtn.textContent = 'Ocultar Favoritos 🙈';
  } else {
    favoritesGallery.style.display = 'none';
    toggleFavoritesBtn.textContent = 'Ver Favoritos 🐶';
  }
});

