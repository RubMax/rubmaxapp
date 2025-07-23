
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
    
    document.addEventListener('DOMContentLoaded', () => {
  // Afficher la première section au démarrage
  const firstTitle = document.querySelector('h2');
  const firstContainer = firstTitle?.nextElementSibling;

  if (firstTitle && firstContainer) {
    firstTitle.style.display = 'block';
    firstContainer.style.display = 'block';
  }
});

function scrollToSection(sectionId) {
  const allSections = document.querySelectorAll('.section-container');
  const allTitles = document.querySelectorAll('h2');

  const firstTitle = allTitles[0];
  const firstContainer = firstTitle?.nextElementSibling;
  const firstSectionId = firstTitle?.id;

  if (sectionId === firstSectionId) {
    // Si on clique sur la première section, afficher tout
    allTitles.forEach(title => title.style.display = 'block');
    allSections.forEach(section => section.style.display = 'block');
  } else {
    allTitles.forEach((title, i) => {
      if (i === 0) {
        title.style.display = 'block'; // garder la première visible
      } else {
        title.style.display = (title.id === sectionId) ? 'block' : 'none';
      }
    });

    allSections.forEach((section, i) => {
      if (i === 0) {
        section.style.display = 'block'; // garder le premier contenu visible
      } else {
        const sectionTitle = allTitles[i];
        section.style.display = (sectionTitle?.id === sectionId) ? 'block' : 'none';
      }
    });
  }

  // Scroll vers la section cible
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    const headerHeight = document.querySelector('.fixed-header')?.offsetHeight || 0;
    const sectionPosition = targetSection.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = sectionPosition - headerHeight - 10;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Mise à jour des boutons
  document.querySelectorAll('.section-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.section-btn[href="#${sectionId}"]`)?.classList.add('active');

  // Mise à jour de l’URL
  history.pushState(null, null, `#${sectionId}`);
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

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(reg => console.log("Service Worker enregistré", reg))
      .catch(err => console.error("Erreur SW :", err));
  });
}

let deferredPrompt;

// Affiche un popup personnalisé (ex : modal, bannière...)
function showInstallPopup() {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.left = '20px';
  popup.style.right = '20px';
  popup.style.padding = '20px';
  popup.style.background = '#fff';
  popup.style.border = '1px solid #ccc';
  popup.style.borderRadius = '10px';
  popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  popup.style.zIndex = '10000';
  popup.innerHTML = `
    <p>👉 Toque em “Instalar” para adicionar o aplicativo à sua tela inicial.</p>
    <button id="btn-install">📲 Sim, instale</button>
    <button id="btn-fermer">❌ Não, obrigado</button>
  `;
  document.body.appendChild(popup);

  document.getElementById('btn-install').addEventListener('click', () => {
    popup.remove();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log("✅ Installation acceptée");
        } else {
          console.log("❌ Installation refusée");
        }
        deferredPrompt = null;
      });
    }
  });

  document.getElementById('btn-fermer').addEventListener('click', () => {
    popup.remove();
  });
}

// Événement déclenché si installation est possible
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPopup(); // Montre automatiquement le popup personnalisé
});

// Détection si l'app est déjà installée
window.addEventListener('appinstalled', () => {
  console.log("✅ L'app est installée");
  deferredPrompt = null;
});

