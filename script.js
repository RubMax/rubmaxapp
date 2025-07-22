if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register(URL.createObjectURL(new Blob([`
      self.addEventListener('install', function(e) { self.skipWaiting(); });
      self.addEventListener('activate', function(e) { });
      self.addEventListener('fetch', function(event) {
        event.respondWith(fetch(event.request));
      });
    `], {type: 'application/javascript'})));
  });
}

    // Variable globale pour stocker les détails du produit actuel
    let currentProduct = {};
    let pubItems = [];
    let currentPubIndex = 0;
    let pubTimeout;
    
    // Variables pour la galerie d'images
    let currentImageIndex = 0;
    let imageUrls = [];
    
    document.addEventListener('DOMContentLoaded', function() {
      // Chargement des données
     fetch("https://script.google.com/macros/s/AKfycbwoTyj8mpGYPfWCOxszGA-SPYTSBsJbJoHyFKgIr-b5xSAu-CO9pgE3bCebLGAWCVDnPg/exec?page=api")
  .then(response => response.json())
  .then(data => {
    displayProduits(data);
  })
  .catch(error => {
    document.getElementById("produits").innerHTML =
      "<div class='alert alert-danger'>Erreur de chargement des données</div>";
    console.error(error);
  });

      
      // Initialiser le défilement horizontal
      setupHorizontalDragScroll();
    });

    function triggerScrollPulse() {
    const el = document.querySelector('.old-price');

    // Stopper l’animation subtile
    el.classList.add('pause-subtle');

    // Déclencher scrollPulse
    el.classList.add('animate-badge');

    // Après 2s, retirer l’animation scrollPulse et relancer subtlePulse
    setTimeout(() => {
        el.classList.remove('animate-badge');
        el.classList.remove('pause-subtle');
    }, 2000);
}


    function setupHorizontalDragScroll() {
      const container = document.getElementById('nav-container');
      const content = document.getElementById('section-nav');
      
      let pos = { left: 0, x: 0 };
      let isDragging = false;
      
      // Souris
      content.addEventListener('mousedown', function(e) {
        isDragging = true;
        pos = {
          left: container.scrollLeft,
          x: e.clientX
        };
        content.classList.add('grabbing');
        e.preventDefault();
      });
      
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - pos.x;
        container.scrollLeft = pos.left - dx;
      });
      
      document.addEventListener('mouseup', function() {
        isDragging = false;
        content.classList.remove('grabbing');
      });
      
      // Tactile
      content.addEventListener('touchstart', function(e) {
        isDragging = true;
        pos = {
          left: container.scrollLeft,
          x: e.touches[0].clientX
        };
        content.classList.add('grabbing');
      }, { passive: false });
      
      document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - pos.x;
        container.scrollLeft = pos.left - dx;
        e.preventDefault();
      }, { passive: false });
      
      document.addEventListener('touchend', function() {
        isDragging = false;
        content.classList.remove('grabbing');
      });
    }
    
    function createSectionButtons(sections) {
  const navContainer = document.getElementById('section-nav');
  navContainer.innerHTML = '';
  
  sections.forEach(section => {
    const sectionId = generateSectionId(section);
    const button = document.createElement('a');
    button.href = `#${sectionId}`;
    button.textContent = section.toUpperCase();
    button.className = 'section-btn';
    
    button.addEventListener('click', function(e) {
      e.preventDefault();
      scrollToSection(sectionId);
    });
    
    navContainer.appendChild(button);
  });
}

    
    /**
 * Génère un ID de section à partir d'un nom
 * @param {string} sectionName - Le nom de la section à transformer
 * @param {object} options - Options de configuration
 * @param {string} [options.separator='-'] - Séparateur à utiliser
 * @param {boolean} [options.preserveCase=false] - Conserver la casse originale
 * @param {boolean} [options.allowUnderscores=false] - Autoriser les underscores
 * @param {number} [options.maxLength=0] - Longueur maximale (0 = illimitée)
 * @returns {string} L'ID généré
 */
function generateSectionId(sectionName) {
  return sectionName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/(^-|-$)/g, ''); // Supprimer les tirets en début et fin
} 
    
    function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = document.querySelector('.fixed-header').offsetHeight;
    const sectionPosition = section.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = sectionPosition - headerHeight - 10; // 10px de marge
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    
    // Mettre à jour le bouton actif
    document.querySelectorAll('.section-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.section-btn[href="#${sectionId}"]`).classList.add('active');
    
    history.pushState(null, null, `#${sectionId}`);
  }
}

function handleScroll() {
  const sections = document.querySelectorAll('h2');
  const scrollPosition = window.scrollY + document.querySelector('.fixed-header').offsetHeight + 20;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.id;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`.section-btn[href="#${sectionId}"]`).classList.add('active');
    }
  });
}

// Initialiser l'écouteur de défilement
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', handleScroll);
  
  // Activer la première section au chargement
  const firstSection = document.querySelector('h2');
  if (firstSection) {
    const firstSectionId = firstSection.id;
    document.querySelector(`.section-btn[href="#${firstSectionId}"]`).classList.add('active');
  }
});
    
    
function displayProduits(data) {
  const container = document.getElementById('produits');
  container.innerHTML = "";
  const sections = [...new Set(data.map(item => item.section))];

  // Filtrer les pubs valides
  pubItems = data.filter(item => item.pub && item.pub.trim() !== '');

  createSectionButtons(sections);

  sections.forEach(section => {
    const sectionId = generateSectionId(section);
    const h2 = document.createElement('h2');
    h2.textContent = section.toUpperCase(); // <-- Ajouté pour mettre le titre en majuscule
    h2.id = sectionId;
    container.appendChild(h2);

    const sectionContainer = document.createElement('div');
    sectionContainer.className = "section-container";
    container.appendChild(sectionContainer);

    data
      .filter(p => p.section === section)
      .forEach(produit => {
        const div = document.createElement('div');
        div.className = "article produit-ligne"; // Ajout de la classe pour le style

        const descriptionHtml = produit.description.replace(/\n/g, '<br>');
        const descriptionParam = encodeURIComponent(produit.description);

        div.innerHTML = `
          <div class="article-image">
            <img src="${produit.image ? escapeHtml(produit.image) : 'https://iili.io/F3yIWCb.png'}" 
                 alt="${escapeHtml(produit.nom)}" 
                 onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}')">
          </div>
          <div class="article-details">
            <h3 style="text-transform: uppercase" onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}')">${escapeHtml(produit.nom)}</h3>

            

            <div class="details">
  ${produit.prix ? (() => {
  try {
    if (produit.prix.includes('-')) {
      const [oldPrice, newPrice] = produit.prix.split('-').map(p => escapeHtml(p.trim()));
      return `
        <div class="price-container">
          <span class="old-price">R$ ${oldPrice}</span>
          <span class="new-price">R$ ${newPrice}</span>
        </div>
      `;
    }
    return `<p>R$ <strong>${escapeHtml(produit.prix)}</strong></p>`;
  } catch (e) {
    return `<p>R$ <strong>${escapeHtml(produit.prix)}</strong></p>`;
  }
})() : ''}

${(() => {
  let note = '';
  let taillesNettoyees = produit.tailles;

  // Extraire le texte entre parenthèses (s'il existe)
  const match = produit.tailles.match(/\(([^)]+)\)/);
  if (match) {
    note = match[1];
    taillesNettoyees = produit.tailles.replace(/\([^)]*\)/g, '').trim();
  }

  // Séparer et formater les tailles avec encadrement
  const taillesArray = taillesNettoyees.split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  const taillesEncadrees = taillesArray.map(taille => 
    `<span class="taille-encadree">${escapeHtml(taille)}</span>`
  ).join(' ');

  return `
    ${note ? `<p class="note-text"><strong>${escapeHtml(note)}</strong></p>` : ''}
    ${taillesArray.length > 0 ? `
      <div class="tailles-container">
        ${taillesEncadrees}
      </div>
    ` : ''}
  `;
})()}
<br>
            <button class="open-button" onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}')">Solicite/Realise</button>
            
          

          </div>
        `;
        sectionContainer.appendChild(div);
      });
  });

  // Démarrer le carrousel de pubs si il y a des pubs
  if (pubItems.length > 0) {
    startPubCarousel();
  }

  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 300);
  }
}


    
    
     function startPubCarousel() {
      if (pubItems.length === 0) return;
      
      currentPubIndex = 0;
      scheduleNextPub();
    }
    
    function scheduleNextPub() {
      clearTimeout(pubTimeout);
      
      const currentPub = pubItems[currentPubIndex];
      const delay = currentPub.pubInterval || 25000; // Valeur par défaut 25s
      
      pubTimeout = setTimeout(() => {
        showCurrentPub();
        currentPubIndex = (currentPubIndex + 1) % pubItems.length;
        scheduleNextPub();
      }, delay);
    }

   function showCurrentPub() {
  const currentPub = pubItems[currentPubIndex];
  const parts = currentPub.pub.split('|');
  
  // Nouveau format: texte_gras|image|texte
  const boldText = parts[0] ? parts[0].trim() : null;
  const imageUrl = parts[1] ? parts[1].trim() : null;
  const text = parts[2] ? parts[2].trim() : null;
  
  let htmlContent = '<div class="pub-header" style="color: #ff0000; font-weight: bold; font-size: 2rem; margin-bottom: 0.5rem; text-align: center;">ANÚNCIO</div>';
  
  // Ajouter le texte en gras s'il existe
  if (boldText) {
    htmlContent += `<div class="pub-bold-text" style="font-weight: bold; font-size: 2rem; margin-bottom: 1rem;">
                    ${escapeHtml(boldText).replace(/\n/g, '<br>')}
                   </div>`;
  }
  
  // Ajouter l'image si elle existe
  if (imageUrl) {
    htmlContent += `<img src="${escapeHtml(imageUrl)}" class="pub-image" alt="Publicité">`;
  }
  
  // Ajouter le texte normal s'il existe
  if (text) {
    htmlContent += `<div class="pub-text">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
  }
  
  document.getElementById('pub-container').innerHTML = htmlContent;
  updatePubDots();
  document.getElementById('pub-popup').style.display = 'flex';
}
    
    function updatePubDots() {
      const dotsContainer = document.getElementById('pub-dots');
      dotsContainer.innerHTML = '';
      
      pubItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `pub-dot ${index === currentPubIndex ? 'active' : ''}`;
        dot.onclick = () => {
          currentPubIndex = index;
          showCurrentPub();
          scheduleNextPub();
        };
        dotsContainer.appendChild(dot);
      });
    }
    
    function closePubPopup() {
      document.getElementById('pub-popup').style.display = 'none';
    }
    
    
    function closePubPopup() {
      document.getElementById('pub-popup').style.display = 'none';
    }
    
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    function showDescriptionPopup(encodedDescription) {
  const description = decodeURIComponent(encodedDescription).replace(/\n/g, '<br>');
  const descriptionContent = document.getElementById("description-content");
  descriptionContent.innerHTML = description;
  descriptionContent.style.fontSize = "50px";  // 👈 Taille du texte à 40px
  document.getElementById("description-popup").style.display = "flex";
  document.querySelector('.description-popup-close').style.fontSize = '40px';

}

    
    function closeDescriptionPopup() {
      document.getElementById("description-popup").style.display = "none";
    }
    
    
    /* Fonctions pour la galerie d'images */
  function showPopup(imageUrl, nom, description, prix, tailles, code, hideWhatsappButton = false) {
  // Stocker toutes les images
  imageUrls = imageUrl.split(',').map(url => url.trim());
  currentImageIndex = 0;
  document.getElementById("popup").style.display = "flex";

  // Supprimer les textes entre parenthèses dans "tailles"
  const cleanedTailles = tailles.replace(/\([^)]*\)/g, '').trim();
  const sizesArray = cleanedTailles.split(',').map(size => size.trim()).filter(size => size !== '');
  const hasMultipleSizes = sizesArray.length > 1;

  // Stocker les détails du produit dans la variable globale
  currentProduct = {
    imageUrl,
    nom,
    description,
    prix,
    tailles,
    code,
    selectedSize: hasMultipleSizes ? null : sizesArray[0]
  };

  updateGallery();

  let sizesHTML = '';
  if (hasMultipleSizes) {
    sizesHTML = `
  <p></p>
  <div class="sizes-list" id="sizes-container">
    ${sizesArray.map(size => `
      <span class="size-item" onclick="selectSize(this, '${escapeHtml(size)}')">${escapeHtml(size)}</span>
    `).join('')}
  </div>
`;
  } else if (sizesArray.length === 1) {
    sizesHTML = `
      <p><strong>${escapeHtml(sizesArray[0])}</strong></p>
    `;
  } else {
    sizesHTML = ``;
  }

  // Mettre à jour le contenu du popup
  document.getElementById("popup-details").innerHTML = `
    <h4>${escapeHtml(nom)}</h4>
    
    ${prix?.trim() ? (() => {
      // Vérifie si le prix contient un séparateur "-"
      if (prix.includes('-')) {
        const [oldPrice, newPrice] = prix.split('-').map(p => p.trim());
        return `
          <div class="price-highlight">
            <div class="dual-price-container">
              <div class="old-price">
                <span class="currency-symbol">R$</span>
                <span class="price-amount">${escapeHtml(oldPrice)}</span>
              </div>
              <div class="new-price">
                <span class="currency-symbol">R$</span>
                <span class="price-amount">${escapeHtml(newPrice)}</span>
              </div>
            </div>
          </div>
        `;
      }
      // Cas normal (un seul prix)
      return `
        <div class="price-highlight">
          <span class="currency-symbol">R$</span>
          <span class="price-amount">${escapeHtml(prix)}</span>
        </div>
      `;
    })() : ''}
    
    <div>
      ${sizesHTML}
    </div>
    
    

    <div">
      <strong>Solicite ou realize este serviço no Whatsapp:</strong>
    </div>
     <br>
    <a href="#" id="whatsappButton" class="whatsapp-btn" onclick="event.preventDefault(); sendWhatsAppMessage();">
      <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
<br>
    <div">
      <strong>Descrição:</strong>
      <div class="description-text" color: #0081fe;">
        ${decodeURIComponent(description).replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  // Afficher ou masquer le bouton WhatsApp selon le paramètre
  const whatsappButton = document.getElementById("whatsappButton");
  if (hideWhatsappButton) {
    whatsappButton.style.display = "none";
  } else {
    whatsappButton.style.display = "inline-block";
  }

  // Sélection automatique de la taille si une seule
  if (!hasMultipleSizes && sizesArray.length === 1) {
    const sizeElements = document.querySelectorAll('.size-item');
    if (sizeElements.length > 0) {
      sizeElements[0].classList.add('selected');
    }
  }
}

    
       function updateGallery() {
      const galleryImages = document.getElementById('gallery-images');
      const galleryDots = document.getElementById('gallery-dots');
      
      galleryImages.innerHTML = '';
      galleryDots.innerHTML = '';
      
      imageUrls.forEach((url, index) => {
        // Ajouter l'image
        const img = document.createElement('img');
        img.src = url;
        img.alt = currentProduct.nom;
        img.className = 'gallery-image';
        galleryImages.appendChild(img);
        
        // Ajouter le point de navigation
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (index === currentImageIndex ? ' active' : '');
        dot.onclick = () => goToImage(index);
        galleryDots.appendChild(dot);
      });
      
      // Positionner la galerie sur l'image actuelle
      galleryImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }
    
    function prevImage() {
      if (currentImageIndex > 0) {
        currentImageIndex--;
      } else {
        currentImageIndex = imageUrls.length - 1;
      }
      updateGallery();
    }
    
    function nextImage() {
      if (currentImageIndex < imageUrls.length - 1) {
        currentImageIndex++;
      } else {
        currentImageIndex = 0;
      }
      updateGallery();
    }
    
    function goToImage(index) {
      currentImageIndex = index;
      updateGallery();
    }
    
    // Gestion des glissements tactiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('gallery-images').addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.getElementById('gallery-images').addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        nextImage(); // Glissement vers la gauche
      } else if (touchEndX - touchStartX > threshold) {
        prevImage(); // Glissement vers la droite
      }
    }
    
    function selectSize(element, size) {
  const sizeItems = document.querySelectorAll('.size-item');
  sizeItems.forEach(item => item.classList.remove('selected'));
  
  element.classList.add('selected');
  currentProduct.selectedSize = size;
  
  // Supprimer l'animation de secousse si elle était active
  const sizesContainer = document.getElementById('sizes-container');
  if (sizesContainer) {
    sizesContainer.classList.remove('shake');
  }
}
    
   function sendWhatsAppMessage() {
  const sizesArray = currentProduct.tailles.split(',').map(size => size.trim()).filter(size => size !== '');
  const hasMultipleSizes = sizesArray.length > 1;
  const sizesContainer = document.getElementById('sizes-container');

  if (hasMultipleSizes && !currentProduct.selectedSize) {
    // Ajouter l'animation de secousse
    sizesContainer.classList.add('shake');

    // Supprimer l'animation après 0.5s
    setTimeout(() => {
      sizesContainer.classList.remove('shake');
    }, 500);

    // Supprimer l'alerte visuelle
    return;
  }

  let message = `Olá, Gostaria de solicitar, fazer ou saber mais sobre este produto: ${currentProduct.nom}\n` +
                `Codigo : ${currentProduct.code}\n` +
                `Preco : R$ ${currentProduct.prix}`;

  if (currentProduct.selectedSize) {
    message += `\nT/Desc : ${currentProduct.selectedSize}`;
  } else if (sizesArray.length === 1) {
    message += `\nT/Desc : ${sizesArray[0]}`;
  }

  window.open(`https://wa.me/916204805?text=${encodeURIComponent(message)}`, '_blank');
}


    function showCustomAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.style.position = 'fixed';
  alertBox.style.top = '50%';
  alertBox.style.left = '50%';
  alertBox.style.transform = 'translate(-50%, -50%)';
  alertBox.style.backgroundColor = '#fff'; // blanc complet
  alertBox.style.color = '#000'; // texte noir
  alertBox.style.padding = '20px';
  alertBox.style.border = '2px solid #333';
  alertBox.style.zIndex = '9999';
  alertBox.style.fontSize = '40px';
  alertBox.style.textAlign = 'center';
  alertBox.style.borderRadius = '8px';
  alertBox.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
  alertBox.innerHTML = `
    <p style="margin: 0; font-size: 40px;">${message}</p>
    <button id="close-alert" style="
      margin-top: 15px;
      padding: 10px 20px;
      font-size: 40px;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    ">OK</button>
  `;

  document.body.appendChild(alertBox);

  document.getElementById('close-alert').addEventListener('click', () => {
    document.body.removeChild(alertBox);
  });
}

    
    function closePopup() {
       document.getElementById("popup").style.display = "none";
    }

function checkScreenSize() {
    // Définir la largeur minimale pour considérer comme un écran d'ordinateur
    const isComputerScreen = window.innerWidth > 992; // 992px est une taille courante pour tablette/desktop
    
    if (isComputerScreen) {
        // Créer le popup
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popup.style.color = 'white';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '9999';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.textAlign = 'center';
        popup.style.padding = '20px';
        
        // Ajouter le message
        const message = document.createElement('div');
        message.innerHTML = '<h1>Cette application n\'est pas accessible sur grand écran</h1>' +
                            '<p>Veuillez appuyer sur F12 </p>' +
                            '<p>Ou utilisez un appareil mobile pour une meilleure expérience</p>';
        message.style.fontSize = '1.5rem';
        
        popup.appendChild(message);
        document.body.appendChild(popup);
        
        // Désactiver l'application (empêcher toute interaction)
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';
        popup.style.pointerEvents = 'auto';
        
        // Empêcher le F12 d'ouvrir les outils de développement (optionnel)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                e.preventDefault();
                alert('Les outils de développement sont désactivés pour cette application.');
            }
        });
    }
}

// Vérifier la taille de l'écran au chargement
window.addEventListener('load', checkScreenSize);

// Vérifier aussi lors du redimensionnement
window.addEventListener('resize', checkScreenSize);


document.getElementById('atalhoBtn').addEventListener('click', function() {
  // Vérifier si le navigateur supporte l'API d'installation
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    alert('L\'application est déjà installée sur votre écran d\'accueil!');
    return;
  }

  // Fonction pour afficher les instructions d'installation
  function showInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    
    if (isIOS) {
      instructions = `
        <div style="text-align: center; padding: 20px;">
          <h3>Pour ajouter à l'écran d'accueil :</h3>
          <p>1. Appuyez sur le bouton "Partager"</p>
          <p>2. Sélectionnez "Sur l'écran d'accueil"</p>
          <p>3. Appuyez sur "Ajouter"</p>
          <img src="https://i.imgur.com/9z2wDf1.png" style="max-width: 200px; margin-top: 10px;">
        </div>
      `;
    } else if (isAndroid) {
      instructions = `
        <div style="text-align: center; padding: 20px;">
          <h3>Pour ajouter à l'écran d'accueil :</h3>
          <p>1. Appuyez sur les trois points en haut à droite</p>
          <p>2. Sélectionnez "Ajouter à l'écran d'accueil"</p>
          <p>3. Confirmez l'installation</p>
          <img src="https://i.imgur.com/7XbJ2uQ.png" style="max-width: 200px; margin-top: 10px;">
        </div>
      `;
    } else {
      instructions = '<p>Cette fonctionnalité est disponible uniquement sur mobile.</p>';
    }
    
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100%';
    popup.style.height = '100%';
    popup.style.backgroundColor = 'rgba(0,0,0,0.9)';
    popup.style.display = 'flex';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.zIndex = '9999';
    popup.style.color = 'white';
    popup.style.fontSize = '1.2em';
    
    popup.innerHTML = `
      <div style="background: #fff; color: #333; padding: 20px; border-radius: 10px; max-width: 90%;">
        ${instructions}
        <button style="margin-top: 20px; padding: 10px 20px; background: #83addc; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Fermer
        </button>
      </div>
    `;
    
    popup.querySelector('button').addEventListener('click', () => {
      document.body.removeChild(popup);
    });
    
    document.body.appendChild(popup);
  }

  // Vérifier si l'API d'installation est disponible
  if ('BeforeInstallPromptEvent' in window) {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Empêcher l'affichage automatique du prompt
      e.preventDefault();
      // Stocker l'événement pour l'utiliser plus tard
      deferredPrompt = e;
      
      // Afficher le prompt d'installation
      deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('L\'utilisateur a accepté l\'installation');
        } else {
          console.log('L\'utilisateur a refusé l\'installation');
        }
        deferredPrompt = null;
      });
    });
  } else {
    // Si l'API n'est pas disponible, afficher les instructions manuelles
    showInstallInstructions();
  }
});




  let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Empêche Chrome de montrer la mini-bannière
  e.preventDefault();
  deferredPrompt = e;

  // Affiche un popup personnalisé
  showInstallPrompt();
});

function showInstallPrompt() {
  const promptDiv = document.createElement('div');
  promptDiv.innerHTML = `
    <div style="position:fixed; bottom:20px; left:20px; right:20px; background:#83addc; color:white; padding:15px; border-radius:10px; text-align:center; z-index:10000;">
      <p>Installez cette application sur votre appareil pour un accès rapide !</p>
      <button id="installAppBtn" style="padding:10px 20px; border:none; background:white; color:#83addc; border-radius:5px; font-weight:bold; cursor:pointer;">Installer</button>
    </div>
  `;
  document.body.appendChild(promptDiv);

  document.getElementById('installAppBtn').addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Utilisateur a accepté l’installation');
        } else {
          console.log('Utilisateur a refusé l’installation');
        }
        deferredPrompt = null;
        promptDiv.remove();
      });
    }
  });
}


  if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => {
      console.log("Service Worker enregistré !", reg);
    })
    .catch(err => {
      console.error("Erreur Service Worker : ", err);
    });
}
