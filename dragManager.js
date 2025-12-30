class DragManager {
            constructor() {
                this.isDragging = false;
                this.dragElement = null;
                this.preview = null;
                this.offsetX = 0;
                this.offsetY = 0;
                
                this.init();
            }

            init() {
                this.setupDraggableElements();
                this.setupDropZones();
            }

            setupDraggableElements() {
                const draggableElements = document.querySelectorAll('.card_2');
                
                draggableElements.forEach(element => {
                    // Mouse events
                    element.addEventListener('mousedown', this.handleDragStart.bind(this));
                    
                    // Touch events
                    element.addEventListener('touchstart', this.handleDragStart.bind(this), { passive: false });
                    element.addEventListener('touchmove', this.handleDragMove.bind(this), { passive: false });
                    element.addEventListener('touchend', this.handleDragEnd.bind(this));
                    
                    // Prevent default drag behavior
                    element.addEventListener('dragstart', (e) => e.preventDefault());
                });

                // Global events
                document.addEventListener('mousemove', this.handleDragMove.bind(this));
                document.addEventListener('mouseup', this.handleDragEnd.bind(this));
            }

            setupDropZones() {
                const dropZones = document.querySelectorAll('.drop-zone');
                
                dropZones.forEach(zone => {
                    zone.addEventListener('dragover', (e) => e.preventDefault());
                    zone.addEventListener('drop', (e) => e.preventDefault());
                    
                    // Для наших кастомных событий
                    zone.addEventListener('mouseover', this.handleZoneEnter.bind(this));
                    zone.addEventListener('mouseout', this.handleZoneLeave.bind(this));
                });
            }

            handleDragStart(e) {
                e.preventDefault();
                
                const element = e.target.closest('.card_2');
                if (!element) return;

                this.isDragging = true;
                this.dragElement = element;
                
                // Получаем координаты касания/клика
                let clientX, clientY;
                
                if (e.type === 'touchstart') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const rect = element.getBoundingClientRect();
                this.offsetX = clientX - rect.left;
                this.offsetY = clientY - rect.top;

                // Создаем превью
                this.createPreview(element, clientX, clientY);
                
                // Добавляем класс для стилей
                element.classList.add('dragging');
            }

            handleDragMove(e) {
                if (!this.isDragging || !this.preview) return;
                
                e.preventDefault();

                let clientX, clientY;
                
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                // Обновляем позицию превью
                this.updatePreviewPosition(clientX, clientY);
            }

            handleDragEnd(e) {
                if (!this.isDragging) return;

                e.preventDefault();
                
                // Проверяем, находится ли элемент над drop-зоной
                const dropZone = document.querySelector('.drop-zone.active');
                if (dropZone) {
                    this.handleDrop(dropZone);
                }

                this.cleanup();
            }

            createPreview(element, x, y) {
                this.preview = element.cloneNode(true);
                this.preview.classList.add('drag-preview');
                this.preview.style.width = element.offsetWidth + 'px';
                this.preview.style.position = 'fixed'
                this.preview.style.left = (x - this.offsetX) + 'px';
                this.preview.style.top = (y - this.offsetY) + 'px';
                
                document.body.appendChild(this.preview);
            }

            updatePreviewPosition(x, y) {
                if (!this.preview) return;
                
                this.preview.style.left = (x - this.offsetX) + 'px';
                this.preview.style.top = (y - this.offsetY) + 'px';

                // Проверяем hover над drop-зонами
                this.checkDropZones(x, y);
            }

            checkDropZones(x, y) {
                const dropZones = document.querySelectorAll('.drop-zone');
                let activeZone = null;

                dropZones.forEach(zone => {
                    const rect = zone.getBoundingClientRect();
                    const isOver = x >= rect.left && x <= rect.right && 
                                  y >= rect.top && y <= rect.bottom;
                    
                    if (isOver) {
                        zone.classList.add('active');
                        activeZone = zone;
                    } else {
                        zone.classList.remove('active');
                    }
                });

                return activeZone;
            }

            handleZoneEnter(e) {
                if (this.isDragging) {
                    e.currentTarget.classList.add('active');
                }
            }

            handleZoneLeave(e) {
                e.currentTarget.classList.remove('active');
            }

            handleDrop(zone) {
                // Здесь можно добавить логику для обработки дропа
                // zone.innerHTML = '<span>Элемент перемещен сюда!</span>';
                const platformId = Number(zone.dataset.platform);
                const images = document.querySelectorAll(`.platform-image[data-platform="${platformId}"]`);
                const platformImgsData = window.platformsData.filter(p => p.id === platformId);
                images.forEach((img, index) => {
                    if (platformImgsData[index]) img.src = platformImgsData[index].defaultImg;
                });

                const platform = document.querySelector(`.platform[data-platform="${platformId}"]`);
                if (platform) platform.style.backgroundColor = "#FFFFFF";
                const platformShadow = document.querySelector(`.platform-shadow[data-platform="${platformId}"]`);
                if (platformShadow) platformShadow.style.backgroundColor = "#C4C4C4";

                const cardIndex = cardsData.findIndex(c => c.name === this.dragElement.name);

                if (cardIndex !== -1) {
                const pos = platformCardPositions[platformId][cardIndex];
                const imgPath = platformCardImages[cardIndex];
                if (pos && imgPath) {
                    const newImg = document.createElement("img");
                    newImg.src = imgPath;
                    newImg.className = "p";
                    newImg.style.position = "absolute";
                    newImg.style.zIndex = 999;
                    newImg.style.left = pos.left + "px";
                    newImg.style.top = pos.top + "px";
                    newImg.style.width = pos.width + "px";
                    newImg.style.height = pos.height + "px";
                    platform.parentElement.appendChild(newImg);
                }
    }

    // 5️⃣ Обновляем статистику
    document.querySelector(".left-block").textContent = "22/100";
    document.querySelector(".text_i").textContent = 8;
    document.querySelector("#f1").textContent = 20;
    document.querySelector("#f2").textContent = 2;

    usedCards.add(this.dragElement.name);
    cardToPlace = null;

    document.querySelectorAll(".cards-container .card").forEach(c => c.classList.remove("highlight"));
    updateStatsDisplay();

    // 6️⃣ Проверка ресурсов и победы
    if (totalCost <= 0) alert("Денег больше нет!");
    if (totalStats.reduce((a,b)=>a+b,0) >= 60) alert("Вы выиграли!");

    // 7️⃣ Делаем карточку неактивной
    const y = document.querySelector(".card_2");
    y.style.backgroundColor = "#C4C4C4";
    y.style.border = "none";

    // 8️⃣ Показ модального окна GHJ после текста бонуса
    setTimeout(() => {
        const ghjModal = document.querySelector(".GHJ");
        if (!ghjModal) return;

        ghjModal.style.display = "flex"; // показываем GHJ
        let g = document.querySelector(".rrr");
        if (g) g.style.display = 'none'

        const ghjBtn = ghjModal.querySelector("button"); // кнопка в GHJ
        ghjBtn.onclick = () => {
            ghjModal.style.display = "none"; // скрываем GHJ
            // показываем блок .g
            const gBlock = document.querySelector(".g");
            gBlock.style.display = "inline-block";

            const myBtn = document.getElementById("myBtn");
            myBtn.style.display = "inline-block";

            myBtn.onclick = async () => {
                await ym?.(103834904,'reachGoal','rules');
                setTimeout(() => {
                    gBlock.style.display = "none";
                    myBtn.style.display = "none";
                    window.location.href = "game4.html"; 
                }, 0);
                // замените на свой URL }
            };
        };
    }, 500); // задержка 0.5с для плавного эффекта
            }
            cleanup() {
                if (this.preview) {
                    this.preview.remove();
                    this.preview = null;
                }
                
                if (this.dragElement) {
                    this.dragElement.classList.remove('dragging');
                    this.dragElement = null;
                }
                
                this.isDragging = false;
                
                // Убираем активные классы с drop-зон
                document.querySelectorAll('.drop-zone').forEach(zone => {
                    zone.classList.remove('active');
                });
            }
        }

        // Инициализация когда DOM загружен
        document.addEventListener('DOMContentLoaded', () => {
            new DragManager();
        });
